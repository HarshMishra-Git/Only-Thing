import prisma from '../prisma/client';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { emailService } from './email.service';

export interface CreateOrderInput {
  addressId: string;
  paymentMethod: string;
  stripePaymentId?: string;
}

export class OrderService {
  async createOrder(userId: string, input: CreateOrderInput) {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: input.addressId,
        userId,
      },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price.toString()) * item.quantity;
    }, 0);

    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax (adjust as needed)
    const total = subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: input.addressId,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.stripePaymentId ? PaymentStatus.PAID : PaymentStatus.PENDING,
        stripePaymentId: input.stripePaymentId,
        status: OrderStatus.PENDING,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Clear cart after order creation
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Get user info for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true },
    });

    // Send order confirmation email (async)
    if (user) {
      emailService.sendOrderConfirmationEmail(user.email, {
        firstName: user.firstName || 'Customer',
        orderNumber: order.orderNumber,
        orderDate: order.createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        total: parseFloat(order.total.toString()),
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
        })),
        shippingAddress: {
          fullName: order.shippingAddress.fullName,
          streetAddress: order.shippingAddress.addressLine1,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipCode: order.shippingAddress.postalCode,
        },
        subtotal: parseFloat(order.subtotal.toString()),
        shipping: parseFloat(order.shipping.toString()),
        tax: parseFloat(order.tax.toString()),
      }).catch(err => {
        console.error('Failed to send order confirmation email:', err);
      });
    }

    return order;
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async getOrderByNumber(orderNumber: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: { email: true, firstName: true },
        },
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Send shipping notification email when status changes to SHIPPED
    if (status === OrderStatus.SHIPPED && order.user) {
      emailService.sendShippingNotificationEmail(order.user.email, {
        firstName: order.user.firstName || 'Customer',
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber || undefined,
        carrier: 'USPS', // Default carrier, can be customized
        estimatedDelivery: order.shippedAt 
          ? new Date(order.shippedAt.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : undefined,
        items: order.items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
        })),
      }).catch(err => {
        console.error('Failed to send shipping notification email:', err);
      });
    }

    return order;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, stripePaymentId?: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        stripePaymentId,
      },
    });
  }

  async getOrderStats(userId: string) {
    const [totalOrders, totalSpent] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      totalSpent: totalSpent._sum.total || 0,
    };
  }
}

export const orderService = new OrderService();
