# 🚀 Complete Deployment Guide - Only Thing

This guide covers deploying your application to production with:
- **Frontend**: Next.js on Vercel
- **Backend**: Fastify on AWS (EC2 or Elastic Beanstalk)
- **Database**: PostgreSQL (AWS RDS or managed service)

---

## 📋 Pre-Deployment Checklist

### ✅ Before You Start:

1. **Git Repository Ready**
   - [ ] `.gitignore` is properly configured
   - [ ] All sensitive files are excluded
   - [ ] Code is tested locally
   - [ ] No `.env` files in repo

2. **Environment Variables Documented**
   - [ ] All required environment variables listed
   - [ ] Separate configs for development and production
   - [ ] Database URLs ready
   - [ ] API keys secured

3. **Dependencies Updated**
   - [ ] All packages installed
   - [ ] No security vulnerabilities (`npm audit`)
   - [ ] Production-ready configurations

---

## 📦 STEP 1: Push to GitHub

### 1.1 Initialize Git Repository (if not already done)

```powershell
# Navigate to your project root
cd D:\DESKTOP-L\OT

# Initialize git (if not done)
git init

# Check current status
git status
```

### 1.2 Add Files to Git

```powershell
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status
```

### 1.3 Create First Commit

```powershell
# Commit with meaningful message
git commit -m "Initial commit: Complete Only Thing e-commerce platform

- Frontend: Next.js 14 with Emotion styled components
- Backend: Fastify API with Prisma ORM
- Authentication: JWT + Google OAuth
- Database: PostgreSQL with Prisma
- Product management: 7 products configured
- Pages: Home, Products, About, FAQ, Privacy, Terms
- Features: User auth, cart, checkout, admin panel"
```

### 1.4 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New Repository"**
3. Repository settings:
   - **Name**: `only-thing-wellness` (or your preferred name)
   - **Description**: "Premium health & wellness e-commerce platform"
   - **Visibility**: Private (recommended for production)
   - **DO NOT** initialize with README (you have one)

### 1.5 Push to GitHub

```powershell
# Add remote origin (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/only-thing-wellness.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main

# If your default branch is 'master', use:
# git branch -M main
# git push -u origin main
```

---

## 🎨 STEP 2: Deploy Frontend to Vercel

### 2.1 Prepare Frontend for Vercel

#### Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/frontend/$1"
    }
  ]
}
```

### 2.2 Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Option B: Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd apps/frontend

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

### 2.3 Configure Environment Variables on Vercel

Go to: **Project Settings → Environment Variables**

Add these variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Sanity CMS (if using)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Stripe (Payment)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Google OAuth (Frontend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**IMPORTANT**: 
- Use production keys for production environment
- Never commit these to Git
- Set for all environments: Production, Preview, Development

### 2.4 Configure Custom Domain (Optional)

1. Go to **Project Settings → Domains**
2. Add your domain: `www.onlything.com`
3. Update DNS records as instructed by Vercel
4. Wait for SSL certificate (automatic)

---

## 🖥️ STEP 3: Deploy Backend to AWS

### Option A: AWS EC2 (Recommended for Full Control)

#### 3.1 Launch EC2 Instance

1. **AWS Console → EC2 → Launch Instance**

2. **Configuration**:
   - **Name**: `only-thing-backend-production`
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t3.small (or t3.medium for production)
   - **Key Pair**: Create new or use existing (save `.pem` file securely)
   - **Security Group**: 
     - SSH (22) - Your IP only
     - HTTP (80) - 0.0.0.0/0
     - HTTPS (443) - 0.0.0.0/0
     - Custom TCP (3001) - 0.0.0.0/0 (or your backend port)

3. **Storage**: 20 GB gp3 (minimum)

4. Click **Launch Instance**

#### 3.2 Connect to EC2 Instance

```powershell
# On Windows (PowerShell)
# First, set permissions on .pem file
icacls "your-key.pem" /inheritance:r
icacls "your-key.pem" /grant:r "%username%:R"

# Connect via SSH
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

#### 3.3 Setup Server Environment

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install PostgreSQL client (if using RDS)
sudo apt install -y postgresql-client
```

#### 3.4 Deploy Backend Code

```bash
# Clone your repository
git clone https://github.com/USERNAME/only-thing-wellness.git
cd only-thing-wellness/apps/backend

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate
```

#### 3.5 Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add these variables:

```env
# Server
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database (AWS RDS PostgreSQL)
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/onlything?schema=public"

# JWT Secrets
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-at-least-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://www.onlything.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-api.com/api/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@onlything.com

# Razorpay (if using)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

Save file: `Ctrl + X`, `Y`, `Enter`

#### 3.6 Build and Run Database Migrations

```bash
# Build TypeScript
npm run build

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

#### 3.7 Start Backend with PM2

```bash
# Start application
pm2 start dist/server.js --name "only-thing-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Run the command it outputs

# Check status
pm2 status

# View logs
pm2 logs only-thing-backend

# Monitor
pm2 monit
```

#### 3.8 Setup Nginx as Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/only-thing-backend
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name api.onlything.com;  # Your backend domain

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/only-thing-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

#### 3.9 Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.onlything.com

# Auto-renewal is setup automatically
# Test renewal
sudo certbot renew --dry-run
```

### Option B: AWS Elastic Beanstalk (Easier Management)

#### 3.1 Install EB CLI

```powershell
# Install EB CLI
pip install awsebcli --upgrade --user
```

#### 3.2 Initialize EB Application

```powershell
cd apps/backend

# Initialize EB
eb init

# Follow prompts:
# - Region: Choose closest
# - Application name: only-thing-backend
# - Platform: Node.js
# - SSH: Yes
```

#### 3.3 Create Environment

```powershell
# Create production environment
eb create only-thing-production --instance-type t3.small

# Set environment variables
eb setenv NODE_ENV=production `
  PORT=8080 `
  DATABASE_URL="your_database_url" `
  JWT_SECRET="your_jwt_secret" `
  FRONTEND_URL="https://your-vercel-app.vercel.app"

# Deploy
eb deploy

# Open in browser
eb open
```

---

## 🗄️ STEP 4: Setup PostgreSQL Database

### Option A: AWS RDS (Recommended)

1. **AWS Console → RDS → Create Database**

2. **Configuration**:
   - **Engine**: PostgreSQL 15
   - **Template**: Production
   - **DB Instance**: db.t3.micro (start small)
   - **Master Username**: `onlythingadmin`
   - **Master Password**: (strong password)
   - **Public Access**: No (only EC2 can access)
   - **VPC Security Group**: Allow PostgreSQL (5432) from EC2 security group

3. **Get Connection String**:
   ```
   postgresql://username:password@endpoint:5432/database_name
   ```

4. **Update Backend .env** with DATABASE_URL

### Option B: Neon.tech (Serverless PostgreSQL)

1. Go to [Neon.tech](https://neon.tech)
2. Create account
3. Create new project: "only-thing-production"
4. Copy connection string
5. Update backend DATABASE_URL

### Option C: Supabase (PostgreSQL + Backend Services)

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get connection string from settings
4. Update backend DATABASE_URL

---

## 🔐 STEP 5: Security & Final Checks

### 5.1 Security Checklist

- [ ] All environment variables set in production
- [ ] No `.env` files committed to Git
- [ ] CORS configured with frontend URL only
- [ ] Rate limiting enabled on backend
- [ ] SSL/HTTPS enabled on all domains
- [ ] Database has strong password
- [ ] Firewall rules restrict access
- [ ] JWT secrets are strong (32+ characters)
- [ ] Google OAuth redirect URIs updated

### 5.2 Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth application
3. **Authorized JavaScript origins**:
   - `https://your-vercel-app.vercel.app`
   - `https://www.onlything.com`
4. **Authorized redirect URIs**:
   - `https://your-backend-api.com/api/auth/google/callback`

### 5.3 Update Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → Webhooks → Add endpoint
3. Endpoint URL: `https://your-backend-api.com/api/webhooks/stripe`
4. Select events to listen to
5. Copy webhook secret to backend env

---

## 🧪 STEP 6: Testing Production

### 6.1 Frontend Tests

```
✓ Visit your Vercel URL
✓ Check all pages load
✓ Test user registration
✓ Test login (email + Google)
✓ Test product pages
✓ Test add to cart
✓ Test checkout flow
✓ Verify email notifications
```

### 6.2 Backend API Tests

```bash
# Health check
curl https://your-backend-api.com/health

# Test authentication
curl -X POST https://your-backend-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## 📊 STEP 7: Monitoring & Maintenance

### 7.1 Setup Monitoring

**Vercel**:
- Built-in analytics in dashboard
- View logs in real-time
- Monitor performance

**AWS/EC2**:
```bash
# View PM2 logs
pm2 logs

# Monitor resources
pm2 monit

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 7.2 Setup Alerts

- Configure AWS CloudWatch alarms
- Setup Vercel deployment notifications
- Monitor database connections

### 7.3 Backup Strategy

**Database Backups**:
```bash
# Manual backup
pg_dump DATABASE_URL > backup.sql

# Setup automated backups (AWS RDS has this built-in)
```

---

## 🔄 STEP 8: Future Updates & CI/CD

### Update Workflow

```powershell
# Make changes locally
git add .
git commit -m "Feature: Add new product"
git push origin main

# Vercel auto-deploys frontend
# For backend on EC2:
ssh -i your-key.pem ubuntu@your-ec2-ip
cd only-thing-wellness
git pull
cd apps/backend
npm install
npm run build
pm2 restart only-thing-backend
```

### Setup GitHub Actions (Optional CI/CD)

Create `.github/workflows/deploy.yml` for automated deployments.

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **AWS Docs**: https://docs.aws.amazon.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Deployment Complete!

Your application is now live:
- 🌐 Frontend: https://your-app.vercel.app
- 🔌 Backend: https://your-backend-api.com
- 🗄️ Database: Running on AWS RDS/Neon/Supabase

**Next Steps**:
1. Point custom domain to Vercel
2. Setup monitoring and alerts
3. Configure automated backups
4. Add staging environment
5. Setup CI/CD pipeline

🎉 **Congratulations! You're now in production!**
