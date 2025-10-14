# 🚀 Only Thing - Deployment Quick Start

## 📝 What We've Prepared

Your complete e-commerce platform is ready for deployment with:

✅ **Enhanced `.gitignore`** - Protects all sensitive files
✅ **Complete Deployment Guide** - Step-by-step instructions  
✅ **Deployment Checklist** - Quick reference for each step
✅ **Environment Variables Template** - Reference for all configs

---

## 🎯 Deployment Plan Overview

### **Architecture**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Frontend (Next.js 14)                         │
│  ↓ Deployed on VERCEL                          │
│  └─ https://your-app.vercel.app                │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 ↓
┌─────────────────────────────────────────────────┐
│                                                 │
│  Backend (Fastify API)                         │
│  ↓ Deployed on AWS EC2                         │
│  └─ https://api.onlything.com                  │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ Database Queries
                 ↓
┌─────────────────────────────────────────────────┐
│                                                 │
│  PostgreSQL Database                           │
│  ↓ AWS RDS / Neon / Supabase                  │
│  └─ Production Database                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start Commands

### Step 1: Push to GitHub

```powershell
# Navigate to project
cd D:\DESKTOP-L\OT

# Check status (verify .env files are NOT listed)
git status

# Initialize and commit
git init
git add .
git commit -m "Initial commit: Complete Only Thing platform"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/only-thing-wellness.git
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

**Via Dashboard** (Easiest):
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Root Directory: `apps/frontend`
   - Framework: Next.js
6. Add environment variables (see checklist)
7. Deploy!

**Via CLI**:
```powershell
npm install -g vercel
cd apps/frontend
vercel login
vercel --prod
```

### Step 3: Deploy Backend to AWS

**Quick Setup** (via EC2):
```bash
# On EC2 instance (after SSH):
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2

git clone https://github.com/YOUR_USERNAME/only-thing-wellness.git
cd only-thing-wellness/apps/backend
npm install
npm run db:generate
npm run build
pm2 start dist/server.js --name only-thing-backend
pm2 save
pm2 startup
```

### Step 4: Setup Database

**Neon.tech** (Easiest):
1. Sign up at [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Add to backend `.env` as `DATABASE_URL`

**Then run migrations**:
```bash
npm run db:migrate
```

---

## 🔑 Critical Environment Variables

### Frontend (Vercel Dashboard)

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Backend (EC2 .env file)

```env
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET=your-super-secure-secret-32-chars+
JWT_REFRESH_SECRET=your-refresh-secret-32-chars+
FRONTEND_URL=https://your-vercel-app.vercel.app
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
GOOGLE_REDIRECT_URI=https://your-api.com/api/auth/google/callback
STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
```

---

## ✅ Pre-Deployment Checklist

Run these commands before pushing:

```powershell
# Check what will be committed
git status

# Verify no .env files are showing
# Should see: .gitignore, source files, configs

# Security audit
npm audit

# Test locally one more time
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 3001
```

---

## 📚 Documentation Files

1. **`DEPLOYMENT_GUIDE.md`** - Complete step-by-step guide (653 lines)
2. **`DEPLOYMENT_CHECKLIST.md`** - Quick checklist for each step
3. **`.gitignore`** - Protects sensitive files (comprehensive)
4. **`.env.example`** - Template for environment variables

---

## 🎯 Recommended Deployment Order

1. **GitHub** (5 minutes)
   - Push code to repository
   
2. **Database** (10 minutes)
   - Setup PostgreSQL on Neon/Supabase
   - Get connection string
   
3. **Backend** (30-45 minutes)
   - Launch AWS EC2
   - Deploy code
   - Configure environment
   - Run migrations
   - Start with PM2
   
4. **Frontend** (10 minutes)
   - Deploy to Vercel
   - Configure environment variables
   - Test deployment

5. **Final Setup** (15 minutes)
   - Update Google OAuth URLs
   - Configure Stripe webhooks
   - Test complete flow
   - Setup custom domains

**Total Time**: ~1-2 hours for first deployment

---

## 🔒 Security Reminders

❌ **NEVER COMMIT**:
- `.env` files
- API keys or secrets
- Database passwords
- Private keys (.pem, .key)
- `node_modules/`

✅ **SAFE TO COMMIT**:
- Source code
- `.gitignore`
- `.env.example` (template only)
- Public assets
- Documentation

---

## 🆘 Troubleshooting

### "Files not being ignored"
```powershell
# Clear git cache
git rm -r --cached .
git add .
git commit -m "Fix gitignore"
```

### "Can't connect to database"
- Verify DATABASE_URL format
- Check security group/firewall rules
- Test connection: `psql $DATABASE_URL`

### "CORS errors on frontend"
- Add Vercel URL to `ALLOWED_ORIGINS` in backend
- Update `FRONTEND_URL` environment variable

### "Google OAuth not working"
- Update redirect URIs in Google Console
- Match GOOGLE_REDIRECT_URI exactly
- Use production URLs (https://)

---

## 📞 Getting Help

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Refer to `DEPLOYMENT_CHECKLIST.md` for quick reference
3. Platform documentation:
   - Vercel: https://vercel.com/docs
   - AWS: https://docs.aws.amazon.com/ec2/
   - Prisma: https://www.prisma.io/docs

---

## 🎉 You're Ready!

Everything is prepared for deployment. Follow the steps in order:

1. ✅ `.gitignore` configured
2. ✅ Documentation ready
3. ✅ Code tested locally
4. ✅ Environment variables documented

**Next step**: Run the GitHub commands above and begin deployment!

Good luck! 🚀

---

**Project**: Only Thing Health & Wellness  
**Stack**: Next.js 14 + Fastify + PostgreSQL + Prisma  
**Deployment**: Vercel + AWS EC2 + RDS/Neon
