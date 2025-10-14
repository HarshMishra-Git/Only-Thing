import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';

/**
 * Password security service
 * Handles password hashing, validation, and account lockout
 */
export class PasswordSecurityService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly PASSWORD_HISTORY_SIZE = 5;

  /**
   * Hash password with bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify password
   */
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Complexity checks
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push('Add special characters');

    // Common patterns (reduce score)
    const commonPatterns = [
      /^123+/,
      /^password/i,
      /^admin/i,
      /^qwerty/i,
      /(.)\1{2,}/, // Repeated characters
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        score = Math.max(0, score - 2);
        feedback.push('Avoid common patterns');
        break;
      }
    }

    return { score: Math.min(score, 5), feedback };
  }

  /**
   * Record failed login attempt
   */
  static async recordFailedLogin(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true },
    });

    if (!user) return;

    const attempts = (user.failedLoginAttempts || 0) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: attempts >= this.MAX_LOGIN_ATTEMPTS
          ? new Date(Date.now() + this.LOCKOUT_DURATION)
          : null,
      },
    });

    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      logger.warn({
        event: 'account_locked',
        userId,
        attempts,
      }, 'Account locked due to failed login attempts');
    }
  }

  /**
   * Reset failed login attempts on successful login
   */
  static async resetFailedLogins(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
  }

  /**
   * Check if account is locked
   */
  static async isAccountLocked(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (!user?.lockedUntil) return false;

    // Check if lockout has expired
    if (user.lockedUntil < new Date()) {
      // Unlock account
      await this.resetFailedLogins(userId);
      return false;
    }

    return true;
  }

  /**
   * Check if password was recently used (prevent reuse)
   */
  static async isPasswordRecentlyUsed(
    userId: string,
    newPassword: string
  ): Promise<boolean> {
    // Note: This requires a passwordHistory field in the User model
    // For now, we'll just check against current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) return false;

    return this.verifyPassword(newPassword, user.password);
  }

  /**
   * Validate password change request
   */
  static async validatePasswordChange(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ valid: boolean; error?: string }> {
    // Check if account is locked
    const isLocked = await this.isAccountLocked(userId);
    if (isLocked) {
      return { valid: false, error: 'Account is temporarily locked' };
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return { valid: false, error: 'User not found' };
    }

    // Verify current password
    const isCurrentValid = await this.verifyPassword(
      currentPassword,
      user.password
    );

    if (!isCurrentValid) {
      await this.recordFailedLogin(userId);
      return { valid: false, error: 'Current password is incorrect' };
    }

    // Check password strength
    const strength = this.checkPasswordStrength(newPassword);
    if (strength.score < 3) {
      return {
        valid: false,
        error: `Password too weak. ${strength.feedback.join(', ')}`,
      };
    }

    // Check if password was recently used
    const wasRecentlyUsed = await this.isPasswordRecentlyUsed(
      userId,
      newPassword
    );

    if (wasRecentlyUsed) {
      return {
        valid: false,
        error: 'Cannot reuse recent passwords',
      };
    }

    return { valid: true };
  }

  /**
   * Change user password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    // Validate password change
    const validation = await this.validatePasswordChange(
      userId,
      currentPassword,
      newPassword
    );

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });

    logger.info({
      event: 'password_changed',
      userId,
    }, 'User password changed successfully');

    return { success: true };
  }

  /**
   * Generate password reset token
   */
  static generateResetToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create password reset request
   */
  static async createPasswordReset(
    email: string
  ): Promise<{ success: boolean; token?: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    const token = this.generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database (you'll need a PasswordReset model)
    // For now, we'll store it in a separate table or in the user model

    logger.info({
      event: 'password_reset_requested',
      userId: user.id,
    }, 'Password reset token generated');

    return { success: true, token };
  }
}

export default PasswordSecurityService;
