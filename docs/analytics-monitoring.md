# Analytics & Monitoring Documentation

## Overview

The application includes comprehensive analytics and monitoring capabilities to track user behavior, application performance, errors, and business metrics.

## Components

### 1. Google Analytics 4 (GA4)
Track user interactions, page views, and e-commerce events.

### 2. Sentry
Error tracking and performance monitoring for both frontend and backend.

### 3. Custom Monitoring Service
Internal metrics collection, health checks, and performance tracking.

### 4. Pino Logger
Structured logging with multiple transports and log levels.

---

## Google Analytics 4 (GA4)

### Setup

1. **Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

2. **Auto-initialization**
GA4 is automatically initialized when the app loads if the measurement ID is configured.

### Frontend Usage

#### Basic Events
```typescript
import { analytics } from '@/lib/analytics';

// Track custom event
analytics.event('button_click', { button_name: 'signup' });

// Track page view
analytics.pageView('/products', 'Products Page');

// Track search
analytics.search('laptop computers');
```

#### E-commerce Events
```typescript
// Product view
analytics.viewItem({
  id: 'product-123',
  name: 'Laptop',
  price: 999.99,
  category: 'Electronics',
  brand: 'TechBrand',
});

// Add to cart
analytics.addToCart({
  id: 'product-123',
  name: 'Laptop',
  price: 999.99,
  quantity: 1,
  category: 'Electronics',
});

// Begin checkout
analytics.beginCheckout(cartItems, totalValue);

// Purchase
analytics.purchase({
  id: 'order-456',
  total: 1099.99,
  tax: 100,
  shipping: 10,
  items: orderItems,
});
```

#### User Tracking
```typescript
// Set user ID (on login)
analytics.setUserId('user-123');

// Set user properties
analytics.setUserProperties({
  plan: 'premium',
  signup_date: '2024-01-01',
});

// Track authentication
analytics.signUp('email');
analytics.login('google');
```

#### Automatic Page Tracking
```tsx
// In your root layout or pages
import { usePageTracking } from '@/hooks/useAnalytics';

function MyApp() {
  usePageTracking(); // Automatically tracks page views
  return <YourApp />;
}
```

#### Hook Usage
```tsx
import useAnalytics from '@/hooks/useAnalytics';

function ProductCard({ product }) {
  const { trackProductView, trackAddToCart } = useAnalytics();

  const handleView = () => {
    trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  const handleAddToCart = () => {
    trackAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div onMouseEnter={handleView}>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### Backend Usage

```typescript
import { analyticsService } from '@/services/analytics.service';

// Track e-commerce event
await analyticsService.trackEvent('purchase', {
  transaction_id: order.id,
  value: order.total,
  currency: 'USD',
  items: orderItems,
}, { userId: user.id });

// Track custom event
await analyticsService.trackEvent('subscription_created', {
  plan: 'premium',
  value: 99.99,
}, { userId: user.id });

// Get funnel analytics
const funnelStats = await analyticsService.getFunnelStats(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

---

## Sentry Error Tracking

### Setup

1. **Environment Variables**
```bash
# Backend (.env)
SENTRY_DSN=https://xxx@sentry.io/xxx

# Frontend (.env.local)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

2. **Initialize in Application**

**Backend:**
```typescript
// In server.ts or app entry
import { initSentry } from './lib/sentry';

initSentry();
```

**Frontend:**
```typescript
// In app layout or _app.tsx
import { initSentry } from '@/lib/sentry';

initSentry();
```

### Usage

#### Capture Exceptions
```typescript
import { captureException } from '@/lib/sentry';

try {
  // Your code
} catch (error) {
  captureException(error, {
    userId: user.id,
    action: 'checkout',
    orderId: order.id,
  });
}
```

#### Capture Messages
```typescript
import { captureMessage } from '@/lib/sentry';

captureMessage('Payment processing delayed', 'warning');
```

#### Set User Context
```typescript
import { setUser, clearUser } from '@/lib/sentry';

// On login
setUser({
  id: user.id,
  email: user.email,
  role: user.role,
});

// On logout
clearUser();
```

#### Add Breadcrumbs
```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb({
  category: 'auth',
  message: 'User login attempt',
  level: 'info',
  data: { method: 'email' },
});
```

### Frontend Error Boundary

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}

// Custom fallback
<ErrorBoundary fallback={<CustomErrorPage />}>
  <YourApp />
</ErrorBoundary>
```

---

## Custom Monitoring Service

### Backend Monitoring

#### Health Checks
```bash
GET /api/monitoring/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400,
  "database": "connected",
  "memory": {
    "used": 150,
    "total": 512
  }
}
```

#### System Metrics
```bash
GET /api/monitoring/metrics
```

Response:
```json
{
  "counters": {
    "api_requests_total": 1000,
    "api_errors_total": 10
  },
  "timings": {
    "api_response_time": {
      "count": 1000,
      "mean": 150,
      "min": 10,
      "max": 2000
    }
  }
}
```

#### Database Stats
```bash
GET /api/monitoring/database
```

#### Analytics Summary
```bash
GET /api/monitoring/analytics?startDate=2024-01-01&endDate=2024-01-31
```

#### Funnel Stats
```bash
GET /api/monitoring/funnel?startDate=2024-01-01&endDate=2024-01-31
```

### Recording Metrics

```typescript
import { monitoringService } from '@/services/monitoring.service';

// Increment counter
monitoringService.recordCounter('orders_created');

// Record timing
monitoringService.recordTiming('database_query', 150);

// Record error
monitoringService.recordError(
  'payment_failed',
  error,
  { userId: user.id, amount: 99.99 }
);

// Check system health
const health = await monitoringService.checkHealth();
```

### Monitoring Middleware

Automatically applied to all routes to track:
- Request counts
- Response times
- Error rates
- Status codes

Access via:
```typescript
// In routes/server.ts
import { monitoringMiddleware, errorHandler } from '@/middleware/monitoring.middleware';

server.addHook('onRequest', monitoringMiddleware);
server.setErrorHandler(errorHandler);
```

---

## Logging with Pino

### Log Levels
- **fatal**: Application crash
- **error**: Error requiring attention
- **warn**: Warning, non-critical issue
- **info**: General information
- **debug**: Debug information
- **trace**: Very detailed debug info

### Usage

```typescript
import { logger } from '@/lib/logger';

// Info
logger.info('User logged in', { userId: user.id });

// Error
logger.error({ err: error }, 'Payment processing failed');

// Warning
logger.warn('API rate limit approaching', { remaining: 10 });

// Debug
logger.debug({ query: sql }, 'Database query executed');

// Child logger (with context)
const reqLogger = logger.child({ requestId: req.id });
reqLogger.info('Processing request');
```

### Structured Logging

```typescript
logger.info({
  event: 'order_created',
  orderId: order.id,
  userId: user.id,
  total: order.total,
  items: order.items.length,
}, 'New order created');
```

---

## Key Metrics to Monitor

### Business Metrics
- Total revenue
- Order count
- Conversion rate
- Average order value
- Customer lifetime value
- Cart abandonment rate

### Application Performance
- API response time
- Database query time
- Error rate
- Success rate
- Request throughput

### System Health
- CPU usage
- Memory usage
- Database connections
- Uptime
- Response codes (2xx, 4xx, 5xx)

### User Behavior
- Page views
- Session duration
- Bounce rate
- Top pages
- Search queries
- Product views
- Add to cart rate
- Checkout completion rate

---

## Event Tracking Best Practices

### 1. Consistent Naming
Use snake_case for event names:
```typescript
✅ analytics.event('add_to_cart')
❌ analytics.event('Add To Cart')
```

### 2. Include Context
Always provide relevant context:
```typescript
analytics.event('product_viewed', {
  product_id: product.id,
  product_name: product.name,
  category: product.category,
  price: product.price,
  source: 'search_results',
});
```

### 3. Track User Journey
```typescript
// Landing
analytics.event('page_view', { page: 'home' });

// Product browsing
analytics.event('category_viewed', { category: 'laptops' });
analytics.viewItem(product);

// Cart
analytics.addToCart(product);

// Checkout
analytics.beginCheckout(items, total);

// Purchase
analytics.purchase(order);
```

### 4. Track Failures Too
```typescript
try {
  await checkout();
  analytics.event('checkout_success');
} catch (error) {
  analytics.event('checkout_failed', {
    error: error.message,
    step: 'payment',
  });
}
```

---

## Alerting and Notifications

### Critical Alerts
Set up alerts for:
- Error rate > 1%
- Response time > 2s (p95)
- Database connection failures
- Payment processing failures
- API downtime

### Configure in Sentry
1. Go to Sentry project settings
2. Navigate to Alerts
3. Create alert rules:
   - Error threshold alerts
   - Performance degradation alerts
   - Issue assignment rules

---

## Dashboard Setup

### GA4 Dashboard
Recommended reports:
1. **Overview**: Key metrics, real-time users
2. **E-commerce**: Revenue, transactions, products
3. **Behavior**: Page views, events, conversions
4. **User Journey**: Funnel analysis, path exploration

### Sentry Dashboard
Recommended views:
1. **Errors**: Error count, frequency, affected users
2. **Performance**: Transaction throughput, slow queries
3. **Releases**: Deploy tracking, issue regression
4. **User Feedback**: User-reported issues

### Custom Monitoring Dashboard
Access via Admin Panel or build custom views:
- `/api/monitoring/health`: System health
- `/api/monitoring/metrics`: Performance metrics
- `/api/monitoring/analytics`: Business analytics

---

## Troubleshooting

### GA4 Not Tracking

1. Check measurement ID is set:
```bash
echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
```

2. Verify script loads in browser DevTools:
```
Network tab → Filter: gtag
```

3. Check GA4 DebugView in GA console

### Sentry Not Receiving Errors

1. Verify DSN configuration
2. Check network requests in DevTools
3. Test with:
```typescript
throw new Error('Test error');
```

### Monitoring API Not Responding

1. Check route registration in `server.ts`
2. Verify middleware is applied
3. Check authentication (requires Manager+ role)

---

## Privacy and Compliance

### Data Anonymization
- User emails are excluded from production error reports
- IP addresses are anonymized in GA4
- Sensitive data is filtered before sending to Sentry

### GDPR Compliance
- Allow users to opt-out of analytics
- Implement cookie consent
- Provide data export/deletion capabilities

### Example Cookie Consent
```tsx
import { analytics } from '@/lib/analytics';

function CookieConsent() {
  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'true');
    analytics.init(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!);
  };

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'false');
  };

  return (
    <div className="cookie-banner">
      <p>We use cookies for analytics</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
    </div>
  );
}
```

---

## Next Steps

1. **Install Dependencies**:
```bash
cd apps/backend
npm install @sentry/node @sentry/profiling-node

cd ../frontend
npm install @sentry/nextjs
```

2. **Configure Environment Variables**:
   - Add GA4 measurement ID
   - Add Sentry DSN (backend and frontend)

3. **Initialize Services**:
   - Add Sentry initialization to backend entry point
   - Add Sentry initialization to frontend app
   - Wrap frontend app with ErrorBoundary

4. **Set Up Alerts**:
   - Configure Sentry alert rules
   - Set up GA4 custom alerts
   - Create monitoring thresholds

5. **Create Dashboards**:
   - Set up GA4 custom reports
   - Create Sentry dashboards
   - Build admin monitoring views

---

## Support

For issues or questions:
- Backend monitoring: Check logs with `logger.error()`
- Frontend issues: Check browser console and Sentry
- Analytics: Verify in GA4 DebugView
- Performance: Use `/api/monitoring/metrics` endpoint
