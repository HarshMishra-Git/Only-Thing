import { FastifyPluginAsync } from 'fastify';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  // All user routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // GET /api/user/profile - Get user profile
  fastify.get('/profile', userController.getProfile.bind(userController));

  // PUT /api/user/profile - Update user profile
  fastify.put('/profile', userController.updateProfile.bind(userController));

  // GET /api/user/addresses - Get user addresses
  fastify.get('/addresses', userController.getAddresses.bind(userController));
};
