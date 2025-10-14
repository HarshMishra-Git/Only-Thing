import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

/**
 * Swagger/OpenAPI Configuration
 * Provides interactive API documentation
 */
export async function setupSwagger(app: FastifyInstance) {
  // Register Swagger plugin
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'E-Commerce Platform API',
        description: 'Complete REST API for the e-commerce platform with authentication, products, orders, and payments',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'api@yourstore.com',
          url: 'https://yourstore.com/support',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3001',
          description: 'Development server',
        },
        {
          url: 'https://api-staging.yourstore.com',
          description: 'Staging server',
        },
        {
          url: 'https://api.yourstore.com',
          description: 'Production server',
        },
      ],
      tags: [
        { name: 'Authentication', description: 'User authentication endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'Products', description: 'Product catalog endpoints' },
        { name: 'Categories', description: 'Category management endpoints' },
        { name: 'Cart', description: 'Shopping cart endpoints' },
        { name: 'Orders', description: 'Order management endpoints' },
        { name: 'Payments', description: 'Payment processing endpoints' },
        { name: 'Reviews', description: 'Product review endpoints' },
        { name: 'Wishlist', description: 'User wishlist endpoints' },
        { name: 'Admin', description: 'Admin-only endpoints' },
        { name: 'Health', description: 'System health checks' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token',
          },
          apiKey: {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            description: 'API Key for third-party integrations',
          },
        },
        schemas: {
          // User schemas
          User: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              name: { type: 'string' },
              role: { type: 'string', enum: ['USER', 'ADMIN'] },
              avatar: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          UserRegistration: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string', minLength: 8 },
              name: { type: 'string', minLength: 2 },
            },
          },
          UserLogin: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
            },
          },
          AuthResponse: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              refreshToken: { type: 'string' },
              user: { $ref: '#/components/schemas/User' },
            },
          },

          // Product schemas
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number', format: 'decimal' },
              compareAtPrice: { type: 'number', format: 'decimal', nullable: true },
              images: { type: 'array', items: { type: 'string' } },
              stock: { type: 'integer' },
              sku: { type: 'string' },
              category: { $ref: '#/components/schemas/Category' },
              tags: { type: 'array', items: { type: 'string' } },
              rating: { type: 'number', format: 'float' },
              reviewCount: { type: 'integer' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          ProductCreate: {
            type: 'object',
            required: ['name', 'price', 'categoryId'],
            properties: {
              name: { type: 'string', minLength: 3 },
              description: { type: 'string' },
              price: { type: 'number', minimum: 0 },
              compareAtPrice: { type: 'number', minimum: 0 },
              images: { type: 'array', items: { type: 'string' } },
              stock: { type: 'integer', minimum: 0 },
              sku: { type: 'string' },
              categoryId: { type: 'string', format: 'uuid' },
              tags: { type: 'array', items: { type: 'string' } },
            },
          },

          // Category schemas
          Category: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              slug: { type: 'string' },
              description: { type: 'string', nullable: true },
              image: { type: 'string', nullable: true },
              parentId: { type: 'string', format: 'uuid', nullable: true },
              productCount: { type: 'integer' },
            },
          },

          // Cart schemas
          Cart: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/CartItem' },
              },
              subtotal: { type: 'number', format: 'decimal' },
              tax: { type: 'number', format: 'decimal' },
              total: { type: 'number', format: 'decimal' },
            },
          },
          CartItem: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              product: { $ref: '#/components/schemas/Product' },
              quantity: { type: 'integer', minimum: 1 },
              price: { type: 'number', format: 'decimal' },
            },
          },
          AddToCart: {
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
              productId: { type: 'string', format: 'uuid' },
              quantity: { type: 'integer', minimum: 1 },
            },
          },

          // Order schemas
          Order: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              orderNumber: { type: 'string' },
              user: { $ref: '#/components/schemas/User' },
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/OrderItem' },
              },
              status: {
                type: 'string',
                enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
              },
              subtotal: { type: 'number', format: 'decimal' },
              tax: { type: 'number', format: 'decimal' },
              shipping: { type: 'number', format: 'decimal' },
              total: { type: 'number', format: 'decimal' },
              shippingAddress: { $ref: '#/components/schemas/Address' },
              paymentMethod: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          OrderItem: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              product: { $ref: '#/components/schemas/Product' },
              quantity: { type: 'integer' },
              price: { type: 'number', format: 'decimal' },
            },
          },
          OrderCreate: {
            type: 'object',
            required: ['items', 'shippingAddress', 'paymentMethod'],
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    productId: { type: 'string', format: 'uuid' },
                    quantity: { type: 'integer', minimum: 1 },
                  },
                },
              },
              shippingAddress: { $ref: '#/components/schemas/Address' },
              paymentMethod: { type: 'string' },
            },
          },

          // Address schema
          Address: {
            type: 'object',
            required: ['street', 'city', 'state', 'zip', 'country'],
            properties: {
              street: { type: 'string' },
              street2: { type: 'string', nullable: true },
              city: { type: 'string' },
              state: { type: 'string' },
              zip: { type: 'string' },
              country: { type: 'string' },
            },
          },

          // Review schemas
          Review: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              user: { $ref: '#/components/schemas/User' },
              product: { $ref: '#/components/schemas/Product' },
              rating: { type: 'integer', minimum: 1, maximum: 5 },
              title: { type: 'string' },
              comment: { type: 'string' },
              verified: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          ReviewCreate: {
            type: 'object',
            required: ['rating', 'title', 'comment'],
            properties: {
              rating: { type: 'integer', minimum: 1, maximum: 5 },
              title: { type: 'string', minLength: 5 },
              comment: { type: 'string', minLength: 10 },
            },
          },

          // Error schemas
          Error: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          ValidationError: {
            type: 'object',
            properties: {
              statusCode: { type: 'integer', example: 400 },
              error: { type: 'string', example: 'Bad Request' },
              message: { type: 'string' },
              validation: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },

          // Pagination
          PaginationMeta: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              pageSize: { type: 'integer' },
              totalPages: { type: 'integer' },
              hasNext: { type: 'boolean' },
              hasPrev: { type: 'boolean' },
            },
          },
          ProductList: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Product' },
              },
              meta: { $ref: '#/components/schemas/PaginationMeta' },
            },
          },
        },
      },
    },
  });

  // Register Swagger UI
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });

  // Log the documentation URL
  app.log.info('API documentation available at /docs');
}
