import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';
import { logger } from '../lib/logger';

/**
 * Rate limiting configuration for different endpoint types
 */
export const rateLimitConfig = {
  // Global rate limit - applies to all routes
  global: {
    max: 100, // 100 requests
    timeWindow: '15 minutes',
    cache: 10000,
    allowList: ['127.0.0.1', '::1'], // Localhost exempt
    redis: undefined, // TODO: Add Redis for distributed rate limiting
    nameSpace: 'global-',
    continueExceeding: true,
    skipOnError: false,
  },

  // Strict limit for authentication endpoints
  auth: {
    max: 5, // 5 attempts
    timeWindow: '15 minutes',
    cache: 10000,
    errorResponseBuilder: () => {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: 'Too many authentication attempts. Please try again later.',
      };
    },
  },

  // Registration endpoint
  register: {
    max: 3, // 3 registrations
    timeWindow: '1 hour',
    cache: 10000,
  },

  // Password reset
  passwordReset: {
    max: 3,
    timeWindow: '1 hour',
    cache: 10000,
  },

  // API endpoints
  api: {
    max: 60,
    timeWindow: '1 minute',
    cache: 10000,
  },

  // File upload endpoints
  upload: {
    max: 10,
    timeWindow: '15 minutes',
    cache: 10000,
  },

  // Search endpoints
  search: {
    max: 30,
    timeWindow: '1 minute',
    cache: 10000,
  },
};

/**
 * Register global rate limiter
 */
export async function registerGlobalRateLimit(server: FastifyInstance) {
  await server.register(rateLimit, rateLimitConfig.global);
  logger.info('Global rate limiting enabled');
}

/**
 * Create route-specific rate limiter
 */
export function createRateLimiter(config: typeof rateLimitConfig.auth) {
  return async (server: FastifyInstance) => {
    await server.register(rateLimit, config);
  };
}

/**
 * Rate limit decorator for routes
 * Usage: Apply to specific routes that need stricter limits
 */
export const strictRateLimit = {
  config: {
    rateLimit: rateLimitConfig.auth,
  },
};

export const uploadRateLimit = {
  config: {
    rateLimit: rateLimitConfig.upload,
  },
};

export const searchRateLimit = {
  config: {
    rateLimit: rateLimitConfig.search,
  },
};

/**
 * Custom rate limit key generator based on user ID or IP
 */
export function customKeyGenerator(request: any) {
  // Use user ID if authenticated, otherwise use IP
  const userId = request.user?.id;
  const ip = request.ip || request.raw.connection.remoteAddress;
  
  return userId ? `user:${userId}` : `ip:${ip}`;
}

/**
 * Rate limit handler - called when limit is exceeded
 */
export function rateLimitHandler(request: any, key: string) {
  logger.warn({
    event: 'rate_limit_exceeded',
    key,
    ip: request.ip,
    url: request.url,
    userId: request.user?.id,
  }, 'Rate limit exceeded');
}

export default registerGlobalRateLimit;
