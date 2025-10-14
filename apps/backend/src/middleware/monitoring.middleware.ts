import { FastifyRequest, FastifyReply } from 'fastify';
import { monitoringService } from '../services/monitoring.service';
import { logger } from '../utils/logger';

/**
 * Middleware to track request performance and errors
 */
export async function monitoringMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = Date.now();
  
  // Track request start
  const { method, url } = request;
  
  logger.debug(`${method} ${url} - Request started`);

  // Add hook to track response
  reply.addHook('onSend', async (_request, _reply, payload) => {
    const duration = Date.now() - startTime;
    const statusCode = _reply.statusCode;

    // Record metrics
    monitoringService.recordEndpointHit(
      method,
      url,
      statusCode,
      duration
    );

    // Log slow requests
    if (duration > 1000) {
      logger.warn(`Slow request detected: ${method} ${url} took ${duration}ms`);
    }

    return payload;
  });
}

/**
 * Global error handler with monitoring
 */
export function setupErrorMonitoring(server: any) {
  server.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
    const { method, url } = request;
    
    // Record error
    monitoringService.recordError(error, {
      method,
      url,
      user: (request.user as any)?.id,
    });

    logger.error(`Error on ${method} ${url}:`, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      user: (request.user as any)?.id,
    });

    // Send error response
    const statusCode = (error as any).statusCode || 500;
    reply.status(statusCode).send({
      success: false,
      error: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  });
}

export default {
  monitoringMiddleware,
  setupErrorMonitoring,
};
