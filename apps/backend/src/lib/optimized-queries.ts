import { prisma } from './prisma';
import { cache, CacheKeys, CacheTTL } from './cache';
import { Prisma } from '@prisma/client';

/**
 * Optimized Product Queries
 * Includes proper select statements, caching, and pagination
 */
export class OptimizedProductQueries {
  /**
   * Get product by ID with caching
   */
  static async getById(id: string, includeRelations = true) {
    const cacheKey = CacheKeys.product(id);

    return cache.getOrSet(
      cacheKey,
      async () => {
        return prisma.product.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            compareAtPrice: true,
            sku: true,
            inStock: true,
            stockQuantity: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            ...(includeRelations && {
              reviews: {
                select: {
                  id: true,
                  rating: true,
                  comment: true,
                  createdAt: true,
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
                orderBy: { createdAt: 'desc' as const },
                take: 5,
              },
              _count: {
                select: {
                  reviews: true,
                },
              },
            }),
          },
        });
      },
      CacheTTL.MEDIUM
    );
  }

  /**
   * Get products with efficient pagination
   */
  static async getAll(options: {
    page?: number;
    limit?: number;
    categoryId?: string;
    sortBy?: 'createdAt' | 'price' | 'name';
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(categoryId && { category: categoryId }),
    };

    // Use cursor-based pagination for better performance
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        inStock: true,
        stockQuantity: true,
        rating: true,
        reviewCount: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    });

    // Get total count for pagination (cached)
    const total = await this.getCount(where);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total,
      },
    };
  }

  /**
   * Get product count with caching
   */
  private static async getCount(where: Prisma.ProductWhereInput) {
    const cacheKey = `product:count:${JSON.stringify(where)}`;

    return cache.getOrSet(
      cacheKey,
      () => prisma.product.count({ where }),
      CacheTTL.SHORT
    );
  }

  /**
   * Search products (optimized)
   */
  static async search(query: string, page = 1, limit = 20) {
    const cacheKey = CacheKeys.productSearch(query, page);

    return cache.getOrSet(
      cacheKey,
      async () => {
        const skip = (page - 1) * limit;

        const products = await prisma.product.findMany({
          where: {
            AND: [
              { isActive: true },
              {
                OR: [
                  { name: { contains: query, mode: 'insensitive' as const } },
                  { description: { contains: query, mode: 'insensitive' as const } },
                  { sku: { contains: query, mode: 'insensitive' as const } },
                ],
              },
            ],
          },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            inStock: true,
            stockQuantity: true,
          },
          skip,
          take: limit,
        });

        return products;
      },
      CacheTTL.SHORT
    );
  }

  /**
   * Invalidate product cache
   */
  static async invalidateCache(productId: string) {
    await cache.del(CacheKeys.product(productId));
    // Invalidate related caches
    await cache.delPattern('products:*');
  }
}

/**
 * Optimized Order Queries
 */
export class OptimizedOrderQueries {
  /**
   * Get user orders with pagination
   */
  static async getUserOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' as const },
      skip,
      take: limit,
    });

    return orders;
  }

  /**
   * Get order by ID with all details
   */
  static async getById(id: string) {
    const cacheKey = CacheKeys.order(id);

    return cache.getOrSet(
      cacheKey,
      () =>
        prisma.order.findUnique({
          where: { id },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            items: {
              select: {
                id: true,
                quantity: true,
                price: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    sku: true,
                  },
                },
              },
            },
          },
        }),
      CacheTTL.MEDIUM
    );
  }
}

/**
 * Optimized Stats Queries
 * For dashboard and analytics
 */
export class OptimizedStatsQueries {
  /**
   * Get dashboard stats with aggressive caching
   */
  static async getDashboardStats() {
    const cacheKey = CacheKeys.dashboardStats();

    return cache.getOrSet(
      cacheKey,
      async () => {
        // Run queries in parallel
        const [
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
        ] = await Promise.all([
          prisma.order.aggregate({
            _sum: { total: true },
            where: { status: { in: ['DELIVERED', 'SHIPPED'] } },
          }),
          prisma.order.count(),
          prisma.user.count({ where: { role: 'CUSTOMER' } }),
          prisma.product.count({ where: { isActive: true } }),
        ]);

        return {
          revenue: totalRevenue._sum.total || 0,
          orders: totalOrders,
          customers: totalCustomers,
          products: totalProducts,
        };
      },
      CacheTTL.MEDIUM
    );
  }

  /**
   * Get top products (cached)
   */
  static async getTopProducts(limit = 10) {
    const cacheKey = 'stats:top-products';

    return cache.getOrSet(
      cacheKey,
      async () => {
        // Get products with most orders
        const topProducts = await prisma.orderItem.groupBy({
          by: ['productId'],
          _count: { productId: true },
          _sum: { quantity: true },
          orderBy: { _count: { productId: 'desc' as const } },
          take: limit,
        });

        // Fetch product details
        const productIds = topProducts.map((p) => p.productId);
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            name: true,
            price: true,
            slug: true,
          },
        });

        // Merge data
        return topProducts.map((tp) => {
          const product = products.find((p) => p.id === tp.productId);
          return {
            ...product,
            orderCount: tp._count.productId,
            totalQuantity: tp._sum.quantity || 0,
          };
        });
      },
      CacheTTL.LONG
    );
  }
}

/**
 * Batch loading utility to prevent N+1 queries
 */
export class DataLoader<K, V> {
  private cache = new Map<K, Promise<V>>();
  private batchScheduled = false;
  private batchQueue: Array<{ key: K; resolve: (value: V) => void; reject: (error: Error) => void }> = [];

  constructor(
    private batchLoadFn: (keys: K[]) => Promise<V[]>,
    private maxBatchSize = 100
  ) {}

  load(key: K): Promise<V> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    const promise = new Promise<V>((resolve, reject) => {
      this.batchQueue.push({ key, resolve, reject });

      if (!this.batchScheduled) {
        this.batchScheduled = true;
        process.nextTick(() => this.dispatch());
      }
    });

    this.cache.set(key, promise);
    return promise;
  }

  private async dispatch() {
    this.batchScheduled = false;
    const queue = this.batchQueue.splice(0, this.maxBatchSize);

    if (queue.length === 0) return;

    try {
      const keys = queue.map((q) => q.key);
      const values = await this.batchLoadFn(keys);

      queue.forEach((item, index) => {
        item.resolve(values[index]);
      });
    } catch (error) {
      queue.forEach((item) => {
        item.reject(error as Error);
      });
    }
  }

  clear() {
    this.cache.clear();
  }
}

export default {
  OptimizedProductQueries,
  OptimizedOrderQueries,
  OptimizedStatsQueries,
  DataLoader,
};
