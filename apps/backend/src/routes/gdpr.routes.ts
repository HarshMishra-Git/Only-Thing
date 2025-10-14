import { FastifyInstance } from 'fastify';
import { GDPRController } from '../controllers/gdpr.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * GDPR Routes
 * All routes require authentication
 */
export async function gdprRoutes(server: FastifyInstance) {
  // Export user data
  server.get(
    '/export',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Export all user data',
        tags: ['GDPR'],
        response: {
          200: {
            description: 'User data export',
            type: 'object',
          },
        },
      },
    },
    GDPRController.exportData
  );

  // Get data processing information
  server.get(
    '/data-info',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Get information about data processing',
        tags: ['GDPR'],
        response: {
          200: {
            description: 'Data processing information',
            type: 'object',
          },
        },
      },
    },
    GDPRController.getDataProcessingInfo
  );

  // Request account deletion
  server.post(
    '/delete-account',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Request account deletion',
        tags: ['GDPR'],
        body: {
          type: 'object',
          required: ['confirmEmail'],
          properties: {
            confirmEmail: { type: 'string', format: 'email' },
            reason: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Deletion scheduled',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              deletionDate: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    GDPRController.requestAccountDeletion
  );

  // Cancel account deletion
  server.post(
    '/cancel-deletion',
    {
      preHandler: [authenticate],
      schema: {
        description: 'Cancel scheduled account deletion',
        tags: ['GDPR'],
        response: {
          200: {
            description: 'Deletion cancelled',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    GDPRController.cancelAccountDeletion
  );
}

export default gdprRoutes;
