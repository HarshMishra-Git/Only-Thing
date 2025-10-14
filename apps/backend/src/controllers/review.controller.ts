import { FastifyRequest, FastifyReply } from 'fastify';
import { reviewService, CreateReviewInput, UpdateReviewInput } from '../services/review.service';

interface CreateReviewBody extends CreateReviewInput {}
interface UpdateReviewBody extends UpdateReviewInput {}

interface GetReviewsQuery {
  productId?: string;
  userId?: string;
  rating?: string;
  verified?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

export class ReviewController {
  async createReview(
    request: FastifyRequest<{ Body: CreateReviewBody }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const review = await reviewService.createReview(userId, request.body);

      return reply.status(201).send({
        success: true,
        data: review,
      });
    } catch (error: any) {
      console.error('Create review error:', error);
      return reply.status(400).send({
        success: false,
        error: error.message || 'Failed to create review',
      });
    }
  }

  async getReviews(
    request: FastifyRequest<{ Querystring: GetReviewsQuery }>,
    reply: FastifyReply
  ) {
    try {
      const query = {
        productId: request.query.productId,
        userId: request.query.userId,
        rating: request.query.rating ? parseInt(request.query.rating) : undefined,
        verified: request.query.verified === 'true' ? true : undefined,
        sortBy: request.query.sortBy as any,
        page: request.query.page ? parseInt(request.query.page) : 1,
        limit: request.query.limit ? parseInt(request.query.limit) : 10,
      };

      const result = await reviewService.getReviews(query);

      return reply.send({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Get reviews error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch reviews',
      });
    }
  }

  async getReviewById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const review = await reviewService.getReviewById(request.params.id);

      return reply.send({
        success: true,
        data: review,
      });
    } catch (error: any) {
      console.error('Get review error:', error);
      return reply.status(404).send({
        success: false,
        error: error.message || 'Review not found',
      });
    }
  }

  async updateReview(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateReviewBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const review = await reviewService.updateReview(
        request.params.id,
        userId,
        request.body
      );

      return reply.send({
        success: true,
        data: review,
      });
    } catch (error: any) {
      console.error('Update review error:', error);
      return reply.status(400).send({
        success: false,
        error: error.message || 'Failed to update review',
      });
    }
  }

  async deleteReview(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const isAdmin = request.user!.role === 'ADMIN';
      
      await reviewService.deleteReview(request.params.id, userId, isAdmin);

      return reply.send({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete review error:', error);
      return reply.status(400).send({
        success: false,
        error: error.message || 'Failed to delete review',
      });
    }
  }

  async markReviewHelpful(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const result = await reviewService.markReviewHelpful(request.params.id, userId);

      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Mark helpful error:', error);
      return reply.status(400).send({
        success: false,
        error: error.message || 'Failed to mark review as helpful',
      });
    }
  }

  async getProductRatingSummary(
    request: FastifyRequest<{ Params: { productId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const summary = await reviewService.getProductRatingSummary(request.params.productId);

      return reply.send({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      console.error('Get rating summary error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch rating summary',
      });
    }
  }

  async checkUserReviewed(
    request: FastifyRequest<{ Params: { productId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const hasReviewed = await reviewService.hasUserReviewed(userId, request.params.productId);

      return reply.send({
        success: true,
        data: { hasReviewed },
      });
    } catch (error: any) {
      console.error('Check user reviewed error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to check review status',
      });
    }
  }
}

export const reviewController = new ReviewController();
