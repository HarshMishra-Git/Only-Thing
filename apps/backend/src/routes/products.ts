import { FastifyPluginAsync } from 'fastify';
import { productController } from '../controllers/product.controller';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/products - List all products with filters/sort
  fastify.get('/', productController.getAll.bind(productController));

  // GET /api/products/featured - Get featured products
  fastify.get('/featured', productController.getFeatured.bind(productController));

  // GET /api/products/categories - Get all categories
  fastify.get('/categories', productController.getCategories.bind(productController));

  // GET /api/products/search - Search products
  fastify.get('/search', productController.search.bind(productController));

  // GET /api/products/:slug - Get single product by slug
  fastify.get('/:slug', productController.getBySlug.bind(productController));
};
