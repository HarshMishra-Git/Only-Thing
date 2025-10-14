import { FastifyRequest, FastifyReply } from 'fastify';
import { paymentService } from '../services/payment.service';

interface CreatePaymentIntentBody {
  amount: number;
  currency?: string;
  orderId?: string;
}

export class PaymentController {
  async createPaymentIntent(
    request: FastifyRequest<{ Body: CreatePaymentIntentBody }>,
    reply: FastifyReply
  ) {
    try {
      const { amount, currency, orderId } = request.body;

      if (!amount || amount <= 0) {
        return reply.status(400).send({
          success: false,
          error: 'Valid amount is required',
        });
      }

      const result = await paymentService.createPaymentIntent({
        amount,
        currency,
        orderId,
      });

      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to create payment intent',
      });
    }
  }

  async handleWebhook(request: FastifyRequest, reply: FastifyReply) {
    try {
      const signature = request.headers['stripe-signature'] as string;

      if (!signature) {
        return reply.status(400).send({
          success: false,
          error: 'Missing stripe-signature header',
        });
      }

      const payload = request.body as string | Buffer;
      await paymentService.handleWebhook(payload, signature);

      return reply.send({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      return reply.status(400).send({
        success: false,
        error: error.message,
      });
    }
  }

  async getPaymentIntent(
    request: FastifyRequest<{ Params: { paymentIntentId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { paymentIntentId } = request.params;

      const paymentIntent = await paymentService.getPaymentIntent(paymentIntentId);

      return reply.send({
        success: true,
        data: paymentIntent,
      });
    } catch (error: any) {
      console.error('Get payment intent error:', error);
      return reply.status(404).send({
        success: false,
        error: 'Payment intent not found',
      });
    }
  }
}

export const paymentController = new PaymentController();
