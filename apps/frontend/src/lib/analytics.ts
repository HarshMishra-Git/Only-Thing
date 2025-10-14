// Google Analytics 4 Integration

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

class Analytics {
  private initialized = false;

  /**
   * Initialize GA4
   */
  init(measurementId: string) {
    if (this.initialized || typeof window === 'undefined') return;

    // Add gtag script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false, // We'll handle page views manually
    });

    this.initialized = true;
  }

  /**
   * Track page view
   */
  pageView(path: string, title?: string) {
    if (!window.gtag) return;

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || path,
    });
  }

  /**
   * Track custom event
   */
  event(name: string, params?: Record<string, any>) {
    if (!window.gtag) return;

    window.gtag('event', name, params);
  }

  /**
   * Track product view
   */
  viewItem(product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    brand?: string;
  }) {
    this.event('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        item_brand: product.brand,
        quantity: 1,
      }],
    });
  }

  /**
   * Track add to cart
   */
  addToCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }) {
    this.event('add_to_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
        item_category: product.category,
      }],
    });
  }

  /**
   * Track remove from cart
   */
  removeFromCart(product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }) {
    this.event('remove_from_cart', {
      currency: 'USD',
      value: product.price * product.quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      }],
    });
  }

  /**
   * Track begin checkout
   */
  beginCheckout(items: any[], totalValue: number) {
    this.event('begin_checkout', {
      currency: 'USD',
      value: totalValue,
      items,
    });
  }

  /**
   * Track purchase
   */
  purchase(order: {
    id: string;
    total: number;
    tax: number;
    shipping: number;
    items: any[];
  }) {
    this.event('purchase', {
      transaction_id: order.id,
      value: order.total,
      tax: order.tax,
      shipping: order.shipping,
      currency: 'USD',
      items: order.items,
    });
  }

  /**
   * Track search
   */
  search(query: string) {
    this.event('search', {
      search_term: query,
    });
  }

  /**
   * Track signup
   */
  signUp(method: string = 'email') {
    this.event('sign_up', {
      method,
    });
  }

  /**
   * Track login
   */
  login(method: string = 'email') {
    this.event('login', {
      method,
    });
  }

  /**
   * Set user ID
   */
  setUserId(userId: string) {
    if (!window.gtag) return;

    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      user_id: userId,
    });
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>) {
    if (!window.gtag) return;

    window.gtag('set', 'user_properties', properties);
  }
}

export const analytics = new Analytics();

// Auto-initialize if measurement ID is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
  analytics.init(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
}

export default analytics;

