# Only Thing Health & Wellness — Technical Specification

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Vercel)                       │
│  Next.js 14 + TypeScript + Emotion + React                      │
│  - SSR/SSG for SEO                                               │
│  - ISR for product pages (revalidate: 300s)                     │
│  - Client-side state (cart, auth)                               │
│  - Event tracking (analytics.ts)                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ ↑  API Calls (REST)
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Railway/Render)                 │
│  Fastify + TypeScript                                            │
│  - JWT Auth                                                      │
│  - Rate limiting (100/15min)                                     │
│  - CORS, Helmet, Logging                                         │
│  - Business logic & validation                                   │
└─────────────────────────────────────────────────────────────────┘
         ↓ ↑                    ↓ ↑                    ↓ ↑
┌────────────────┐  ┌───────────────────┐  ┌──────────────────────┐
│  NEON POSTGRES │  │  STRIPE PAYMENTS  │  │  SANITY CMS          │
│  - Users       │  │  - Checkout       │  │  - Blog              │
│  - Products    │  │  - Webhooks       │  │  - FAQ               │
│  - Orders      │  │  - Invoices       │  │  - Marketing content │
│  - Events      │  │                   │  │                      │
└────────────────┘  └───────────────────┘  └──────────────────────┘
```

---

## API Endpoints (RESTful)

### Authentication
```typescript
POST   /api/auth/signup
       Body: { email, password, full_name }
       Response: { jwt, refresh_token, user }

POST   /api/auth/login
       Body: { email, password }
       Response: { jwt, refresh_token, user }

POST   /api/auth/refresh
       Body: { refresh_token }
       Response: { jwt }

POST   /api/auth/logout
       Body: { refresh_token }
       Response: { success: true }
```

### Products
```typescript
GET    /api/products
       Query: ?page=1&limit=20&category=skincare&search=vitamin
       Response: { data: Product[], total, page, total_pages }

GET    /api/products/:slug
       Response: Product

POST   /api/products  (Admin only)
       Body: ProductInput
       Response: Product

PATCH  /api/products/:id  (Admin only)
       Body: Partial<ProductInput>
       Response: Product

DELETE /api/products/:id  (Admin only)
       Response: { success: true }
```

### Cart
```typescript
POST   /api/cart
       Body: { anon_id?, user_id?, items: CartItem[] }
       Response: Cart

GET    /api/cart/:id
       Response: Cart

PATCH  /api/cart/:id
       Body: { items: CartItem[] }
       Response: Cart

DELETE /api/cart/:id
       Response: { success: true }
```

### Checkout & Orders
```typescript
POST   /api/checkout
       Body: { cart_id, shipping: ShippingInfo, payment_method }
       Response: { payment_intent_id, client_secret }

POST   /api/webhooks/stripe
       Body: Stripe webhook event
       Response: { received: true }

GET    /api/orders  (Authenticated)
       Response: Order[]

GET    /api/orders/:id  (Authenticated)
       Response: Order
```

### Quiz
```typescript
POST   /api/quiz/submit
       Body: { anon_id?, user_id?, responses: QuizResponse[] }
       Response: QuizResult {
         recommendations: ProductRecommendation[],
         explainability: string
       }

GET    /api/recommendations
       Query: ?user_id=uuid
       Response: Product[]
```

### Reviews
```typescript
POST   /api/products/:id/reviews  (Authenticated)
       Body: { rating: 1-5, text }
       Response: Review

GET    /api/products/:id/reviews
       Query: ?page=1&sort=helpful|recent
       Response: { data: Review[], total, avg_rating }
```

### Events (Analytics)
```typescript
POST   /api/events
       Body: AnalyticsEvent {
         anon_id?, user_id?, event_type,
         product_id?, value?, payload: {}
       }
       Response: { success: true }
```

---

## Database Models (Postgres/Neon)

### Key JSONB Fields

**products.images**
```json
[
  {
    "url": "https://cdn.example.com/product-1.jpg",
    "alt": "Product front view",
    "width": 1200,
    "height": 1200,
    "is_primary": true
  }
]
```

**products.ingredients**
```json
[
  {
    "name": "Vitamin C (L-Ascorbic Acid)",
    "concentration": "15%",
    "benefits": ["Brightening", "Antioxidant", "Collagen synthesis"]
  }
]
```

**products.clinical_evidence**
```json
[
  {
    "study_title": "Efficacy of Vitamin C in photoprotection",
    "summary": "Clinical study showed 23% reduction in hyperpigmentation over 12 weeks",
    "result": "Statistically significant (p<0.05)",
    "source_url": "https://pubmed.ncbi.nlm.nih.gov/..."
  }
]
```

**orders.shipping**
```json
{
  "full_name": "John Doe",
  "address_line1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "phone": "+1234567890"
}
```

**quiz_responses.result**
```json
{
  "recommendations": [
    {
      "product_id": "uuid",
      "score": 0.92,
      "reason": "High vitamin C recommended for hyperpigmentation (clinically supported)"
    }
  ],
  "explainability": "Based on your concerns about hyperpigmentation and normal skin type, we recommend..."
}
```

**events.payload**
```json
{
  "product_id": "uuid",
  "context": {
    "page": "/products/vitamin-c-serum",
    "referrer": "https://google.com/search?q=vitamin+c+serum",
    "campaign": "summer-sale"
  },
  "device": {
    "ua": "Mozilla/5.0...",
    "os": "Windows",
    "browser": "Chrome"
  }
}
```

---

## Authentication Flow

### Signup
1. Client submits email, password, name
2. Backend validates input, checks for existing email
3. Hash password with argon2 (cost factor: 10)
4. Insert user into database
5. Generate JWT (1h expiry) + refresh token (7d expiry)
6. Store refresh token hash in `refresh_tokens` table
7. Return JWT + refresh_token to client
8. Client stores JWT in memory, refresh_token in httpOnly cookie

### Login
1. Client submits email, password
2. Backend fetches user by email
3. Verify password with argon2.verify()
4. Update `last_login` timestamp
5. Generate JWT + refresh token
6. Return to client

### Refresh
1. Client sends refresh_token (from cookie or body)
2. Backend validates token hash exists in DB and not revoked
3. Check expiry
4. Generate new JWT (1h)
5. Return new JWT

### Logout
1. Client sends refresh_token
2. Backend marks token as revoked in DB
3. Return success

---

## Quiz Rules Engine (Example)

```typescript
// apps/backend/src/services/quizService.ts

interface QuizAnswers {
  skin_type: 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';
  primary_concern: 'hyperpigmentation' | 'acne' | 'aging' | 'dryness' | 'redness';
  age_range: '18-25' | '26-35' | '36-45' | '46+';
  allergies: string[];
  sensitivity: boolean;
  lifestyle: 'active' | 'moderate' | 'sedentary';
}

export function calculateRecommendations(
  answers: QuizAnswers,
  products: Product[]
): ProductRecommendation[] {
  const scored: Array<{ product: Product; score: number; reasons: string[] }> = [];

  for (const product of products) {
    let score = 0;
    const reasons: string[] = [];

    // Rule 1: Hyperpigmentation + not oily → Vitamin C
    if (
      answers.primary_concern === 'hyperpigmentation' &&
      answers.skin_type !== 'oily' &&
      product.metadata.category === 'brightening'
    ) {
      score += 0.4;
      reasons.push('Recommended for hyperpigmentation based on clinical evidence');
    }

    // Rule 2: Sensitive skin → No irritants
    if (answers.sensitivity) {
      const hasIrritants = product.ingredients?.some(ing =>
        ['fragrance', 'alcohol', 'parabens'].includes(ing.name.toLowerCase())
      );
      if (hasIrritants) {
        score -= 0.5; // Penalize
      } else {
        reasons.push('Gentle formula suitable for sensitive skin');
      }
    }

    // Rule 3: Age-appropriate products
    if (answers.age_range === '36-45' || answers.age_range === '46+') {
      if (product.metadata.tags?.includes('anti-aging')) {
        score += 0.3;
        reasons.push('Formulated for mature skin concerns');
      }
    }

    // Rule 4: Acne → Salicylic acid or niacinamide
    if (answers.primary_concern === 'acne') {
      const hasAcneIngredient = product.ingredients?.some(ing =>
        ['salicylic acid', 'niacinamide', 'benzoyl peroxide'].includes(
          ing.name.toLowerCase()
        )
      );
      if (hasAcneIngredient) {
        score += 0.4;
        reasons.push('Contains clinically-proven acne-fighting ingredients');
      }
    }

    // Normalize score
    score = Math.min(1.0, Math.max(0, score));

    if (score > 0.3) {
      scored.push({
        product,
        score,
        reasons,
      });
    }
  }

  // Sort by score descending, return top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => ({
      product_id: s.product.id,
      product: s.product,
      score: s.score,
      reason: s.reasons.join('. '),
    }));
}
```

---

## Event Tracking Implementation

### Frontend Hook (`apps/frontend/src/lib/useAnalytics.ts`)
```typescript
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAnonId(): string {
  if (typeof window === 'undefined') return '';
  let anonId = localStorage.getItem('anon_id');
  if (!anonId) {
    anonId = uuidv4();
    localStorage.setItem('anon_id', anonId);
  }
  return anonId;
}

export function useAnalytics() {
  const trackEvent = useCallback(async (
    event_type: string,
    payload: Record<string, any> = {}
  ) => {
    try {
      await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anon_id: getAnonId(),
          event_type,
          payload: {
            ...payload,
            context: {
              page: window.location.pathname,
              referrer: document.referrer,
            },
            device: {
              ua: navigator.userAgent,
            },
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Analytics error:', error);
      // Fail silently - don't break user experience
    }
  }, []);

  return { trackEvent };
}
```

### Usage in Components
```typescript
// Product detail page
import { useAnalytics } from '@/lib/useAnalytics';

export default function ProductPage({ product }: { product: Product }) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('product_view', {
      product_id: product.id,
      product_title: product.title,
      price_cents: product.price_cents,
    });
  }, [product.id]);

  const handleAddToCart = () => {
    // ... cart logic
    trackEvent('add_to_cart', {
      product_id: product.id,
      quantity: 1,
      value: product.price_cents / 100,
    });
  };

  // ...
}
```

---

## Payment Integration (Stripe)

### Checkout Flow
1. **Client**: User clicks "Checkout"
2. **Client → Backend**: POST /api/checkout with cart_id + shipping info
3. **Backend → Stripe**: Create PaymentIntent with amount
4. **Backend → Client**: Return client_secret
5. **Client → Stripe**: Use Stripe.js to complete payment
6. **Stripe → Backend**: Send webhook to /api/webhooks/stripe
7. **Backend**: Verify webhook signature, create order in DB
8. **Backend → Client**: Redirect to order confirmation

### Backend Webhook Handler (`apps/backend/src/routes/webhooks.ts`)
```typescript
import Stripe from 'stripe';
import { query } from '../utils/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function handleStripeWebhook(request, reply) {
  const sig = request.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    return reply.code(400).send({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Extract metadata (cart_id, user_id)
    const { cart_id, user_id } = paymentIntent.metadata;

    // Fetch cart
    const cartResult = await query('SELECT * FROM carts WHERE id = $1', [cart_id]);
    if (!cartResult.rows.length) {
      return reply.code(404).send({ error: 'Cart not found' });
    }

    const cart = cartResult.rows[0];

    // Create order
    await query(
      `INSERT INTO orders (user_id, items, total_cents, currency, status, payment_provider, payment_intent_id, shipping)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user_id,
        JSON.stringify(cart.items),
        cart.total_cents,
        'USD',
        'processing',
        'stripe',
        paymentIntent.id,
        JSON.stringify(paymentIntent.shipping),
      ]
    );

    // Clear cart
    await query('DELETE FROM carts WHERE id = $1', [cart_id]);

    // Track purchase event
    await query(
      `INSERT INTO events (user_id, event_type, value, payload)
       VALUES ($1, $2, $3, $4)`,
      [
        user_id,
        'purchase',
        cart.total_cents / 100,
        JSON.stringify({ payment_intent_id: paymentIntent.id }),
      ]
    );
  }

  return reply.send({ received: true });
}
```

---

## Deployment

### Frontend (Vercel)
```bash
cd apps/frontend
vercel --prod
```

**Environment Variables** (Vercel Dashboard):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

### Backend (Railway.app recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

**Environment Variables** (Railway Dashboard):
- `DATABASE_URL` (Neon connection string)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`

---

## Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| TTI (Time to Interactive) | < 3.5s | Lighthouse |
| API Response Time (p95) | < 300ms | Logs |
| Database Query Time (p95) | < 100ms | Logs |

**Optimization Strategies**:
- ISR for product pages (revalidate: 300s)
- CDN for static assets (Cloudflare)
- Image optimization (Next/Image with AVIF/WebP)
- Code splitting (Next.js automatic)
- Database indexing (already defined in schema)
- Connection pooling (pg Pool, max: 20)

---

## Security Measures

| Threat | Mitigation |
|--------|------------|
| SQL Injection | Parameterized queries |
| XSS | Input sanitization, CSP headers |
| CSRF | Token-based protection |
| Brute force | Rate limiting (100/15min) |
| Man-in-the-middle | HTTPS enforced |
| JWT theft | Short expiry (1h), httpOnly cookies for refresh tokens |
| Payment data leak | Never store card data, use Stripe Checkout |
| DDoS | Cloudflare + rate limiting |

---

## Monitoring & Logging

**Sentry** (Error tracking)
```typescript
// apps/frontend/src/lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

**Structured Logging** (Pino — already integrated)
```typescript
logger.info({ userId, productId }, 'User viewed product');
logger.error({ error, userId }, 'Checkout failed');
```

**Health Checks**
- `/health` endpoint (already implemented)
- Monitor with UptimeRobot or BetterUptime
- Alert on >1% error rate or >500ms p95 latency

---

## Testing

### Unit Tests (Jest)
```bash
# Backend
cd apps/backend
npm test

# Frontend
cd apps/frontend
npm test
```

### E2E Tests (Playwright)
```bash
cd apps/frontend
npx playwright test
```

### Sample E2E Test
```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('Complete checkout flow', async ({ page }) => {
  // Go to product page
  await page.goto('/products/vitamin-c-serum');
  
  // Add to cart
  await page.click('[data-testid="add-to-cart"]');
  
  // Go to cart
  await page.goto('/cart');
  
  // Proceed to checkout
  await page.click('[data-testid="checkout-button"]');
  
  // Fill shipping form
  await page.fill('[name="full_name"]', 'Test User');
  await page.fill('[name="email"]', 'test@example.com');
  // ... fill rest of form
  
  // Complete payment (Stripe test card)
  await page.fill('[name="cardNumber"]', '4242424242424242');
  await page.fill('[name="cardExpiry"]', '12/34');
  await page.fill('[name="cardCvc"]', '123');
  
  await page.click('[data-testid="pay-button"]');
  
  // Wait for confirmation
  await expect(page).toHaveURL(/\/orders\/[a-z0-9-]+/);
  await expect(page.locator('h1')).toContainText('Order Confirmed');
});
```

---

**Last Updated**: 2025-10-13  
**Maintained by**: [Your Team]
