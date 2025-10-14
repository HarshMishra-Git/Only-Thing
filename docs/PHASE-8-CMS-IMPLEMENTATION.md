# Phase 8: CMS & Content Management - Implementation Guide

## Overview

Phase 8 implements a complete headless CMS solution using Sanity.io, providing content editors with a powerful, user-friendly interface to manage all website content without code changes.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Sanity Studio                             │
│         (Content Management Interface)                       │
│  - Products, Categories, Blog Posts, Pages                  │
│  - Rich Text Editor, Media Management                       │
└──────────────────┬──────────────────────────────────────────┘
                   │ Content API
                   │ (HTTP + GROQ Queries)
                   ▼
┌──────────────────────────────────┬──────────────────────────┐
│        Backend (Fastify)          │     Frontend (Next.js)   │
│  - Sanity Service Layer           │  - Sanity Client         │
│  - Caching (5-min TTL)            │  - GROQ Queries          │
│  - Webhook Handlers               │  - Portable Text         │
│  - Image Optimization             │  - Image URLs            │
└──────────────────────────────────┴──────────────────────────┘
```

## Features Implemented

### ✅ 1. Sanity Studio Setup

**Location:** `apps/sanity-studio/`

- Fully configured Sanity Studio v3
- Custom desk structure for organized content management
- TypeScript support
- Environment-based configuration

**Key Files:**
- `sanity.config.ts` - Main configuration
- `structure.ts` - Custom desk structure
- `schemas/` - Content type definitions

### ✅ 2. Comprehensive Schemas

#### **Product Schema** (`schemas/documents/product.ts`)
- Product name, description, and slug
- Pricing (price, compareAtPrice)
- Image gallery with alt text
- Product variants (size, color, etc.)
- Stock management
- SKU tracking
- Categories and tags
- Specifications
- SEO metadata
- Status (active, draft, out_of_stock)
- Featured flag

#### **Category Schema** (`schemas/documents/category.ts`)
- Category name and slug
- Hierarchical structure (parent/child)
- Category images
- Display order
- SEO metadata

#### **Blog Post Schema** (`schemas/documents/post.ts`)
- Title, excerpt, and slug
- Rich content with Portable Text
- Author relationship
- Featured image
- Categories and tags
- Publishing workflow (draft/published)
- Reading time
- SEO metadata

#### **Author Schema** (`schemas/documents/author.ts`)
- Name, role, and bio
- Profile image
- Social media links

#### **Page Schema** (`schemas/documents/page.ts`)
- Dynamic page builder
- Multiple section types:
  - Hero sections
  - Feature sections
  - CTA sections
  - Rich content blocks
- SEO metadata

#### **Reusable Objects:**
- `productVariant` - Product variant details
- `seo` - SEO metadata (title, description, keywords, OG image)
- `blockContent` - Rich text with images, videos, code blocks
- `imageWithAlt` - Images with alt text and captions
- `heroSection` - Hero section builder
- `featuresSection` - Features grid builder
- `ctaSection` - Call-to-action builder
- `faqItem` - FAQ item structure

### ✅ 3. Backend Integration

**Location:** `apps/backend/src/`

#### Sanity Client Configuration (`config/sanity.ts`)
```typescript
- Configured for production/development datasets
- Image URL builder with optimization
- GROQ query helpers
- CDN caching when in production
```

#### Sanity Service (`services/sanity.service.ts`)
**Features:**
- In-memory caching (5-minute TTL)
- Fetch wrapper with error handling
- Product, category, blog, and page methods
- Search across content types
- Webhook handling for cache invalidation
- Image optimization helpers

**API Methods:**
- `getAllProducts()` - Fetch all active products
- `getProductBySlug(slug)` - Get single product
- `getFeaturedProducts()` - Get featured products
- `getAllCategories()` - Fetch categories
- `getAllPosts()` - Fetch blog posts
- `getPostBySlug(slug)` - Get single post
- `search(term, types)` - Search content
- `handleWebhook(payload)` - Process Sanity webhooks

#### Sanity Controller (`controllers/sanity.controller.ts`)
**Endpoints:**
- `GET /api/sanity/products` - List all products
- `GET /api/sanity/products/featured` - Featured products
- `GET /api/sanity/products/:slug` - Single product
- `GET /api/sanity/categories` - List categories
- `GET /api/sanity/categories/:slug` - Single category
- `GET /api/sanity/posts` - List blog posts
- `GET /api/sanity/posts/featured` - Featured posts
- `GET /api/sanity/posts/:slug` - Single post
- `GET /api/sanity/pages/:slug` - Dynamic page
- `GET /api/sanity/search?q=term` - Search content
- `POST /api/sanity/webhook` - Webhook receiver
- `DELETE /api/sanity/cache` - Clear cache (admin only)

#### Caching Strategy
```typescript
Cache TTL: 5 minutes
Cache Invalidation: Via webhooks
Cache Patterns: Query-based keys
```

### ✅ 4. Frontend Integration

**Location:** `apps/frontend/src/`

#### Sanity Client (`lib/sanity.ts`)
- Client configuration for browser/SSR
- Image URL builder
- Optimized image generation
- GROQ query helpers
- Fetch helper function

**Image Optimization:**
```typescript
getOptimizedImageUrl(source, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'auto', // WebP if supported
  fit: 'max'
})
```

#### Portable Text Renderer (`components/PortableText.tsx`)
**Supports:**
- Headings (H1-H6)
- Paragraphs and lists
- Links (internal/external)
- Images with captions
- Blockquotes
- Code blocks
- YouTube embeds
- Custom styling
- Responsive images

**Usage:**
```tsx
import PortableTextContent from '@/components/PortableText';

<PortableTextContent value={post.body} />
```

### ✅ 5. Image Optimization

**Features:**
- Automatic WebP conversion
- Responsive image URLs
- Quality optimization
- Lazy loading support
- Hotspot support for cropping
- CDN delivery

**Backend Example:**
```typescript
import { getOptimizedImageUrl } from '../config/sanity';

const url = getOptimizedImageUrl(product.mainImage, {
  width: 1200,
  quality: 90,
  format: 'webp'
});
```

**Frontend Example:**
```typescript
import { getOptimizedImageUrl, urlFor } from '@/lib/sanity';

// Simple usage
<img src={urlFor(image).width(800).url()} alt={image.alt} />

// Advanced usage
<img 
  src={getOptimizedImageUrl(image, { 
    width: 800, 
    quality: 80,
    format: 'auto'
  })} 
  alt={image.alt}
  loading="lazy"
/>
```

### ✅ 6. Webhook Integration

**Setup in Sanity:**
1. Go to Sanity Manage → API → Webhooks
2. Add new webhook
3. URL: `https://your-api.com/api/sanity/webhook`
4. Dataset: `production`
5. Trigger on: Create, Update, Delete
6. Add secret for signature verification

**Backend Handler:**
```typescript
// Automatically clears cache on content updates
// Verifies webhook signature for security
POST /api/sanity/webhook
```

**Environment Variable:**
```env
SANITY_WEBHOOK_SECRET=your_secret_here
```

### ✅ 7. Content Preview

**Features:**
- Production URL preview in Studio
- Links to preview pages
- Configured per content type

**Studio Configuration:**
```typescript
document: {
  productionUrl: async (prev, context) => {
    const { document } = context;
    
    if (document._type === 'product') {
      return `${baseUrl}/products/${document.slug?.current}`;
    }
    if (document._type === 'post') {
      return `${baseUrl}/blog/${document.slug?.current}`;
    }
    return prev;
  }
}
```

## Environment Configuration

### Sanity Studio (`.env`)
```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

### Backend (`.env`)
```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token  # Optional: for write operations
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Setup Instructions

### 1. Initialize Sanity Project

```bash
cd apps/sanity-studio
npm install

# Create Sanity project (if not done)
npm create sanity@latest

# Follow prompts to:
# - Create/select project
# - Choose dataset name (production)
# - Get your project ID

# Update .env with project ID
cp .env.example .env
# Edit .env with your project ID
```

### 2. Start Sanity Studio

```bash
npm run dev
# Studio available at http://localhost:3333
```

### 3. Deploy Studio (Optional)

```bash
npm run build
npm run deploy
# Studio will be deployed to https://your-project.sanity.studio
```

### 4. Configure CORS

Go to [Sanity Manage](https://www.sanity.io/manage):
1. Select your project
2. Go to Settings → API → CORS Origins
3. Add:
   - `http://localhost:3000` (development)
   - `http://localhost:3333` (studio)
   - `https://your-production-domain.com` (production)

### 5. Set Up Webhooks

1. Go to Sanity Manage → API → Webhooks
2. Click "Create webhook"
3. Name: "Content Updates"
4. URL: `https://your-api-domain.com/api/sanity/webhook`
5. Dataset: `production`
6. Trigger on: `Create`, `Update`, `Delete`
7. Document types: `product`, `category`, `post`, `page`
8. HTTP method: `POST`
9. Secret: Generate a secure secret
10. Save webhook
11. Add secret to backend `.env`:
   ```env
   SANITY_WEBHOOK_SECRET=your_generated_secret
   ```

### 6. Create API Token (If Needed for Write Operations)

1. Go to Sanity Manage → API → Tokens
2. Click "Add API token"
3. Name: "Backend API"
4. Permissions: `Read` or `Write` (depending on needs)
5. Copy token
6. Add to backend `.env`:
   ```env
   SANITY_API_TOKEN=your_token_here
   ```

## Content Management Workflows

### Adding a New Product

1. Open Sanity Studio
2. Navigate to Products → All Products
3. Click "Create" button
4. Fill in:
   - Product name (auto-generates slug)
   - Description
   - Price
   - Upload main image with alt text
   - Add gallery images
   - Select category
   - Add tags
   - Set stock quantity
   - Enter SKU
   - Add variants (if applicable)
   - Add specifications
   - Fill SEO metadata
   - Set status (active/draft)
   - Mark as featured (optional)
5. Click "Publish"

### Writing a Blog Post

1. Navigate to Blog → All Posts
2. Click "Create"
3. Fill in:
   - Title
   - Excerpt (200 characters max)
   - Select/create author
   - Upload featured image
   - Write content using rich text editor
   - Add categories and tags
   - Set reading time
   - Fill SEO metadata
   - Set status (draft/published)
   - Mark as featured (optional)
4. Click "Publish"

### Creating a Dynamic Page

1. Navigate to Pages
2. Click "Create"
3. Fill in:
   - Page title
   - Generate slug
   - Add sections:
     - Hero section with background image
     - Features section with icons
     - CTA section with buttons
     - Rich content blocks
   - Fill SEO metadata
4. Click "Publish"

## Integration Examples

### Fetching Products in Frontend

```tsx
import { fetchSanityData, queries } from '@/lib/sanity';

// Server component (Next.js)
export default async function ProductsPage() {
  const products = await fetchSanityData(queries.allProducts);
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

// Client component with state
import { useEffect, useState } from 'react';

function ProductsList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchSanityData(queries.featuredProducts)
      .then(setProducts);
  }, []);
  
  return (/* ... */);
}
```

### Fetching Blog Post

```tsx
import { fetchSanityData, queries } from '@/lib/sanity';
import PortableTextContent from '@/components/PortableText';
import { urlFor } from '@/lib/sanity';

export default async function BlogPost({ params }) {
  const post = await fetchSanityData(
    queries.postBySlug,
    { slug: params.slug }
  );
  
  return (
    <article>
      <h1>{post.title}</h1>
      <img 
        src={urlFor(post.mainImage).width(1200).url()} 
        alt={post.mainImage.alt} 
      />
      <PortableTextContent value={post.body} />
    </article>
  );
}
```

### Using Image Optimization

```tsx
import { getOptimizedImageUrl } from '@/lib/sanity';

function ProductImage({ product }) {
  const imageUrl = getOptimizedImageUrl(product.mainImage, {
    width: 800,
    height: 800,
    quality: 85,
    format: 'webp',
    fit: 'crop'
  });
  
  return (
    <img 
      src={imageUrl} 
      alt={product.mainImage.alt}
      width={800}
      height={800}
      loading="lazy"
    />
  );
}
```

## API Reference

### GROQ Queries

All queries are predefined in `lib/sanity.ts`:

```typescript
queries.allProducts          // All active products
queries.productBySlug        // Single product by slug
queries.featuredProducts     // Featured products (limit 8)
queries.productsByCategory   // Products filtered by category

queries.allCategories        // All categories
queries.categoryBySlug       // Single category
queries.topLevelCategories   // Root categories only

queries.allPosts             // All published posts
queries.postBySlug           // Single post with author
queries.featuredPosts        // Featured posts (limit 3)
queries.postsByCategory      // Posts by category

queries.authorBySlug         // Author details
queries.pageBySlug           // Dynamic page with sections
```

### Custom Queries

```typescript
import { fetchSanityData } from '@/lib/sanity';

// Custom GROQ query
const customQuery = `*[_type == "product" && price < 50] {
  name,
  price,
  mainImage
}[0...10]`;

const affordableProducts = await fetchSanityData(customQuery);

// With parameters
const query = `*[_type == "product" && price < $maxPrice]`;
const products = await fetchSanityData(query, { maxPrice: 100 });
```

## Security Considerations

1. **API Tokens**: Never expose write tokens in frontend
2. **Webhook Secrets**: Always verify webhook signatures
3. **CORS Configuration**: Only allow trusted origins
4. **CDN Usage**: Use CDN in production for better performance
5. **Rate Limiting**: Consider implementing rate limits on API endpoints

## Performance Optimization

1. **Caching**: 5-minute cache on backend reduces API calls
2. **CDN**: Images served via Sanity CDN with optimization
3. **Lazy Loading**: Images load on demand
4. **Format Detection**: Auto-serves WebP when supported
5. **Query Projection**: Only fetch needed fields in GROQ queries

## Troubleshooting

### Issue: "Project not found"
**Solution:** Verify `SANITY_PROJECT_ID` in environment variables

### Issue: "CORS error"
**Solution:** Add your domain to CORS origins in Sanity Manage

### Issue: "Webhook not triggering"
**Solution:** 
- Check webhook URL is correct
- Verify webhook is active
- Check backend logs for errors

### Issue: "Images not loading"
**Solution:**
- Verify image references in content
- Check CORS configuration
- Ensure `projectId` is correct

### Issue: "Cache not invalidating"
**Solution:**
- Verify webhook is configured
- Check webhook secret matches
- Clear cache manually: `DELETE /api/sanity/cache`

## Best Practices

1. **Always add alt text** to images for SEO and accessibility
2. **Use slugs** for all content that needs URLs
3. **Fill SEO fields** for better search visibility
4. **Preview content** before publishing
5. **Use drafts** for work in progress
6. **Optimize images** before upload (though Sanity will optimize further)
7. **Use consistent naming** for categories and tags
8. **Test webhooks** after configuration
9. **Monitor cache** hit rates for performance
10. **Regular backups** of Sanity dataset

## Future Enhancements

- [ ] GraphQL API deployment
- [ ] Content versioning and rollback
- [ ] Scheduled publishing
- [ ] Multi-language support (i18n)
- [ ] Advanced search with filters
- [ ] Content analytics dashboard
- [ ] Asset management enhancements
- [ ] Custom workflow states
- [ ] Content relationships visualization
- [ ] Bulk import/export tools

## Support Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **GROQ Query Language**: https://www.sanity.io/docs/groq
- **Sanity Community**: https://slack.sanity.io
- **Project Issues**: Contact development team

---

**Phase 8 Status**: ✅ **COMPLETED**

All CMS features have been implemented and are ready for production use. Content editors can now manage all website content through Sanity Studio without requiring code changes.
