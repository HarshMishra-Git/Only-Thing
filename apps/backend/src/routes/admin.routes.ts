import { FastifyPluginAsync } from 'fastify';
import adminController from '../controllers/admin.controller';
import { requireManagerRole, requireAdminRole } from '../middleware/admin.middleware';

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // ============ DASHBOARD ============
  fastify.get('/dashboard/overview', {
    onRequest: [requireManagerRole],
  }, adminController.getOverview.bind(adminController));

  fastify.get('/dashboard/revenue', {
    onRequest: [requireManagerRole],
  }, adminController.getRevenueData.bind(adminController));

  fastify.get('/dashboard/top-products', {
    onRequest: [requireManagerRole],
  }, adminController.getTopProducts.bind(adminController));

  fastify.get('/dashboard/recent-orders', {
    onRequest: [requireManagerRole],
  }, adminController.getRecentOrders.bind(adminController));

  fastify.get('/dashboard/low-stock', {
    onRequest: [requireManagerRole],
  }, adminController.getLowStockAlerts.bind(adminController));

  // ============ USERS ============
  fastify.get('/users', {
    onRequest: [requireManagerRole],
  }, adminController.getUsers.bind(adminController));

  fastify.get('/users/:id', {
    onRequest: [requireManagerRole],
  }, adminController.getUserById.bind(adminController));

  fastify.put('/users/:id/role', {
    onRequest: [requireAdminRole], // Only admins can change roles
  }, adminController.updateUserRole.bind(adminController));

  fastify.patch('/users/:id/status', {
    onRequest: [requireAdminRole], // Only admins can suspend users
  }, adminController.toggleUserStatus.bind(adminController));

  // ============ ORDERS ============
  fastify.get('/orders', {
    onRequest: [requireManagerRole],
  }, adminController.getOrders.bind(adminController));

  fastify.patch('/orders/:id/status', {
    onRequest: [requireManagerRole],
  }, adminController.updateOrderStatus.bind(adminController));

  // ============ PRODUCTS ============
  fastify.get('/products', {
    onRequest: [requireManagerRole],
  }, adminController.getProducts.bind(adminController));

  fastify.patch('/products/:id/stock', {
    onRequest: [requireManagerRole],
  }, adminController.updateProductStock.bind(adminController));

  fastify.get('/products/:id/inventory-logs', {
    onRequest: [requireManagerRole],
  }, adminController.getInventoryLogs.bind(adminController));
};
