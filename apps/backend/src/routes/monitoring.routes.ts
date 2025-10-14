import { FastifyPluginAsync } from 'fastify';
import monitoringController from '../controllers/monitoring.controller';
import { requireManagerRole } from '../middleware/admin.middleware';

export const monitoringRoutes: FastifyPluginAsync = async (fastify) => {
  // Public health check
  fastify.get('/health', monitoringController.health.bind(monitoringController));

  // Protected monitoring endpoints (admin only)
  fastify.get('/metrics', {
    onRequest: [requireManagerRole],
  }, monitoringController.metrics.bind(monitoringController));

  fastify.get('/database-stats', {
    onRequest: [requireManagerRole],
  }, monitoringController.databaseStats.bind(monitoringController));

  fastify.get('/analytics', {
    onRequest: [requireManagerRole],
  }, monitoringController.analyticsSummary.bind(monitoringController));

  fastify.get('/funnel', {
    onRequest: [requireManagerRole],
  }, monitoringController.funnelStats.bind(monitoringController));

  fastify.get('/system', {
    onRequest: [requireManagerRole],
  }, monitoringController.systemInfo.bind(monitoringController));
};
