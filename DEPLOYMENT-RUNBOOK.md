# 🚀 Deployment Runbook

**Version:** 1.0  
**Last Updated:** January 2025  
**Project:** E-commerce Platform

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deployment Procedures](#deployment-procedures)
4. [Rollback Procedures](#rollback-procedures)
5. [Troubleshooting](#troubleshooting)
6. [Emergency Contacts](#emergency-contacts)

---

## Overview

This runbook provides step-by-step instructions for deploying the e-commerce platform to staging and production environments.

### Architecture

```
┌─────────────────────────────────────────────────┐
│                    Users                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              Cloudflare CDN                     │
└─────────────────────────────────────────────────┘
                      ↓
        ┌─────────────────────────┐
        │                         │
┌───────▼─────────┐     ┌────────▼────────┐
│  Vercel         │     │  Railway/Render │
│  (Frontend)     │────▶│  (Backend API)  │
│  Next.js        │     │  Fastify        │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
            ┌───────▼───┐  ┌────▼────┐  ┌────▼────┐
            │ PostgreSQL│  │  Redis  │  │   S3    │
            │ (Database)│  │ (Cache) │  │(Storage)│
            └───────────┘  └─────────┘  └─────────┘
```

### Environments

| Environment | Frontend URL | Backend URL | Database | Purpose |
|-------------|-------------|-------------|----------|---------|
| **Development** | localhost:3000 | localhost:3001 | Local PostgreSQL | Local development |
| **Staging** | staging.yourstore.com | api-staging.yourstore.com | Staging DB | Testing/QA |
| **Production** | yourstore.com | api.yourstore.com | Production DB | Live environment |

---

## Pre-Deployment Checklist

### 📋 Before Every Deployment

- [ ] All CI/CD tests passing on the target branch
- [ ] Code reviewed and approved by at least one team member
- [ ] Database migrations tested in staging
- [ ] Environment variables configured correctly
- [ ] Backup of production database created
- [ ] Stakeholders notified of deployment window
- [ ] Rollback plan prepared and understood
- [ ] Monitoring dashboards open and ready

### 📝 Documentation Requirements

- [ ] CHANGELOG.md updated with new changes
- [ ] API documentation updated (if applicable)
- [ ] Migration notes documented
- [ ] Known issues documented

### 🧪 Testing Requirements

- [ ] Unit tests passing (100% on critical paths)
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Performance tests completed
- [ ] Security scan completed (no critical vulnerabilities)
- [ ] Lighthouse score > 90 (frontend)

### 🔐 Security Checklist

- [ ] No secrets in code or environment variables committed
- [ ] Dependencies updated and vulnerabilities patched
- [ ] CORS settings verified
- [ ] Rate limiting configured
- [ ] HTTPS/TLS certificates valid

---

## Deployment Procedures

### 🎯 Automated Deployment (Recommended)

#### Staging Deployment

```bash
# 1. Merge changes to develop branch
git checkout develop
git pull origin develop
git merge feature/your-feature-branch

# 2. Push to trigger CI/CD
git push origin develop

# 3. Monitor deployment
# - Check GitHub Actions: https://github.com/your-org/your-repo/actions
# - Frontend: Automatically deploys to staging.yourstore.com
# - Backend: Automatically deploys to api-staging.yourstore.com

# 4. Verify deployment
curl https://api-staging.yourstore.com/health
```

**GitHub Actions will automatically:**
- Run all tests
- Execute database migrations
- Deploy frontend to Vercel staging
- Deploy backend to Railway/Render staging
- Run health checks
- Send Slack notification

#### Production Deployment

```bash
# 1. Create release branch
git checkout main
git pull origin main
git merge develop

# 2. Tag the release
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin main --tags

# 3. Monitor deployment
# GitHub Actions will automatically deploy to production

# 4. Verify deployment
curl https://api.yourstore.com/health
```

---

### 🛠️ Manual Deployment (Emergency Only)

#### Frontend Manual Deployment

```bash
# 1. Navigate to frontend directory
cd apps/frontend

# 2. Install dependencies
npm install

# 3. Build application
npm run build

# 4. Deploy to Vercel
vercel --prod

# 5. Verify deployment
curl https://yourstore.com
```

#### Backend Manual Deployment

```bash
# 1. Navigate to backend directory
cd apps/backend

# 2. Install dependencies
npm install

# 3. Run database migrations
npx prisma migrate deploy

# 4. Build application
npm run build

# 5. Deploy to Railway
railway up --environment production

# OR Deploy to Render
render deploy --app your-backend-app

# 6. Verify deployment
curl https://api.yourstore.com/health
```

---

### 🗄️ Database Migration Deployment

#### Staging Migration

```bash
# 1. SSH to staging server or use Railway/Render CLI
railway run --environment staging bash

# 2. Backup database
./scripts/backup-database.sh staging

# 3. Run migrations
cd apps/backend
npx prisma migrate deploy

# 4. Verify migration
npx prisma db pull
npx prisma studio  # Check data integrity

# 5. Seed data (if needed)
npm run db:seed
```

#### Production Migration

```bash
# 1. Create backup (CRITICAL)
./scripts/backup-database.sh production

# 2. Enable maintenance mode (if applicable)
# Set MAINTENANCE_MODE=true in environment

# 3. Run migrations
railway run --environment production bash
cd apps/backend
npx prisma migrate deploy

# 4. Verify migration
npx prisma db pull

# 5. Disable maintenance mode
# Set MAINTENANCE_MODE=false in environment

# 6. Monitor for errors
tail -f /var/log/app.log
```

---

### 📦 Post-Deployment Verification

#### Automated Health Checks

The CI/CD pipeline automatically runs these checks:

```bash
# Backend health check
curl https://api.yourstore.com/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2025-01-15T10:00:00Z",
#   "services": {
#     "database": "connected",
#     "redis": "connected"
#   }
# }

# Frontend health check
curl https://yourstore.com

# Expected: 200 OK
```

#### Manual Verification Steps

1. **Frontend Verification**
   ```bash
   # Check homepage loads
   curl -I https://yourstore.com
   
   # Check key pages
   curl -I https://yourstore.com/products
   curl -I https://yourstore.com/checkout
   ```

2. **Backend Verification**
   ```bash
   # Check API endpoints
   curl https://api.yourstore.com/api/products
   curl https://api.yourstore.com/api/categories
   
   # Check authentication
   curl -X POST https://api.yourstore.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

3. **Database Verification**
   ```bash
   # Connect to database
   psql $DATABASE_URL
   
   # Check migrations
   SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 5;
   
   # Check record counts
   SELECT COUNT(*) FROM "User";
   SELECT COUNT(*) FROM "Product";
   SELECT COUNT(*) FROM "Order";
   ```

4. **Performance Verification**
   - Run Lighthouse audit: https://web.dev/measure
   - Check response times in monitoring dashboard
   - Verify CDN cache hit rate
   - Check database query performance

5. **User Acceptance Testing**
   - [ ] User registration works
   - [ ] User login works
   - [ ] Product browsing works
   - [ ] Search functionality works
   - [ ] Cart functionality works
   - [ ] Checkout process works
   - [ ] Payment processing works
   - [ ] Order confirmation emails sent

---

## Rollback Procedures

### 🔄 Automated Rollback

If health checks fail, GitHub Actions will automatically rollback.

### 🔴 Manual Rollback

#### Frontend Rollback

```bash
# Option 1: Revert to previous deployment in Vercel
vercel rollback https://yourstore.com

# Option 2: Redeploy previous version
git checkout v1.2.2  # Previous stable version
cd apps/frontend
vercel --prod

# Verify rollback
curl https://yourstore.com
```

#### Backend Rollback

```bash
# Option 1: Rollback in Railway/Render dashboard
# Navigate to: Deployments → Select previous deployment → Rollback

# Option 2: Redeploy previous version
git checkout v1.2.2
cd apps/backend
railway up --environment production

# Verify rollback
curl https://api.yourstore.com/health
```

#### Database Rollback

```bash
# 1. Stop application (prevent new writes)
railway down --environment production

# 2. Restore from backup
./scripts/restore-database.sh /backups/production/backup_20250115_020000.sql.gz

# 3. Verify restoration
psql $DATABASE_URL
SELECT COUNT(*) FROM "User";
SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC LIMIT 5;

# 4. Restart application
railway up --environment production

# 5. Monitor for errors
tail -f /var/log/app.log
```

---

## Troubleshooting

### 🐛 Common Issues

#### Issue: Deployment Fails During Build

**Symptoms:**
```
Error: Build failed with exit code 1
npm ERR! code ELIFECYCLE
```

**Solutions:**
1. Check build logs in GitHub Actions
2. Verify all dependencies are installed
3. Check for TypeScript errors: `npm run type-check`
4. Clear build cache: `npm run clean && npm install`
5. Check Node version compatibility

#### Issue: Database Migration Fails

**Symptoms:**
```
Error: Migration failed to apply cleanly
P3009: migrate found failed migration
```

**Solutions:**
1. Check migration logs
2. Resolve migration manually:
   ```bash
   npx prisma migrate resolve --applied <migration_name>
   ```
3. If needed, rollback and reapply:
   ```bash
   ./scripts/restore-database.sh latest
   npx prisma migrate deploy
   ```

#### Issue: Health Check Fails

**Symptoms:**
```
Health check endpoint returns 500 or timeout
```

**Solutions:**
1. Check application logs:
   ```bash
   railway logs --environment production
   ```
2. Verify environment variables:
   ```bash
   railway variables --environment production
   ```
3. Check database connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   ```
4. Check Redis connection:
   ```bash
   redis-cli -u $REDIS_URL ping
   ```

#### Issue: Frontend Shows Old Version

**Symptoms:**
- Users see old UI after deployment

**Solutions:**
1. Clear CDN cache:
   ```bash
   # Cloudflare cache purge
   curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"purge_everything":true}'
   ```
2. Clear browser cache (Ctrl+Shift+R)
3. Verify deployment in Vercel dashboard

#### Issue: High Error Rate After Deployment

**Symptoms:**
- Sentry shows spike in errors
- Users reporting issues

**Solutions:**
1. **Immediate action:** Rollback to previous version
2. Check error logs in Sentry
3. Review recent code changes
4. Check for missing environment variables
5. Verify third-party service availability

#### Issue: Slow Performance After Deployment

**Symptoms:**
- Increased response times
- Slow page loads

**Solutions:**
1. Check database query performance:
   ```sql
   SELECT query, mean_exec_time, calls 
   FROM pg_stat_statements 
   ORDER BY mean_exec_time DESC 
   LIMIT 10;
   ```
2. Verify Redis cache is working:
   ```bash
   redis-cli -u $REDIS_URL INFO stats
   ```
3. Check for N+1 queries in logs
4. Review recent code changes for performance impact
5. Scale up resources if needed

---

### 🔍 Debugging Tools

#### Application Logs

```bash
# Railway logs
railway logs --environment production --tail

# Render logs
render logs --app your-backend-app --follow

# Frontend logs (Vercel)
vercel logs yourstore.com --follow
```

#### Database Debugging

```bash
# Connect to database
psql $DATABASE_URL

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

# Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Cache Debugging

```bash
# Connect to Redis
redis-cli -u $REDIS_URL

# Check cache statistics
INFO stats

# Check memory usage
INFO memory

# List keys matching pattern
KEYS product:*

# Get cache hit rate
INFO stats | grep keyspace
```

---

## Emergency Contacts

### 👥 Team Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| **Lead Developer** | [Name] | [Email/Phone] | 24/7 |
| **DevOps Engineer** | [Name] | [Email/Phone] | 24/7 |
| **Database Admin** | [Name] | [Email/Phone] | Business hours |
| **Product Manager** | [Name] | [Email/Phone] | Business hours |

### 🆘 Service Providers

| Service | Support | Documentation |
|---------|---------|---------------|
| **Vercel** | https://vercel.com/support | https://vercel.com/docs |
| **Railway** | https://railway.app/help | https://docs.railway.app |
| **Render** | https://render.com/support | https://render.com/docs |
| **AWS** | https://aws.amazon.com/support | https://docs.aws.amazon.com |
| **Stripe** | https://support.stripe.com | https://stripe.com/docs |

### 📊 Monitoring Dashboards

- **Application Performance:** [Sentry Dashboard URL]
- **Infrastructure:** [Railway/Render Dashboard URL]
- **Database:** [Database Dashboard URL]
- **CDN:** [Cloudflare Dashboard URL]
- **Analytics:** [Google Analytics URL]

---

## Deployment Schedule

### 🗓️ Recommended Deployment Windows

- **Staging:** Anytime (continuous deployment)
- **Production:** Tuesday-Thursday, 10:00 AM - 2:00 PM EST
- **Emergency Fixes:** Anytime (with approval)

### ⏰ Maintenance Windows

- **Database Maintenance:** Sunday 2:00 AM - 4:00 AM EST
- **Infrastructure Updates:** Last Sunday of month, 2:00 AM EST

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | DevOps Team | Initial runbook |

---

## Appendix

### Useful Commands

```bash
# Check deployment status
railway status --environment production

# View environment variables
railway variables --environment production

# Scale application
railway scale --replicas 3 --environment production

# View database backups
ls -lh /backups/production/

# Test API endpoint
curl -X GET https://api.yourstore.com/api/health \
  -H "Content-Type: application/json"

# Generate secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Emergency Procedures Quick Reference

```bash
# EMERGENCY ROLLBACK
git checkout v1.2.2
vercel --prod
railway up --environment production

# EMERGENCY DATABASE RESTORE
./scripts/restore-database.sh latest production

# ENABLE MAINTENANCE MODE
railway variables set MAINTENANCE_MODE=true

# CHECK SYSTEM STATUS
curl https://api.yourstore.com/health
railway logs --environment production --tail
```

---

**Remember:** When in doubt, rollback first, debug later. User experience is paramount.
