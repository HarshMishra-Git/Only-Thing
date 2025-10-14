import { FastifyPluginAsync } from 'fastify';
import sanityController from '../controllers/sanity.controller';

export const sanityRoutes: FastifyPluginAsync = async (fastify) => {
  // Public routes
  fastify.get('/products', sanityController.getProducts.bind(sanityController));
  fastify.get('/products/featured', sanityController.getFeaturedProducts.bind(sanityController));
  fastify.get('/products/:slug', sanityController.getProductBySlug.bind(sanityController));

  fastify.get('/categories', sanityController.getCategories.bind(sanityController));
  fastify.get('/categories/:slug', sanityController.getCategoryBySlug.bind(sanityController));

  fastify.get('/posts', sanityController.getPosts.bind(sanityController));
  fastify.get('/posts/featured', sanityController.getFeaturedPosts.bind(sanityController));
  fastify.get('/posts/:slug', sanityController.getPostBySlug.bind(sanityController));

  fastify.get('/pages/:slug', sanityController.getPageBySlug.bind(sanityController));

  fastify.get('/search', sanityController.search.bind(sanityController));

  // Webhook endpoint (protected by signature verification in controller)
  fastify.post('/webhook', sanityController.handleWebhook.bind(sanityController));

  // Protected routes (admin only)
  fastify.delete('/cache', {
    onRequest: [fastify.authenticate],
  }, sanityController.clearCache.bind(sanityController));
};
