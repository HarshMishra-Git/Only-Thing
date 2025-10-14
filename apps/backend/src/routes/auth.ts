import { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { googleAuthController } from '../controllers/google-auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // POST /api/auth/register - Create new user account
  fastify.post('/register', authController.register.bind(authController));

  // POST /api/auth/login - Login with email and password
  fastify.post('/login', authController.login.bind(authController));

  // GET /api/auth/google - Initiate Google OAuth
  fastify.get('/google', googleAuthController.initiateGoogleAuth.bind(googleAuthController));

  // GET /api/auth/google/callback - Google OAuth callback
  fastify.get('/google/callback', googleAuthController.handleGoogleCallback.bind(googleAuthController));

  // POST /api/auth/refresh - Refresh access token
  fastify.post('/refresh', authController.refresh.bind(authController));

  // GET /api/auth/me - Get current user (protected)
  fastify.get('/me', {
    preHandler: authMiddleware,
    handler: authController.me.bind(authController),
  });
};
