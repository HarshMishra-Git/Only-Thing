import { FastifyRequest, FastifyReply } from 'fastify';
import { authService, RegisterInput, LoginInput } from '../services/auth.service';
import { JWTUtils } from '../utils/jwt';
import { z } from 'zod';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validate input
      const validatedData = registerSchema.parse(request.body);

      // Register user
      const user = await authService.register(validatedData as RegisterInput);

      // Generate tokens
      const tokens = JWTUtils.generateTokens(request.server, {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.code(201).send({
        user,
        ...tokens,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Validation Error',
          message: error.errors[0].message,
          details: error.errors,
        });
      }

      if (error.message === 'User already exists with this email') {
        return reply.code(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: error.message,
        });
      }

      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to register user',
      });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(request.body);

      // Login user
      const user = await authService.login(validatedData as LoginInput);

      // Generate tokens
      const tokens = JWTUtils.generateTokens(request.server, {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        user,
        ...tokens,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Validation Error',
          message: error.errors[0].message,
          details: error.errors,
        });
      }

      if (error.message === 'Invalid email or password') {
        return reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: error.message,
        });
      }

      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to login',
      });
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Validate input
      const validatedData = refreshSchema.parse(request.body);

      // Refresh tokens
      const tokens = await JWTUtils.refreshAccessToken(
        request.server,
        validatedData.refreshToken
      );

      return reply.send(tokens);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Validation Error',
          message: error.errors[0].message,
        });
      }

      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token',
      });
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Not authenticated',
        });
      }

      const user = await authService.getUserById(request.user.userId);

      return reply.send({ user });
    } catch (error: any) {
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to get user',
      });
    }
  }
}

export const authController = new AuthController();
