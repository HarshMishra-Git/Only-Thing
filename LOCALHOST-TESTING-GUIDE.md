# 🧪 Only Thing - Localhost Testing Guide

**Purpose:** Step-by-step guide to verify all features work correctly in your browser  
**Date:** January 2025

---

## 📋 Pre-Flight Checklist

Before starting the servers, ensure these are ready:

### ✅ 1. Environment Variables

**Backend (.env file location: `D:\DESKTOP-L\OT\apps\backend\.env`)**

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/onlything?schema=public"

# JWT (Required)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"

# Razorpay (Optional - for India payments)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxx"
RAZORPAY_WEBHOOK_SECRET="xxxxxxxxxxxxx"

# Server
PORT=3001
NODE_ENV=development
```

**Frontend (.env.local file location: `D:\DESKTOP-L\OT\apps\frontend\.env.local`)**

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_xxxxxxxxxxxxx"

# Razorpay Public Key (Optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
```

---

## 🚀 Step 1: Start Database (PostgreSQL)

### If you have PostgreSQL installed locally:

```powershell
# Check if PostgreSQL is running
Get-Service -Name postgresql*

# If not running, start it
Start-Service -Name postgresql-x64-14  # Adjust version number
```

### If you're using Docker:

```powershell
# Start PostgreSQL in Docker
docker run --name onlything-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=onlything -p 5432:5432 -d postgres:15
```

### Verify database connection:

```powershell
# Test connection
cd D:\DESKTOP-L\OT\apps\backend
npx prisma db push
```

**Expected Output:** ✅ "Database schema in sync"

---

## 🚀 Step 2: Install Dependencies

```powershell
# Navigate to project root
cd D:\DESKTOP-L\OT

# Install all dependencies (monorepo)
npm install

# If Razorpay not installed yet
cd apps\backend
npm install razorpay
cd ..\..
```

**Expected Output:** ✅ "added X packages" (no errors)

---

## 🚀 Step 3: Run Database Migrations

```powershell
cd D:\DESKTOP-L\OT\apps\backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database with sample data
npm run seed
```

**Expected Output:** ✅ "Migration applied successfully"

---

## 🚀 Step 4: Start Backend Server

### Terminal 1 (Backend):

```powershell
cd D:\DESKTOP-L\OT\apps\backend
npm run dev
```

**Expected Output:**
```
✓ Fastify server listening on http://localhost:3001
✓ Database connected
✓ Swagger docs available at http://localhost:3001/docs
```

**⚠️ Troubleshooting:**
- ❌ "Port 3001 already in use" → Change PORT in `.env` or kill existing process
- ❌ "Database connection error" → Check DATABASE_URL and PostgreSQL is running
- ❌ "JWT_SECRET not found" → Add JWT_SECRET to `.env`

---

## 🚀 Step 5: Start Frontend Server

### Terminal 2 (Frontend):

```powershell
# Open NEW terminal window
cd D:\DESKTOP-L\OT\apps\frontend
npm run dev
```

**Expected Output:**
```
✓ Ready on http://localhost:3000
✓ Compiled successfully
```

**⚠️ Troubleshooting:**
- ❌ "Port 3000 already in use" → Change port: `npm run dev -- -p 3002`
- ❌ "Module not found" → Run `npm install` in frontend directory
- ❌ "API connection failed" → Verify NEXT_PUBLIC_API_URL in `.env.local`

---

## 🧪 Testing Checklist

### Open Browser: `http://localhost:3000`

---

## ✅ TEST 1: Homepage & Hero Video

**What to Test:**

1. **Hero Section Loads** ✓
   - [ ] Headline displays: "The Future of Skincare is Intelligent"
   - [ ] Two CTAs visible: "Shop Now" and "Take the Assessment"
   - [ ] Background is grayscale (monochrome)
   - [ ] Video plays automatically (if video file present) or shows poster

2. **Brand Colors** ✓
   - [ ] Primary text is black (#000000)
   - [ ] Background is white/light gray (#FFFFFF or #F5F5F5)
   - [ ] Buttons have minimal color (black/white/gray)
   - [ ] Gold accent (#BFA66A) only on micro-interactions (hover/focus)

3. **Responsive Design** ✓
   - [ ] Resize browser to mobile width (< 768px)
   - [ ] Hero video hidden on mobile, poster shown instead
   - [ ] CTAs stack vertically on small screens

**✅ Pass Criteria:** Homepage loads with correct headline, CTAs, and monochrome design

**🐛 Common Issues:**
- Video not playing → Video file missing at `apps/frontend/public/videos/hero-loop.mp4`
- Wrong headline → Check `HeroVideo.tsx` component
- Colors look wrong → Verify design tokens imported correctly

---

## ✅ TEST 2: Health & Wellness Quiz

**Navigate to:** `http://localhost:3000/quiz`

**What to Test:**

1. **Quiz Loads** ✓
   - [ ] First question appears: "What is your skin type?"
   - [ ] 4 options visible: Oily, Dry, Combination, Normal
   - [ ] "Next" button enabled after selection

2. **Progress Through Quiz** ✓
   - [ ] Answer Q1 (Skin Type)
   - [ ] Answer Q2 (Primary Concern) - 6 options
   - [ ] Answer Q3 (Age Range) - 5 options
   - [ ] Answer Q4 (Known Allergies) - Multi-select
   - [ ] Answer Q5 (Lifestyle Factors) - Multi-select
   - [ ] Answer Q6 (Sensitivity Level)
   - [ ] Answer Q7 (Current Routine)
   - [ ] Answer Q8 (Treatment Preference)

3. **Results Page** ✓
   - [ ] After Q8, recommendations appear
   - [ ] See 2-4 product recommendations
   - [ ] Each recommendation shows:
     - Product name and image (grayscale)
     - Match score (e.g., "95% match")
     - Reason: "Why this product suits you"
     - Clinical evidence: Scientific backing
   - [ ] "Shop Recommended Products" CTA visible

4. **Clinical Logic Verification** ✓

   **Test Case A: Hyperpigmentation + Dry Skin**
   - Select: Skin Type = "Dry"
   - Select: Primary Concern = "Hyperpigmentation"
   - Expected: Vitamin C Serum recommended with clinical evidence

   **Test Case B: Acne + Sensitive Skin**
   - Select: Skin Type = "Sensitive"
   - Select: Primary Concern = "Acne"
   - Expected: Gentle alternative (NOT Salicylic Acid)

   **Test Case C: Aging + 45+ Age**
   - Select: Age Range = "45-54"
   - Select: Primary Concern = "Aging"
   - Expected: Retinol or Peptide Complex recommended

**✅ Pass Criteria:** Quiz flows through 8 questions and shows personalized recommendations with clinical reasoning

**🐛 Common Issues:**
- Quiz not loading → Check console for API errors
- No recommendations → Database might be empty, run seed script
- Wrong recommendations → Verify `healthQuizData.ts` logic
- API 500 error → Backend might be down, check Terminal 1

---

## ✅ TEST 3: Product Catalog

**Navigate to:** `http://localhost:3000/products`

**What to Test:**

1. **Product Grid Loads** ✓
   - [ ] Products display in grid layout (3-4 columns desktop, 1-2 mobile)
   - [ ] Product images are grayscale (monochrome)
   - [ ] Product name, price, short description visible
   - [ ] "View Details" or "Add to Cart" button on each card

2. **Product Filtering** ✓
   - [ ] Filter by category (e.g., "Serums", "Moisturizers", "SPF")
   - [ ] Filter by concern (e.g., "Acne", "Aging", "Hyperpigmentation")
   - [ ] Products update without page reload

3. **Product Search** ✓
   - [ ] Search bar functional
   - [ ] Type "vitamin" → Vitamin C products appear
   - [ ] Type "retinol" → Retinol products appear

**✅ Pass Criteria:** Product catalog displays with grayscale images and functional filters

---

## ✅ TEST 4: Product Detail Page

**Navigate to:** `http://localhost:3000/products/[product-id]`

**What to Test:**

1. **Product Information** ✓
   - [ ] Product name, price, main image (grayscale)
   - [ ] Product description (clinical-luxury tone)
   - [ ] Multiple product images in gallery (all grayscale)

2. **"Why This Product" Section** ✓
   - [ ] Box with key benefits listed
   - [ ] Clinical reasoning for recommendation
   - [ ] Ingredients highlighted

3. **Clinical Evidence Section** ✓
   - [ ] Scientific studies referenced
   - [ ] Clinical trial results (e.g., "40% improvement in 8 weeks")
   - [ ] Journal citations (e.g., "J Clin Aesthet Dermatol, 2017")

4. **Purchase Panel** ✓
   - **Desktop:**
     - [ ] Sticky sidebar on right side
     - [ ] Price, quantity selector, "Add to Cart" button
     - [ ] Stays visible when scrolling
   
   - **Mobile:**
     - [ ] Fixed action bar at bottom of screen
     - [ ] "Add to Cart" button always visible
     - [ ] Doesn't overlap content

5. **Add to Cart Flow** ✓
   - [ ] Click "Add to Cart"
   - [ ] Cart icon updates with item count
   - [ ] Success notification appears (subtle, clinical design)

**✅ Pass Criteria:** Product page shows clinical evidence, "Why This Product" box, and sticky purchase UI

---

## ✅ TEST 5: Shopping Cart

**Navigate to:** `http://localhost:3000/cart`

**What to Test:**

1. **Cart Display** ✓
   - [ ] Cart items listed with image, name, price, quantity
   - [ ] Can increase/decrease quantity
   - [ ] Can remove items
   - [ ] Subtotal updates dynamically

2. **Empty Cart State** ✓
   - [ ] Remove all items
   - [ ] "Your cart is empty" message displays
   - [ ] "Continue Shopping" CTA visible

3. **Checkout Button** ✓
   - [ ] "Proceed to Checkout" button enabled when cart has items
   - [ ] Clicking redirects to `/checkout`

**✅ Pass Criteria:** Cart CRUD operations work, totals calculate correctly

---

## ✅ TEST 6: Checkout & Payments

**Navigate to:** `http://localhost:3000/checkout`

### **A. Shipping Information Form** ✓
- [ ] Name, email, phone, address fields present
- [ ] Form validation works (required fields)
- [ ] Can proceed to payment after filling

### **B. Payment Method Selection** ✓

**For Global Payments (Stripe):**
- [ ] Stripe card input appears
- [ ] Test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date (e.g., 12/25)
- [ ] CVC: Any 3 digits (e.g., 123)
- [ ] Submit payment → Order confirmation page

**For India Payments (Razorpay):**
- [ ] Select country "India" or currency "INR"
- [ ] Razorpay payment options appear (UPI, Card, NetBanking, Wallets)
- [ ] Test mode shows Razorpay test interface
- [ ] Complete test payment → Order confirmation

### **C. Order Confirmation** ✓
- [ ] After successful payment, redirected to `/orders/[order-id]`
- [ ] Order summary displays
- [ ] Order number visible
- [ ] Email confirmation sent (check backend logs)

**✅ Pass Criteria:** Can complete checkout with both Stripe and Razorpay test payments

**🐛 Common Issues:**
- Stripe not loading → Check NEXT_PUBLIC_STRIPE_PUBLIC_KEY in frontend .env.local
- Razorpay not appearing → Verify RAZORPAY_KEY_ID set and currency is INR
- Payment fails → Check backend logs in Terminal 1
- Webhook errors → Expected in local dev (webhooks need ngrok for testing)

---

## ✅ TEST 7: User Authentication

### **A. Sign Up** ✓
**Navigate to:** `http://localhost:3000/signup`

- [ ] Registration form appears (name, email, password)
- [ ] Submit form → Account created
- [ ] Redirected to dashboard or homepage
- [ ] User menu shows "Logged in as [name]"

### **B. Login** ✓
**Navigate to:** `http://localhost:3000/login`

- [ ] Login form appears
- [ ] Enter credentials → Logged in successfully
- [ ] JWT token stored (check browser DevTools → Application → Cookies)

### **C. Profile** ✓
**Navigate to:** `http://localhost:3000/profile`

- [ ] User profile information displays
- [ ] Can edit name, email
- [ ] Can view past orders

### **D. Logout** ✓
- [ ] Click "Logout" in user menu
- [ ] Redirected to homepage
- [ ] User menu shows "Login/Signup" again

**✅ Pass Criteria:** Can register, login, view profile, and logout successfully

---

## ✅ TEST 8: Design System Verification

**Open DevTools (F12) → Console**

### **A. Color Palette Check** ✓
Run this in console:
```javascript
// Check computed styles
const body = document.body;
const styles = window.getComputedStyle(body);
console.log('Background:', styles.backgroundColor); // Should be white/light gray
console.log('Text color:', styles.color); // Should be black
```

**Expected:**
- Primary backgrounds: `#FFFFFF` or `#F5F5F5` (white/light gray)
- Text: `#000000` (black)
- Borders/dividers: `#9A9A9A` (gray)
- Accents (rare): `#BFA66A` (gold on hover only)

### **B. Spacing Verification** ✓
- [ ] Inspect any element → Check padding/margin
- [ ] Should use multiples of 12px: 12, 24, 36, 48, 60, etc.

### **C. Typography Check** ✓
- [ ] Headers use bold/heavy weight fonts (Arial Black, Futura, Helvetica Neue)
- [ ] Body text uses system fonts (Segoe UI, sans-serif)
- [ ] Font sizes: 12px, 14px, 16px, 18px, 24px, 32px, 48px

### **D. Grayscale Filter** ✓
- [ ] All product images appear grayscale (no color)
- [ ] Inspect image → Check CSS: `filter: grayscale(100%)`

**✅ Pass Criteria:** All design tokens match Only Thing brand guidelines

---

## ✅ TEST 9: API Health Check

**Navigate to:** `http://localhost:3001/health`

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-13T11:18:50.000Z",
  "database": "connected"
}
```

**Navigate to:** `http://localhost:3001/docs` (Swagger UI)

- [ ] API documentation loads
- [ ] Can see all endpoints: `/api/products`, `/api/auth`, `/api/orders`, `/api/quiz`
- [ ] Can test endpoints directly from Swagger UI

**✅ Pass Criteria:** Backend API responds correctly

---

## ✅ TEST 10: Mobile Responsiveness

### **Chrome DevTools Device Emulation:**

1. Open DevTools (F12) → Click device icon (top-left)
2. Select device: "iPhone 12 Pro" or "Pixel 5"

**Test on Mobile View:**

- [ ] **Homepage:** Hero headline readable, CTAs accessible
- [ ] **Quiz:** Questions fit screen, radio buttons tappable
- [ ] **Product Grid:** Displays 1-2 columns (not 4)
- [ ] **Product Detail:** Images stack vertically, purchase bar at bottom
- [ ] **Cart:** Items list readable, checkout button visible
- [ ] **Checkout:** Form fields stack vertically, keyboard doesn't hide inputs

**Rotate to Landscape:**
- [ ] Layout adapts correctly
- [ ] No horizontal scrolling

**✅ Pass Criteria:** All pages usable on mobile without zooming/scrolling issues

---

## 🎯 Final Verification Checklist

Before marking "Everything Working":

- [ ] ✅ Backend running on `http://localhost:3001`
- [ ] ✅ Frontend running on `http://localhost:3000`
- [ ] ✅ Database connected (no errors in backend terminal)
- [ ] ✅ Homepage loads with correct hero headline
- [ ] ✅ Quiz completes with recommendations
- [ ] ✅ Products display in grayscale
- [ ] ✅ Product detail shows clinical evidence
- [ ] ✅ Can add to cart and view cart
- [ ] ✅ Checkout flow works (Stripe test mode)
- [ ] ✅ User can register and login
- [ ] ✅ Design matches monochrome brand (black/white/gray)
- [ ] ✅ Mobile responsive (tested in DevTools)
- [ ] ✅ API docs accessible at `/docs`

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to backend"
**Symptoms:** Frontend shows "API Error" or blank pages
**Solution:**
```powershell
# Check backend is running
cd D:\DESKTOP-L\OT\apps\backend
npm run dev

# Verify .env.local has correct API URL
cat apps\frontend\.env.local  # Should show NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Issue 2: "Database connection error"
**Symptoms:** Backend crashes with "connection refused"
**Solution:**
```powershell
# Check PostgreSQL is running
Get-Service -Name postgresql*

# Or start Docker PostgreSQL
docker start onlything-postgres

# Test connection
cd apps\backend
npx prisma db push
```

### Issue 3: "Quiz recommendations are empty"
**Symptoms:** Quiz completes but shows no products
**Solution:**
```powershell
# Seed database with sample products
cd apps\backend
npm run seed
```

### Issue 4: "Payment form doesn't appear"
**Symptoms:** Checkout page shows blank payment section
**Solution:**
```powershell
# Check Stripe keys are set
cd apps\frontend
cat .env.local  # Should have NEXT_PUBLIC_STRIPE_PUBLIC_KEY

# Check backend has secret key
cd ..\backend
cat .env  # Should have STRIPE_SECRET_KEY
```

### Issue 5: "Images have color (not grayscale)"
**Symptoms:** Product images show color instead of monochrome
**Solution:**
```typescript
// Check CSS in product components
img {
  filter: grayscale(100%); // Should be present
}
```

### Issue 6: "Port already in use"
**Symptoms:** "EADDRINUSE: address already in use"
**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :3000  # or :3001

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3002
```

---

## 📸 Screenshots Checklist

Take screenshots of these working features:

1. [ ] Homepage with hero headline "The Future of Skincare is Intelligent"
2. [ ] Quiz questions (Q1 skin type)
3. [ ] Quiz results with recommendations and clinical evidence
4. [ ] Product catalog (grayscale images)
5. [ ] Product detail page with "Why This Product" box
6. [ ] Shopping cart with items
7. [ ] Checkout payment form (Stripe or Razorpay)
8. [ ] Order confirmation page
9. [ ] Mobile view (use DevTools device emulation)
10. [ ] Swagger API docs at `/docs`

---

## ✨ Success Criteria

**You'll know everything is working when:**

1. ✅ Both terminals show no errors (backend + frontend)
2. ✅ Homepage loads in under 3 seconds
3. ✅ Quiz completes with personalized recommendations
4. ✅ Can add products to cart and checkout
5. ✅ Test payment succeeds (Stripe test card works)
6. ✅ All images are grayscale (monochrome)
7. ✅ Design uses only black/white/gray colors
8. ✅ Mobile view is fully responsive
9. ✅ API docs accessible and functional
10. ✅ No console errors in browser DevTools

---

## 🚀 Next Steps After Verification

Once localhost testing passes:

1. **Deploy to Staging**
   - Set up Neon database (production connection)
   - Deploy backend to Railway/Render/Fly.io
   - Deploy frontend to Vercel

2. **Production Checklist**
   - [ ] Add real Stripe/Razorpay production keys
   - [ ] Upload hero video file
   - [ ] Add real product images
   - [ ] Populate clinical evidence content
   - [ ] Set up monitoring (Sentry, LogRocket)

3. **Performance Testing**
   - [ ] Run Lighthouse audit (target: 90+ score)
   - [ ] Test with real user data volume
   - [ ] Load testing with k6 or Artillery

---

**Ready to Test! Open your browser to `http://localhost:3000` and follow the checklist above.** 🎉

Let me know if anything doesn't work as expected!
