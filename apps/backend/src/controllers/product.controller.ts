import { FastifyRequest, FastifyReply } from 'fastify';
import { productService } from '../services/product.service';

export class ProductController {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      
      const filters = {
        category: query.category,
        minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
        features: query.features ? (Array.isArray(query.features) ? query.features : [query.features]) : undefined,
        dietary: query.dietary ? (Array.isArray(query.dietary) ? query.dietary : [query.dietary]) : undefined,
        inStock: query.inStock === 'true',
        search: query.search,
      };

      const sort = {
        sortBy: query.sortBy || 'relevance',
      };

      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;

      const result = await productService.getAllProducts(filters, sort, page, limit);
      
      return reply.send(result);
    } catch (error: any) {
      return reply.code(500).send({
        error: 'Failed to fetch products',
        message: error.message,
      });
    }
  }

  async getBySlug(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { slug } = request.params as { slug: string };
      const product = await productService.getProductBySlug(slug);
      
      return reply.send(product);
    } catch (error: any) {
      if (error.message === 'Product not found') {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Product not found',
        });
      }
      
      return reply.code(500).send({
        error: 'Failed to fetch product',
        message: error.message,
      });
    }
  }

  async getFeatured(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const limit = query.limit ? parseInt(query.limit) : 8;
      
      const products = await productService.getFeaturedProducts(limit);
      
      return reply.send(products);
    } catch (error: any) {
      return reply.code(500).send({
        error: 'Failed to fetch featured products',
        message: error.message,
      });
    }
  }

  async getCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await productService.getCategories();
      
      return reply.send(categories);
    } catch (error: any) {
      return reply.code(500).send({
        error: 'Failed to fetch categories',
        message: error.message,
      });
    }
  }

  async search(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as any;
      const searchQuery = query.q || '';
      const limit = query.limit ? parseInt(query.limit) : 10;
      
      if (!searchQuery) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: 'Search query is required',
        });
      }
      
      const products = await productService.searchProducts(searchQuery, limit);
      
      return reply.send(products);
    } catch (error: any) {
      return reply.code(500).send({
        error: 'Failed to search products',
        message: error.message,
      });
    }
  }
}

export const productController = new ProductController();
