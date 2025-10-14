import { FastifyRequest, FastifyReply } from 'fastify';
import { userService, UpdateProfileInput } from '../services/user.service';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export class UserController {
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Not authenticated',
        });
      }

      const profile = await userService.getProfile(request.user.userId);

      return reply.send({ profile });
    } catch (error: any) {
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to get profile',
      });
    }
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Not authenticated',
        });
      }

      const validatedData = updateProfileSchema.parse(request.body);

      const profile = await userService.updateProfile(
        request.user.userId,
        validatedData as UpdateProfileInput
      );

      return reply.send({ profile });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          statusCode: 400,
          error: 'Validation Error',
          message: error.errors[0].message,
        });
      }

      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to update profile',
      });
    }
  }

  async getAddresses(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Not authenticated',
        });
      }

      const addresses = await userService.getAddresses(request.user.userId);

      return reply.send({ addresses });
    } catch (error: any) {
      return reply.code(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to get addresses',
      });
    }
  }
}

export const userController = new UserController();
