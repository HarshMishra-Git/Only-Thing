import { FastifyRequest, FastifyReply } from 'fastify';
import { quizService, QuizAnswer } from '../services/quiz.service';

interface SubmitQuizBody {
  answers: QuizAnswer[];
}

interface GetResultsParams {
  userId?: string;
  resultId?: string;
}

export class QuizController {
  /**
   * Submit quiz and get recommendations
   * POST /api/quiz/submit
   */
  async submitQuiz(
    request: FastifyRequest<{ Body: SubmitQuizBody }>,
    reply: FastifyReply
  ) {
    try {
      const { answers } = request.body;
      const userId = request.user?.id; // Optional - quiz can be taken without login

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return reply.status(400).send({
          success: false,
          error: 'Quiz answers are required',
        });
      }

      const result = await quizService.submitQuiz({
        answers,
        userId,
      });

      return reply.status(201).send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Submit quiz error:', error);
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to process quiz',
      });
    }
  }

  /**
   * Get quiz result by ID
   * GET /api/quiz/results/:resultId
   */
  async getQuizResult(
    request: FastifyRequest<{ Params: { resultId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { resultId } = request.params;

      const result = await quizService.getQuizResult(resultId);

      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Get quiz result error:', error);
      return reply.status(404).send({
        success: false,
        error: error.message || 'Quiz result not found',
      });
    }
  }

  /**
   * Get user's quiz results
   * GET /api/quiz/results/user/:userId
   */
  async getUserQuizResults(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const requestUserId = request.user?.id;

      // Verify user can only access their own results
      if (userId !== requestUserId) {
        return reply.status(403).send({
          success: false,
          error: 'Unauthorized access',
        });
      }

      const results = await quizService.getUserQuizResults(userId);

      return reply.send({
        success: true,
        data: results,
      });
    } catch (error: any) {
      console.error('Get user quiz results error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch quiz results',
      });
    }
  }

  /**
   * Get latest quiz result for authenticated user
   * GET /api/quiz/latest
   */
  async getLatestQuizResult(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user!.id;

      const result = await quizService.getLatestUserQuizResult(userId);

      if (!result) {
        return reply.status(404).send({
          success: false,
          error: 'No quiz results found',
        });
      }

      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Get latest quiz result error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch quiz result',
      });
    }
  }

  /**
   * Get recommendations for authenticated user (from latest quiz)
   * GET /api/quiz/recommendations
   */
  async getRecommendations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user!.id;

      const result = await quizService.getLatestUserQuizResult(userId);

      if (!result) {
        return reply.status(404).send({
          success: false,
          error: 'No quiz results found. Please take the quiz first.',
        });
      }

      return reply.send({
        success: true,
        data: {
          recommendations: result.results,
          profile: {
            fitnessGoal: result.fitnessGoal,
            activityLevel: result.activityLevel,
            dietaryPreference: result.dietaryPreference,
          },
          takenAt: result.createdAt,
        },
      });
    } catch (error: any) {
      console.error('Get recommendations error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch recommendations',
      });
    }
  }
}

export const quizController = new QuizController();
