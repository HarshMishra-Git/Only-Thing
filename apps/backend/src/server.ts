import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { config } from './config/env';
import prisma from './prisma/client';

// Import routes
import { productRoutes } from './routes/products';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { cartRoutes } from './routes/cart';
import { orderRoutes } from './routes/orders';
import { quizRoutes } from './routes/quiz';
import { reviewRoutes } from './routes/reviews';
// import { sanityRoutes } from './routes/sanity.routes'; // Temporarily disabled - Sanity not configured yet
import { adminRoutes } from './routes/admin.routes';
import { monitoringRoutes } from './routes/monitoring.routes';

const server = Fastify({
  logger: {
    level: config.nodeEnv === 'development' ? 'info' : 'warn',
    transport: config.nodeEnv === 'development' 
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: config.frontend.url,
    credentials: true,
  });

  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  // JWT
  await server.register(jwt, {
    secret: config.jwt.secret,
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  server.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    };
  });

  // API routes
  await server.register(authRoutes, { prefix: '/api/auth' });
  await server.register(userRoutes, { prefix: '/api/user' });
  await server.register(productRoutes, { prefix: '/api/products' });
  await server.register(cartRoutes, { prefix: '/api/cart' });
  await server.register(orderRoutes, { prefix: '/api/orders' });
  await server.register(quizRoutes, { prefix: '/api/quiz' });
  await server.register(reviewRoutes, { prefix: '/api/reviews' });
  // await server.register(sanityRoutes, { prefix: '/api/sanity' }); // Temporarily disabled - Sanity not configured yet
  await server.register(adminRoutes, { prefix: '/api/admin' });
  await server.register(monitoringRoutes, { prefix: '/api/monitoring' });

  // 404 handler
  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
    });
  });

  // Error handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    
    reply.code(error.statusCode || 500).send({
      statusCode: error.statusCode || 500,
      error: error.name || 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
    });
  });
}

// Graceful shutdown
async function closeGracefully(signal: string) {
  server.log.info(`Received ${signal}, closing server...`);
  await server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();
    
    await server.listen({
      port: config.port,
      host: config.host,
    });
    
    server.log.info(`🚀 Server running on http://${config.host}:${config.port}`);
    server.log.info(`📝 Environment: ${config.nodeEnv}`);
    server.log.info(`🔗 Frontend URL: ${config.frontend.url}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
