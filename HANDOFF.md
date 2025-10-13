# Only Thing Health & Wellness — Phase 1 Handoff Documentation

## 🎯 Project Summary

**Goal**: Build and launch Phase 1 of a world-class, premium, monochrome e-commerce site for Only Thing Health & Wellness LLP.

**Status**: Foundation complete — ready for team implementation

**Key Deliverables**:
- ✅ Project structure (monorepo with Next.js + Fastify)
- ✅ Design system with monochrome tokens (#000000, #FFFFFF, #9A9A9A, #F5F5F5, #BFA66A)
- ✅ Frontend skeleton with hero video component
- ✅ Backend API with Fastify + Neon Postgres
- ✅ Complete database schema (users, products, orders, reviews, quiz_responses, events)
- 🔲 Remaining: Auth, product catalog, quiz, payments, CMS, admin panel

---

## 📁 Project Structure

```
only-thing-wellness/
├── apps/
│   ├── frontend/          ← Next.js 14 + TypeScript + Emotion
│   │   ├── src/
│   │   │   ├── app/               # App router (page.tsx, layout.tsx)
│   │   │   ├── components/
│   │   │   │   ├── hero/          # Hero video component ✅
│   │   │   │   ├── common/        # Shared UI components
│   │   │   │   ├── products/      # Product catalog components
│   │   │   │   └── quiz/          # Quiz wizard components
│   │   │   ├── lib/               # API client, utilities
│   │   │   ├── styles/            # Theme provider, global styles ✅
│   │   │   └── types/             # TypeScript interfaces ✅
│   │   ├── public/
│   │   │   ├── videos/            # Hero video files (place here)
│   │   │   └── images/            # Product images, posters
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── next.config.js
│   │   └── .env.example
│   │
│   ├── backend/           ← Fastify + Postgres
│   │   ├── src/
│   │   │   ├── routes/            # API endpoints (to implement)
│   │   │   ├── services/          # Business logic
│   │   │   ├── models/            # Database models
│   │   │   ├── middleware/        # Auth, rate-limit, etc.
│   │   │   ├── utils/             # Database, logger ✅
│   │   │   └── index.ts           # Main server ✅
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql  ✅
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── sanity/            ← Sanity CMS Studio (to setup)
│
├── packages/
│   ├── design-tokens/     ← Design system tokens ✅
│   │   └── src/index.ts
│   └── shared/            ← Shared types & utilities
│
├── docs/
│   ├── api/               # API documentation (OpenAPI spec)
│   └── deployment/        # Deployment guides
│
├── scripts/               # Build & deploy scripts
├── package.json           ← Root workspace config ✅
├── .gitignore             ✅
└── README.md              ✅
```

---

## 🚀 Quick Start for Development Team

### 1. Install Dependencies

```bash
# Clone the repo and navigate to project
cd only-thing-wellness

# Install all workspace dependencies
npm install
```

### 2. Set Up Environment Variables

#### Frontend (`apps/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

#### Backend (`apps/backend/.env`)
```env
DATABASE_URL=postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters-long
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Neon Database

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run migrations:

```bash
# Navigate to backend
cd apps/backend

# Run initial schema migration
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### 4. Start Development Servers

```bash
# From project root
npm run dev

# This starts both:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
```

---

## 🎨 Design System (For Designers)

### Brand Tokens Implemented

**Color Palette (Strict Monochrome)**
- Primary Black: `#000000`
- White: `#FFFFFF`
- Neutral Gray: `#9A9A9A`
- Light Background: `#F5F5F5`
- Gold Accent: `#BFA66A` (use sparingly for micro-feedback only)

**Typography**
- Display Font: Arial Black / Heavy geometric (H1/H2)
- Body Font: System sans-serif (-apple-system, Segoe UI, Roboto)
- Sizes: 12px base scale with modular sizing

**Spacing Scale (12px base)**
- 1 = 12px, 2 = 24px, 3 = 36px, 4 = 48px, 5 = 60px, 6 = 72px, 8 = 96px

**Micro-interactions**
- Hover scale: 1.02
- Press scale: 0.98
- Subtle shadows on interaction

### Assets to Deliver

#### Required Hero Video
- **Duration**: 8–12 seconds (looped)
- **Color**: Strict monochrome (black/white/gray)
- **Formats**:
  - `hero-loop.mp4` (H.264, 1080p, <4MB)
  - `hero-loop.webm` (WebM format)
  - `hero-poster.jpg` (high-res poster frame for fallback)
- **Content**:
  - 0-2s: Lab glass drop (slow motion)
  - 2-4s: Macro skin close-up
  - 4-7s: Data lines/biological intelligence motion graphics
  - 7-9s: Product bottle beauty shot
  - 9-10s: Fade to logo
- **Text**: Must NOT be baked into video (HTML overlay handles text)
- **Deliverables**: Place in `apps/frontend/public/videos/`

#### Logo Variants
- Full lockup (horizontal, vertical)
- Mark-only (icon)
- Reversed (white on black)
- Formats: SVG + PNG (multiple sizes: 32px, 64px, 128px, 256px, 512px)
- Favicon: `favicon.ico`, `icon.svg`, `apple-touch-icon.png`
- Place in `apps/frontend/public/`

#### Product Images
- Grayscale only (or will be filtered by CSS)
- Minimum 1200x1200px
- Multiple angles per product
- Ingredient/packaging close-ups
- Transparent PNG or white background

---

## 💻 Development Priorities (Copy-Paste Tasks)

### **Priority 1: Authentication (Week 1)**

**Backend** (`apps/backend/src/routes/auth.ts`)
- [ ] Implement `POST /api/auth/signup` — Create user with argon2 password hash
- [ ] Implement `POST /api/auth/login` — Verify credentials, return JWT + refresh token
- [ ] Implement `POST /api/auth/refresh` — Issue new JWT from refresh token
- [ ] Create JWT middleware for protected routes (`src/middleware/auth.ts`)
- [ ] Write unit tests for auth endpoints

**Frontend** (`apps/frontend/src/lib/auth.ts`)
- [ ] Create auth context/hook for managing user state
- [ ] Build login/signup forms with validation
- [ ] Implement token storage (httpOnly cookies recommended)
- [ ] Add protected route wrapper

**Schema**: Users table already exists in `migrations/001_initial_schema.sql` ✅

---

### **Priority 2: Product Catalog (Week 1-2)**

**Backend** (`apps/backend/src/routes/products.ts`)
- [ ] `GET /api/products` — List products with filters (category, price range, search)
- [ ] `GET /api/products/:slug` — Get single product by slug
- [ ] `POST /api/products` (admin) — Create product
- [ ] `PATCH /api/products/:id` (admin) — Update product
- [ ] Create seed script with sample products (`src/scripts/seed.ts`)

**Frontend** (`apps/frontend/src/app/products/`)
- [ ] `/products` page — Grid with filters, pagination
- [ ] `/products/[slug]` page — Product detail with SSR/ISR
- [ ] Add Product schema JSON-LD for SEO
- [ ] Implement event tracking (product_view)
- [ ] Build sticky purchase panel for desktop
- [ ] Mobile persistent action bar (price + Add to Cart)

**Schema**: Products table already exists ✅

---

### **Priority 3: Cart & Checkout (Week 2-3)**

**Backend**
- [ ] `POST /api/cart` — Create/update cart
- [ ] `GET /api/cart/:id` — Get cart
- [ ] `POST /api/checkout` — Create Stripe payment_intent
- [ ] `POST /api/webhooks/stripe` — Handle payment webhook (verify signature!)
- [ ] Create order on successful payment

**Frontend**
- [ ] Cart page with item management
- [ ] Checkout flow with shipping form
- [ ] Stripe Elements integration
- [ ] Order confirmation page
- [ ] Implement event tracking (add_to_cart, purchase)

**Payment Setup**:
1. Create Stripe account (test mode)
2. Set up webhook endpoint: `https://your-backend/api/webhooks/stripe`
3. Add webhook secret to `.env`

---

### **Priority 4: Rule-Based Quiz (Week 3)**

**Backend** (`apps/backend/src/routes/quiz.ts`)
- [ ] `POST /api/quiz/submit` — Process quiz, return recommendations
- [ ] Implement rules engine:
  - If `hyperpigmentation` + `not oily` → Recommend Vitamin C product
  - If `sensitivity == true` → Filter out irritants
  - etc. (expand rules based on product line)

**Frontend** (`apps/frontend/src/components/quiz/`)
- [ ] Build multi-step wizard (6-8 questions)
- [ ] Questions: skin_type, primary_concern, age_range, allergies, sensitivity, lifestyle
- [ ] Show progress indicator
- [ ] Results page with 3 recommended products + reasons
- [ ] Implement event tracking (quiz_submit)

**Schema**: quiz_responses table already exists ✅

---

### **Priority 5: Reviews System (Week 3-4)**

**Backend** (`apps/backend/src/routes/reviews.ts`)
- [ ] `POST /api/products/:id/reviews` — Create review
- [ ] `GET /api/products/:id/reviews` — List reviews with pagination
- [ ] Set `verified = true` if user has purchased product
- [ ] Implement event tracking (review_submit)

**Frontend**
- [ ] Review submission form (rating + text)
- [ ] Display reviews with verified badge
- [ ] Star rating visualization
- [ ] Sorting/filtering (most helpful, recent)

**Schema**: reviews table already exists ✅

---

### **Priority 6: Sanity CMS Integration (Week 4)**

**Setup**
```bash
cd apps/sanity
npm create sanity@latest
```

**Schemas to Create**:
- `blogPost`: title, slug, content (portable text), images, publishedAt
- `faqItem`: question, answer, category
- `page`: slug, title, sections (flexible content blocks)
- `homepageContent`: hero subtitle, featured products, testimonials

**Frontend Integration**:
- [ ] Create Sanity client (`apps/frontend/src/lib/sanity.ts`)
- [ ] Fetch content for About, FAQ, Blog pages
- [ ] Use ISR (revalidate: 300s) for content pages

---

### **Priority 7: Admin Panel (Week 4-5)**

**Backend** (`apps/backend/src/routes/admin.ts`)
- [ ] Add `is_admin` check middleware
- [ ] Product CRUD endpoints (already partially covered)
- [ ] Order management (`GET /api/admin/orders`, `PATCH /api/admin/orders/:id`)
- [ ] Basic analytics: total sales, top products, order count
- [ ] CSV export for orders

**Frontend** (`apps/frontend/src/app/admin/`)
- [ ] Login with admin credentials
- [ ] Product management UI (add/edit/delete)
- [ ] Order list with status updates
- [ ] Basic analytics dashboard
- [ ] Review moderation

**Access Control**: Use JWT with `is_admin` claim. Protect all admin routes.

---

### **Priority 8: CI/CD & Deployment (Week 5)**

**GitHub Actions** (`.github/workflows/`)
- [ ] `ci.yml` — Run tests, lint on every PR
- [ ] `deploy-staging.yml` — Auto-deploy to staging on merge to `staging` branch
- [ ] `deploy-production.yml` — Manual approval, deploy to `main` branch

**Vercel Deployment** (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd apps/frontend
vercel --prod
```

**Backend Deployment Options**:
- Railway.app (recommended for Fastify + Postgres)
- Render.com
- Fly.io
- AWS ECS

**Monitoring**:
- [ ] Set up Sentry for error tracking
- [ ] Configure structured logging (Pino already integrated)
- [ ] Add health check monitoring (e.g., UptimeRobot)

---

## 🗄️ Database Schema Reference

All tables created in `migrations/001_initial_schema.sql` ✅

### Core Tables

**users** — User accounts + profiles
```sql
id, email, password_hash, full_name, phone,
profile (JSONB), marketing_consent, is_admin,
created_at, last_login, updated_at
```

**products** — Product catalog
```sql
id, sku, title, slug, description, short_description,
price_cents, currency, stock, images (JSONB),
ingredients (JSONB), clinical_evidence (JSONB),
metadata (JSONB), is_active, created_at, updated_at
```

**orders** — Order history
```sql
id, user_id, items (JSONB), total_cents, currency,
status, payment_provider, payment_intent_id,
shipping (JSONB), tracking_number, notes,
created_at, updated_at
```

**reviews** — Product reviews
```sql
id, product_id, user_id, rating, text, verified,
helpful_count, created_at, updated_at
```

**quiz_responses** — Quiz results + recommendations
```sql
id, user_id, anon_id, responses (JSONB),
result (JSONB), recommended_products (JSONB),
created_at
```

**events** — ML instrumentation
```sql
id, user_id, anon_id, event_type, product_id,
cart_id, quiz_id, value, payload (JSONB),
timestamp, created_at
```

**carts** — Server-side cart storage
```sql
id, user_id, anon_id, items (JSONB),
total_cents, currency, created_at, updated_at, expires_at
```

**refresh_tokens** — JWT refresh tokens
```sql
id, user_id, token_hash, expires_at, created_at, revoked
```

---

## 🔐 Security Checklist

- [x] HTTPS enforced (in production)
- [x] CORS configured (Fastify plugin)
- [x] Rate limiting (100 req/15min)
- [x] Helmet security headers
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS prevention (sanitize user input)
- [ ] CSRF protection (token-based)
- [ ] Password hashing with argon2
- [ ] JWT with short expiry (1h) + refresh tokens
- [ ] Stripe webhook signature verification
- [ ] Admin endpoints protected with role check
- [ ] PCI compliance: Never store card data (use Stripe Checkout)

---

## 🧪 Testing Strategy

### Unit Tests
- **Backend**: Jest for services, models
- **Frontend**: Jest + React Testing Library for components

### Integration Tests
- API endpoint tests (Fastify + supertest)
- Database transaction tests

### E2E Tests
- Playwright/Cypress for critical flows:
  - [ ] User signup → login → add to cart → checkout
  - [ ] Quiz flow → recommendations
  - [ ] Product search → detail view → review

### Performance Tests
- Lighthouse (aim for >90 score)
- Load testing with k6 or Artillery

---

## 📊 Analytics & Instrumentation

### Events to Track (POST /api/events)

```typescript
event_type: 
  | 'product_view'     // Product detail page view
  | 'add_to_cart'      // Item added to cart
  | 'purchase'         // Order completed
  | 'quiz_submit'      // Quiz completed
  | 'search'           // Product search performed
  | 'review_submit'    // Review submitted
```

### Implementation

**Frontend** (`apps/frontend/src/lib/analytics.ts`)
```typescript
export async function trackEvent(event: AnalyticsEvent) {
  await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      anon_id: getAnonId(), // or user_id if logged in
      event_type: event.type,
      payload: {
        product_id: event.product_id,
        context: { page: window.location.pathname },
        device: { ua: navigator.userAgent },
      },
      timestamp: new Date().toISOString(),
    }),
  });
}
```

**Usage**:
```typescript
// On product page
trackEvent({ type: 'product_view', product_id: 'uuid' });

// On add to cart
trackEvent({ type: 'add_to_cart', product_id: 'uuid', value: price });
```

---

## 📈 SEO Checklist

- [x] Meta tags in `layout.tsx`
- [x] OpenGraph tags for social sharing
- [ ] Generate `sitemap.xml` (use next-sitemap)
- [ ] Generate `robots.txt`
- [ ] Implement Product schema JSON-LD:

```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": ["image-url"],
  "description": "...",
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD"
  }
}
</script>
```

- [ ] Optimize images (Next/Image handles this)
- [ ] Add alt text to all images
- [ ] Ensure fast LCP (<2.5s)

---

## ♿ Accessibility Checklist (WCAG AA)

- [x] Skip to content link
- [x] Focus styles (2px black outline)
- [x] Semantic HTML (h1, nav, main, footer)
- [ ] ARIA labels on interactive elements
- [ ] Color contrast: 4.5:1 minimum (black on white = 21:1 ✅)
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader testing (NVDA, VoiceOver)
- [ ] Forms: labels, error messages
- [ ] Alt text on all images

**Tools**:
- Lighthouse accessibility audit
- axe DevTools browser extension

---

## 🚦 Deployment Checklist

### Staging
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Smoke tests passed
- [ ] SSL certificate active

### Production
- [ ] All staging checks ✅
- [ ] Backup strategy in place (Neon auto-backup)
- [ ] Monitoring & alerts configured (Sentry, UptimeRobot)
- [ ] CDN configured for static assets (Cloudflare)
- [ ] Rate limiting tuned for production load
- [ ] Payment webhooks tested in test mode
- [ ] DNS configured
- [ ] Performance tested (Lighthouse, WebPageTest)

---

## 📞 Support & Contacts

**Questions?**
- Technical Lead: [Your Name / Email]
- Design Lead: [Designer Name / Email]
- Product Owner: [PO Name / Email]

**Resources**:
- GitHub Repo: [link]
- Figma Designs: [link]
- Stripe Dashboard: [link]
- Neon Dashboard: [link]
- Sanity Studio: [link once created]

---

## 🎯 Success Metrics (Phase 1)

- [ ] Homepage loads with hero video in <3s (desktop)
- [ ] All product pages render with SSR/ISR
- [ ] Checkout flow completes successfully (Stripe test mode)
- [ ] Quiz returns 3 recommendations with reasons
- [ ] Events tracked for all core interactions
- [ ] Lighthouse score >90 on key pages
- [ ] WCAG AA accessibility compliance
- [ ] Zero critical security vulnerabilities

---

**Last Updated**: 2025-10-13

**Status**: Foundation Complete ✅ — Ready for Team Implementation 🚀
