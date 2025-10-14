import prisma from '../prisma/client';

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface GetReviewsQuery {
  productId?: string;
  userId?: string;
  rating?: number;
  verified?: boolean;
  sortBy?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
  page?: number;
  limit?: number;
}

export class ReviewService {
  /**
   * Create a new review
   * Verifies if user has purchased the product
   */
  async createReview(userId: string, input: CreateReviewInput) {
    // Validate rating
    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: input.productId,
        },
      },
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // Check if user has purchased this product (for verified badge)
    const hasPurchased = await this.hasUserPurchasedProduct(userId, input.productId);

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        productId: input.productId,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
        verified: hasPurchased,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update product rating and review count
    await this.updateProductRating(input.productId);

    return review;
  }

  /**
   * Check if user has purchased a product
   */
  private async hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        paymentStatus: 'PAID',
        items: {
          some: {
            productId,
          },
        },
      },
    });

    return !!order;
  }

  /**
   * Get reviews with filtering and sorting
   */
  async getReviews(query: GetReviewsQuery) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (query.productId) where.productId = query.productId;
    if (query.userId) where.userId = query.userId;
    if (query.rating) where.rating = query.rating;
    if (query.verified !== undefined) where.verified = query.verified;

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // Default: most recent
    
    switch (query.sortBy) {
      case 'helpful':
        orderBy = { helpful: 'desc' };
        break;
      case 'rating_high':
        orderBy = { rating: 'desc' };
        break;
      case 'rating_low':
        orderBy = { rating: 'asc' };
        break;
      case 'recent':
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch reviews
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single review by ID
   */
  async getReviewById(reviewId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    return review;
  }

  /**
   * Update a review (only by owner)
   */
  async updateReview(reviewId: string, userId: string, input: UpdateReviewInput) {
    // Check if review exists and belongs to user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('You can only update your own reviews');
    }

    // Validate rating if provided
    if (input.rating && (input.rating < 1 || input.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: input,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update product rating if rating changed
    if (input.rating) {
      await this.updateProductRating(review.productId);
    }

    return updatedReview;
  }

  /**
   * Delete a review (only by owner or admin)
   */
  async deleteReview(reviewId: string, userId: string, isAdmin: boolean = false) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new Error('You can only delete your own reviews');
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update product rating
    await this.updateProductRating(review.productId);

    return { success: true };
  }

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId: string, userId: string) {
    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new Error('Review not found');
    }

    // Check if user already marked this review as helpful
    const existingVote = await prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    if (existingVote) {
      // Remove vote (toggle)
      await prisma.reviewHelpfulVote.delete({
        where: { id: existingVote.id },
      });

      // Decrement helpful count
      await prisma.review.update({
        where: { id: reviewId },
        data: { helpful: { decrement: 1 } },
      });

      return { helpful: false, count: review.helpful - 1 };
    } else {
      // Add vote
      await prisma.reviewHelpfulVote.create({
        data: {
          reviewId,
          userId,
        },
      });

      // Increment helpful count
      await prisma.review.update({
        where: { id: reviewId },
        data: { helpful: { increment: 1 } },
      });

      return { helpful: true, count: review.helpful + 1 };
    }
  }

  /**
   * Get product rating summary
   */
  async getProductRatingSummary(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    // Calculate average
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate distribution
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    };
  }

  /**
   * Update product's average rating and review count
   */
  private async updateProductRating(productId: string) {
    const summary = await this.getProductRatingSummary(productId);

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: summary.averageRating,
        reviewCount: summary.totalReviews,
      },
    });
  }

  /**
   * Check if user has reviewed a product
   */
  async hasUserReviewed(userId: string, productId: string): Promise<boolean> {
    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!review;
  }

  /**
   * Check if user has marked review as helpful
   */
  async hasUserMarkedHelpful(userId: string, reviewId: string): Promise<boolean> {
    const vote = await prisma.reviewHelpfulVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId,
          userId,
        },
      },
    });

    return !!vote;
  }
}

export const reviewService = new ReviewService();
