import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

/**
 * Redis Cache Service
 * Provides caching capabilities for frequently accessed data
 */
class CacheService {
  private client: RedisClientType | null = null;
  private isConnected = false;

  /**
   * Initialize Redis connection
   */
  async connect() {
    if (this.isConnected) return;

    try {
      // Create Redis client
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 5000,
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis max retries reached');
              return new Error('Redis max retries reached');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      this.client.on('error', (err) => {
        logger.error({ err }, 'Redis client error');
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        logger.warn('Redis client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      logger.error({ err: error }, 'Failed to connect to Redis');
      // Don't throw - allow app to work without cache
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;

    try {
      const value = await this.client.get(key);
      if (!value) return null;

      return JSON.parse(value) as T;
    } catch (error) {
      logger.error({ err: error, key }, 'Cache get error');
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key: string, value: any, ttl: number = 3600): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const serialized = JSON.stringify(value);
      await this.client.setEx(key, ttl, serialized);
      return true;
    } catch (error) {
      logger.error({ err: error, key }, 'Cache set error');
      return false;
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error({ err: error, key }, 'Cache del error');
      return false;
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<number> {
    if (!this.client || !this.isConnected) return 0;

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;

      await this.client.del(keys);
      return keys.length;
    } catch (error) {
      logger.error({ err: error, pattern }, 'Cache delPattern error');
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      logger.error({ err: error, key }, 'Cache exists error');
      return false;
    }
  }

  /**
   * Get or set (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fetchFunc: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const fresh = await fetchFunc();

    // Store in cache
    await this.set(key, fresh, ttl);

    return fresh;
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    if (!this.client || !this.isConnected) return 0;

    try {
      return await this.client.incrBy(key, amount);
    } catch (error) {
      logger.error({ err: error, key }, 'Cache increment error');
      return 0;
    }
  }

  /**
   * Set with expiration (px - milliseconds)
   */
  async setWithExpiry(key: string, value: any, ms: number): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      const serialized = JSON.stringify(value);
      await this.client.set(key, serialized, { PX: ms });
      return true;
    } catch (error) {
      logger.error({ err: error, key }, 'Cache setWithExpiry error');
      return false;
    }
  }

  /**
   * Get remaining TTL
   */
  async ttl(key: string): Promise<number> {
    if (!this.client || !this.isConnected) return -1;

    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error({ err: error, key }, 'Cache ttl error');
      return -1;
    }
  }

  /**
   * Flush all cache
   */
  async flushAll(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;

    try {
      await this.client.flushAll();
      logger.info('Cache flushed');
      return true;
    } catch (error) {
      logger.error({ err: error }, 'Cache flush error');
      return false;
    }
  }

  /**
   * Close connection
   */
  async disconnect() {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }
}

// Singleton instance
export const cache = new CacheService();

/**
 * Cache key generators
 */
export const CacheKeys = {
  // Products
  product: (id: string) => `product:${id}`,
  productsByCategory: (categoryId: string, page: number) => 
    `products:category:${categoryId}:page:${page}`,
  productsAll: (page: number) => `products:all:page:${page}`,
  productSearch: (query: string, page: number) => 
    `products:search:${query}:page:${page}`,

  // Categories
  category: (id: string) => `category:${id}`,
  categoriesAll: () => `categories:all`,

  // Users
  user: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,

  // Orders
  order: (id: string) => `order:${id}`,
  userOrders: (userId: string, page: number) => 
    `orders:user:${userId}:page:${page}`,

  // Reviews
  productReviews: (productId: string, page: number) => 
    `reviews:product:${productId}:page:${page}`,

  // Cart
  cart: (userId: string) => `cart:${userId}`,

  // Wishlist
  wishlist: (userId: string) => `wishlist:${userId}`,

  // Stats/Analytics
  stats: (type: string) => `stats:${type}`,
  dashboardStats: () => `dashboard:stats`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
};

export default cache;
