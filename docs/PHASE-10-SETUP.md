# Phase 10: Analytics & Monitoring - Quick Setup Guide

## ✅ Completed Components

### Backend
- ✅ Monitoring Service with metrics collection
- ✅ Analytics Service for GA4 integration  
- ✅ Monitoring Middleware for request tracking
- ✅ Health check endpoints
- ✅ Sentry error tracking setup
- ✅ Enhanced Pino logger

### Frontend
- ✅ GA4 Analytics utility
- ✅ React hooks for analytics tracking
- ✅ Sentry error tracking setup
- ✅ ErrorBoundary component
- ✅ Auto page view tracking

### Documentation
- ✅ Comprehensive analytics & monitoring guide
- ✅ Event tracking best practices
- ✅ Troubleshooting guide

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd D:\DESKTOP-L\OT\apps\backend
npm install @sentry/node @sentry/profiling-node
```

**Frontend:**
```bash
cd D:\DESKTOP-L\OT\apps\frontend
npm install @sentry/nextjs
```

### Step 2: Configure Environment Variables

**Backend (.env):**
```env
# Optional but recommended
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

**Frontend (.env.local):**
```env
# Required for GA4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional but recommended  
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### Step 3: Initialize Sentry in Backend

Edit `apps/backend/src/server.ts`:

```typescript
import { initSentry } from './lib/sentry';

// Add at the top of the file, before creating the server
initSentry();

// Rest of your server code...
```

### Step 4: Initialize Sentry in Frontend

Create `apps/frontend/src/app/layout.tsx` (if not exists) or edit existing:

```tsx
import { initSentry } from '@/lib/sentry';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { usePageTracking } from '@/hooks/useAnalytics';

// Initialize on app load
if (typeof window !== 'undefined') {
  initSentry();
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <AppWithTracking>{children}</AppWithTracking>
        </ErrorBoundary>
      </body>
    </html>
  );
}

function AppWithTracking({ children }) {
  usePageTracking(); // Auto-track page views
  return <>{children}</>;
}
```

### Step 5: Apply Monitoring Middleware

Edit `apps/backend/src/server.ts`:

```typescript
import { monitoringMiddleware, errorHandler } from './middleware/monitoring.middleware';

// After creating the server instance
server.addHook('onRequest', monitoringMiddleware);
server.setErrorHandler(errorHandler);
```

### Step 6: Verify Setup

**Test Health Check:**
```bash
curl http://localhost:3000/api/monitoring/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123,
  "database": "connected"
}
```

**Test Metrics:**
```bash
curl http://localhost:3000/api/monitoring/metrics
```

**Test Frontend Tracking:**
1. Open browser DevTools → Network tab
2. Filter by "gtag" or "collect"
3. Navigate pages and verify GA4 requests

---

## 📊 Available Monitoring Endpoints

All monitoring endpoints require Manager+ role except `/health`:

```bash
# Public health check
GET /api/monitoring/health

# System metrics (requires auth)
GET /api/monitoring/metrics

# Database stats (requires auth)  
GET /api/monitoring/database

# Analytics summary (requires auth)
GET /api/monitoring/analytics?startDate=2024-01-01&endDate=2024-01-31

# Funnel statistics (requires auth)
GET /api/monitoring/funnel?startDate=2024-01-01&endDate=2024-01-31

# System information (requires auth)
GET /api/monitoring/system
```

---

## 🎯 Common Use Cases

### Track Product View
```tsx
import useAnalytics from '@/hooks/useAnalytics';

function ProductPage({ product }) {
  const { trackProductView } = useAnalytics();
  
  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  }, [product]);
  
  return <div>...</div>;
}
```

### Track Add to Cart
```tsx
const { trackAddToCart } = useAnalytics();

const handleAddToCart = () => {
  trackAddToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
  });
  // ... add to cart logic
};
```

### Track Purchase (Backend)
```typescript
import { analyticsService } from '@/services/analytics.service';

// In your order creation endpoint
const order = await createOrder(data);

await analyticsService.trackEvent('purchase', {
  transaction_id: order.id,
  value: order.total,
  currency: 'USD',
  items: order.items.map(item => ({
    item_id: item.productId,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
}, { userId: user.id });
```

### Capture Errors
```typescript
import { captureException } from '@/lib/sentry';

try {
  await riskyOperation();
} catch (error) {
  captureException(error, {
    userId: user.id,
    operation: 'checkout',
    context: { orderId: order.id },
  });
  throw error;
}
```

### Log Events
```typescript
import { logger } from '@/lib/logger';

logger.info({
  event: 'order_created',
  orderId: order.id,
  userId: user.id,
  total: order.total,
}, 'New order created successfully');
```

---

## 🔧 Optional: Advanced Configuration

### Custom GA4 Events

Create custom event tracking:
```typescript
import { analytics } from '@/lib/analytics';

// Track newsletter signup
analytics.event('newsletter_signup', {
  location: 'footer',
  email_provided: true,
});

// Track filter usage
analytics.event('filter_applied', {
  filter_type: 'price',
  min_price: 0,
  max_price: 100,
});
```

### Custom Monitoring Metrics

Add custom metrics in your services:
```typescript
import { monitoringService } from '@/services/monitoring.service';

// Track custom counter
monitoringService.recordCounter('custom_operation');

// Track operation timing
const startTime = Date.now();
await performOperation();
monitoringService.recordTiming('operation_duration', Date.now() - startTime);

// Track errors
monitoringService.recordError('operation_failed', error, {
  context: 'additional_info',
});
```

### Configure Sentry Alerts

1. Go to https://sentry.io
2. Navigate to your project → Alerts
3. Create alert rules:
   - **Error Spike**: Alert when error count > 10 in 5 minutes
   - **Performance**: Alert when p95 response time > 2s
   - **New Issues**: Alert on first occurrence of new error

---

## 📈 Next Steps

1. **Set up GA4 property** at https://analytics.google.com
2. **Create Sentry projects** at https://sentry.io
3. **Configure custom dashboards** in GA4 and Sentry
4. **Set up alerts** for critical metrics
5. **Review logs regularly** to identify patterns
6. **Optimize based on metrics** collected

---

## 📚 Documentation

Full documentation available at:
- `docs/analytics-monitoring.md` - Complete guide
- GA4 docs: https://developers.google.com/analytics/devguides/collection/ga4
- Sentry docs: https://docs.sentry.io

---

## ✨ Phase 10 Complete!

You now have:
- ✅ Full-stack error tracking with Sentry
- ✅ User behavior analytics with GA4
- ✅ Performance monitoring and metrics
- ✅ Health checks and system monitoring
- ✅ Structured logging with Pino
- ✅ Comprehensive documentation

**Total Setup Time:** ~5-10 minutes
**Maintenance:** Minimal - automatic tracking

---

## 🐛 Troubleshooting

### Analytics not working?
1. Check measurement ID in environment variables
2. Verify script loads in browser Network tab
3. Use GA4 DebugView to see events in real-time

### Sentry not receiving errors?
1. Verify DSN configuration
2. Check network requests in DevTools
3. Throw a test error to verify: `throw new Error('Test')`

### Monitoring endpoints returning 401?
1. Ensure you're authenticated
2. Check user has Manager+ role
3. Verify JWT token is valid

### Health check failing?
1. Check database connection
2. Verify server is running
3. Check logs for errors

For more help, see `docs/analytics-monitoring.md`
