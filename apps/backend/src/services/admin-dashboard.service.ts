import prisma from '../prisma/client';
import { logger } from '../utils/logger';

class AdminDashboardService {
  /**
   * Get overview statistics
   */
  async getOverviewStats() {
    try {
      const [
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        pendingOrders,
      ] = await Promise.all([
        // Total users
        prisma.user.count({
          where: { role: 'CUSTOMER' },
        }),
        
        // Total orders
        prisma.order.count(),
        
        // Total products
        prisma.product.count({ where: { isActive: true } }),
        
        // Total revenue
        prisma.order.aggregate({
          where: { paymentStatus: 'PAID' },
          _sum: { total: true },
        }),
        
        // Recent orders (last 24 hours)
        prisma.order.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        }),
        
        // Low stock products (< 10 items)
        prisma.product.count({
          where: {
            stockQuantity: { lt: 10 },
            isActive: true,
          },
        }),
        
        // Pending orders
        prisma.order.count({
          where: { status: 'PENDING' },
        }),
      ]);

      return {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue._sum.total || 0,
        recentOrders,
        lowStockProducts,
        pendingOrders,
      };
    } catch (error) {
      logger.error('Error fetching overview stats:', error);
      throw error;
    }
  }

  /**
   * Get revenue data for charts
   */
  async getRevenueData(period: 'week' | 'month' | 'year' = 'month') {
    try {
      let startDate: Date;
      const now = new Date();

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: startDate },
          paymentStatus: 'PAID',
        },
        select: {
          createdAt: true,
          total: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      // Group by date
      const revenueByDate = orders.reduce((acc: any, order) => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += Number(order.total);
        return acc;
      }, {});

      return Object.entries(revenueByDate).map(([date, revenue]) => ({
        date,
        revenue,
      }));
    } catch (error) {
      logger.error('Error fetching revenue data:', error);
      throw error;
    }
  }

  /**
   * Get top selling products
   */
  async getTopProducts(limit: number = 10) {
    try {
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
        },
        _count: {
          productId: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: limit,
      });

      // Fetch product details
      const productIds = topProducts.map((p) => p.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
          id: true,
          name: true,
          price: true,
          stockQuantity: true,
        },
      });

      return topProducts.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          productId: item.productId,
          name: product?.name || 'Unknown',
          price: product?.price || 0,
          totalSold: item._sum.quantity || 0,
          orderCount: item._count.productId,
          currentStock: product?.stockQuantity || 0,
        };
      });
    } catch (error) {
      logger.error('Error fetching top products:', error);
      throw error;
    }
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 10) {
    try {
      const orders = await prisma.order.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return orders;
    } catch (error) {
      logger.error('Error fetching recent orders:', error);
      throw error;
    }
  }

  /**
   * Get customer analytics
   */
  async getCustomerAnalytics() {
    try {
      const [
        newCustomers,
        returningCustomers,
        activeCustomers,
      ] = await Promise.all([
        // New customers (last 30 days)
        prisma.user.count({
          where: {
            role: 'CUSTOMER',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        
        // Returning customers (made 2+ orders)
        prisma.user.count({
          where: {
            role: 'CUSTOMER',
            orders: {
              some: {
                id: { not: undefined },
              },
            },
          },
        }),
        
        // Active customers (ordered in last 30 days)
        prisma.user.count({
          where: {
            role: 'CUSTOMER',
            orders: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        }),
      ]);

      return {
        newCustomers,
        returningCustomers,
        activeCustomers,
      };
    } catch (error) {
      logger.error('Error fetching customer analytics:', error);
      throw error;
    }
  }

  /**
   * Get order status breakdown
   */
  async getOrderStatusBreakdown() {
    try {
      const statuses = await prisma.order.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });

      return statuses.map((item) => ({
        status: item.status,
        count: item._count.status,
      }));
    } catch (error) {
      logger.error('Error fetching order status breakdown:', error);
      throw error;
    }
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(threshold: number = 10) {
    try {
      const products = await prisma.product.findMany({
        where: {
          stockQuantity: { lt: threshold },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stockQuantity: true,
          price: true,
        },
        orderBy: { stockQuantity: 'asc' },
      });

      return products;
    } catch (error) {
      logger.error('Error fetching low stock alerts:', error);
      throw error;
    }
  }
}

export const adminDashboardService = new AdminDashboardService();
export default adminDashboardService;
