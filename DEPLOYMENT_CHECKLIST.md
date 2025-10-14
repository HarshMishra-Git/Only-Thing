# 📋 Quick Deployment Checklist

## Before Pushing to GitHub

- [ ] Run `git status` to check what files will be committed
- [ ] Verify `.gitignore` is working (no `.env` files showing)
- [ ] Test application locally one more time
- [ ] Remove any console.logs or debug code
- [ ] Check for any hardcoded secrets or API keys
- [ ] Run `npm audit` to check for vulnerabilities

## GitHub Setup

- [ ] Create new private repository on GitHub
- [ ] Run `git init` (if not done)
- [ ] Run `git add .`
- [ ] Run `git commit -m "Initial commit: Complete Only Thing platform"`
- [ ] Run `git remote add origin https://github.com/USERNAME/only-thing-wellness.git`
- [ ] Run `git push -u origin main`

## Vercel Deployment (Frontend)

- [ ] Sign up/login to Vercel
- [ ] Import GitHub repository
- [ ] Set root directory to `apps/frontend`
- [ ] Configure environment variables:
  - [ ] NEXT_PUBLIC_API_URL
  - [ ] NEXT_PUBLIC_GOOGLE_CLIENT_ID
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [ ] NEXT_PUBLIC_SANITY_PROJECT_ID (if using)
- [ ] Deploy and test
- [ ] Configure custom domain (optional)

## AWS Deployment (Backend)

- [ ] Create AWS account
- [ ] Launch EC2 instance (t3.small Ubuntu)
- [ ] Configure security groups (ports 22, 80, 443, 3001)
- [ ] SSH into server
- [ ] Install Node.js, PM2, Nginx
- [ ] Clone repository
- [ ] Create .env file with production values
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Setup database connection
- [ ] Run migrations: `npm run db:migrate`
- [ ] Start with PM2: `pm2 start dist/server.js`
- [ ] Configure Nginx reverse proxy
- [ ] Setup SSL with Let's Encrypt

## Database Setup

Choose one option:
- [ ] AWS RDS (PostgreSQL)
- [ ] Neon.tech (Serverless)
- [ ] Supabase

- [ ] Create database instance
- [ ] Get connection string
- [ ] Update DATABASE_URL in backend .env
- [ ] Test connection
- [ ] Run migrations

## Security Configuration

- [ ] Update Google OAuth redirect URIs
- [ ] Update Stripe webhook URLs
- [ ] Configure CORS with production URLs
- [ ] Verify all secrets are secure
- [ ] Enable rate limiting
- [ ] Setup SSL certificates

## Final Testing

- [ ] Test frontend loads on Vercel URL
- [ ] Test all pages (Home, Products, About, etc.)
- [ ] Test user registration
- [ ] Test email/password login
- [ ] Test Google OAuth login
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test backend API endpoints
- [ ] Verify email notifications work
- [ ] Check mobile responsiveness

## Post-Deployment

- [ ] Setup monitoring (AWS CloudWatch, Vercel Analytics)
- [ ] Configure automated backups
- [ ] Document any issues found
- [ ] Update README with deployment info
- [ ] Setup staging environment
- [ ] Configure CI/CD pipeline (optional)

## Environment Variables Reference

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SANITY_PROJECT_ID
```

### Backend (AWS)
```
NODE_ENV
PORT
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
STRIPE_SECRET_KEY
RESEND_API_KEY
```

## Important Notes

⚠️ **NEVER commit these files:**
- `.env`
- `.env.local`
- `.env.production`
- `node_modules/`
- `.next/`
- `dist/`

✅ **Safe to commit:**
- `.env.example`
- Source code
- Public assets
- Configuration files (without secrets)

## Need Help?

Refer to `DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions.

---

**Last Updated**: 2025-01-14
