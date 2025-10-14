import { Resend } from 'resend';
import {
  welcomeEmailTemplate,
  orderConfirmationEmailTemplate,
  shippingNotificationEmailTemplate,
  passwordResetEmailTemplate,
  contactFormEmailTemplate,
  type WelcomeEmailData,
  type OrderConfirmationData,
  type ShippingNotificationData,
  type PasswordResetData,
  type ContactFormData,
} from '../utils/email-templates';

export class EmailService {
  private resend: Resend | null = null;
  private fromEmail: string;
  private fromName: string;
  private enabled: boolean;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    this.fromName = process.env.FROM_NAME || 'SupplementStore';
    this.enabled = process.env.EMAIL_ENABLED !== 'false';

    if (apiKey && this.enabled) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn('Email service disabled: RESEND_API_KEY not configured or EMAIL_ENABLED=false');
    }
  }

  /**
   * Check if email service is enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.resend !== null;
  }

  /**
   * Send email using Resend
   */
  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isEnabled()) {
      console.log('Email not sent (service disabled):', params.subject);
      return { success: false, error: 'Email service is disabled' };
    }

    try {
      const result = await this.resend!.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });

      if (result.error) {
        console.error('Email send error:', result.error);
        return { success: false, error: result.error.message };
      }

      console.log('Email sent successfully:', result.data?.id);
      return { success: true, messageId: result.data?.id };
    } catch (error: any) {
      console.error('Email send exception:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(to: string, data: WelcomeEmailData) {
    return this.sendEmail({
      to,
      subject: 'Welcome to SupplementStore! 🎉',
      html: welcomeEmailTemplate(data),
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmationEmail(to: string, data: OrderConfirmationData) {
    return this.sendEmail({
      to,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: orderConfirmationEmailTemplate(data),
    });
  }

  /**
   * Send shipping notification email
   */
  async sendShippingNotificationEmail(to: string, data: ShippingNotificationData) {
    return this.sendEmail({
      to,
      subject: `Your Order Has Shipped! - ${data.orderNumber}`,
      html: shippingNotificationEmailTemplate(data),
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, data: PasswordResetData) {
    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html: passwordResetEmailTemplate(data),
    });
  }

  /**
   * Send contact form confirmation email
   */
  async sendContactFormEmail(to: string, data: ContactFormData) {
    return this.sendEmail({
      to,
      subject: 'We Received Your Message',
      html: contactFormEmailTemplate(data),
    });
  }

  /**
   * Send admin notification for contact form
   */
  async sendAdminContactNotification(data: ContactFormData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@supplementstore.com';
    
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `[Contact Form] ${data.subject}`,
      html,
    });
  }
}

export const emailService = new EmailService();
