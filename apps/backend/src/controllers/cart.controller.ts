import { FastifyRequest, FastifyReply } from 'fastify';
import { cartService, AddToCartInput } from '../services/cart.service';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

const syncCartSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })),
});

export class CartController {
  async getCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const cart = await cartService.getCart(request.user.userId);

      return reply.send({ cart });
    } catch (error: any) {
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to get cart',
      });
    }
  }

  async addToCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const validatedData = addToCartSchema.parse(request.body);

      const item = await cartService.addToCart(
        request.user.userId,
        validatedData as AddToCartInput
      );

      return reply.code(201).send({
        message: 'Item added to cart',
        item,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: error.errors[0].message,
        });
      }

      if (error.message === 'Product not found') {
        return reply.code(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }

      if (error.message.includes('out of stock') || error.message.includes('items available')) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to add item to cart',
      });
    }
  }

  async updateCartItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const { itemId } = request.params as { itemId: string };
      const validatedData = updateCartItemSchema.parse(request.body);

      const result = await cartService.updateCartItem(
        request.user.userId,
        itemId,
        validatedData.quantity
      );

      return reply.send(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: error.errors[0].message,
        });
      }

      if (error.message === 'Cart item not found') {
        return reply.code(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }

      if (error.message.includes('items available')) {
        return reply.code(400).send({
          error: 'Bad Request',
          message: error.message,
        });
      }

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to update cart item',
      });
    }
  }

  async removeCartItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const { itemId } = request.params as { itemId: string };

      const result = await cartService.removeCartItem(request.user.userId, itemId);

      return reply.send(result);
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        return reply.code(404).send({
          error: 'Not Found',
          message: error.message,
        });
      }

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to remove cart item',
      });
    }
  }

  async clearCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const result = await cartService.clearCart(request.user.userId);

      return reply.send(result);
    } catch (error: any) {
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to clear cart',
      });
    }
  }

  async syncCart(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required',
        });
      }

      const validatedData = syncCartSchema.parse(request.body);

      const cart = await cartService.syncCart(request.user.userId, validatedData.items);

      return reply.send({ cart });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          message: error.errors[0].message,
        });
      }

      return reply.code(500).send({
        error: 'Internal Server Error',
        message: 'Failed to sync cart',
      });
    }
  }
}

export const cartController = new CartController();
