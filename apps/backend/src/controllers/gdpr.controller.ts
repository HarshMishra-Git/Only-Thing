import { FastifyRequest, FastifyReply } from 'fastify';
import { GDPRService } from '../services/gdpr.service';
import { logger } from '../lib/logger';

/**
 * GDPR Controller
 * Handles data export and deletion requests
 */
export class GDPRController {
  /**
   * Export user data
   * GET /api/gdpr/export
   */
  static async exportData(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;

      const exportData = await GDPRService.exportUserData(userId);

      // Return as JSON download
      reply
        .header('Content-Disposition', `attachment; filename="data-export-${userId}.json"`)
        .header('Content-Type', 'application/json')
        .send(exportData);
    } catch (error) {
      logger.error({ err: error }, 'Failed to export user data');
      
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to export data',
      });
    }
  }

  /**
   * Request account deletion
   * POST /api/gdpr/delete-account
   */
  static async requestAccountDeletion(
    request: FastifyRequest<{
      Body: { reason?: string; confirmEmail: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const { reason, confirmEmail } = request.body;

      // Verify email confirmation
      if (confirmEmail !== request.user!.email) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Email confirmation does not match',
        });
      }

      // Check if account can be deleted
      const canDelete = await GDPRService.canDeleteAccount(userId);
      
      if (!canDelete.canDelete) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: canDelete.reason,
        });
      }

      // Schedule deletion with grace period
      const deletionDate = await GDPRService.scheduleAccountDeletion(userId);

      return reply.send({
        success: true,
        message: `Account deletion scheduled for ${deletionDate.toDateString()}. You can cancel this within 30 days.`,
        deletionDate,
      });
    } catch (error) {
      logger.error({ err: error }, 'Failed to schedule account deletion');
      
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to process deletion request',
      });
    }
  }

  /**
   * Cancel scheduled account deletion
   * POST /api/gdpr/cancel-deletion
   */
  static async cancelAccountDeletion(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;

      await GDPRService.cancelAccountDeletion(userId);

      return reply.send({
        success: true,
        message: 'Account deletion cancelled',
      });
    } catch (error) {
      logger.error({ err: error }, 'Failed to cancel account deletion');
      
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to cancel deletion',
      });
    }
  }

  /**
   * Get user's data processing information
   * GET /api/gdpr/data-info
   */
  static async getDataProcessingInfo(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const dataInfo = {
        dataCollected: [
          'Email address',
          'Name',
          'Phone number (optional)',
          'Order history',
          'Product reviews',
          'Shopping cart',
          'Wishlist',
        ],
        dataUsage: [
          'Order processing and fulfillment',
          'Customer support',
          'Product recommendations',
          'Marketing communications (with consent)',
          'Analytics and service improvement',
        ],
        dataRetention: {
          accountData: 'Retained while account is active',
          orderHistory: 'Retained for 7 years for legal/accounting purposes',
          analytics: 'Anonymized after 24 months',
        },
        dataSharing: [
          'Payment processors (for transaction processing)',
          'Shipping providers (for order delivery)',
          'Analytics providers (anonymized data only)',
        ],
        rights: [
          'Right to access your data',
          'Right to rectify inaccurate data',
          'Right to erasure (with limitations)',
          'Right to data portability',
          'Right to object to processing',
          'Right to withdraw consent',
        ],
      };

      return reply.send(dataInfo);
    } catch (error) {
      logger.error({ err: error }, 'Failed to get data processing info');
      
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to retrieve information',
      });
    }
  }
}

export default GDPRController;
