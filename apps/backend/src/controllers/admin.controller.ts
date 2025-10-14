import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';
import adminDashboardService from '../services/admin-dashboard.service';
import adminUserService from '../services/admin-user.service';
import prisma from '../prisma/client';
import { getAuthUser } from '../middleware/admin.middleware';

class AdminController {
  // ============ DASHBOARD ============
  
  async getOverview(req: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await adminDashboardService.getOverviewStats();
      return reply.send({ success: true, data: stats });
    } catch (error: any) {
      logger.error('Error fetching overview:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch overview',
        error: error.message,
      });
    }
  }

  async getRevenueData(
    req: FastifyRequest<{ Querystring: { period?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { period = 'month' } = req.query;
      const data = await adminDashboardService.getRevenueData(
        period as any
      );
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error fetching revenue data:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch revenue data',
        error: error.message,
      });
    }
  }

  async getTopProducts(
    req: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const data = await adminDashboardService.getTopProducts(limit);
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error fetching top products:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch top products',
        error: error.message,
      });
    }
  }

  async getRecentOrders(
    req: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const data = await adminDashboardService.getRecentOrders(limit);
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error fetching recent orders:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch recent orders',
        error: error.message,
      });
    }
  }

  async getLowStockAlerts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await adminDashboardService.getLowStockAlerts();
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error fetching low stock alerts:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch alerts',
        error: error.message,
      });
    }
  }

  // ============ USERS ============

  async getUsers(
    req: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        search?: string;
        role?: string;
        isActive?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page, limit, search, role, isActive } = req.query;
      const data = await adminUserService.getUsers({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search,
        role,
        isActive: isActive ? isActive === 'true' : undefined,
      });
      return reply.send({ success: true, ...data });
    } catch (error: any) {
      logger.error('Error fetching users:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      });
    }
  }

  async getUserById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const data = await adminUserService.getUserById(req.params.id);
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error fetching user:', error);
      return reply.status(404).send({
        success: false,
        message: error.message || 'User not found',
      });
    }
  }

  async updateUserRole(
    req: FastifyRequest<{
      Params: { id: string };
      Body: { role: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const user = getAuthUser(req);
      const data = await adminUserService.updateUserRole(
        req.params.id,
        req.body.role,
        user.role
      );
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error updating user role:', error);
      return reply.status(403).send({
        success: false,
        message: error.message,
      });
    }
  }

  async toggleUserStatus(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = getAuthUser(req);
      const data = await adminUserService.toggleUserStatus(
        req.params.id,
        user.role
      );
      return reply.send({ success: true, data });
    } catch (error: any) {
      logger.error('Error toggling user status:', error);
      return reply.status(403).send({
        success: false,
        message: error.message,
      });
    }
  }

  // ============ ORDERS ============

  async getOrders(
    req: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        status?: string;
        search?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page = '1', limit = '20', status, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          {
            user: {
              email: { contains: search, mode: 'insensitive' },
            },
          },
        ];
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          skip,
          take: parseInt(limit),
          include: {
            user: {
              select: {
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
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);

      return reply.send({
        success: true,
        data: orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error: any) {
      logger.error('Error fetching orders:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message,
      });
    }
  }

  async updateOrderStatus(
    req: FastifyRequest<{
      Params: { id: string };
      Body: {
        status: string;
        trackingNumber?: string;
        notes?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { status, trackingNumber, notes } = req.body;
      const updateData: any = { status };

      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (notes) updateData.notes = notes;
      if (status === 'SHIPPED') updateData.shippedAt = new Date();
      if (status === 'DELIVERED') updateData.deliveredAt = new Date();

      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: updateData,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
            },
          },
        },
      });

      logger.info(`Order ${order.orderNumber} status updated to ${status}`);
      return reply.send({ success: true, data: order });
    } catch (error: any) {
      logger.error('Error updating order:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to update order',
        error: error.message,
      });
    }
  }

  // ============ PRODUCTS ============

  async getProducts(
    req: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        category?: string;
        search?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page = '1', limit = '20', category, search } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const where: any = {};
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      return reply.send({
        success: true,
        data: products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error: any) {
      logger.error('Error fetching products:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  }

  async updateProductStock(
    req: FastifyRequest<{
      Params: { id: string };
      Body: {
        quantity: number;
        type: string;
        reason?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { quantity, type, reason } = req.body;
      const user = getAuthUser(req);

      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
      });

      if (!product) {
        return reply.status(404).send({
          success: false,
          message: 'Product not found',
        });
      }

      const newQuantity = product.stockQuantity + quantity;

      // Update product and create log in transaction
      const [updatedProduct] = await prisma.$transaction([
        prisma.product.update({
          where: { id: req.params.id },
          data: {
            stockQuantity: newQuantity,
            inStock: newQuantity > 0,
          },
        }),
        prisma.inventoryLog.create({
          data: {
            productId: req.params.id,
            userId: user.id,
            type: type as any,
            quantity,
            previousQty: product.stockQuantity,
            newQty: newQuantity,
            reason,
          },
        }),
      ]);

      logger.info(`Product ${product.sku} stock updated: ${product.stockQuantity} -> ${newQuantity}`);
      return reply.send({ success: true, data: updatedProduct });
    } catch (error: any) {
      logger.error('Error updating stock:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to update stock',
        error: error.message,
      });
    }
  }

  async getInventoryLogs(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const logs = await prisma.inventoryLog.findMany({
        where: { productId: req.params.id },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      return reply.send({ success: true, data: logs });
    } catch (error: any) {
      logger.error('Error fetching inventory logs:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch logs',
        error: error.message,
      });
    }
  }
}

export const adminController = new AdminController();
export default adminController;
