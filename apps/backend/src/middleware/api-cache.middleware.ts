import { FastifyRequest, FastifyReply } from 'fastify';
import { cache } from '../lib/cache';
import { logger } from '../lib/logger';

/**
 * API Response Caching Middleware
 * Implements HTTP caching with stale-while-revalidate
 */

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string | ((request: FastifyRequest) => string); // Custom cache key
  varyBy?: string[]; // Vary cache by headers (e.g., ['user-id'])
  condition?: (request: FastifyRequest) => boolean; // Conditional caching
  tags?: string[]; // Cache tags for bulk invalidation
}

/**
 * Create API cache middleware
 */
export function apiCache(options: CacheOptions = {}) {
  const {
    ttl = 60,
    key: keyOption,
    varyBy = [],
    condition,
    tags = [],
  } = options;

  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
      return;
    }

    // Check condition
    if (condition && !condition(request)) {
      return;
    }

    // Generate cache key
    const cacheKey = generateCacheKey(request, keyOption, varyBy);

    try {
      // Try to get from cache
      const cached = await cache.get<CachedResponse>(cacheKey);

      if (cached) {
        // Set headers
        reply.header('X-Cache', 'HIT');
        reply.header('Cache-Control', `public, max-age=${ttl}, stale-while-revalidate=${ttl * 2}`);
        reply.header('Age', String(Math.floor((Date.now() - cached.timestamp) / 1000)));

        // Send cached response
        return reply.code(cached.statusCode).send(cached.body);
      }

      // Cache miss
      reply.header('X-Cache', 'MISS');

      // Intercept the response
      const originalSend = reply.send.bind(reply);
      reply.send = function (payload: any) {
        // Cache successful responses only
        if (reply.statusCode >= 200 && reply.statusCode < 300) {
          const cachedResponse: CachedResponse = {
            body: payload,
            statusCode: reply.statusCode,
            headers: reply.getHeaders(),
            timestamp: Date.now(),
            tags,
          };

          // Store in cache (don't await)
          cache.set(cacheKey, cachedResponse, ttl).catch((err) => {
            logger.error({ err, cacheKey }, 'Failed to cache response');
          });
        }

        // Set cache headers
        reply.header('Cache-Control', `public, max-age=${ttl}, stale-while-revalidate=${ttl * 2}`);
        reply.header('ETag', generateETag(payload));

        return originalSend(payload);
      };
    } catch (error) {
      logger.error({ err: error, cacheKey }, 'Cache middleware error');
      // Continue without caching
    }
  };
}

/**
 * Cached response interface
 */
interface CachedResponse {
  body: any;
  statusCode: number;
  headers: Record<string, any>;
  timestamp: number;
  tags: string[];
}

/**
 * Generate cache key
 */
function generateCacheKey(
  request: FastifyRequest,
  keyOption?: string | ((request: FastifyRequest) => string),
  varyBy: string[] = []
): string {
  // Custom key function
  if (typeof keyOption === 'function') {
    return `api:${keyOption(request)}`;
  }

  // Custom key string
  if (typeof keyOption === 'string') {
    return `api:${keyOption}`;
  }

  // Default: URL + query params + vary headers
  const url = request.url;
  const varyParts = varyBy.map((header) => {
    const value = request.headers[header.toLowerCase()];
    return `${header}:${value}`;
  }).join(':');

  return `api:${url}${varyParts ? `:${varyParts}` : ''}`;
}

/**
 * Generate ETag for response
 */
function generateETag(payload: any): string {
  const crypto = require('crypto');
  const content = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const hash = crypto.createHash('md5').update(content).digest('hex');
  return `"${hash}"`;
}

/**
 * Cache invalidation utilities
 */
export class CacheInvalidator {
  /**
   * Invalidate specific endpoint
   */
  static async invalidate(path: string) {
    const pattern = `api:${path}*`;
    const count = await cache.delPattern(pattern);
    logger.info({ pattern, count }, 'Cache invalidated');
    return count;
  }

  /**
   * Invalidate by tags
   */
  static async invalidateByTags(tags: string[]) {
    // This requires storing tag->key mappings
    // For now, use pattern matching
    for (const tag of tags) {
      await cache.delPattern(`*${tag}*`);
    }
  }

  /**
   * Invalidate products cache
   */
  static async invalidateProducts() {
    await cache.delPattern('api:*/products*');
    await cache.delPattern('product:*');
    logger.info('Products cache invalidated');
  }

  /**
   * Invalidate orders cache
   */
  static async invalidateOrders(userId?: string) {
    if (userId) {
      await cache.delPattern(`api:*/orders*${userId}*`);
      await cache.delPattern(`orders:user:${userId}*`);
    } else {
      await cache.delPattern('api:*/orders*');
      await cache.delPattern('order:*');
    }
    logger.info({ userId }, 'Orders cache invalidated');
  }

  /**
   * Invalidate user cache
   */
  static async invalidateUser(userId: string) {
    await cache.del(`user:${userId}`);
    await cache.delPattern(`api:*/users/${userId}*`);
    logger.info({ userId }, 'User cache invalidated');
  }

  /**
   * Flush all API cache
   */
  static async flushAll() {
    await cache.delPattern('api:*');
    logger.info('All API cache flushed');
  }
}

/**
 * Conditional caching helpers
 */
export const CacheConditions = {
  /**
   * Only cache for authenticated users
   */
  authenticated: (request: FastifyRequest) => !!request.user,

  /**
   * Only cache for anonymous users
   */
  anonymous: (request: FastifyRequest) => !request.user,

  /**
   * Cache per user
   */
  perUser: (request: FastifyRequest) => !!request.user,
};

/**
 * Pre-configured cache options
 */
export const CachePresets = {
  // Public data (products, categories)
  public: {
    ttl: 300, // 5 minutes
  },

  // User-specific data
  private: {
    ttl: 60, // 1 minute
    varyBy: ['user-id'],
    condition: CacheConditions.authenticated,
  },

  // Rarely changing data
  static: {
    ttl: 3600, // 1 hour
  },

  // Frequently changing data
  dynamic: {
    ttl: 30, // 30 seconds
  },
};

export default apiCache;
