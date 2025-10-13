import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabase } from './utils/database';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create Fastify instance
const server: FastifyInstance = Fastify({
  logger: logger,
  trustProxy: true,
  bodyLimit: 1048576, // 1MB
});

async function buildServer() {
  // Register CORS
  await server.register(cors, {
    origin: [FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Register Helmet for security headers
  await server.register(helmet, {
    contentSecurityPolicy: false, // Configure as needed
  });

  // Register rate limiting
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
    cache: 10000,
    allowList: ['127.0.0.1'],
    redis: undefined, // Configure Redis for production
  });

  // Register JWT
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-minimum-32-characters-long',
    sign: {
      expiresIn: process.env.JWT_EXPIRY || '1h',
    },
  });

  // Initialize database
  initializeDatabase({
    connectionString: process.env.DATABASE_URL || '',
  });

  // Health check endpoint
  server.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  });

  // API routes will be registered here
  // await server.register(authRoutes, { prefix: '/api/auth' });
  // await server.register(productRoutes, { prefix: '/api/products' });
  // await server.register(cartRoutes, { prefix: '/api/cart' });
  // await server.register(orderRoutes, { prefix: '/api/orders' });
  // await server.register(quizRoutes, { prefix: '/api/quiz' });
  // await server.register(reviewRoutes, { prefix: '/api/reviews' });
  // await server.register(eventRoutes, { prefix: '/api/events' });

  // 404 handler
  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
    });
  });

  // Global error handler
  server.setErrorHandler((error, request, reply) => {
    logger.error({ error, request: { method: request.method, url: request.url } }, 'Request error');

    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : error.message;

    reply.code(statusCode).send({
      error: error.name || 'Error',
      message,
      statusCode,
    });
  });

  return server;
}

async function start() {
  try {
    const app = await buildServer();
    
    await app.listen({ port: PORT, host: HOST });
    
    logger.info(`🚀 Server started on http://${HOST}:${PORT}`);
    logger.info(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Frontend URL: ${FRONTEND_URL}`);
  } catch (err) {
    logger.error(err, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await closeDatabase();
  await server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await closeDatabase();
  await server.close();
  process.exit(0);
});

// Start the server
if (require.main === module) {
  start();
}

export { buildServer, start };
export default server;
