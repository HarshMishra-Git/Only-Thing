import { FastifyInstance } from 'fastify';
import { quizController } from '../controllers/quiz.controller';
import { authenticate } from '../middleware/auth.middleware';

/**
 * Optional authentication middleware
 * Adds user to request if token is present, but doesn't require it
 */
async function optionalAuth(request: any, reply: any) {
  try {
    await authenticate(request, reply);
  } catch (error) {
    // Continue without authentication
    request.user = undefined;
  }
}

export async function quizRoutes(fastify: FastifyInstance) {
  // Submit quiz (optional auth - can be taken without login)
  fastify.post(
    '/submit',
    { preHandler: [optionalAuth] },
    quizController.submitQuiz.bind(quizController)
  );

  // Get quiz result by ID (public - anyone with ID can view)
  fastify.get(
    '/results/:resultId',
    quizController.getQuizResult.bind(quizController)
  );

  // Get user's quiz results (requires auth)
  fastify.get(
    '/results/user/:userId',
    { preHandler: [authenticate] },
    quizController.getUserQuizResults.bind(quizController)
  );

  // Get latest quiz result for current user (requires auth)
  fastify.get(
    '/latest',
    { preHandler: [authenticate] },
    quizController.getLatestQuizResult.bind(quizController)
  );

  // Get recommendations for current user (requires auth)
  fastify.get(
    '/recommendations',
    { preHandler: [authenticate] },
    quizController.getRecommendations.bind(quizController)
  );
}
