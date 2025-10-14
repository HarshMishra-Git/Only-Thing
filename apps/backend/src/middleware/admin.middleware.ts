import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../utils/logger';

// Role hierarchy: SUPER_ADMIN > ADMIN > MANAGER > CUSTOMER
const ROLE_HIERARCHY = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  MANAGER: 2,
  CUSTOMER: 1,
};

export type AdminRole = keyof typeof ROLE_HIERARCHY;

/**
 * Check if user has required admin role
 */
export function hasRole(userRole: string, requiredRole: AdminRole): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as AdminRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

/**
 * Middleware to verify user is authenticated
 * Should be used before admin middleware
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
  } catch (error) {
    logger.warn('Authentication failed:', error);
    return reply.status(401).send({
      success: false,
      message: 'Authentication required',
    });
  }
}

/**
 * Middleware to verify user has minimum admin role
 */
export function requireAdmin(minRole: AdminRole = 'MANAGER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Ensure user is authenticated first
      await request.jwtVerify();
      
      const user = request.user as any;
      
      if (!user || !user.id) {
        return reply.status(401).send({
          success: false,
          message: 'Authentication required',
        });
      }

      // Check if user has required role
      if (!hasRole(user.role, minRole)) {
        logger.warn(`Access denied for user ${user.id}: insufficient role (${user.role} < ${minRole})`);
        return reply.status(403).send({
          success: false,
          message: 'Insufficient permissions. Admin access required.',
        });
      }

      // User has required role, continue
      logger.debug(`Admin access granted: ${user.email} (${user.role})`);
    } catch (error: any) {
      logger.error('Admin auth error:', error);
      return reply.status(401).send({
        success: false,
        message: 'Authentication failed',
      });
    }
  };
}

/**
 * Middleware specifically for super admin only operations
 */
export const requireSuperAdmin = requireAdmin('SUPER_ADMIN');

/**
 * Middleware for admin level operations
 */
export const requireAdminRole = requireAdmin('ADMIN');

/**
 * Middleware for manager level operations (default)
 */
export const requireManagerRole = requireAdmin('MANAGER');

/**
 * Check if current user can manage target user
 * Super admins can manage anyone
 * Admins can manage managers and customers
 * Managers can only manage customers
 */
export function canManageUser(
  currentUserRole: string,
  targetUserRole: string
): boolean {
  const currentLevel = ROLE_HIERARCHY[currentUserRole as AdminRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetUserRole as AdminRole] || 0;
  
  // Can manage users with lower role level
  return currentLevel > targetLevel;
}

/**
 * Utility to get user from request
 */
export function getAuthUser(request: FastifyRequest): any {
  return request.user;
}

/**
 * Check if user is admin (any admin role)
 */
export function isAdmin(role: string): boolean {
  return hasRole(role, 'MANAGER');
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(role: string): boolean {
  return role === 'SUPER_ADMIN';
}

export default {
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
  requireAdminRole,
  requireManagerRole,
  hasRole,
  canManageUser,
  getAuthUser,
  isAdmin,
  isSuperAdmin,
};
