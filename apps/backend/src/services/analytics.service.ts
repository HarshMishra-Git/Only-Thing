import { logger } from '../utils/logger';

interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

interface EcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_brand?: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private readonly maxEvents = 1000;

  /**
   * Track a custom event
   */
  trackEvent(name: string, params?: Record<string, any>, userId?: string) {
    const event: AnalyticsEvent = {
      name,
      params,
      userId,
      timestamp: new Date(),
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    logger.info(`Analytics event: ${name}`, { params, userId });

    // In production, send to GA4 Measurement Protocol
    if (process.env.NODE_ENV === 'production' && process.env.GA_MEASUREMENT_ID) {
      this.sendToGA4(event).catch(error => {
        logger.error('Failed to send event to GA4:', error);
      });
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, userId?: string, params?: Record<string, any>) {
    this.trackEvent('page_view', {
      page_path: path,
      page_title: path,
      ...params,
    }, userId);
  }

  /**
   * Track product view
   */
  trackProductView(product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  }, userId?: string) {
    this.trackEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        quantity: 1,
      }],
    }, userId);
  }

  /**
   * Track add to cart
   */
  trackAddToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }, userId?: string) {
    this.trackEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
        item_category: product.category,
      }],
    }, userId);
  }

  /**
   * Track remove from cart
   */
  trackRemoveFromCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }, userId?: string) {
    this.trackEvent('remove_from_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }],
    }, userId);
  }

  /**
   * Track begin checkout
   */
  trackBeginCheckout(items: EcommerceItem[], totalValue: number, userId?: string) {
    this.trackEvent('begin_checkout', {
      currency: 'USD',
      value: totalValue,
      items,
    }, userId);
  }

  /**
   * Track checkout progress
   */
  trackCheckoutProgress(step: number, stepName: string, userId?: string) {
    this.trackEvent('checkout_progress', {
      checkout_step: step,
      checkout_step_name: stepName,
    }, userId);
  }

  /**
   * Track purchase
   */
  trackPurchase(order: {
    id: string;
    total: number;
    tax: number;
    shipping: number;
    items: EcommerceItem[];
  }, userId?: string) {
    this.trackEvent('purchase', {
      transaction_id: order.id,
      value: order.total,
      tax: order.tax,
      shipping: order.shipping,
      currency: 'USD',
      items: order.items,
    }, userId);
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultsCount: number, userId?: string) {
    this.trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
    }, userId);
  }

  /**
   * Track user signup
   */
  trackSignup(method: string, userId: string) {
    this.trackEvent('sign_up', {
      method,
    }, userId);
  }

  /**
   * Track user login
   */
  trackLogin(method: string, userId: string) {
    this.trackEvent('login', {
      method,
    }, userId);
  }

  /**
   * Get funnel conversion rates
   */
  getFunnelStats(timeframe: 'day' | 'week' | 'month' = 'day') {
    const cutoff = new Date();
    switch (timeframe) {
      case 'day':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(cutoff.getMonth() - 1);
        break;
    }

    const recentEvents = this.events.filter(e => 
      e.timestamp && e.timestamp >= cutoff
    );

    const viewItem = recentEvents.filter(e => e.name === 'view_item').length;
    const addToCart = recentEvents.filter(e => e.name === 'add_to_cart').length;
    const beginCheckout = recentEvents.filter(e => e.name === 'begin_checkout').length;
    const purchase = recentEvents.filter(e => e.name === 'purchase').length;

    return {
      timeframe,
      funnel: {
        view_item: viewItem,
        add_to_cart: addToCart,
        begin_checkout: beginCheckout,
        purchase: purchase,
      },
      conversion_rates: {
        view_to_cart: viewItem > 0 ? ((addToCart / viewItem) * 100).toFixed(2) + '%' : '0%',
        cart_to_checkout: addToCart > 0 ? ((beginCheckout / addToCart) * 100).toFixed(2) + '%' : '0%',
        checkout_to_purchase: beginCheckout > 0 ? ((purchase / beginCheckout) * 100).toFixed(2) + '%' : '0%',
        overall: viewItem > 0 ? ((purchase / viewItem) * 100).toFixed(2) + '%' : '0%',
      },
    };
  }

  /**
   * Get event summary
   */
  getEventSummary(timeframe: 'hour' | 'day' | 'week' = 'day') {
    const cutoff = new Date();
    switch (timeframe) {
      case 'hour':
        cutoff.setHours(cutoff.getHours() - 1);
        break;
      case 'day':
        cutoff.setDate(cutoff.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(cutoff.getDate() - 7);
        break;
    }

    const recentEvents = this.events.filter(e => 
      e.timestamp && e.timestamp >= cutoff
    );

    const summary: Record<string, number> = {};
    recentEvents.forEach(event => {
      summary[event.name] = (summary[event.name] || 0) + 1;
    });

    return {
      timeframe,
      total_events: recentEvents.length,
      unique_users: new Set(recentEvents.map(e => e.userId).filter(Boolean)).size,
      events: summary,
    };
  }

  /**
   * Send event to GA4 Measurement Protocol
   */
  private async sendToGA4(event: AnalyticsEvent) {
    const measurementId = process.env.GA_MEASUREMENT_ID;
    const apiSecret = process.env.GA_API_SECRET;

    if (!measurementId || !apiSecret) {
      return;
    }

    const payload = {
      client_id: event.userId || 'anonymous',
      events: [{
        name: event.name,
        params: event.params || {},
      }],
    };

    try {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`GA4 API returned ${response.status}`);
      }
    } catch (error) {
      logger.error('Error sending to GA4:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
