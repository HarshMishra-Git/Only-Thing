import { FastifyPluginAsync } from 'fastify';
import { cartController } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const cartRoutes: FastifyPluginAsync = async (fastify) => {
  // All cart routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // GET /api/cart - Get user's cart
  fastify.get('/', cartController.getCart.bind(cartController));

  // POST /api/cart/add - Add item to cart
  fastify.post('/add', cartController.addToCart.bind(cartController));

  // PUT /api/cart/update/:itemId - Update cart item quantity
  fastify.put('/update/:itemId', cartController.updateCartItem.bind(cartController));

  // DELETE /api/cart/remove/:itemId - Remove item from cart
  fastify.delete('/remove/:itemId', cartController.removeCartItem.bind(cartController));

  // DELETE /api/cart/clear - Clear entire cart
  fastify.delete('/clear', cartController.clearCart.bind(cartController));

  // POST /api/cart/sync - Sync cart with localStorage
  fastify.post('/sync', cartController.syncCart.bind(cartController));
};
