import helmet from '@fastify/helmet';
import { FastifyInstance } from 'fastify';
import { logger } from '../lib/logger';

/**
 * Security headers configuration using Helmet
 */
export const securityHeadersConfig = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://analytics.google.com'],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },

  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: false, // Set to true if you need stronger isolation

  // Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' },

  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: 'same-site' },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },

  // Frameguard - prevent clickjacking
  frameguard: { action: 'deny' },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // IE No Open - prevent IE from executing downloads
  ieNoOpen: true,

  // Don't sniff MIME types
  noSniff: true,

  // Origin Agent Cluster
  originAgentCluster: true,

  // Permitted Cross-Domain Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // X-XSS-Protection (legacy, but still useful for old browsers)
  xssFilter: true,
};

/**
 * Register security headers middleware
 */
export async function registerSecurityHeaders(server: FastifyInstance) {
  await server.register(helmet, securityHeadersConfig);
  logger.info('Security headers configured');
}

/**
 * Additional custom security headers
 */
export function customSecurityHeaders(reply: any) {
  // Permissions Policy (formerly Feature Policy)
  reply.header('Permissions-Policy', [
    'geolocation=()',
    'microphone=()',
    'camera=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
  ].join(', '));

  // Expect-CT header (deprecated but some security scanners check for it)
  reply.header('Expect-CT', 'max-age=86400, enforce');

  // Custom security header
  reply.header('X-Content-Type-Options', 'nosniff');
}

/**
 * CORS configuration for API
 */
export const corsConfig = {
  origin: (origin: string, cb: (err: Error | null, allow: boolean) => void) => {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      cb(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      logger.warn({ origin }, 'CORS origin not allowed');
      cb(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Accept',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
};

/**
 * Apply security headers to all responses
 */
export function applySecurityHeaders(reply: any) {
  customSecurityHeaders(reply);
}

export default registerSecurityHeaders;
