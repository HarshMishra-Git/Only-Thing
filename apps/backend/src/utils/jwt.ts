import { FastifyInstance } from 'fastify';
import { config } from '../config/env';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class JWTUtils {
  static generateTokens(fastify: FastifyInstance, payload: JWTPayload): TokenResponse {
    const accessToken = fastify.jwt.sign(payload, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = fastify.jwt.sign(
      { ...payload, type: 'refresh' },
      { expiresIn: '30d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn,
    };
  }

  static async verifyToken(fastify: FastifyInstance, token: string): Promise<JWTPayload> {
    try {
      const decoded = fastify.jwt.verify(token) as JWTPayload & { type?: string };
      
      // Remove 'type' if it exists (for refresh tokens)
      const { type, ...payload } = decoded;
      
      return payload as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async refreshAccessToken(
    fastify: FastifyInstance,
    refreshToken: string
  ): Promise<TokenResponse> {
    try {
      const decoded = fastify.jwt.verify(refreshToken) as JWTPayload & { type?: string };

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      const payload: JWTPayload = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      return this.generateTokens(fastify, payload);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
