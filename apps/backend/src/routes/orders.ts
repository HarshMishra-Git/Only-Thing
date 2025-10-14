import { FastifyPluginAsync } from 'fastify';

export const orderRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return reply.code(501).send({ message: 'Order endpoints coming in Phase 4' });
  });
};
