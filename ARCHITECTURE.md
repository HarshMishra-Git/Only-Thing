# 🏗️ Architecture Documentation

**E-Commerce Platform System Architecture**

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Database Schema](#database-schema)
5. [API Design](#api-design)
6. [Frontend Architecture](#frontend-architecture)
7. [Security Architecture](#security-architecture)
8. [Performance & Scalability](#performance--scalability)
9. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users / Clients                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                             │
│  • Static Assets  • Image Optimization  • DDoS Protection      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │                                          │
┌───────▼─────────┐                    ┌──────────▼──────────┐
│   Frontend      │                    │    Backend API      │
│   (Next.js)     │◄──────REST────────►│    (Fastify)        │
│   Port: 3000    │                    │    Port: 3001       │
└─────────────────┘                    └──────────┬──────────┘
        │                                          │
        │                                          ▼
        │                              ┌──────────────────────┐
        │                              │  Authentication &    │
        │                              │  Authorization       │
        │                              │  (JWT + Sessions)    │
        │                              └──────────┬───────────┘
        │                                         │
        │                              ┌──────────▼───────────┐
        │                              │  Business Logic      │
        │                              │  Services Layer      │
        │                              └──────────┬───────────┘
        │                                         │
        │                      ┌──────────────────┼───────────────────┐
        │                      │                  │                   │
        │              ┌───────▼────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
        │              │ PostgreSQL │  │  Redis Cache   │  │  AWS S3        │
        │              │ (Database) │  │  (Sessions)    │  │  (File Store)  │
        │              └────────────┘  └────────────────┘  └────────────────┘
        │                      │
        ▼                      │
┌─────────────────┐            │
│   Sanity CMS    │            │
│  (Content Mgmt) │            │
└─────────────────┘            │
        │                      │
        └──────────────────────┘
                    ↓
        ┌───────────────────────────┐
        │  External Services        │
        │  • Stripe (Payments)      │
        │  • SendGrid (Email)       │
        │  • Sentry (Monitoring)    │
        └───────────────────────────┘
```

### Request Flow

```
1. User Request → CDN → Next.js Frontend
2. Frontend → API Call → Fastify Backend
3. Backend → Auth Middleware → JWT Verification
4. Backend → Rate Limiting → Request Validation
5. Backend → Service Layer → Business Logic
6. Service → Repository Layer → Database Query
7. Database → Cache Check → Redis (if cached)
8. Database → PostgreSQL (if not cached)
9. Response → Cache Store → Redis
10. Response → Frontend → User
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.x | React framework, SSR/SSG |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Styling |
| **Zustand** | 4.x | State management |
| **React Query** | 5.x | Server state management |
| **Zod** | 3.x | Schema validation |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Fastify** | 4.x | Web framework |
| **Prisma** | 5.x | ORM |
| **PostgreSQL** | 15.x | Database |
| **Redis** | 7.x | Caching & sessions |
| **JWT** | 9.x | Authentication |
| **Bcrypt** | 5.x | Password hashing |

### CMS
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Sanity** | 3.x | Headless CMS |
| **Groq** | Latest | Query language |

### DevOps
| Technology | Version | Purpose |
|-----------|---------|---------|
| **GitHub Actions** | Latest | CI/CD |
| **Docker** | Latest | Containerization |
| **Vercel** | Latest | Frontend hosting |
| **Railway** | Latest | Backend hosting |

### Monitoring
| Technology | Purpose |
|-----------|---------|
| **Sentry** | Error tracking |
| **Google Analytics** | User analytics |
| **Lighthouse** | Performance monitoring |

---

## Architecture Patterns

### 1. Monorepo Structure

```
apps/
├── backend/       # API server
├── frontend/      # Web application
└── cms/          # Content management

packages/         # Shared code (optional)
├── types/        # Shared TypeScript types
├── utils/        # Shared utilities
└── config/       # Shared configuration
```

**Benefits:**
- Code sharing
- Unified versioning
- Simplified dependencies
- Easier refactoring

### 2. Layered Architecture (Backend)

```
┌─────────────────────────────────────┐
│         Controllers Layer           │
│  • HTTP handling                    │
│  • Request/response formatting      │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Services Layer              │
│  • Business logic                   │
│  • Data transformation              │
│  • External API calls               │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│       Repository Layer              │
│  • Database queries                 │
│  • Data access                      │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Database (Prisma)           │
└─────────────────────────────────────┘
```

**Example:**

```typescript
// Controller
export class ProductController {
  constructor(private productService: ProductService) {}

  async getProduct(req, reply) {
    const product = await this.productService.getProduct(req.params.id);
    return reply.send(product);
  }
}

// Service
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return this.enrichProduct(product);
  }
}

// Repository
export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }
}
```

### 3. API Gateway Pattern

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   API Gateway    │
│   (Fastify)      │
│   - Rate Limit   │
│   - Auth         │
│   - Validation   │
└──────┬───────────┘
       │
       ├──► /api/products    → Products Service
       ├──► /api/orders      → Orders Service
       ├──► /api/users       → Users Service
       └──► /api/payments    → Payments Service
```

### 4. Caching Strategy

**Multi-Level Caching:**

```
Request
  │
  ├─► Browser Cache (Cache-Control headers)
  │
  ├─► CDN Cache (Cloudflare)
  │
  ├─► Redis Cache (Application level)
  │
  └─► Database
```

**Cache Invalidation:**

```typescript
// Cache with TTL
await redis.setex(`product:${id}`, 3600, JSON.stringify(product));

// Invalidate on update
await redis.del(`product:${id}`);

// Pattern-based invalidation
await redis.del('products:*');
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│    User      │         │   Product    │
├──────────────┤         ├──────────────┤
│ id           │         │ id           │
│ email        │◄───┐    │ name         │
│ password     │    │    │ price        │
│ name         │    │    │ categoryId   │◄──┐
│ role         │    │    │ stock        │   │
│ createdAt    │    │    │ images       │   │
└──────┬───────┘    │    └──────┬───────┘   │
       │            │           │            │
       │            │           │            │
       │ 1        N │           │ N       1  │
       │            │           │            │
       ▼            │           ▼            │
┌──────────────┐   │    ┌──────────────┐    │
│    Order     │───┘    │  Category    │────┘
├──────────────┤        ├──────────────┤
│ id           │        │ id           │
│ userId       │        │ name         │
│ total        │        │ slug         │
│ status       │        │ parentId     │
│ createdAt    │        └──────────────┘
└──────┬───────┘
       │
       │ 1
       │
       │ N
       ▼
┌──────────────┐
│  OrderItem   │
├──────────────┤
│ id           │
│ orderId      │
│ productId    │
│ quantity     │
│ price        │
└──────────────┘
```

### Core Tables

#### Users
```sql
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "role" VARCHAR(50) DEFAULT 'USER',
  "avatar" TEXT,
  "emailVerified" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
```

#### Products
```sql
CREATE TABLE "Product" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) UNIQUE NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "compareAtPrice" DECIMAL(10,2),
  "stock" INTEGER DEFAULT 0,
  "sku" VARCHAR(100) UNIQUE,
  "categoryId" UUID REFERENCES "Category"("id"),
  "images" TEXT[],
  "tags" TEXT[],
  "rating" DECIMAL(3,2) DEFAULT 0,
  "reviewCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "Product_slug_idx" ON "Product"("slug");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_price_idx" ON "Product"("price");
CREATE INDEX "Product_rating_idx" ON "Product"("rating");
```

#### Orders
```sql
CREATE TABLE "Order" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
  "userId" UUID REFERENCES "User"("id") ON DELETE CASCADE,
  "status" VARCHAR(50) DEFAULT 'PENDING',
  "subtotal" DECIMAL(10,2) NOT NULL,
  "tax" DECIMAL(10,2) NOT NULL,
  "shipping" DECIMAL(10,2) NOT NULL,
  "total" DECIMAL(10,2) NOT NULL,
  "shippingAddress" JSONB NOT NULL,
  "paymentMethod" VARCHAR(50) NOT NULL,
  "paymentIntentId" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX "Order_userId_idx" ON "Order"("userId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
```

### Database Indexes

**Performance Optimization:**

```sql
-- Composite indexes for common queries
CREATE INDEX "Product_category_price_idx" ON "Product"("categoryId", "price");
CREATE INDEX "Product_category_rating_idx" ON "Product"("categoryId", "rating");

-- Full-text search
CREATE INDEX "Product_name_trgm_idx" ON "Product" USING gin (name gin_trgm_ops);
CREATE INDEX "Product_description_trgm_idx" ON "Product" USING gin (description gin_trgm_ops);

-- Partial indexes
CREATE INDEX "Product_in_stock_idx" ON "Product"("stock") WHERE "stock" > 0;
```

---

## API Design

### RESTful Conventions

```
Resource-based URLs:
  GET    /api/products         # List products
  GET    /api/products/:id     # Get product
  POST   /api/products         # Create product
  PUT    /api/products/:id     # Update product
  DELETE /api/products/:id     # Delete product

Nested resources:
  GET    /api/products/:id/reviews
  POST   /api/products/:id/reviews

Query parameters:
  /api/products?page=1&limit=20&sort=price&order=asc

Filtering:
  /api/products?category=electronics&minPrice=100&maxPrice=500
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Product Name",
    "price": 29.99
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 123 not found",
    "statusCode": 404
  }
}
```

### API Versioning

```
/api/v1/products
/api/v2/products

Accept: application/vnd.api+json; version=1
```

---

## Frontend Architecture

### Component Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Marketing pages
│   ├── (shop)/           # Shop pages
│   ├── (auth)/           # Auth pages
│   └── (admin)/          # Admin pages
│
├── components/
│   ├── ui/               # Reusable UI components
│   ├── features/         # Feature-specific components
│   ├── layouts/          # Layout components
│   └── forms/            # Form components
│
├── lib/
│   ├── api/              # API client
│   ├── hooks/            # Custom hooks
│   ├── store/            # State management
│   └── utils/            # Utilities
│
└── styles/               # Global styles
```

### State Management

```typescript
// Zustand store
export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),
}));

// React Query for server state
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## Security Architecture

### Authentication Flow

```
1. User Login → Backend
2. Backend → Validate Credentials
3. Backend → Generate JWT + Refresh Token
4. Backend → Store Session in Redis
5. Backend → Return Tokens to Frontend
6. Frontend → Store Tokens in HTTP-only Cookies
7. Frontend → Include JWT in Authorization Header
8. Backend → Validate JWT on Each Request
9. Backend → Refresh Token if Expired
```

### Security Layers

```
┌──────────────────────────────────┐
│  1. Network Layer                │
│  • HTTPS/TLS                     │
│  • DDoS Protection (Cloudflare)  │
└──────────────────────────────────┘
              ↓
┌──────────────────────────────────┐
│  2. Application Layer            │
│  • Rate Limiting                 │
│  • CORS                          │
│  • CSRF Protection               │
└──────────────────────────────────┘
              ↓
┌──────────────────────────────────┐
│  3. Authentication               │
│  • JWT Tokens                    │
│  • Password Hashing (bcrypt)     │
│  • MFA (Optional)                │
└──────────────────────────────────┘
              ↓
┌──────────────────────────────────┐
│  4. Authorization                │
│  • Role-based Access Control     │
│  • Permission Checks             │
└──────────────────────────────────┘
              ↓
┌──────────────────────────────────┐
│  5. Data Layer                   │
│  • Input Validation              │
│  • SQL Injection Prevention      │
│  • XSS Protection                │
└──────────────────────────────────┘
```

---

## Performance & Scalability

### Performance Optimizations

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization
- Service Workers (PWA)

**Backend:**
- Database indexing
- Query optimization
- Connection pooling
- Caching (Redis)
- CDN for static assets

**Database:**
- Indexed queries
- Query optimization
- Read replicas
- Connection pooling

### Scalability Strategy

```
Horizontal Scaling:
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │  Backend   │  │  Backend   │  │  Backend   │
  │ Instance 1 │  │ Instance 2 │  │ Instance 3 │
  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
        │                │                │
        └────────────────┼────────────────┘
                        │
                  ┌─────▼─────┐
                  │Load Balance│
                  └───────────┘
```

---

## Deployment Architecture

### Production Environment

```
┌──────────────────────────────────────────────────┐
│              Production (US-East-1)              │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐         ┌──────────────┐     │
│  │   Vercel     │         │   Railway    │     │
│  │  (Frontend)  │◄───────►│  (Backend)   │     │
│  └──────────────┘         └──────┬───────┘     │
│                                   │              │
│                    ┌──────────────┼──────────┐  │
│                    │              │          │  │
│            ┌───────▼───┐  ┌───────▼───┐  ┌──▼──▼──┐
│            │PostgreSQL │  │   Redis   │  │   S3   │
│            │ (Primary) │  │ (Session) │  │ (CDN)  │
│            └───────────┘  └───────────┘  └────────┘
│                                                  │
└──────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Maintained by:** Development Team
