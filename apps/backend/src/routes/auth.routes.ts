import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { googleAuthController } from '../controllers/google-auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { passwordResetService } from '../services/password-reset.service';

interface RequestPasswordResetBody {
  email: string;
}

interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  // Registration
  fastify.post('/register', authController.register.bind(authController));

  // Login
  fastify.post('/login', authController.login.bind(authController));

  // Google OAuth
  fastify.get('/google', googleAuthController.initiateGoogleAuth.bind(googleAuthController));
  fastify.get('/google/callback', googleAuthController.handleGoogleCallback.bind(googleAuthController));

  // Refresh token
  fastify.post('/refresh', authController.refresh.bind(authController));

  // Get current user
  fastify.get(
    '/me',
    { preHandler: [authenticate] },
    authController.me.bind(authController)
  );

  // Request password reset
  fastify.post(
    '/forgot-password',
    async (request: FastifyRequest<{ Body: RequestPasswordResetBody }>, reply: FastifyReply) => {
      try {
        const { email } = request.body;

        if (!email) {
          return reply.status(400).send({
            success: false,
            error: 'Email is required',
          });
        }

        await passwordResetService.requestPasswordReset(email);

        return reply.send({
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent.',
        });
      } catch (error: any) {
        console.error('Password reset request error:', error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to process password reset request',
        });
      }
    }
  );

  // Verify reset token
  fastify.get(
    '/verify-reset-token/:token',
    async (request: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) => {
      try {
        const { token } = request.params;
        const verification = await passwordResetService.verifyResetToken(token);

        if (!verification.valid) {
          return reply.status(400).send({
            success: false,
            error: 'Invalid or expired reset token',
          });
        }

        return reply.send({
          success: true,
          valid: true,
        });
      } catch (error: any) {
        console.error('Token verification error:', error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to verify token',
        });
      }
    }
  );

  // Reset password
  fastify.post(
    '/reset-password',
    async (request: FastifyRequest<{ Body: ResetPasswordBody }>, reply: FastifyReply) => {
      try {
        const { token, newPassword } = request.body;

        if (!token || !newPassword) {
          return reply.status(400).send({
            success: false,
            error: 'Token and new password are required',
          });
        }

        if (newPassword.length < 6) {
          return reply.status(400).send({
            success: false,
            error: 'Password must be at least 6 characters long',
          });
        }

        await passwordResetService.resetPassword(token, newPassword);

        return reply.send({
          success: true,
          message: 'Password has been reset successfully',
        });
      } catch (error: any) {
        console.error('Password reset error:', error);
        return reply.status(400).send({
          success: false,
          error: error.message || 'Failed to reset password',
        });
      }
    }
  );
}
