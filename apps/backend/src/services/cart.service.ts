import prisma from '../prisma/client';

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export class CartService {
  async getCart(userId: string) {
    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                inStock: true,
                stockQuantity: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  inStock: true,
                  stockQuantity: true,
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(userId: string, input: AddToCartInput) {
    // Verify product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (!product.inStock || product.stockQuantity < input.quantity) {
      throw new Error('Product is out of stock');
    }

    // Get cart
    const cart = await this.getCart(userId);

    // Check if item already exists
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: input.productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + input.quantity;

      if (newQuantity > product.stockQuantity) {
        throw new Error(`Only ${product.stockQuantity} items available`);
      }

      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
            },
          },
        },
      });
    } else {
      // Create new cart item
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: input.productId,
          quantity: input.quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
            },
          },
        },
      });
    }
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
      return { message: 'Item removed from cart' };
    }

    // Check stock
    if (quantity > cartItem.product.stockQuantity) {
      throw new Error(`Only ${cartItem.product.stockQuantity} items available`);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
          },
        },
      },
    });
  }

  async removeCartItem(userId: string, itemId: string) {
    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared' };
  }

  async syncCart(userId: string, items: any[]) {
    const cart = await this.getCart(userId);

    // Clear existing items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Add new items
    if (items.length > 0) {
      await prisma.cartItem.createMany({
        data: items.map(item => ({
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return this.getCart(userId);
  }
}

export const cartService = new CartService();
