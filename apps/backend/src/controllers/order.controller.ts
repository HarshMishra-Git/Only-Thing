import { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from '../services/order.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

interface CreateOrderBody {
  addressId: string;
  paymentMethod: string;
  stripePaymentId?: string;
}

interface UpdateOrderStatusBody {
  status: OrderStatus;
}

interface GetOrdersQuery {
  page?: string;
  limit?: string;
}

export class OrderController {
  async createOrder(
    request: FastifyRequest<{ Body: CreateOrderBody }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const { addressId, paymentMethod, stripePaymentId } = request.body;

      if (!addressId || !paymentMethod) {
        return reply.status(400).send({
          success: false,
          error: 'Address ID and payment method are required',
        });
      }

      const order = await orderService.createOrder(userId, {
        addressId,
        paymentMethod,
        stripePaymentId,
      });

      return reply.status(201).send({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error('Create order error:', error);
      return reply.status(400).send({
        success: false,
        error: error.message || 'Failed to create order',
      });
    }
  }

  async getUserOrders(
    request: FastifyRequest<{ Querystring: GetOrdersQuery }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const page = parseInt(request.query.page || '1', 10);
      const limit = parseInt(request.query.limit || '10', 10);

      const result = await orderService.getUserOrders(userId, page, limit);

      return reply.send({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error: any) {
      console.error('Get user orders error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch orders',
      });
    }
  }

  async getOrderById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const { id } = request.params;

      const order = await orderService.getOrderById(id, userId);

      return reply.send({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error('Get order error:', error);
      return reply.status(404).send({
        success: false,
        error: error.message || 'Order not found',
      });
    }
  }

  async getOrderByNumber(
    request: FastifyRequest<{ Params: { orderNumber: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user!.id;
      const { orderNumber } = request.params;

      const order = await orderService.getOrderByNumber(orderNumber, userId);

      return reply.send({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error('Get order by number error:', error);
      return reply.status(404).send({
        success: false,
        error: error.message || 'Order not found',
      });
    }
  }

  async updateOrderStatus(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateOrderStatusBody;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const { status } = request.body;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid order status',
        });
      }

      const order = await orderService.updateOrderStatus(id, status);

      return reply.send({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error('Update order status error:', error);
      return reply.status(400).send({
        success: false,
        error: 'Failed to update order status',
      });
    }
  }

  async getOrderStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user!.id;
      const stats = await orderService.getOrderStats(userId);

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Get order stats error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch order stats',
      });
    }
  }
}

export const orderController = new OrderController();
