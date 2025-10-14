import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Sanity client configuration
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Use CDN for better performance
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
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  } = {}
): string {
  const {
    width = 800,
    height,
    quality = 80,
    format = 'auto',
    fit = 'max',
  } = options;

  let url = urlFor(source).width(width).quality(quality).fit(fit);

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
  allProducts: `*[_type == "product" && status == "active"] {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    mainImage,
    category->,
    tags,
    stock,
    sku,
    featured,
    status
  } | order(name asc)`,
  
  productBySlug: `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    fullDescription,
    price,
    compareAtPrice,
    mainImage,
    gallery,
    category->,
    tags,
    variants,
    stock,
    sku,
    featured,
    status,
    specifications,
    seo
  }`,
  
  featuredProducts: `*[_type == "product" && featured == true && status == "active"] {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    mainImage,
    category->,
    tags,
    featured
  } | order(_createdAt desc)[0...8]`,
  
  productsByCategory: `*[_type == "product" && category._ref == $categoryId && status == "active"] {
    _id,
    name,
    slug,
    description,
    price,
    compareAtPrice,
    mainImage,
    category->,
    tags,
    stock
  } | order(name asc)`,

  // Categories
  allCategories: `*[_type == "category"] {
    _id,
    name,
    slug,
    description,
    image,
    parent->,
    order
  } | order(order asc)`,
  
  categoryBySlug: `*[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    image,
    parent->,
    seo
  }`,
  
  topLevelCategories: `*[_type == "category" && !defined(parent)] {
    _id,
    name,
    slug,
    description,
    image,
    order
  } | order(order asc)`,

  // Blog Posts
  allPosts: `*[_type == "post" && status == "published"] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    author->,
    publishedAt,
    readTime,
    categories,
    tags,
    featured
  } | order(publishedAt desc)`,
  
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    author->,
    publishedAt,
    readTime,
    categories,
    tags,
    featured,
    seo
  }`,
  
  featuredPosts: `*[_type == "post" && featured == true && status == "published"] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    author->,
    publishedAt,
    readTime,
    categories
  } | order(publishedAt desc)[0...3]`,
  
  postsByCategory: `*[_type == "post" && $category in categories && status == "published"] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    author->,
    publishedAt,
    readTime,
    categories
  } | order(publishedAt desc)`,

  // Authors
  authorBySlug: `*[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    role,
    social
  }`,

  // Pages
  pageBySlug: `*[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    sections,
    seo
  }`,
};

// Fetch helper with TypeScript support
export async function fetchSanityData<T = any>(
  query: string,
  params?: any
): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.error('Error fetching Sanity data:', error);
    throw error;
  }
}

export default sanityClient;

