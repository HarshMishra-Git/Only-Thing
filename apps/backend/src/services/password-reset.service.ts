import crypto from 'crypto';
import prisma from '../prisma/client';
import { authService } from './auth.service';
import { emailService } from './email.service';

interface PasswordResetToken {
  token: string;
  userId: string;
  expiresAt: Date;
}

export class PasswordResetService {
  private resetTokens: Map<string, PasswordResetToken> = new Map();
  private readonly TOKEN_EXPIRY_HOURS = 1;

  /**
   * Generate a secure reset token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Request password reset - sends email with token
   */
  async requestPasswordReset(email: string) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
      },
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      console.log('Password reset requested for non-existent email:', email);
      return { success: true };
    }

    // Generate reset token
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.TOKEN_EXPIRY_HOURS);

    // Store token (in production, use database with TTL)
    this.resetTokens.set(token, {
      token,
      userId: user.id,
      expiresAt,
    });

    // Clean up expired tokens
    this.cleanupExpiredTokens();

    // Send password reset email
    emailService.sendPasswordResetEmail(user.email, {
      firstName: user.firstName || 'User',
      resetToken: token,
      expiresIn: `${this.TOKEN_EXPIRY_HOURS} hour${this.TOKEN_EXPIRY_HOURS > 1 ? 's' : ''}`,
    }).catch(err => {
      console.error('Failed to send password reset email:', err);
    });

    return { success: true };
  }

  /**
   * Verify reset token is valid
   */
  async verifyResetToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    const resetToken = this.resetTokens.get(token);

    if (!resetToken) {
      return { valid: false };
    }

    // Check if token expired
    if (new Date() > resetToken.expiresAt) {
      this.resetTokens.delete(token);
      return { valid: false };
    }

    return { valid: true, userId: resetToken.userId };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string) {
    // Verify token
    const verification = await this.verifyResetToken(token);

    if (!verification.valid || !verification.userId) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await authService.hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: verification.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    this.resetTokens.delete(token);

    return { success: true };
  }

  /**
   * Clean up expired tokens
   */
  private cleanupExpiredTokens() {
    const now = new Date();
    for (const [token, data] of this.resetTokens.entries()) {
      if (now > data.expiresAt) {
        this.resetTokens.delete(token);
      }
    }
  }
}

export const passwordResetService = new PasswordResetService();
