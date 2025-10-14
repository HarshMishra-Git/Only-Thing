import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  dietary?: string[];
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export class ProductService {
  async getAllProducts(
    filters: ProductFilters = {},
    sort: ProductSort = {},
    page: number = 1,
    limit: number = 20
  ) {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Apply filters
    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.features && filters.features.length > 0) {
      where.features = {
        hasSome: filters.features,
      };
    }

    if (filters.dietary && filters.dietary.length > 0) {
      where.dietaryInfo = {
        hasSome: filters.dietary,
      };
    }

    if (filters.inStock !== undefined) {
      where.inStock = filters.inStock;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ];
    }

    // Apply sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    
    switch (sort.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { isFeatured: 'desc' };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          price: true,
          compareAtPrice: true,
          category: true,
          tags: true,
          rating: true,
          reviewCount: true,
          inStock: true,
          isFeatured: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        supplementFacts: {
          orderBy: { order: 'asc' },
        },
        reviews: {
          where: { verified: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        ingredients: true,
        supplementFacts: true,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async getFeaturedProducts(limit: number = 8) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        inStock: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        compareAtPrice: true,
        category: true,
        rating: true,
        reviewCount: true,
      },
    });
  }

  async getCategories() {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return products.map(p => p.category);
  }

  async searchProducts(query: string, limit: number = 10) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        category: true,
      },
    });
  }
}

export const productService = new ProductService();
