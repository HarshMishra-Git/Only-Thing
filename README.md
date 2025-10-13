# Only Thing Health & Wellness — E-Commerce Platform

> **Phase 1**: Premium monochrome e-commerce site with clinical-luxury UI, secure commerce, rule-based personalization, and ML-readiness instrumentation.

## 🎯 Project Overview

A world-class, production-ready e-commerce platform featuring:

- **Premium Monochrome UI**: Black/white/gray design system with minimal, clinical-luxury aesthetic
- **Full E-Commerce**: Product catalog, cart, checkout (Stripe + Razorpay), order management
- **Personalized Quiz**: Rule-based consultation that recommends products based on skin concerns
- **Hero Video**: Full-bleed homepage hero with muted loop and responsive fallback
- **ML-Ready**: Comprehensive event instrumentation for future machine learning models
- **CMS Integration**: Sanity.io for marketing content, blog, and FAQs
- **Accessibility First**: WCAG AA compliance, semantic HTML, keyboard navigation

## 🏗️ Tech Stack

### Frontend
- **Next.js** (latest) — React framework with SSR/SSG
- **TypeScript** — Type safety throughout
- **Emotion/Styled Components** — Component-scoped styling
- **Next/Image** — Optimized image delivery

### Backend
- **Node.js** + **Fastify** — High-performance API server
- **Neon Postgres** — Serverless database
- **JWT** — Secure authentication
- **Stripe & Razorpay** — Payment processing

### CMS & Content
- **Sanity.io** — Headless CMS for content management

### Infrastructure
- **Vercel** — Frontend hosting with edge functions
- **GitHub Actions** — CI/CD pipeline
- **Sentry** — Error monitoring
- **CDN** — Cloudflare/CloudFront for assets

## 📁 Project Structure

```
only-thing-wellness/
├── apps/
│   ├── frontend/          # Next.js e-commerce site
│   │   ├── src/
│   │   │   ├── app/       # App router pages
│   │   │   ├── components/
│   │   │   ├── lib/       # Utilities
│   │   │   ├── styles/    # Design tokens & theme
│   │   │   └── types/
│   │   └── public/        # Static assets
│   ├── backend/           # Fastify API server
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── migrations/    # Database migrations
│   └── sanity/            # Sanity Studio
├── packages/
│   ├── shared/            # Shared types & utilities
│   └── design-tokens/     # Design system tokens
├── docs/                  # Documentation
└── scripts/               # Build & deployment scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (or Neon account)
- Stripe account (test mode)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env

# Configure your database and API keys in .env files

# Run database migrations
npm run migrate

# Seed initial data
npm run seed

# Start development servers
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:4000`.

## 🎨 Design System

### Color Palette (Monochrome)

- **Primary Black**: `#000000` — Primary text, headers, accents
- **White**: `#FFFFFF` — Backgrounds, reversed text
- **Neutral Gray**: `#9A9A9A` — Secondary text, borders
- **Light Background**: `#F5F5F5` — Page backgrounds
- **Gold Accent**: `#BFA66A` — Micro-feedback only (sparingly)

### Typography

- **Display Font**: Heavy black geometric (H1/H2)
- **Body Font**: Neutral sans-serif (paragraphs, UI)
- **Scale**: 12px base, modular scale for headings

### Spacing

12px base scale: `12, 24, 36, 48, 60, 72, 96, 120`

## 📊 Database Schema

Core tables:
- **users** — User accounts, profiles, preferences
- **products** — SKU, pricing, ingredients, clinical evidence
- **orders** — Order items, totals, payment status
- **reviews** — Ratings, text, verified purchaser flag
- **quiz_responses** — Quiz answers, recommendations
- **events** — Full event stream for analytics/ML

See `apps/backend/migrations/` for complete schema definitions.

## 🔐 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
```

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test --workspace=apps/frontend

# Run backend tests
npm run test --workspace=apps/backend
```

## 📦 Deployment

### Staging

Automatic deployment on PR merge to `staging` branch.

### Production

Manual deployment approval required for `main` branch.

```bash
# Build for production
npm run build

# Deploy frontend to Vercel
vercel --prod

# Deploy backend
# (Follow platform-specific instructions)
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Refresh JWT

### Products
- `GET /api/products` — List products (with filters)
- `GET /api/products/:slug` — Product detail

### Cart & Checkout
- `POST /api/cart` — Create/update cart
- `GET /api/cart/:id` — Get cart
- `POST /api/checkout` — Initiate checkout

### Quiz
- `POST /api/quiz/submit` — Submit quiz, get recommendations

### Events
- `POST /api/events` — Track analytics event

Full API documentation: [docs/api/openapi.yaml](docs/api/openapi.yaml)

## 📈 Analytics & Instrumentation

Events tracked:
- `product_view` — Product page views
- `add_to_cart` — Items added to cart
- `purchase` — Completed orders
- `quiz_submit` — Quiz completions
- `search` — Search queries
- `review_submit` — Review submissions

## 🎯 Acceptance Criteria (Phase 1)

- [x] Homepage with hero video and HTML overlays
- [x] Product listing & detail pages with SSR
- [x] Full checkout flow (Stripe integration)
- [x] User accounts and order history
- [x] Admin panel for products and orders
- [x] Rule-based quiz with recommendations
- [x] Event instrumentation (all core events)
- [x] SEO (sitemap, robots, schema.org Product)
- [x] Accessibility (WCAG AA compliance)
- [x] CI/CD pipeline configured

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📄 License

Proprietary — Only Thing Health & Wellness LLP

---

**Built with ♥ for intelligent skincare**
