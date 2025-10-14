import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

/**
 * GDPR Compliance Service
 * Handles data export and deletion (Right to Access, Right to be Forgotten)
 */
export class GDPRService {
  /**
   * Export all user data in JSON format
   * Implements GDPR Right to Access
   */
  static async exportUserData(userId: string): Promise<any> {
    try {
      // Fetch all user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
          reviews: {
            include: {
              product: true,
            },
          },
          cart: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
          wishlist: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive data
      const { password, ...userData } = user;

      // Structure the export
      const exportData = {
        exportDate: new Date().toISOString(),
        dataRetentionPolicy: 'Data is retained as long as account is active',
        personalInformation: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          isActive: userData.isActive,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          lastLoginAt: userData.lastLoginAt,
        },
        orders: userData.orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt,
          items: order.items.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
        })),
        reviews: userData.reviews.map(review => ({
          id: review.id,
          productName: review.product.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        })),
        cart: userData.cart ? {
          items: userData.cart.items.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
          })),
        } : null,
        wishlist: userData.wishlist ? {
          items: userData.wishlist.items.map(item => ({
            productName: item.product.name,
            addedAt: item.createdAt,
          })),
        } : null,
      };

      logger.info({
        event: 'data_export',
        userId,
      }, 'User data exported');

      return exportData;
    } catch (error) {
      logger.error({
        err: error,
        userId,
      }, 'Failed to export user data');
      throw error;
    }
  }

  /**
   * Delete user account and anonymize data
   * Implements GDPR Right to be Forgotten
   */
  static async deleteUserAccount(userId: string, reason?: string): Promise<void> {
    try {
      // Start transaction
      await prisma.$transaction(async (tx) => {
        // 1. Anonymize user data instead of hard delete
        // This preserves referential integrity and historical data
        const anonymizedEmail = `deleted-${userId}@anonymized.local`;
        const anonymizedName = `Deleted User ${userId.slice(0, 8)}`;

        await tx.user.update({
          where: { id: userId },
          data: {
            email: anonymizedEmail,
            name: anonymizedName,
            phone: null,
            password: 'DELETED',
            isActive: false,
            deletedAt: new Date(),
          },
        });

        // 2. Delete or anonymize personal data in related tables
        
        // Delete cart (temporary data)
        await tx.cart.deleteMany({
          where: { userId },
        });

        // Delete wishlist (temporary data)
        await tx.wishlist.deleteMany({
          where: { userId },
        });

        // Anonymize reviews (keep for product rating accuracy)
        await tx.review.updateMany({
          where: { userId },
          data: {
            comment: null, // Remove personal comments
          },
        });

        // Keep orders for legal/accounting purposes but anonymize
        await tx.order.updateMany({
          where: { userId },
          data: {
            // Keep order data but remove PII from shipping address if stored
            notes: null,
          },
        });

        // Log deletion
        logger.info({
          event: 'account_deleted',
          userId,
          reason,
        }, 'User account deleted and data anonymized');
      });
    } catch (error) {
      logger.error({
        err: error,
        userId,
      }, 'Failed to delete user account');
      throw error;
    }
  }

  /**
   * Check if user has pending orders that prevent deletion
   */
  static async canDeleteAccount(userId: string): Promise<{
    canDelete: boolean;
    reason?: string;
  }> {
    // Check for active/pending orders
    const pendingOrders = await prisma.order.count({
      where: {
        userId,
        status: {
          in: ['PENDING', 'PROCESSING', 'SHIPPED'],
        },
      },
    });

    if (pendingOrders > 0) {
      return {
        canDelete: false,
        reason: `You have ${pendingOrders} pending order(s). Please wait until they are completed or cancelled.`,
      };
    }

    return { canDelete: true };
  }

  /**
   * Schedule account deletion
   * Gives user grace period to cancel deletion
   */
  static async scheduleAccountDeletion(
    userId: string,
    gracePeriodDays: number = 30
  ): Promise<Date> {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + gracePeriodDays);

    await prisma.user.update({
      where: { id: userId },
      data: {
        scheduledDeletionAt: deletionDate,
      },
    });

    logger.info({
      event: 'account_deletion_scheduled',
      userId,
      deletionDate,
    }, 'Account deletion scheduled');

    return deletionDate;
  }

  /**
   * Cancel scheduled account deletion
   */
  static async cancelAccountDeletion(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        scheduledDeletionAt: null,
      },
    });

    logger.info({
      event: 'account_deletion_cancelled',
      userId,
    }, 'Account deletion cancelled');
  }

  /**
   * Process scheduled deletions
   * Should be run as a cron job
   */
  static async processScheduledDeletions(): Promise<void> {
    const usersToDelete = await prisma.user.findMany({
      where: {
        scheduledDeletionAt: {
          lte: new Date(),
        },
        deletedAt: null,
      },
      select: { id: true },
    });

    for (const user of usersToDelete) {
      try {
        await this.deleteUserAccount(user.id, 'Scheduled deletion');
      } catch (error) {
        logger.error({
          err: error,
          userId: user.id,
        }, 'Failed to process scheduled deletion');
      }
    }

    logger.info({
      event: 'scheduled_deletions_processed',
      count: usersToDelete.length,
    }, 'Processed scheduled account deletions');
  }
}

export default GDPRService;
