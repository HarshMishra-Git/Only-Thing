import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information | Only Thing',
  description: 'Learn about our shipping options, delivery times, and policies.',
};

export default function ShippingPage() {
  return (
    <>
      <Header />
      <ContentPage title="Shipping Information">
        <p>
          We want your Only Thing products to reach you quickly and safely. Here's everything 
          you need to know about our shipping options and policies.
        </p>

        <h2>Shipping Options</h2>
        
        <h3>Standard Shipping (Free on orders over ₹1,500)</h3>
        <ul>
          <li>Delivery Time: 5-7 business days</li>
          <li>Cost: ₹99 for orders under ₹1,500</li>
          <li>Available: Pan-India</li>
        </ul>

        <h3>Express Shipping</h3>
        <ul>
          <li>Delivery Time: 2-3 business days</li>
          <li>Cost: ₹199</li>
          <li>Available: Major cities</li>
        </ul>

        <h3>Same-Day Delivery</h3>
        <ul>
          <li>Delivery Time: Within 24 hours</li>
          <li>Cost: ₹299</li>
          <li>Available: Select metro areas (Delhi NCR, Mumbai, Bangalore, Hyderabad)</li>
          <li>Order before 2 PM for same-day delivery</li>
        </ul>

        <h2>Processing Time</h2>
        <p>
          Orders are typically processed and shipped within 1-2 business days. You'll receive a 
          confirmation email with tracking information once your order ships.
        </p>

        <h2>Order Tracking</h2>
        <p>
          Track your order status in real-time:
        </p>
        <ul>
          <li>Check your email for shipping confirmation and tracking number</li>
          <li>Visit our Order Tracking page and enter your order number</li>
          <li>Log into your account to view all order history</li>
        </ul>

        <h2>International Shipping</h2>
        <p>
          We currently ship within India only. International shipping will be available soon.
        </p>

        <h2>Packaging</h2>
        <p>
          All products are carefully packaged to ensure they arrive in perfect condition:
        </p>
        <ul>
          <li>Eco-friendly, recyclable packaging materials</li>
          <li>Temperature-controlled shipping for sensitive formulations</li>
          <li>Protective cushioning to prevent damage</li>
          <li>Discreet packaging with no external branding</li>
        </ul>

        <h2>Delivery Issues</h2>
        <p>
          If you experience any issues with your delivery:
        </p>
        <ul>
          <li><strong>Delayed Delivery:</strong> Contact us if your order hasn't arrived within the estimated timeframe</li>
          <li><strong>Damaged Package:</strong> Take photos and contact us immediately</li>
          <li><strong>Missing Items:</strong> We'll resolve this within 24 hours</li>
          <li><strong>Wrong Address:</strong> Contact us immediately to redirect your package</li>
        </ul>

        <h2>Carbon-Neutral Shipping</h2>
        <p>
          We offset 100% of shipping emissions through verified carbon credit programs, making 
          every delivery carbon-neutral at no extra cost to you.
        </p>

        <h2>Contact</h2>
        <p>
          For shipping questions or concerns, contact our customer service team at 
          shipping@onlything.com or call 1800-XXX-XXXX (Mon-Fri, 9 AM - 6 PM IST).
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}
