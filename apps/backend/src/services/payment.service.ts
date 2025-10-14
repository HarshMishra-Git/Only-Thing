import Stripe from 'stripe';
import { orderService } from './order.service';
import { PaymentStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export interface CreatePaymentIntentInput {
  amount: number;
  currency?: string;
  orderId?: string;
  metadata?: Record<string, string>;
}

export class PaymentService {
  async createPaymentIntent(input: CreatePaymentIntentInput) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(input.amount * 100), // Convert to cents
        currency: input.currency || 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: input.orderId || '',
          ...input.metadata,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      console.error('Stripe payment intent creation error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error: any) {
      console.error('Stripe payment confirmation error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  async handleWebhook(payload: string | Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      try {
        await orderService.updatePaymentStatus(
          orderId,
          PaymentStatus.PAID,
          paymentIntent.id
        );
        console.log(`Payment succeeded for order ${orderId}`);
      } catch (error) {
        console.error(`Failed to update order ${orderId} payment status:`, error);
      }
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      try {
        await orderService.updatePaymentStatus(orderId, PaymentStatus.FAILED);
        console.log(`Payment failed for order ${orderId}`);
      } catch (error) {
        console.error(`Failed to update order ${orderId} payment status:`, error);
      }
    }
  }

  private async handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      try {
        await orderService.updatePaymentStatus(orderId, PaymentStatus.REFUNDED);
        console.log(`Payment canceled for order ${orderId}`);
      } catch (error) {
        console.error(`Failed to update order ${orderId} payment status:`, error);
      }
    }
  }

  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error: any) {
      console.error('Stripe refund error:', error);
      throw new Error('Failed to create refund');
    }
  }

  async getPaymentIntent(paymentIntentId: string) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      console.error('Failed to retrieve payment intent:', error);
      throw new Error('Failed to retrieve payment intent');
    }
  }
}

export const paymentService = new PaymentService();
