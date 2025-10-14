# Phase 8: CMS & Content Management - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Install Sanity Studio Dependencies

```bash
cd apps/sanity-studio
npm install
```

### 2. Create Your Sanity Project

```bash
npm create sanity@latest
```

**Follow the prompts:**
- ✅ Create new project
- ✅ Project name: "E-commerce CMS"
- ✅ Dataset: production
- ✅ Output path: Current directory (just press Enter)
- ✅ Schema: Select "Clean project"

**Save your Project ID!** You'll need it in the next step.

### 3. Configure Environment Variables

**Sanity Studio** (`apps/sanity-studio/.env`):
```env
SANITY_STUDIO_PROJECT_ID=your_project_id_here
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

**Backend** (`apps/backend/.env`):
```env
SANITY_PROJECT_ID=your_project_id_here
SANITY_DATASET=production
SANITY_API_TOKEN=  # Leave empty for now (optional)
SANITY_WEBHOOK_SECRET=  # Leave empty for now (configure later)
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 4. Configure CORS

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **Settings** → **API** → **CORS Origins**
4. Click **Add CORS origin**
5. Add these origins:
   - `http://localhost:3000` (Frontend)
   - `http://localhost:3333` (Studio)
   - `http://localhost:4000` (Backend)
   - Allow credentials: ✅ YES

### 5. Start Everything

```bash
# Terminal 1: Start Sanity Studio
cd apps/sanity-studio
npm run dev
# Studio → http://localhost:3333

# Terminal 2: Start Backend
cd apps/backend
npm run dev
# API → http://localhost:4000

# Terminal 3: Start Frontend
cd apps/frontend
npm run dev
# App → http://localhost:3000
```

## ✅ Verify Installation

### Test Sanity Studio
1. Open http://localhost:3333
2. Sign in with your Sanity account
3. You should see: Products, Categories, Blog, Pages

### Test Backend API
```bash
# Fetch products (should return empty array initially)
curl http://localhost:4000/api/sanity/products

# Should return: {"success":true,"data":[]}
```

### Test Frontend Integration
The frontend is now ready to fetch content from Sanity via the backend API.

## 📝 Create Your First Content

### Create a Category
1. Open Studio → Categories
2. Click **Create**
3. Fill in:
   - Name: "Wellness"
   - Generate slug (click Generate button)
   - Description: "Health and wellness products"
   - Upload an image
4. Click **Publish**

### Create a Product
1. Open Studio → Products → All Products
2. Click **Create**
3. Fill in:
   - Name: "Premium Protein Powder"
   - Generate slug
   - Description: "High-quality whey protein blend"
   - Price: 49.99
   - Stock: 100
   - SKU: "PROTEIN-001"
   - Upload main image (remember to add alt text!)
   - Select category: Wellness
   - Status: Active
4. Click **Publish**

### View Your Product
```bash
# Backend API
curl http://localhost:4000/api/sanity/products

# Or test in browser
# http://localhost:4000/api/sanity/products
```

## 🎨 Create a Blog Post

1. First, create an author:
   - Studio → Blog → Authors
   - Name: "Your Name"
   - Role: "Content Writer"
   - Upload profile image
   - Publish

2. Create a post:
   - Studio → Blog → All Posts
   - Title: "Welcome to Our Store"
   - Excerpt: "Discover amazing wellness products..."
   - Select your author
   - Upload featured image
   - Write content using the rich text editor
   - Add categories (e.g., "news")
   - Status: Published
   - Publish

## 🔌 Set Up Webhooks (Optional but Recommended)

This enables automatic cache clearing when content changes.

1. Go to [Sanity Manage](https://www.sanity.io/manage) → Your Project
2. **API** → **Webhooks**
3. Click **Create webhook**
4. Fill in:
   - Name: "Content Updates"
   - URL: `http://localhost:4000/api/sanity/webhook` (use your production URL later)
   - Dataset: production
   - Trigger on: Create, Update, Delete
   - HTTP method: POST
   - Secret: Generate a random secret (or use: `openssl rand -hex 32`)
5. Copy the secret
6. Add to backend `.env`:
   ```env
   SANITY_WEBHOOK_SECRET=your_secret_here
   ```
7. Restart backend server

## 📚 API Endpoints Available

All endpoints are prefixed with `/api/sanity/`:

### Products
- `GET /products` - List all products
- `GET /products/featured` - Featured products
- `GET /products/:slug` - Single product

### Categories
- `GET /categories` - List all categories
- `GET /categories/:slug` - Single category

### Blog
- `GET /posts` - List all posts
- `GET /posts?limit=5` - List with limit
- `GET /posts/featured` - Featured posts
- `GET /posts/:slug` - Single post

### Search
- `GET /search?q=wellness` - Search all content
- `GET /search?q=protein&types=product` - Search products only

### Admin
- `DELETE /cache?pattern=product` - Clear cache (requires auth)

## 🎯 Next Steps

### For Content Managers
1. Read the full documentation: `docs/PHASE-8-CMS-IMPLEMENTATION.md`
2. Explore the Studio interface
3. Create more products and categories
4. Write blog posts
5. Build custom pages

### For Developers
1. **Frontend**: Use the Sanity client to fetch and display content
   ```tsx
   import { fetchSanityData, queries } from '@/lib/sanity';
   
   const products = await fetchSanityData(queries.allProducts);
   ```

2. **Images**: Use optimized image URLs
   ```tsx
   import { getOptimizedImageUrl } from '@/lib/sanity';
   
   const imageUrl = getOptimizedImageUrl(product.mainImage, {
     width: 800,
     quality: 85,
     format: 'webp'
   });
   ```

3. **Blog Posts**: Render rich content
   ```tsx
   import PortableTextContent from '@/components/PortableText';
   
   <PortableTextContent value={post.body} />
   ```

## 🐛 Troubleshooting

### Studio won't start
```bash
cd apps/sanity-studio
rm -rf node_modules package-lock.json
npm install
```

### "Project not found" error
- Double-check your `SANITY_PROJECT_ID` in all `.env` files
- Make sure you're using the correct project ID from Sanity Manage

### CORS errors
- Verify you added `http://localhost:3000`, `http://localhost:3333`, and `http://localhost:4000` to CORS origins
- Make sure "Allow credentials" is checked

### Images not loading
- Check that images have alt text in Studio
- Verify CORS configuration includes your frontend URL
- Ensure `SANITY_PROJECT_ID` is correct

### API returns empty data
- Make sure you've published content (not just saved as draft)
- Check content status is "active" or "published"
- Verify backend is running and accessible

## 📖 Learn More

- **Full Documentation**: `docs/PHASE-8-CMS-IMPLEMENTATION.md`
- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Query Language**: https://www.sanity.io/docs/groq
- **Image URLs**: https://www.sanity.io/docs/image-url

## ✨ What's Included

✅ Sanity Studio v3 with custom configuration  
✅ Complete schema definitions (Products, Blog, Pages, Categories)  
✅ Backend service layer with caching  
✅ Frontend client with GROQ queries  
✅ Portable Text renderer for rich content  
✅ Image optimization with WebP support  
✅ Webhook integration for cache invalidation  
✅ SEO metadata support  
✅ Product variants and specifications  
✅ Blog with authors and categories  
✅ Dynamic page builder  
✅ Comprehensive API endpoints  

---

**Need Help?** Check the full documentation or contact the development team!

🎉 **Congratulations!** Your CMS is ready to use!
