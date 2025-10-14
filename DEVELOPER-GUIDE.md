# 🚀 Developer Setup Guide

**Welcome to the E-Commerce Platform!**

This guide will help you set up the development environment and start contributing to the project.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Code Style](#code-style)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

---

## Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | 18.x or higher | https://nodejs.org/ |
| **npm** | 9.x or higher | Included with Node.js |
| **PostgreSQL** | 15.x or higher | https://www.postgresql.org/ |
| **Redis** | 7.x or higher | https://redis.io/ |
| **Git** | Latest | https://git-scm.com/ |

### Optional Tools

- **Docker** - For containerized development
- **VS Code** - Recommended IDE with extensions
- **Postman** - API testing
- **pgAdmin** - PostgreSQL GUI

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "orta.vscode-jest",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## Initial Setup

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-org/ecommerce-platform.git

# OR clone via SSH
git clone git@github.com:your-org/ecommerce-platform.git

# Navigate to project directory
cd ecommerce-platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ../..
```

### 3. Setup PostgreSQL

#### Option A: Local PostgreSQL

```bash
# Create database
createdb ecommerce_dev

# Verify connection
psql ecommerce_dev -c "SELECT version();"
```

#### Option B: Docker PostgreSQL

```bash
# Start PostgreSQL container
docker run --name ecommerce-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ecommerce_dev \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

### 4. Setup Redis

#### Option A: Local Redis

```bash
# macOS (via Homebrew)
brew install redis
brew services start redis

# Linux (Ubuntu/Debian)
sudo apt-get install redis-server
sudo systemctl start redis

# Windows (via Chocolatey)
choco install redis-64
redis-server
```

#### Option B: Docker Redis

```bash
# Start Redis container
docker run --name ecommerce-redis \
  -p 6379:6379 \
  -d redis:7

# Verify container is running
docker ps
```

---

## Environment Configuration

### 1. Copy Environment Template

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your local settings:

```bash
# ========================================
# DATABASE
# ========================================
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_dev
DIRECT_URL=postgresql://postgres:password@localhost:5432/ecommerce_dev

# ========================================
# REDIS
# ========================================
REDIS_URL=redis://localhost:6379

# ========================================
# JWT AUTHENTICATION
# ========================================
# Generate a secure secret
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ========================================
# SECURITY
# ========================================
CSRF_SECRET=your-csrf-secret-32-characters-minimum
SESSION_SECRET=your-session-secret-32-characters-minimum

# ========================================
# FRONTEND
# ========================================
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001

# ========================================
# DEVELOPMENT
# ========================================
NODE_ENV=development
PORT=3001
DEBUG=true
```

### 3. Generate Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate CSRF secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Setup Database

```bash
# Navigate to backend
cd apps/backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## Running the Application

### Development Mode

#### Option 1: Run All Services

```bash
# From project root
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/docs

#### Option 2: Run Services Individually

```bash
# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Frontend
cd apps/frontend
npm run dev

# Terminal 3: CMS (Sanity)
cd apps/cms
npm run dev
```

### Production Build

```bash
# Build all applications
npm run build

# Start production server
npm run start
```

### Docker Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Development Workflow

### Branch Strategy

```
main                    Production-ready code
  └── develop           Development branch
        └── feature/*   Feature branches
        └── bugfix/*    Bug fix branches
        └── hotfix/*    Emergency fixes
```

### Creating a Feature

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add your feature"

# 3. Push to remote
git push origin feature/your-feature-name

# 4. Create Pull Request on GitHub
# - Target branch: develop
# - Add description
# - Request review

# 5. After approval, merge to develop
```

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(products): add product search functionality
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
refactor(cart): optimize cart calculation logic
test(orders): add integration tests for order flow
chore(deps): update dependencies
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

---

## Testing

### Run All Tests

```bash
# From project root
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage
```

### Backend Tests

```bash
cd apps/backend

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Specific test file
npm test -- auth.test.ts
```

### Frontend Tests

```bash
cd apps/frontend

# Component tests
npm test

# E2E tests with Playwright
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# Visual regression tests
npm run test:visual
```

### Writing Tests

#### Backend Unit Test Example

```typescript
// apps/backend/src/services/__tests__/product.service.test.ts
import { ProductService } from '../product.service';
import { prisma } from '../../lib/prisma';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService(prisma);
  });

  describe('getProduct', () => {
    it('should return product by id', async () => {
      const product = await service.getProduct('product-id');
      expect(product).toBeDefined();
      expect(product.id).toBe('product-id');
    });

    it('should throw error for non-existent product', async () => {
      await expect(service.getProduct('invalid-id'))
        .rejects.toThrow('Product not found');
    });
  });
});
```

#### Frontend Component Test Example

```typescript
// apps/frontend/src/components/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: '/test.jpg',
  };

  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });
});
```

---

## Code Style

### ESLint

```bash
# Lint all code
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Lint specific files
npm run lint -- apps/backend/src/**/*.ts
```

### Prettier

```bash
# Format all code
npm run format

# Check formatting
npm run format:check
```

### TypeScript

```bash
# Type check all code
npm run type-check

# Type check backend
cd apps/backend && npm run type-check

# Type check frontend
cd apps/frontend && npm run type-check
```

### Pre-commit Hooks

We use Husky for pre-commit hooks:

```bash
# Install hooks
npm run prepare

# Hooks will automatically:
# - Run ESLint
# - Run Prettier
# - Run type checking
# - Run tests (on staged files)
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
psql $DATABASE_URL -c "SELECT 1"

# Reset database
npx prisma migrate reset
```

#### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# Start Redis
redis-server  # Default port 6379
```

#### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Prisma generated files
npx prisma generate
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf apps/frontend/.next

# Clear build artifacts
npm run clean
npm run build
```

### Getting Help

1. **Check existing issues:** [GitHub Issues](https://github.com/your-org/ecommerce-platform/issues)
2. **Ask on Slack:** #dev-help channel
3. **Review documentation:** `/docs` folder
4. **Contact maintainers:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Project Structure

```
ecommerce-platform/
├── apps/
│   ├── backend/              # Fastify API
│   │   ├── src/
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── services/     # Business logic
│   │   │   ├── middleware/   # Custom middleware
│   │   │   ├── lib/          # Utilities
│   │   │   └── index.ts      # Entry point
│   │   ├── prisma/           # Database schema
│   │   └── package.json
│   │
│   ├── frontend/             # Next.js app
│   │   ├── src/
│   │   │   ├── app/          # App router
│   │   │   ├── components/   # React components
│   │   │   ├── lib/          # Utilities
│   │   │   └── styles/       # Global styles
│   │   └── package.json
│   │
│   └── cms/                  # Sanity CMS
│       └── schemas/          # Content schemas
│
├── scripts/                  # Deployment scripts
├── .github/                  # GitHub Actions
├── docs/                     # Documentation
├── .env.example              # Environment template
└── package.json              # Root package.json
```

---

## Useful Commands

### Database

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Seed database
npm run db:seed
```

### Development

```bash
# Start dev servers
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service]

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

---

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts with develop
- [ ] PR description is clear and complete

---

## Resources

### Documentation
- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](http://localhost:3001/docs)
- [Deployment Runbook](./DEPLOYMENT-RUNBOOK.md)
- [Phase Guides](./docs/)

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Fastify Docs](https://www.fastify.io/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/react)

---

## Quick Start Checklist

- [ ] Install prerequisites (Node.js, PostgreSQL, Redis)
- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Copy `.env.example` to `.env`
- [ ] Configure environment variables
- [ ] Generate secrets
- [ ] Run database migrations
- [ ] Start development servers (`npm run dev`)
- [ ] Visit http://localhost:3000
- [ ] Check API docs at http://localhost:3001/docs

---

**Happy Coding! 🚀**

If you have any questions, don't hesitate to ask in the #dev-help channel or create an issue on GitHub.
