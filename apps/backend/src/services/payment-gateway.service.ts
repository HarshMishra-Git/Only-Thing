/**
 * Payment Gateway Abstraction Layer
 * Supports both Stripe (global) and Razorpay (India)
 * Only Thing Health & Wellness LLP
 */

import Stripe from 'stripe';
import Razorpay from 'razorpay';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
  provider: 'stripe' | 'razorpay';
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  customer?: string;
  description?: string;
}

export interface RefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

/**
 * Payment Gateway Service
 * Abstraction layer for multiple payment providers
 */
export class PaymentGatewayService {
  private stripe: Stripe;
  private razorpay: any;
  private defaultProvider: 'stripe' | 'razorpay';

  constructor() {
    // Initialize Stripe
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });

    // Initialize Razorpay
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }

    // Default provider based on configuration
    this.defaultProvider = process.env.DEFAULT_PAYMENT_PROVIDER as any || 'stripe';
  }

  /**
   * Determine payment provider based on currency and country
   */
  private selectProvider(currency: string, country?: string): 'stripe' | 'razorpay' {
    // Use Razorpay for INR and India
    if (currency === 'INR' || country === 'IN') {
      return this.razorpay ? 'razorpay' : 'stripe';
    }
    
    // Use Stripe for all other currencies
    return 'stripe';
  }

  /**
   * Create payment intent with automatic provider selection
   */
  async createPaymentIntent(
    params: CreatePaymentIntentParams,
    country?: string
  ): Promise<PaymentIntent> {
    const provider = this.selectProvider(params.currency, country);

    if (provider === 'razorpay') {
      return this.createRazorpayOrder(params);
    } else {
      return this.createStripePaymentIntent(params);
    }
  }

  /**
   * Create Stripe Payment Intent
   */
  private async createStripePaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency.toLowerCase(),
      metadata: params.metadata || {},
      description: params.description,
      customer: params.customer,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret || undefined,
      provider: 'stripe',
      metadata: paymentIntent.metadata,
    };
  }

  /**
   * Create Razorpay Order
   */
  private async createRazorpayOrder(
    params: CreatePaymentIntentParams
  ): Promise<PaymentIntent> {
    if (!this.razorpay) {
      throw new Error('Razorpay is not configured');
    }

    const order = await this.razorpay.orders.create({
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: params.currency.toUpperCase(),
      notes: params.metadata || {},
      receipt: `receipt_${Date.now()}`,
    });

    return {
      id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      status: order.status === 'created' ? 'requires_payment_method' : order.status,
      provider: 'razorpay',
      metadata: order.notes,
    };
  }

  /**
   * Retrieve payment intent/order
   */
  async retrievePaymentIntent(id: string, provider: 'stripe' | 'razorpay'): Promise<PaymentIntent> {
    if (provider === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: paymentIntent.status,
        provider: 'stripe',
        metadata: paymentIntent.metadata,
      };
    } else {
      const order = await this.razorpay.orders.fetch(id);
      return {
        id: order.id,
        amount: order.amount / 100,
        currency: order.currency,
        status: order.status,
        provider: 'razorpay',
        metadata: order.notes,
      };
    }
  }

  /**
   * Confirm payment (for manual confirmation)
   */
  async confirmPayment(id: string, provider: 'stripe' | 'razorpay'): Promise<PaymentIntent> {
    if (provider === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.confirm(id);
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: paymentIntent.status,
        provider: 'stripe',
      };
    } else {
      // Razorpay doesn't need manual confirmation
      return this.retrievePaymentIntent(id, 'razorpay');
    }
  }

  /**
   * Capture payment (for two-step payments)
   */
  async capturePayment(id: string, provider: 'stripe' | 'razorpay', amount?: number): Promise<PaymentIntent> {
    if (provider === 'stripe') {
      const paymentIntent = await this.stripe.paymentIntents.capture(id, {
        amount_to_capture: amount ? Math.round(amount * 100) : undefined,
      });
      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: paymentIntent.status,
        provider: 'stripe',
      };
    } else {
      const payment = await this.razorpay.payments.capture(id, Math.round((amount || 0) * 100), 'INR');
      return {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        provider: 'razorpay',
      };
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(params: RefundParams): Promise<any> {
    // Determine provider from payment intent ID format
    const provider = params.paymentIntentId.startsWith('pi_') ? 'stripe' : 'razorpay';

    if (provider === 'stripe') {
      const refund = await this.stripe.refunds.create({
        payment_intent: params.paymentIntentId,
        amount: params.amount ? Math.round(params.amount * 100) : undefined,
        reason: params.reason as any,
      });
      return {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        provider: 'stripe',
      };
    } else {
      const refund = await this.razorpay.payments.refund(params.paymentIntentId, {
        amount: params.amount ? Math.round(params.amount * 100) : undefined,
        notes: { reason: params.reason || '' },
      });
      return {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        provider: 'razorpay',
      };
    }
  }

  /**
   * Verify Stripe webhook signature
   */
  verifyStripeWebhook(payload: Buffer, signature: string): any {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  /**
   * Verify Razorpay webhook signature
   */
  verifyRazorpayWebhook(payload: any, signature: string): boolean {
    if (!this.razorpay) return false;
    
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return expectedSignature === signature;
  }

  /**
   * Get supported payment methods for a country
   */
  getSupportedPaymentMethods(country: string): string[] {
    if (country === 'IN') {
      return ['card', 'upi', 'netbanking', 'wallet'];
    }
    return ['card', 'bank_transfer'];
  }

  /**
   * Get payment provider for a currency
   */
  getProviderForCurrency(currency: string): 'stripe' | 'razorpay' {
    return this.selectProvider(currency);
  }
}

// Export singleton instance
export const paymentGateway = new PaymentGatewayService();
