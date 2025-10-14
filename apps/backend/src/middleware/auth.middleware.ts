import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTUtils, JWTPayload } from '../utils/jwt';
import { authService } from '../services/auth.service';

// Extend @fastify/jwt types to match our JWTPayload
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTPayload;
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'No authorization token provided',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = await JWTUtils.verifyToken(request.server, token);

    // Validate user still exists
    const userExists = await authService.validateUser(payload.userId);

    if (!userExists) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'User no longer exists',
      });
    }

    // Attach user to request
    request.user = payload;
  } catch (error: any) {
    return reply.code(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: error.message || 'Invalid or expired token',
    });
  }
}

export async function optionalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = await JWTUtils.verifyToken(request.server, token);
      
      const userExists = await authService.validateUser(payload.userId);
      if (userExists) {
        request.user = payload;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }
}

export function requireRole(role: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (request.user.role !== role) {
      return reply.code(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions',
      });
    }
  };
}

// Export authenticate as an alias for authMiddleware
export const authenticate = authMiddleware;
