import prisma from '../prisma/client';

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

export interface QuizSubmission {
  answers: QuizAnswer[];
  userId?: string;
}

interface ProductScore {
  productId: string;
  score: number;
  reasons: string[];
}

interface QuizScore {
  fitnessGoal: string;
  activityLevel: string;
  dietaryPreference: string;
  focusAreas: string[];
  budgetRange: string;
}

export class QuizService {
  /**
   * Submit quiz and get personalized recommendations
   */
  async submitQuiz(submission: QuizSubmission) {
    // Parse answers into structured data
    const parsedAnswers = this.parseAnswers(submission.answers);
    
    // Calculate quiz score/profile
    const score = this.calculateScore(parsedAnswers);
    
    // Get product recommendations based on quiz results
    const recommendations = await this.getRecommendations(score);
    
    // Save quiz result to database
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: submission.userId || null,
        answers: submission.answers as any,
        score: score as any,
        results: recommendations as any,
        fitnessGoal: score.fitnessGoal,
        activityLevel: score.activityLevel,
        dietaryPreference: score.dietaryPreference,
        recommendedProductIds: recommendations.products.map((p: any) => p.id),
      },
    });

    return {
      id: quizResult.id,
      score,
      recommendations,
      createdAt: quizResult.createdAt,
    };
  }

  /**
   * Get quiz results by ID
   */
  async getQuizResult(resultId: string) {
    const result = await prisma.quizResult.findUnique({
      where: { id: resultId },
    });

    if (!result) {
      throw new Error('Quiz result not found');
    }

    return result;
  }

  /**
   * Get user's quiz results
   */
  async getUserQuizResults(userId: string) {
    const results = await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return results;
  }

  /**
   * Get latest quiz result for user
   */
  async getLatestUserQuizResult(userId: string) {
    const result = await prisma.quizResult.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return result;
  }

  /**
   * Parse quiz answers into structured format
   */
  private parseAnswers(answers: QuizAnswer[]) {
    const parsed: any = {};
    
    answers.forEach(answer => {
      parsed[answer.questionId] = answer.answer;
    });

    return parsed;
  }

  /**
   * Calculate quiz score and user profile
   */
  private calculateScore(answers: any): QuizScore {
    const score: QuizScore = {
      fitnessGoal: answers.fitnessGoal || answers.goal || 'general_health',
      activityLevel: answers.activityLevel || answers.activity || 'moderate',
      dietaryPreference: answers.dietaryPreference || answers.diet || 'omnivore',
      focusAreas: this.extractFocusAreas(answers),
      budgetRange: answers.budget || 'moderate',
    };

    return score;
  }

  /**
   * Extract focus areas from quiz answers
   */
  private extractFocusAreas(answers: any): string[] {
    const focusAreas: string[] = [];

    // Extract from various answer types
    if (answers.focusAreas) {
      if (Array.isArray(answers.focusAreas)) {
        focusAreas.push(...answers.focusAreas);
      } else {
        focusAreas.push(answers.focusAreas);
      }
    }

    if (answers.concerns) {
      if (Array.isArray(answers.concerns)) {
        focusAreas.push(...answers.concerns);
      } else {
        focusAreas.push(answers.concerns);
      }
    }

    if (answers.goals && Array.isArray(answers.goals)) {
      focusAreas.push(...answers.goals);
    }

    return [...new Set(focusAreas)]; // Remove duplicates
  }

  /**
   * Get personalized product recommendations
   */
  private async getRecommendations(score: QuizScore) {
    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        ingredients: true,
        supplementFacts: true,
      },
    });

    // Score each product based on quiz results
    const scoredProducts = products.map(product => {
      const productScore = this.scoreProduct(product, score);
      return {
        product,
        score: productScore.score,
        reasons: productScore.reasons,
      };
    });

    // Sort by score and get top recommendations
    const topProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // Format recommendations
    const recommendations = topProducts.map(item => ({
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      description: item.product.shortDescription || item.product.description,
      price: item.product.price,
      compareAtPrice: item.product.compareAtPrice,
      category: item.product.category,
      tags: item.product.tags,
      rating: item.product.rating,
      matchScore: item.score,
      reasons: item.reasons,
    }));

    return {
      products: recommendations,
      profile: {
        fitnessGoal: score.fitnessGoal,
        activityLevel: score.activityLevel,
        dietaryPreference: score.dietaryPreference,
        focusAreas: score.focusAreas,
      },
      summary: this.generateRecommendationSummary(score, recommendations.length),
    };
  }

  /**
   * Score a product based on quiz results
   */
  private scoreProduct(product: any, score: QuizScore): ProductScore {
    let totalScore = 0;
    const reasons: string[] = [];

    // Base score
    totalScore += 50;

    // Score based on fitness goal
    const goalScore = this.scoreByGoal(product, score.fitnessGoal);
    totalScore += goalScore.score;
    if (goalScore.reason) reasons.push(goalScore.reason);

    // Score based on activity level
    const activityScore = this.scoreByActivity(product, score.activityLevel);
    totalScore += activityScore.score;
    if (activityScore.reason) reasons.push(activityScore.reason);

    // Score based on dietary preference
    const dietScore = this.scoreByDiet(product, score.dietaryPreference);
    totalScore += dietScore.score;
    if (dietScore.reason) reasons.push(dietScore.reason);

    // Score based on focus areas
    const focusScore = this.scoreByFocusAreas(product, score.focusAreas);
    totalScore += focusScore.score;
    reasons.push(...focusScore.reasons);

    // Boost for featured products
    if (product.isFeatured) {
      totalScore += 10;
      reasons.push('Popular choice');
    }

    // Boost for high-rated products
    if (product.rating && parseFloat(product.rating.toString()) >= 4.5) {
      totalScore += 15;
      reasons.push('Highly rated');
    }

    return {
      productId: product.id,
      score: Math.min(100, totalScore), // Cap at 100
      reasons: reasons.slice(0, 3), // Top 3 reasons
    };
  }

  /**
   * Score product by fitness goal
   */
  private scoreByGoal(product: any, goal: string): { score: number; reason?: string } {
    const goalMapping: Record<string, string[]> = {
      weight_loss: ['fat burner', 'metabolism', 'weight management', 'thermogenic'],
      muscle_gain: ['protein', 'mass gainer', 'creatine', 'pre-workout', 'bcaa'],
      endurance: ['energy', 'endurance', 'pre-workout', 'electrolytes'],
      general_health: ['multivitamin', 'wellness', 'immune', 'daily'],
      recovery: ['recovery', 'post-workout', 'bcaa', 'glutamine'],
      performance: ['pre-workout', 'performance', 'energy', 'focus'],
    };

    const keywords = goalMapping[goal] || [];
    const productText = `${product.name} ${product.description} ${product.category} ${product.tags.join(' ')}`.toLowerCase();

    let score = 0;
    let matchedKeyword = '';

    for (const keyword of keywords) {
      if (productText.includes(keyword.toLowerCase())) {
        score += 20;
        matchedKeyword = keyword;
        break;
      }
    }

    return {
      score,
      reason: matchedKeyword ? `Perfect for ${goal.replace('_', ' ')}` : undefined,
    };
  }

  /**
   * Score product by activity level
   */
  private scoreByActivity(product: any, activity: string): { score: number; reason?: string } {
    const activityMapping: Record<string, string[]> = {
      sedentary: ['wellness', 'daily', 'multivitamin'],
      moderate: ['energy', 'wellness', 'protein'],
      active: ['pre-workout', 'protein', 'performance'],
      very_active: ['pre-workout', 'recovery', 'mass gainer', 'performance'],
    };

    const keywords = activityMapping[activity] || [];
    const productText = `${product.name} ${product.category} ${product.tags.join(' ')}`.toLowerCase();

    let score = 0;
    let matched = false;

    for (const keyword of keywords) {
      if (productText.includes(keyword.toLowerCase())) {
        score += 15;
        matched = true;
        break;
      }
    }

    return {
      score,
      reason: matched ? `Ideal for ${activity.replace('_', ' ')} lifestyle` : undefined,
    };
  }

  /**
   * Score product by dietary preference
   */
  private scoreByDiet(product: any, diet: string): { score: number; reason?: string } {
    const dietKeywords: Record<string, string[]> = {
      vegan: ['vegan', 'plant-based'],
      vegetarian: ['vegetarian', 'vegan', 'plant-based'],
      keto: ['keto', 'low-carb'],
      paleo: ['paleo', 'natural'],
    };

    const keywords = dietKeywords[diet] || [];
    const productText = `${product.name} ${product.description} ${product.dietaryInfo?.join(' ') || ''}`.toLowerCase();

    let score = 0;
    let matchedDiet = '';

    for (const keyword of keywords) {
      if (productText.includes(keyword.toLowerCase())) {
        score += 15;
        matchedDiet = keyword;
        break;
      }
    }

    return {
      score,
      reason: matchedDiet ? `${matchedDiet.charAt(0).toUpperCase() + matchedDiet.slice(1)}-friendly` : undefined,
    };
  }

  /**
   * Score product by focus areas
   */
  private scoreByFocusAreas(product: any, focusAreas: string[]): { score: number; reasons: string[] } {
    const productText = `${product.name} ${product.description} ${product.category} ${product.tags.join(' ')} ${product.features?.join(' ') || ''}`.toLowerCase();
    
    let score = 0;
    const reasons: string[] = [];

    focusAreas.forEach(area => {
      if (productText.includes(area.toLowerCase().replace('_', ' '))) {
        score += 10;
        reasons.push(`Supports ${area.replace('_', ' ')}`);
      }
    });

    return { score: Math.min(30, score), reasons }; // Cap focus area score
  }

  /**
   * Generate recommendation summary text
   */
  private generateRecommendationSummary(score: QuizScore, productCount: number): string {
    const goalText = score.fitnessGoal.replace('_', ' ');
    const activityText = score.activityLevel.replace('_', ' ');

    return `Based on your ${goalText} goal and ${activityText} activity level, we've curated ${productCount} personalized supplements to help you achieve your fitness objectives.`;
  }
}

export const quizService = new QuizService();
