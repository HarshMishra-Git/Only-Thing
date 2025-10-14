import { FastifyRequest, FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import { authService } from '../services/auth.service';
import { JWTUtils } from '../utils/jwt';
import prisma from '../prisma/client';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

const googleClient = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

export class GoogleAuthController {
  // Step 1: Redirect user to Google OAuth
  async initiateGoogleAuth(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authUrl = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ],
        prompt: 'consent',
      });

      return reply.redirect(authUrl);
    } catch (error: any) {
      console.error('Google auth initiation error:', error);
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to initiate Google authentication',
      });
    }
  }

  // Step 2: Handle Google OAuth callback
  async handleGoogleCallback(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { code } = request.query as { code?: string };

      if (!code) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Authorization code not provided',
        });
      }

      // Exchange code for tokens
      const { tokens } = await googleClient.getToken(code);
      googleClient.setCredentials(tokens);

      // Get user info from Google
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new Error('Failed to get user information from Google');
      }

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      // If user doesn't exist, create new user
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            password: '', // No password for OAuth users
            firstName: payload.given_name || '',
            lastName: payload.family_name || '',
            role: 'CUSTOMER',
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        });

        // Create empty cart for new user
        await prisma.cart.create({
          data: {
            userId: user.id,
          },
        });
      }

      // Generate JWT tokens
      const jwtTokens = JWTUtils.generateTokens(request.server, {
        userId: user.id,
        id: user.id,
        email: user.email,
        role: user.role as string,
      });

      // Get the frontend URL from environment or use default
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      // Encode tokens and user data in URL
      const encodedUser = encodeURIComponent(JSON.stringify(user));
      const redirectUrl = `${frontendUrl}/auth/google/callback?` +
        `user=${encodedUser}&` +
        `accessToken=${jwtTokens.accessToken}&` +
        `refreshToken=${jwtTokens.refreshToken}`;

      // Direct redirect to frontend callback page
      return reply.redirect(302, redirectUrl);
    } catch (error: any) {
      console.error('Google callback error:', error);
      
      // Get the frontend URL from environment or use default
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      // Redirect to login page with error message
      return reply.redirect(302, `${frontendUrl}/login?error=google_auth_failed`);
    }
  }
}

export const googleAuthController = new GoogleAuthController();
