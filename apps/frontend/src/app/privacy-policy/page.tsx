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
          <li>Authenticate your identity when you sign in</li>
        </ul>
        
        <h2>Google OAuth Authentication</h2>
        <p>
          We use Google OAuth for secure authentication. When you sign in with Google, we receive your:
        </p>
        <ul>
          <li>Name and email address</li>
          <li>Profile picture (if available)</li>
        </ul>
        <p>
          We DO NOT access, store, or share your Google password. Your Google credentials remain secure 
          with Google. We only use this information to authenticate your identity and provide you with 
          a personalized experience on our platform.
        </p>
        
        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your personal information. Your 
          payment information is processed through secure, PCI-compliant payment providers and is never 
          stored on our servers.
        </p>
        
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
        
        <h2>Third-Party Services</h2>
        <p>
          We use trusted third-party services for authentication (Google), payment processing, 
          and analytics. These services have their own privacy policies and handle data according 
          to their terms.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or how we handle your data, please contact us:
        </p>
        <p>
          <strong>Email:</strong> privacy@onlything.com<br />
          <strong>Address:</strong> Only Thing Health & Wellness LLP, India
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}

