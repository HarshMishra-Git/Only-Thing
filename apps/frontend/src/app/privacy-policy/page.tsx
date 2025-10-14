import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Only Thing',
  description: 'Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <ContentPage title="Privacy Policy">
        <p><strong>Effective Date:</strong> January 1, 2025</p>
        <p><strong>Last Updated:</strong> January 1, 2025</p>
        <p>
          Only Thing Health & Wellness LLP ("we," "our," or "us") is committed to protecting your 
          privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
          information when you visit our website or use our services.
        </p>
        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>When you create an account, place an order, or contact us, we may collect:</p>
        <ul>
          <li>Name and contact information (email, phone, address)</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Order history and preferences</li>
          <li>Skin assessment quiz responses</li>
        </ul>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Provide personalized product recommendations</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Improve our website and services</li>
        </ul>
        <h2>Contact Us</h2>
        <p>Email: privacy@onlything.com | Phone: 1800-XXX-XXXX</p>
      </ContentPage>
      <Footer />
    </>
  );
}
