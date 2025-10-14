import { FastifyRequest, FastifyReply } from 'fastify';
import sanityService, { clearCache } from '../services/sanity.service';
import { logger } from '../utils/logger';
import crypto from 'crypto';

class SanityController {
  /**
   * Get all products from Sanity
   */
  async getProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await sanityService.getAllProducts();
      return reply.send({ success: true, data: products });
    } catch (error: any) {
      logger.error('Error fetching products from Sanity:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch products',
        error: error.message 
      });
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    try {
      const { slug } = req.params;
      const product = await sanityService.getProductBySlug(slug);
      
      if (!product) {
        return reply.status(404).send({ 
          success: false, 
          message: 'Product not found' 
        });
      }
      
      return reply.send({ success: true, data: product });
    } catch (error: any) {
      logger.error('Error fetching product:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch product',
        error: error.message 
      });
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await sanityService.getFeaturedProducts();
      return reply.send({ success: true, data: products });
    } catch (error: any) {
      logger.error('Error fetching featured products:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch featured products',
        error: error.message 
      });
    }
  }

  /**
   * Get all categories
   */
  async getCategories(req: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await sanityService.getAllCategories();
      return reply.send({ success: true, data: categories });
    } catch (error: any) {
      logger.error('Error fetching categories:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch categories',
        error: error.message 
      });
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    try {
      const { slug } = req.params;
      const category = await sanityService.getCategoryBySlug(slug);
      
      if (!category) {
        return reply.status(404).send({ 
          success: false, 
          message: 'Category not found' 
        });
      }
      
      return reply.send({ success: true, data: category });
    } catch (error: any) {
      logger.error('Error fetching category:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch category',
        error: error.message 
      });
    }
  }

  /**
   * Get all blog posts
   */
  async getPosts(req: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const posts = await sanityService.getAllPosts(limit);
      return reply.send({ success: true, data: posts });
    } catch (error: any) {
      logger.error('Error fetching posts:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch posts',
        error: error.message 
      });
    }
  }

  /**
   * Get blog post by slug
   */
  async getPostBySlug(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    try {
      const { slug } = req.params;
      const post = await sanityService.getPostBySlug(slug);
      
      if (!post) {
        return reply.status(404).send({ 
          success: false, 
          message: 'Post not found' 
        });
      }
      
      return reply.send({ success: true, data: post });
    } catch (error: any) {
      logger.error('Error fetching post:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch post',
        error: error.message 
      });
    }
  }

  /**
   * Get featured blog posts
   */
  async getFeaturedPosts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const posts = await sanityService.getFeaturedPosts();
      return reply.send({ success: true, data: posts });
    } catch (error: any) {
      logger.error('Error fetching featured posts:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch featured posts',
        error: error.message 
      });
    }
  }

  /**
   * Get page by slug
   */
  async getPageBySlug(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    try {
      const { slug } = req.params;
      const page = await sanityService.getPageBySlug(slug);
      
      if (!page) {
        return reply.status(404).send({ 
          success: false, 
          message: 'Page not found' 
        });
      }
      
      return reply.send({ success: true, data: page });
    } catch (error: any) {
      logger.error('Error fetching page:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to fetch page',
        error: error.message 
      });
    }
  }

  /**
   * Search content
   */
  async search(req: FastifyRequest<{ Querystring: { q?: string; types?: string } }>, reply: FastifyReply) {
    try {
      const { q, types } = req.query;
      
      if (!q) {
        return reply.status(400).send({ 
          success: false, 
          message: 'Search query is required' 
        });
      }
      
      const searchTypes = types 
        ? types.split(',')
        : ['product', 'post', 'page'];
      
      const results = await sanityService.search(q, searchTypes);
      return reply.send({ success: true, data: results });
    } catch (error: any) {
      logger.error('Error searching content:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Search failed',
        error: error.message 
      });
    }
  }

  /**
   * Handle Sanity webhook
   * This endpoint receives notifications when content is updated in Sanity
   */
  async handleWebhook(req: FastifyRequest, reply: FastifyReply) {
    try {
      // Verify webhook signature if configured
      const signature = req.headers['sanity-webhook-signature'] as string;
      const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
      
      if (webhookSecret && signature) {
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
          .createHmac('sha256', webhookSecret)
          .update(body)
          .digest('hex');
        
        if (signature !== expectedSignature) {
          logger.warn('Invalid webhook signature');
          return reply.status(401).send({ 
            success: false, 
            message: 'Invalid signature' 
          });
        }
      }
      
      const result = await sanityService.handleWebhook(req.body);
      return reply.send(result);
    } catch (error: any) {
      logger.error('Error handling webhook:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Webhook processing failed',
        error: error.message 
      });
    }
  }

  /**
   * Clear cache manually (admin only)
   */
  async clearCache(req: FastifyRequest<{ Querystring: { pattern?: string } }>, reply: FastifyReply) {
    try {
      const { pattern } = req.query;
      clearCache(pattern);
      return reply.send({ 
        success: true, 
        message: 'Cache cleared successfully' 
      });
    } catch (error: any) {
      logger.error('Error clearing cache:', error);
      return reply.status(500).send({ 
        success: false, 
        message: 'Failed to clear cache',
        error: error.message 
      });
    }
  }
}

export const sanityController = new SanityController();
export default sanityController;
