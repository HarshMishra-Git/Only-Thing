import { FastifyInstance } from 'fastify';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

export async function reviewRoutes(fastify: FastifyInstance) {
  // Get reviews (public)
  fastify.get('/', reviewController.getReviews.bind(reviewController));

  // Get single review (public)
  fastify.get('/:id', reviewController.getReviewById.bind(reviewController));

  // Get product rating summary (public)
  fastify.get(
    '/product/:productId/summary',
    reviewController.getProductRatingSummary.bind(reviewController)
  );

  // Check if user has reviewed product (requires auth)
  fastify.get(
    '/product/:productId/check',
    { preHandler: [authenticate] },
    reviewController.checkUserReviewed.bind(reviewController)
  );

  // Create review (requires auth)
  fastify.post(
    '/',
    { preHandler: [authenticate] },
    reviewController.createReview.bind(reviewController)
  );

  // Update review (requires auth)
  fastify.put(
    '/:id',
    { preHandler: [authenticate] },
    reviewController.updateReview.bind(reviewController)
  );

  // Delete review (requires auth)
  fastify.delete(
    '/:id',
    { preHandler: [authenticate] },
    reviewController.deleteReview.bind(reviewController)
  );

  // Mark review as helpful (requires auth)
  fastify.post(
    '/:id/helpful',
    { preHandler: [authenticate] },
    reviewController.markReviewHelpful.bind(reviewController)
  );
}
