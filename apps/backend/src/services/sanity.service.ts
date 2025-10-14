import sanityClient, { queries, getOptimizedImageUrl } from '../config/sanity';
import { logger } from '../utils/logger';

// Cache configuration
const CACHE_TTL = 300000; // 5 minutes in milliseconds
const cache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(query: string, params?: any): string {
  return `${query}:${JSON.stringify(params || {})}`;
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
  logger.info(`Sanity cache cleared${pattern ? ` for pattern: ${pattern}` : ''}`);
}

class SanityService {
  /**
   * Fetch data from Sanity with caching
   */
  async fetch<T = any>(query: string, params?: any, useCache = true): Promise<T> {
    const cacheKey = getCacheKey(query, params);
    
    if (useCache) {
      const cached = getFromCache(cacheKey);
      if (cached) {
        logger.debug('Returning cached Sanity data');
        return cached;
      }
    }
    
    try {
      const data = await sanityClient.fetch<T>(query, params);
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      logger.error('Error fetching from Sanity:', error);
      throw error;
    }
  }

  // Product methods
  async getAllProducts() {
    return this.fetch(queries.allProducts);
  }

  async getProductBySlug(slug: string) {
    return this.fetch(queries.productBySlug, { slug });
  }

  async getFeaturedProducts() {
    return this.fetch(queries.featuredProducts);
  }

  async getProductsByCategory(categoryId: string) {
    return this.fetch(queries.productsByCategory, { categoryId });
  }

  // Category methods
  async getAllCategories() {
    return this.fetch(queries.allCategories);
  }

  async getCategoryBySlug(slug: string) {
    return this.fetch(queries.categoryBySlug, { slug });
  }

  async getTopLevelCategories() {
    return this.fetch(queries.topLevelCategories);
  }

  // Blog methods
  async getAllPosts(limit?: number) {
    const query = limit 
      ? `${queries.allPosts}[0...${limit}]`
      : queries.allPosts;
    return this.fetch(query);
  }

  async getPostBySlug(slug: string) {
    return this.fetch(queries.postBySlug, { slug });
  }

  async getFeaturedPosts() {
    return this.fetch(queries.featuredPosts);
  }

  async getPostsByCategory(category: string) {
    return this.fetch(queries.postsByCategory, { category });
  }

  // Author methods
  async getAuthorBySlug(slug: string) {
    return this.fetch(queries.authorBySlug, { slug });
  }

  // Page methods
  async getPageBySlug(slug: string) {
    return this.fetch(queries.pageBySlug, { slug });
  }

  // Image optimization
  getOptimizedImageUrl = getOptimizedImageUrl;

  /**
   * Sync product from Sanity to local database
   * This allows hybrid approach: content in Sanity, transactions in PostgreSQL
   */
  async syncProduct(sanityProductId: string) {
    try {
      const query = `*[_type == "product" && _id == $id][0]`;
      const product = await this.fetch(query, { id: sanityProductId }, false);
      
      if (!product) {
        throw new Error(`Product ${sanityProductId} not found in Sanity`);
      }

      // TODO: Sync to local database if needed
      // This would involve checking if product exists in PostgreSQL
      // and creating/updating accordingly
      
      logger.info(`Synced product ${sanityProductId} from Sanity`);
      return product;
    } catch (error) {
      logger.error(`Error syncing product ${sanityProductId}:`, error);
      throw error;
    }
  }

  /**
   * Handle webhook payload from Sanity
   */
  async handleWebhook(payload: any) {
    const { _type, _id, slug } = payload;
    
    logger.info(`Received webhook for ${_type}:${_id}`);
    
    // Clear relevant cache
    switch (_type) {
      case 'product':
        clearCache('product');
        if (slug?.current) {
          clearCache(slug.current);
        }
        break;
      case 'category':
        clearCache('category');
        break;
      case 'post':
        clearCache('post');
        break;
      case 'page':
        clearCache('page');
        break;
      default:
        logger.warn(`Unknown document type: ${_type}`);
    }
    
    return { success: true, message: 'Cache cleared' };
  }

  /**
   * Search across all content types
   */
  async search(searchTerm: string, types: string[] = ['product', 'post', 'page']) {
    const typeFilter = types.map(t => `_type == "${t}"`).join(' || ');
    const query = `*[
      (${typeFilter}) &&
      (
        name match $term ||
        title match $term ||
        description match $term ||
        excerpt match $term
      )
    ][0...20]`;
    
    return this.fetch(query, { term: `*${searchTerm}*` }, false);
  }
}

export const sanityService = new SanityService();
export default sanityService;
