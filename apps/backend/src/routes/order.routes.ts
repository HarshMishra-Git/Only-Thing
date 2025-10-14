import { FastifyInstance } from 'fastify';
import { orderController } from '../controllers/order.controller';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

export async function orderRoutes(fastify: FastifyInstance) {
  // Payment routes
  fastify.post(
    '/payment/create-intent',
    { preHandler: [authenticate] },
    paymentController.createPaymentIntent.bind(paymentController)
  );

  fastify.post(
    '/payment/webhook',
    {
      config: {
        rawBody: true, // Important for Stripe webhook signature verification
      },
    },
    paymentController.handleWebhook.bind(paymentController)
  );

  fastify.get(
    '/payment/:paymentIntentId',
    { preHandler: [authenticate] },
    paymentController.getPaymentIntent.bind(paymentController)
  );

  // Order routes
  fastify.post(
    '/orders',
    { preHandler: [authenticate] },
    orderController.createOrder.bind(orderController)
  );

  fastify.get(
    '/orders',
    { preHandler: [authenticate] },
    orderController.getUserOrders.bind(orderController)
  );

  fastify.get(
    '/orders/stats',
    { preHandler: [authenticate] },
    orderController.getOrderStats.bind(orderController)
  );

  fastify.get(
    '/orders/:id',
    { preHandler: [authenticate] },
    orderController.getOrderById.bind(orderController)
  );

  fastify.get(
    '/orders/number/:orderNumber',
    { preHandler: [authenticate] },
    orderController.getOrderByNumber.bind(orderController)
  );

  fastify.patch(
    '/orders/:id/status',
    { preHandler: [authenticate] },
    orderController.updateOrderStatus.bind(orderController)
  );
}
