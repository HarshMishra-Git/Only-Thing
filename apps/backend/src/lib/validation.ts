import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitization utilities
 */
export class Sanitizer {
  /**
   * Sanitize HTML to prevent XSS
   */
  static html(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  }

  /**
   * Sanitize plain text - remove all HTML
   */
  static text(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  /**
   * Sanitize email
   */
  static email(input: string): string {
    return validator.normalizeEmail(input.trim().toLowerCase()) || '';
  }

  /**
   * Sanitize URL
   */
  static url(input: string): string {
    const trimmed = input.trim();
    if (validator.isURL(trimmed)) {
      return trimmed;
    }
    return '';
  }

  /**
   * Sanitize filename
   */
  static filename(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .substring(0, 255);
  }

  /**
   * Sanitize SQL input (even though Prisma handles this)
   */
  static sql(input: string): string {
    return validator.escape(input);
  }

  /**
   * Strip potentially dangerous characters
   */
  static stripDangerous(input: string): string {
    return input
      .replace(/[<>\"']/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }
}

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  // Email validation
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email too short')
    .max(255, 'Email too long')
    .transform(Sanitizer.email),

  // Password validation - strong passwords required
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain special character'),

  // Username validation
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),

  // Name validation
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(Sanitizer.text),

  // URL validation
  url: z.string()
    .url('Invalid URL')
    .max(2048, 'URL too long')
    .transform(Sanitizer.url),

  // Phone number validation
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),

  // ID validation (UUID)
  uuid: z.string().uuid('Invalid ID format'),

  // Positive integer
  positiveInt: z.number().int().positive(),

  // Pagination
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  }).refine(data => data.endDate >= data.startDate, {
    message: 'End date must be after start date',
  }),

  // Rich text content (with HTML sanitization)
  richText: z.string()
    .max(10000, 'Content too long')
    .transform(Sanitizer.html),

  // Plain text content
  plainText: z.string()
    .max(5000, 'Content too long')
    .transform(Sanitizer.text),

  // Search query
  searchQuery: z.string()
    .min(1, 'Search query too short')
    .max(100, 'Search query too long')
    .transform(Sanitizer.stripDangerous),

  // Slug validation
  slug: z.string()
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(1)
    .max(100),

  // Price validation
  price: z.number()
    .positive('Price must be positive')
    .max(1000000, 'Price too high')
    .multipleOf(0.01, 'Price can have at most 2 decimal places'),

  // Image file validation
  imageFile: z.object({
    filename: z.string().max(255),
    mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    size: z.number().max(5 * 1024 * 1024, 'Image too large (max 5MB)'),
  }),
};

/**
 * Product validation schemas
 */
export const ProductSchemas = {
  create: z.object({
    name: ValidationSchemas.name,
    description: ValidationSchemas.richText,
    price: ValidationSchemas.price,
    sku: z.string().max(50),
    stock: ValidationSchemas.positiveInt,
    categoryId: ValidationSchemas.uuid.optional(),
    images: z.array(ValidationSchemas.url).max(10).optional(),
  }),

  update: z.object({
    name: ValidationSchemas.name.optional(),
    description: ValidationSchemas.richText.optional(),
    price: ValidationSchemas.price.optional(),
    sku: z.string().max(50).optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: ValidationSchemas.uuid.optional(),
    images: z.array(ValidationSchemas.url).max(10).optional(),
  }),
};

/**
 * User validation schemas
 */
export const UserSchemas = {
  register: z.object({
    email: ValidationSchemas.email,
    password: ValidationSchemas.password,
    name: ValidationSchemas.name,
  }),

  login: z.object({
    email: ValidationSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),

  updateProfile: z.object({
    name: ValidationSchemas.name.optional(),
    phone: ValidationSchemas.phone.optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: ValidationSchemas.password,
  }),

  resetPassword: z.object({
    token: z.string().min(1),
    password: ValidationSchemas.password,
  }),
};

/**
 * Order validation schemas
 */
export const OrderSchemas = {
  create: z.object({
    items: z.array(z.object({
      productId: ValidationSchemas.uuid,
      quantity: ValidationSchemas.positiveInt,
    })).min(1, 'Order must contain at least one item'),
    shippingAddress: z.object({
      line1: ValidationSchemas.plainText,
      line2: ValidationSchemas.plainText.optional(),
      city: ValidationSchemas.plainText,
      state: ValidationSchemas.plainText,
      postalCode: z.string().max(20),
      country: z.string().length(2), // ISO country code
    }),
  }),
};

/**
 * Review validation schemas
 */
export const ReviewSchemas = {
  create: z.object({
    productId: ValidationSchemas.uuid,
    rating: z.number().int().min(1).max(5),
    comment: ValidationSchemas.plainText.optional(),
  }),
};

/**
 * Validate and sanitize input
 */
export async function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const data = await schema.parseAsync(input);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

/**
 * Fastify plugin for automatic request validation
 */
export function createValidationPlugin(schema: z.ZodSchema) {
  return async (request: any, reply: any) => {
    const result = await validateInput(schema, request.body);
    
    if (!result.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
        errors: result.errors,
      });
    }

    // Replace request body with validated and sanitized data
    request.body = result.data;
  };
}

export default ValidationSchemas;
