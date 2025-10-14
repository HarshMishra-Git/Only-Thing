import prisma from '../prisma/client';
import { logger } from '../utils/logger';
import { canManageUser } from '../middleware/admin.middleware';

class AdminUserService {
  /**
   * Get all users with pagination and filters
   */
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) {
    try {
      const { page = 1, limit = 20, search, role, isActive } = params;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
            lastLogin: true,
            _count: {
              select: {
                orders: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user details by ID
   */
  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          orders: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
              createdAt: true,
            },
          },
          reviews: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
          addresses: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate total spent
      const orderStats = await prisma.order.aggregate({
        where: {
          userId,
          paymentStatus: 'PAID',
        },
        _sum: {
          total: true,
        },
        _count: true,
      });

      return {
        ...user,
        stats: {
          totalOrders: orderStats._count,
          totalSpent: orderStats._sum.total || 0,
          totalReviews: user._count.reviews,
        },
      };
    } catch (error) {
      logger.error('Error fetching user details:', error);
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(
    userId: string,
    newRole: string,
    adminRole: string
  ) {
    try {
      // Check if admin can manage this user
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!targetUser) {
        throw new Error('User not found');
      }

      if (!canManageUser(adminRole, targetUser.role)) {
        throw new Error('Insufficient permissions to manage this user');
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole as any },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      logger.info(`User role updated: ${userId} -> ${newRole}`);
      return user;
    } catch (error) {
      logger.error('Error updating user role:', error);
      throw error;
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string, adminRole: string) {
    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, isActive: true },
      });

      if (!targetUser) {
        throw new Error('User not found');
      }

      if (!canManageUser(adminRole, targetUser.role)) {
        throw new Error('Insufficient permissions to manage this user');
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { isActive: !targetUser.isActive },
        select: {
          id: true,
          email: true,
          isActive: true,
        },
      });

      logger.info(`User status toggled: ${userId} -> ${user.isActive ? 'active' : 'inactive'}`);
      return user;
    } catch (error) {
      logger.error('Error toggling user status:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    try {
      const [
        totalCustomers,
        activeCustomers,
        adminCount,
        newCustomersThisMonth,
      ] = await Promise.all([
        prisma.user.count({
          where: { role: 'CUSTOMER' },
        }),
        prisma.user.count({
          where: {
            role: 'CUSTOMER',
            isActive: true,
          },
        }),
        prisma.user.count({
          where: {
            role: { in: ['ADMIN', 'MANAGER', 'SUPER_ADMIN'] },
          },
        }),
        prisma.user.count({
          where: {
            role: 'CUSTOMER',
            createdAt: {
              gte: new Date(new Date().setDate(1)), // First day of current month
            },
          },
        }),
      ]);

      return {
        totalCustomers,
        activeCustomers,
        inactiveCustomers: totalCustomers - activeCustomers,
        adminCount,
        newCustomersThisMonth,
      };
    } catch (error) {
      logger.error('Error fetching user stats:', error);
      throw error;
    }
  }
}

export const adminUserService = new AdminUserService();
export default adminUserService;
