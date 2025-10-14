import { FastifyPluginAsync } from 'fastify';

export const reviewRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:productId', async (request, reply) => {
    return reply.code(501).send({ message: 'Review endpoints coming in Phase 7' });
  });
};
