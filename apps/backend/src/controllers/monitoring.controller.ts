import { FastifyRequest, FastifyReply } from 'fastify';
import { monitoringService } from '../services/monitoring.service';
import { analyticsService } from '../services/analytics.service';
import { logger } from '../utils/logger';

class MonitoringController {
  /**
   * Health check endpoint
   */
  async health(req: FastifyRequest, reply: FastifyReply) {
    try {
      const health = await monitoringService.checkSystemHealth();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      return reply.status(statusCode).send(health);
    } catch (error: any) {
      logger.error('Health check failed:', error);
      return reply.status(503).send({
        status: 'unhealthy',
        error: error.message,
      });
    }
  }

  /**
   * Get metrics
   */
  async metrics(req: FastifyRequest, reply: FastifyReply) {
    try {
      const metrics = monitoringService.getAllMetrics();
      return reply.send({
        success: true,
        data: metrics,
      });
    } catch (error: any) {
      logger.error('Error fetching metrics:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch metrics',
        error: error.message,
      });
    }
  }

  /**
   * Get database statistics
   */
  async databaseStats(req: FastifyRequest, reply: FastifyReply) {
    try {
      const stats = await monitoringService.getDatabaseStats();
      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Error fetching database stats:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch database stats',
        error: error.message,
      });
    }
  }

  /**
   * Get analytics summary
   */
  async analyticsSummary(
    req: FastifyRequest<{ Querystring: { timeframe?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { timeframe = 'day' } = req.query;
      const summary = analyticsService.getEventSummary(timeframe as any);
      return reply.send({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      logger.error('Error fetching analytics summary:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch analytics',
        error: error.message,
      });
    }
  }

  /**
   * Get conversion funnel stats
   */
  async funnelStats(
    req: FastifyRequest<{ Querystring: { timeframe?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { timeframe = 'day' } = req.query;
      const stats = analyticsService.getFunnelStats(timeframe as any);
      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('Error fetching funnel stats:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch funnel stats',
        error: error.message,
      });
    }
  }

  /**
   * System information
   */
  async systemInfo(req: FastifyRequest, reply: FastifyReply) {
    try {
      const memUsage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      const info = {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memory: {
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        env: process.env.NODE_ENV,
      };

      return reply.send({
        success: true,
        data: info,
      });
    } catch (error: any) {
      logger.error('Error fetching system info:', error);
      return reply.status(500).send({
        success: false,
        message: 'Failed to fetch system info',
        error: error.message,
      });
    }
  }
}

export const monitoringController = new MonitoringController();
export default monitoringController;
