import { FastifyPluginAsync } from 'fastify';

export const quizRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/submit', async (request, reply) => {
    return reply.code(501).send({ message: 'Quiz endpoints coming in Phase 5' });
  });
};
