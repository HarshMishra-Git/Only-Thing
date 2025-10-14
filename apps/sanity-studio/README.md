# Sanity Studio - E-commerce CMS

This is the Sanity Studio for managing all content in the e-commerce platform.

## Features

- **Product Management**: Full product catalog with variants, images, and SEO
- **Category Management**: Hierarchical category structure
- **Blog System**: Complete blog with posts, authors, and rich content
- **Page Builder**: Dynamic pages with customizable sections
- **SEO Optimization**: Built-in SEO fields for all content types
- **Media Management**: Image optimization and alt text support

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Sanity Project

If you haven't created a Sanity project yet:

```bash
npm create sanity@latest -- --template clean --create-project "E-commerce CMS" --dataset production
```

This will:
- Create a new Sanity project
- Give you a project ID
- Set up authentication

### 3. Configure Environment

Copy `.env.example` to `.env` and update with your project details:

```bash
cp .env.example .env
```

Update the values:
```env
SANITY_STUDIO_PROJECT_ID=your_actual_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=http://localhost:3000
```

### 4. Run Studio

```bash
npm run dev
```

The Studio will be available at `http://localhost:3333`

## Content Types

### Products
- Comprehensive product information
- Image galleries with alt text
- Variants (size, color, etc.)
- Stock management
- SEO optimization

### Categories
- Hierarchical structure
- Parent/child relationships
- Category images

### Blog Posts
- Rich content with portable text
- Author management
- Categories and tags
- Featured images
- Publishing workflow

### Authors
- Author profiles
- Bio and images
- Social media links

### Pages
- Dynamic page builder
- Hero sections
- Feature sections
- CTA sections
- Custom content blocks

## Deployment

### Deploy Studio

```bash
npm run build
npm run deploy
```

This deploys your Studio to `https://your-project.sanity.studio`

### GraphQL API (Optional)

Deploy a GraphQL API:

```bash
npm run deploy-graphql
```

## API Access

The Sanity API is available at:
- Production: `https://your-project-id.api.sanity.io/v2021-10-21/data/query/production`
- Development: Same URL with different dataset

## CORS Configuration

Add your frontend URLs to CORS settings in Sanity Manage:
- `http://localhost:3000` (development)
- `https://your-production-domain.com` (production)

## Best Practices

1. **Always add alt text to images** for SEO and accessibility
2. **Use slugs** for all content that needs URLs
3. **Fill SEO fields** for better search engine visibility
4. **Preview content** before publishing using the preview button
5. **Use drafts** for work in progress

## Schema Customization

All schemas are in `/schemas`:
- `/documents` - Main content types (products, posts, pages)
- `/objects` - Reusable components (SEO, images, sections)

To add a new schema:
1. Create the schema file in the appropriate directory
2. Import it in `/schemas/index.ts`
3. Add it to the `schemaTypes` array

## Support

For Sanity documentation: https://www.sanity.io/docs
For project-specific issues: Contact the development team
