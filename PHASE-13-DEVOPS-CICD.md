# 🚀 Phase 13: CI/CD & DevOps - Complete Guide

**Status:** ✅ Complete  
**Version:** 1.0  
**Last Updated:** January 2025

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [GitHub Actions Workflows](#github-actions-workflows)
4. [Environment Management](#environment-management)
5. [Database Backup & Restore](#database-backup--restore)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Security Best Practices](#security-best-practices)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

---

## Overview

Phase 13 implements a complete CI/CD pipeline with automated testing, deployment, and monitoring for the e-commerce platform.

### ✨ Key Features

- ✅ **Automated CI/CD** - GitHub Actions workflows for frontend and backend
- ✅ **Multi-Environment** - Development, Staging, Production
- ✅ **Automated Testing** - Unit, integration, E2E tests on every PR
- ✅ **Database Migrations** - Automatic Prisma migrations with rollback
- ✅ **Automated Backups** - Daily database backups with 30-day retention
- ✅ **Health Checks** - Post-deployment verification and automatic rollback
- ✅ **Monitoring** - Slack notifications, Sentry error tracking
- ✅ **Security** - Secret management, vulnerability scanning
- ✅ **Performance** - Lighthouse checks, bundle size monitoring

---

## Architecture

### Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   main       │  │   develop    │  │  feature/*   │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                  │                 │
│         │                 │                  │                 │
│  ┌──────▼─────────────────▼──────────────────▼──────┐         │
│  │          GitHub Actions Workflows                │         │
│  │  • Lint  • Test  • Build  • Deploy              │         │
│  └──────┬─────────────────┬──────────────────┬──────┘         │
└─────────┼─────────────────┼──────────────────┼────────────────┘
          │                 │                  │
┌─────────▼────────┐ ┌──────▼──────┐ ┌─────────▼────────┐
│   Production     │ │   Staging   │ │   Development    │
│                  │ │             │ │                  │
│ ┌──────────────┐ │ │┌──────────┐ │ │ ┌──────────────┐│
│ │   Vercel     │ │ ││  Vercel  │ │ │ │  localhost   ││
│ │  (Frontend)  │ │ ││(Frontend)│ │ │ │  :3000       ││
│ └──────┬───────┘ │ │└─────┬────┘ │ │ └──────┬───────┘│
│        │         │ │      │      │ │        │        │
│ ┌──────▼───────┐ │ │┌─────▼────┐ │ │ ┌──────▼───────┐│
│ │   Railway    │ │ ││ Railway  │ │ │ │  localhost   ││
│ │  (Backend)   │ │ ││(Backend) │ │ │ │  :3001       ││
│ └──────┬───────┘ │ │└─────┬────┘ │ │ └──────┬───────┘│
│        │         │ │      │      │ │        │        │
│ ┌──────▼───────┐ │ │┌─────▼────┐ │ │ ┌──────▼───────┐│
│ │ PostgreSQL   │ │ ││PostgreSQL│ │ │ │ PostgreSQL   ││
│ │    Redis     │ │ ││  Redis   │ │ │ │    Redis     ││
│ │     S3       │ │ ││   S3     │ │ │ │   Local      ││
│ └──────────────┘ │ │└──────────┘ │ │ └──────────────┘│
└──────────────────┘ └─────────────┘ └──────────────────┘
```

### Deployment Flow

```
Developer Push
      │
      ▼
┌─────────────────┐
│  GitHub Action  │
│    Triggered    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Run Linting   │
│  & Type Check   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Run Tests     │
│ Unit + E2E      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Build Project  │
│  Next.js/API    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Run Migrations │
│   (Backend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy to Host  │
│ Vercel/Railway  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Health Checks  │
│  & Validation   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Success?│
    └────┬────┘
         │
    ┌────▼────────────┐
    │                 │
   Yes               No
    │                 │
    ▼                 ▼
┌────────┐      ┌──────────┐
│ Notify │      │ Rollback │
│Success │      │ & Alert  │
└────────┘      └──────────┘
```

---

## GitHub Actions Workflows

### 📁 Files Created

```
.github/workflows/
├── frontend-deploy.yml          # Frontend CI/CD
└── backend-deploy.yml           # Backend CI/CD
```

### Frontend Workflow (`.github/workflows/frontend-deploy.yml`)

**Triggers:**
- Push to `main` (production)
- Push to `develop` (staging)
- Pull requests to `main` or `develop`

**Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js 18
3. ✅ Install dependencies with cache
4. ✅ Run ESLint
5. ✅ Type checking (TypeScript)
6. ✅ Run unit tests
7. ✅ Build Next.js app
8. ✅ Deploy to Vercel (staging/production)
9. ✅ Run Lighthouse performance audit (PRs only)
10. ✅ Send Slack notification

**Environment Variables Required:**
```bash
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
SLACK_WEBHOOK_URL
```

### Backend Workflow (`.github/workflows/backend-deploy.yml`)

**Triggers:**
- Push to `main` (production)
- Push to `develop` (staging)
- Pull requests to `main` or `develop`

**Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js 18
3. ✅ Start PostgreSQL service
4. ✅ Start Redis service
5. ✅ Install dependencies
6. ✅ Run ESLint
7. ✅ Type checking (TypeScript)
8. ✅ Run database migrations
9. ✅ Run unit + integration tests
10. ✅ Build application
11. ✅ Create database backup (production only)
12. ✅ Deploy to Railway/Render
13. ✅ Run health checks
14. ✅ Warm up cache
15. ✅ Rollback on failure
16. ✅ Send Slack notification

**Environment Variables Required:**
```bash
DATABASE_URL
REDIS_URL
JWT_SECRET
RAILWAY_TOKEN (or RENDER_API_KEY)
SLACK_WEBHOOK_URL
```

### Setting Up GitHub Secrets

```bash
# Navigate to repository settings
# Settings → Secrets and variables → Actions → New repository secret

# Add the following secrets:

# Vercel
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>

# Railway (or Render)
RAILWAY_TOKEN=<your-railway-token>

# Database
PRODUCTION_DATABASE_URL=postgresql://...
STAGING_DATABASE_URL=postgresql://...

# Cache
PRODUCTION_REDIS_URL=redis://...
STAGING_REDIS_URL=redis://...

# Authentication
JWT_SECRET=<your-jwt-secret>
CSRF_SECRET=<your-csrf-secret>
SESSION_SECRET=<your-session-secret>

# Notifications
SLACK_WEBHOOK_URL=<your-slack-webhook>

# AWS (for backups)
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_S3_BUCKET=<your-bucket-name>

# Payment
STRIPE_SECRET_KEY=<your-stripe-key>

# Email
SENDGRID_API_KEY=<your-sendgrid-key>
```

---

## Environment Management

### 📁 Files Created

```
.env.example                     # Environment template
```

### Environment Setup

#### 1. Local Development

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local values
# Development values:
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce_dev
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001
```

#### 2. Staging Environment

Set these in your hosting provider (Railway/Render/Vercel):

```bash
NODE_ENV=staging
DATABASE_URL=$STAGING_DATABASE_URL
REDIS_URL=$STAGING_REDIS_URL
FRONTEND_URL=https://staging.yourstore.com
API_URL=https://api-staging.yourstore.com
```

#### 3. Production Environment

```bash
NODE_ENV=production
DATABASE_URL=$PRODUCTION_DATABASE_URL
REDIS_URL=$PRODUCTION_REDIS_URL
FRONTEND_URL=https://yourstore.com
API_URL=https://api.yourstore.com
```

### Environment Variable Management

**Best Practices:**

1. ✅ Never commit `.env` files to Git
2. ✅ Use different secrets for each environment
3. ✅ Rotate secrets regularly (every 90 days)
4. ✅ Use strong, random secrets (64+ characters)
5. ✅ Document all required variables in `.env.example`
6. ✅ Use secret management services (GitHub Secrets, AWS Secrets Manager)

**Generating Secure Secrets:**

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate CSRF secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Database Backup & Restore

### 📁 Scripts Created

```
scripts/
├── backup-database.sh           # Backup script
├── restore-database.sh          # Restore script
└── setup-backups.sh             # Automated backup setup
```

### Backup Strategy

**Automated Backups:**
- Production: Daily at 2:00 AM EST
- Staging: Daily at 3:00 AM EST
- Retention: 30 days
- Storage: Local + AWS S3

**Backup Process:**

```bash
# Manual backup
./scripts/backup-database.sh production

# What it does:
# 1. Creates SQL dump of database
# 2. Compresses with gzip
# 3. Uploads to S3 (if configured)
# 4. Removes backups older than 30 days
# 5. Sends Slack notification
```

### Setting Up Automated Backups

```bash
# Run setup script
./scripts/setup-backups.sh

# This creates cron jobs:
# Production: 0 2 * * * (Daily at 2 AM)
# Staging:    0 3 * * * (Daily at 3 AM)

# Verify cron jobs
crontab -l

# Check backup logs
tail -f /var/log/db-backup.log

# List backups
ls -lh /backups/production/
```

### Restore Procedures

**Restore from Latest Backup:**

```bash
# Restore production database
./scripts/restore-database.sh latest production

# The script will:
# 1. Create safety backup of current database
# 2. Restore from backup file
# 3. Run Prisma migrations
# 4. Verify data integrity
# 5. Send notification
```

**Restore from Specific Backup:**

```bash
# List available backups
ls -lh /backups/production/

# Restore specific backup
./scripts/restore-database.sh /backups/production/backup_20250115_020000.sql.gz
```

**Emergency Restore:**

```bash
# If scripts fail, manual restore:
gunzip -c backup_file.sql.gz | psql $DATABASE_URL

# Then run migrations
cd apps/backend
npx prisma migrate deploy
```

---

## Monitoring & Alerts

### Slack Notifications

**Events Notified:**
- ✅ Deployment started
- ✅ Deployment success
- ❌ Deployment failure
- ✅ Database backup success
- ❌ Database backup failure
- ✅ Database restore success
- ❌ Database restore failure
- ⚠️ Health check failure

**Setup Slack Webhook:**

1. Go to Slack: https://api.slack.com/apps
2. Create new app → "Incoming Webhooks"
3. Activate and create webhook for channel
4. Copy webhook URL
5. Add to GitHub Secrets: `SLACK_WEBHOOK_URL`

### Sentry Error Tracking

**Setup:**

```bash
# Install Sentry
npm install @sentry/node @sentry/nextjs

# Add to .env
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

**Backend Integration:**

```typescript
// apps/backend/src/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Frontend Integration:**

```typescript
// apps/frontend/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Health Monitoring

**Health Check Endpoint:**

```typescript
// Backend: /health
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "storage": "connected"
  },
  "version": "1.2.3"
}
```

**Monitoring Schedule:**
- Post-deployment: Immediate check
- Continuous: Every 5 minutes
- Alerting: 3 failed checks → Slack alert

---

## Security Best Practices

### 🔐 Secret Management

**DO:**
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use environment variables for runtime
- ✅ Rotate secrets every 90 days
- ✅ Use different secrets per environment
- ✅ Generate strong, random secrets (64+ chars)

**DON'T:**
- ❌ Commit secrets to Git
- ❌ Share secrets in chat/email
- ❌ Use weak or predictable secrets
- ❌ Reuse secrets across environments
- ❌ Log secrets in application logs

### 🛡️ Security Scanning

**GitHub Dependabot:**
- Automatically scans for vulnerabilities
- Creates PRs to update dependencies
- Enable in: Settings → Security → Dependabot

**Manual Security Audit:**

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check outdated packages
npm outdated

# Update packages
npm update
```

### 🔒 Access Control

**GitHub Branch Protection:**
1. Settings → Branches → Add rule
2. Branch name pattern: `main`, `develop`
3. Enable:
   - ✅ Require pull request reviews (1+ approvals)
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution
   - ✅ Include administrators
   - ✅ Restrict pushes

**SSH Key Management:**
- Use separate SSH keys per environment
- Rotate keys every 6 months
- Use strong key types (Ed25519, RSA 4096)
- Never share private keys

---

## Deployment Guide

### Initial Setup

#### 1. Setup Hosting Accounts

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd apps/frontend
vercel link

# Get project info
vercel project ls
```

**Backend (Railway):**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd apps/backend
railway init

# Get project info
railway status
```

#### 2. Configure GitHub Secrets

Add all required secrets (see [Environment Management](#environment-management))

#### 3. Setup Databases

**Production Database:**
```bash
# Railway: Add PostgreSQL plugin
railway add --plugin postgresql

# Get connection string
railway variables --plugin postgresql

# Run initial migration
DATABASE_URL=<production-url> npx prisma migrate deploy
```

**Production Redis:**
```bash
# Railway: Add Redis plugin
railway add --plugin redis

# Get connection string
railway variables --plugin redis
```

#### 4. Initial Deployment

```bash
# Push to trigger deployment
git checkout main
git push origin main

# Monitor in GitHub Actions
# https://github.com/your-org/your-repo/actions

# Verify deployment
curl https://api.yourstore.com/health
curl https://yourstore.com
```

### Regular Deployments

**Feature Development:**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create PR on GitHub
# CI/CD runs tests automatically

# After approval, merge to develop
git checkout develop
git merge feature/new-feature
git push origin develop

# Auto-deploys to staging
```

**Production Release:**
```bash
# After testing in staging
git checkout main
git merge develop

# Tag release
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin main --tags

# Auto-deploys to production
# Monitor deployment in GitHub Actions
```

---

## Troubleshooting

### Common Issues

#### 1. Workflow Fails on Test Step

**Problem:** Tests fail in CI but pass locally

**Solutions:**
```bash
# Check for environment differences
# 1. Verify Node version matches CI
node --version

# 2. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Run tests with same command as CI
npm run test:ci

# 4. Check for missing environment variables
env | grep TEST
```

#### 2. Database Migration Fails

**Problem:** Migration fails in CI/CD

**Solutions:**
```bash
# 1. Check migration status
npx prisma migrate status

# 2. Resolve failed migration
npx prisma migrate resolve --applied <migration_name>

# 3. If needed, rollback and reapply
npx prisma migrate reset
npx prisma migrate deploy

# 4. Check for schema conflicts
npx prisma validate
```

#### 3. Deployment Succeeds but Site Down

**Problem:** Deployment completes but health checks fail

**Solutions:**
```bash
# 1. Check application logs
railway logs --tail

# 2. Verify environment variables
railway variables

# 3. Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# 4. Check Redis connection
redis-cli -u $REDIS_URL ping

# 5. Manually test health endpoint
curl -v https://api.yourstore.com/health
```

#### 4. Slack Notifications Not Working

**Problem:** No Slack notifications received

**Solutions:**
```bash
# 1. Verify webhook URL is correct
# Settings → Secrets → Check SLACK_WEBHOOK_URL

# 2. Test webhook manually
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text": "Test message"}'

# 3. Check workflow logs for errors
# GitHub Actions → Select workflow → Check logs
```

### Getting Help

**Debug Checklist:**
1. ✅ Check GitHub Actions logs
2. ✅ Check application logs (Railway/Render)
3. ✅ Verify environment variables
4. ✅ Test database/Redis connectivity
5. ✅ Check Sentry for errors
6. ✅ Review recent code changes
7. ✅ Check service status pages

**Useful Commands:**
```bash
# View recent deployments
vercel ls
railway status

# View logs
railway logs --tail
vercel logs --follow

# Check service health
curl https://api.yourstore.com/health

# Test database
psql $DATABASE_URL -c "SELECT version();"

# Test Redis
redis-cli -u $REDIS_URL ping
```

---

## Maintenance

### Regular Tasks

#### Daily
- ✅ Monitor error rates in Sentry
- ✅ Check Slack for deployment notifications
- ✅ Review application logs for anomalies

#### Weekly
- ✅ Review backup logs
- ✅ Check database performance metrics
- ✅ Review and merge Dependabot PRs
- ✅ Monitor resource usage (CPU, memory, storage)

#### Monthly
- ✅ Security audit (`npm audit`)
- ✅ Update dependencies
- ✅ Review and optimize database queries
- ✅ Clean up old branches
- ✅ Review access logs

#### Quarterly
- ✅ Rotate secrets (JWT, CSRF, sessions)
- ✅ Update SSL/TLS certificates (if manual)
- ✅ Review and update documentation
- ✅ Performance audit
- ✅ Disaster recovery drill

### Cost Optimization

**Tips:**
- Use connection pooling for databases
- Enable Redis caching to reduce DB load
- Optimize images and use CDN
- Monitor and optimize API usage
- Use appropriate instance sizes
- Review and remove unused resources

---

## Next Steps

### Recommended Improvements

1. **Advanced Monitoring**
   - Setup Prometheus + Grafana
   - Add custom metrics
   - Create alerting rules

2. **Enhanced Security**
   - Implement WAF (Cloudflare)
   - Add DDoS protection
   - Setup security headers

3. **Performance**
   - Implement edge caching
   - Add GraphQL for flexible queries
   - Optimize bundle sizes

4. **Testing**
   - Increase test coverage to 90%+
   - Add visual regression testing
   - Implement load testing

5. **Infrastructure**
   - Setup Kubernetes for scaling
   - Implement blue-green deployments
   - Add canary releases

---

## Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Tools
- [Vercel CLI](https://vercel.com/cli)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

### Support
- [GitHub Support](https://support.github.com)
- [Vercel Support](https://vercel.com/support)
- [Railway Support](https://railway.app/help)

---

## Summary

Phase 13 delivers a production-ready CI/CD pipeline with:

✅ **Automated Deployment** - Push code → Tests → Deploy → Verify  
✅ **Multi-Environment** - Dev, Staging, Production  
✅ **Database Management** - Migrations, backups, restore  
✅ **Monitoring** - Slack alerts, Sentry, health checks  
✅ **Security** - Secret management, vulnerability scanning  
✅ **Documentation** - Runbooks, troubleshooting guides  

The platform is now ready for continuous delivery with confidence! 🚀

---

**Phase 13 Status:** ✅ **COMPLETE**

Ready to move to Phase 14 or start deploying to production!
