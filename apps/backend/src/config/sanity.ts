import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // Use CDN for production
  token: process.env.SANITY_API_TOKEN, // Optional: for write operations
  perspective: 'published', // Only fetch published documents
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper to generate optimized image URLs
export function getOptimizedImageUrl(
  source: SanityImageSource,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
  } = {}
): string {
  const { width = 800, height, quality = 80, format = 'auto' } = options;
  
  let url = urlFor(source).width(width).quality(quality);
  
  if (height) {
    url = url.height(height);
  }
  
  if (format !== 'auto') {
    url = url.format(format);
  } else {
    url = url.auto('format'); // Auto-detect best format (WebP if supported)
  }
  
  return url.url();
}

// GROQ query helpers
export const queries = {
  // Products
  allProducts: `*[_type == "product" && status == "active"] | order(name asc)`,
  productBySlug: `*[_type == "product" && slug.current == $slug][0]`,
  featuredProducts: `*[_type == "product" && featured == true && status == "active"] | order(_createdAt desc)[0...8]`,
  productsByCategory: `*[_type == "product" && category._ref == $categoryId && status == "active"] | order(name asc)`,
  
  // Categories
  allCategories: `*[_type == "category"] | order(order asc)`,
  categoryBySlug: `*[_type == "category" && slug.current == $slug][0]`,
  topLevelCategories: `*[_type == "category" && !defined(parent)] | order(order asc)`,
  
  // Blog Posts
  allPosts: `*[_type == "post" && status == "published"] | order(publishedAt desc)`,
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    ...,
    author->
  }`,
  featuredPosts: `*[_type == "post" && featured == true && status == "published"] | order(publishedAt desc)[0...3]`,
  postsByCategory: `*[_type == "post" && $category in categories && status == "published"] | order(publishedAt desc)`,
  
  // Authors
  authorBySlug: `*[_type == "author" && slug.current == $slug][0]`,
  
  // Pages
  pageBySlug: `*[_type == "page" && slug.current == $slug][0]`,
};

export default sanityClient;
