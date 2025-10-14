/**
 * Email Template Utilities
 * Generates HTML email templates with consistent styling
 */

interface EmailLayoutProps {
  title: string;
  preheader?: string;
  content: string;
}

/**
 * Base email layout with consistent branding
 */
export function emailLayout({ title, preheader, content }: EmailLayoutProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 16px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .divider {
      border: 0;
      border-top: 1px solid #e5e7eb;
      margin: 24px 0;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    .order-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    h2 {
      color: #1f2937;
      font-size: 20px;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
      margin: 12px 0;
    }
    .text-sm {
      font-size: 14px;
    }
    .text-muted {
      color: #6b7280;
    }
    .font-bold {
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
  
  <div class="email-container">
    <div class="header">
      <h1>🏋️ SupplementStore</h1>
    </div>
    
    <div class="content">
      ${content}
    </div>
    
    <div class="footer">
      <p>
        <strong>SupplementStore</strong><br>
        Your trusted source for premium supplements
      </p>
      <p class="text-sm text-muted">
        You received this email because you have an account with SupplementStore.<br>
        If you have any questions, contact us at support@supplementstore.com
      </p>
      <p class="text-sm text-muted">
        © ${new Date().getFullYear()} SupplementStore. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Welcome Email Template
 */
export interface WelcomeEmailData {
  firstName: string;
  email: string;
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  const content = `
    <h2>Welcome to SupplementStore, ${data.firstName}! 🎉</h2>
    
    <p>
      Thank you for joining our community of fitness enthusiasts! We're excited to help you achieve your health and fitness goals.
    </p>
    
    <div class="info-box">
      <p class="font-bold" style="margin: 0;">Your account is ready!</p>
      <p class="text-sm" style="margin: 8px 0 0 0;">Email: ${data.email}</p>
    </div>
    
    <p>Here's what you can do now:</p>
    <ul>
      <li>Browse our premium supplement collection</li>
      <li>Take our personalized quiz to find products perfect for you</li>
      <li>Add items to your cart and checkout securely</li>
      <li>Track your orders in real-time</li>
    </ul>
    
    <center>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/quiz" class="button">
        Take Our Quiz
      </a>
    </center>
    
    <hr class="divider">
    
    <p class="text-sm text-muted">
      Need help getting started? Check out our <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/shop">product catalog</a> or contact our support team.
    </p>
  `;

  return emailLayout({
    title: 'Welcome to SupplementStore',
    preheader: 'Your account has been created successfully',
    content,
  });
}

/**
 * Order Confirmation Email Template
 */
export interface OrderConfirmationData {
  firstName: string;
  orderNumber: string;
  orderDate: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
}

export function orderConfirmationEmailTemplate(data: OrderConfirmationData): string {
  const itemsHtml = data.items.map(item => `
    <div class="order-item">
      <div style="flex: 1;">
        <p style="margin: 0; font-weight: 600;">${item.name}</p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Qty: ${item.quantity}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  `).join('');

  const content = `
    <h2>Order Confirmed! 🎉</h2>
    
    <p>Hi ${data.firstName},</p>
    
    <p>
      Thank you for your order! We've received your order and will begin processing it right away.
    </p>
    
    <div class="info-box">
      <p style="margin: 0;"><span class="font-bold">Order Number:</span> ${data.orderNumber}</p>
      <p style="margin: 8px 0 0 0;"><span class="font-bold">Order Date:</span> ${data.orderDate}</p>
    </div>
    
    <h3 style="margin-top: 32px;">Order Summary</h3>
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
      ${itemsHtml}
      
      <hr class="divider">
      
      <div style="display: flex; justify-content: space-between; margin: 8px 0;">
        <span>Subtotal</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 8px 0;">
        <span>Shipping</span>
        <span>${data.shipping === 0 ? 'FREE' : '$' + data.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin: 8px 0;">
        <span>Tax</span>
        <span>$${data.tax.toFixed(2)}</span>
      </div>
      
      <hr class="divider">
      
      <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700;">
        <span>Total</span>
        <span>$${data.total.toFixed(2)}</span>
      </div>
    </div>
    
    <h3 style="margin-top: 32px;">Shipping Address</h3>
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
      <p style="margin: 0; font-weight: 600;">${data.shippingAddress.fullName}</p>
      <p style="margin: 4px 0;">${data.shippingAddress.streetAddress}</p>
      <p style="margin: 4px 0;">
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
      </p>
    </div>
    
    <center>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders" class="button">
        View Order Details
      </a>
    </center>
    
    <hr class="divider">
    
    <p class="text-sm text-muted">
      You'll receive another email when your order ships. Track your order anytime in your account.
    </p>
  `;

  return emailLayout({
    title: 'Order Confirmation',
    preheader: `Order ${data.orderNumber} confirmed`,
    content,
  });
}

/**
 * Shipping Notification Email Template
 */
export interface ShippingNotificationData {
  firstName: string;
  orderNumber: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export function shippingNotificationEmailTemplate(data: ShippingNotificationData): string {
  const itemsList = data.items.map(item => 
    `<li>${item.name} (x${item.quantity})</li>`
  ).join('');

  const content = `
    <h2>Your Order Has Shipped! 📦</h2>
    
    <p>Hi ${data.firstName},</p>
    
    <p>
      Great news! Your order is on its way. We've packed everything with care and handed it over to the carrier.
    </p>
    
    <div class="info-box">
      <p style="margin: 0;"><span class="font-bold">Order Number:</span> ${data.orderNumber}</p>
      ${data.trackingNumber ? `<p style="margin: 8px 0 0 0;"><span class="font-bold">Tracking Number:</span> ${data.trackingNumber}</p>` : ''}
      ${data.carrier ? `<p style="margin: 8px 0 0 0;"><span class="font-bold">Carrier:</span> ${data.carrier}</p>` : ''}
      ${data.estimatedDelivery ? `<p style="margin: 8px 0 0 0;"><span class="font-bold">Estimated Delivery:</span> ${data.estimatedDelivery}</p>` : ''}
    </div>
    
    <h3>Items Shipped:</h3>
    <ul>
      ${itemsList}
    </ul>
    
    ${data.trackingNumber ? `
      <center>
        <a href="https://www.google.com/search?q=${data.trackingNumber}" class="button">
          Track Your Package
        </a>
      </center>
    ` : ''}
    
    <hr class="divider">
    
    <p class="text-sm text-muted">
      Questions about your delivery? Contact our support team and we'll be happy to help!
    </p>
  `;

  return emailLayout({
    title: 'Your Order Has Shipped',
    preheader: `Order ${data.orderNumber} is on the way`,
    content,
  });
}

/**
 * Password Reset Email Template
 */
export interface PasswordResetData {
  firstName: string;
  resetToken: string;
  expiresIn: string;
}

export function passwordResetEmailTemplate(data: PasswordResetData): string {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${data.resetToken}`;

  const content = `
    <h2>Password Reset Request 🔒</h2>
    
    <p>Hi ${data.firstName},</p>
    
    <p>
      We received a request to reset your password. Click the button below to choose a new password.
    </p>
    
    <center>
      <a href="${resetUrl}" class="button">
        Reset Password
      </a>
    </center>
    
    <div class="info-box">
      <p style="margin: 0;" class="text-sm">
        <strong>Important:</strong> This link will expire in ${data.expiresIn}. 
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
    
    <p class="text-sm text-muted">
      For security reasons, this password reset link will only work once. 
      If you need to reset your password again, you'll need to request a new link.
    </p>
    
    <hr class="divider">
    
    <p class="text-sm text-muted">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}">${resetUrl}</a>
    </p>
  `;

  return emailLayout({
    title: 'Password Reset Request',
    preheader: 'Reset your SupplementStore password',
    content,
  });
}

/**
 * Contact Form Confirmation Email Template
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactFormEmailTemplate(data: ContactFormData): string {
  const content = `
    <h2>Thank You for Contacting Us! 💬</h2>
    
    <p>Hi ${data.name},</p>
    
    <p>
      Thank you for reaching out to SupplementStore. We've received your message and our team will get back to you as soon as possible, typically within 24-48 hours.
    </p>
    
    <h3>Your Message:</h3>
    <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
      <p style="margin: 0;"><strong>Subject:</strong> ${data.subject}</p>
      <p style="margin: 12px 0 0 0;">${data.message}</p>
    </div>
    
    <div class="info-box" style="margin-top: 24px;">
      <p style="margin: 0;" class="text-sm">
        <strong>Reference Number:</strong> CF-${Date.now()}<br>
        Include this number in any follow-up communication.
      </p>
    </div>
    
    <hr class="divider">
    
    <p class="text-sm text-muted">
      In the meantime, you might find answers in our <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/faq">FAQ section</a>.
    </p>
  `;

  return emailLayout({
    title: 'Message Received',
    preheader: 'We got your message and will respond soon',
    content,
  });
}
