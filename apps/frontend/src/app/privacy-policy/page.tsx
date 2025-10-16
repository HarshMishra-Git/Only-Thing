import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Only Thing',
  description: 'Learn how Only Thing Health & Wellness LLP collects, uses, and protects your personal data with transparency and compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <ContentPage title="Privacy Policy">
        <p><strong>Effective Date:</strong> 15/10/2025</p>
        <p><strong>Only Thing Health & Wellness LLP</strong></p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to Only Thing Health & Wellness LLP. We are committed to protecting your personal data 
          and ensuring transparency in how we collect, use, and safeguard your information.
        </p>
        <p>
          This Privacy Policy explains how we handle your data when you visit our website, create an account, 
          make purchases, subscribe to our wellness programs, or use our digital health services.
        </p>
        <p>
          By using our website, you agree to the practices described here.
        </p>
        <h2>2. Information We Collect</h2>
        <p>
          We collect information to deliver personalized, intelligent wellness experiences and seamless 
          e-commerce services.
        </p>
        
        <h3>a. Personal Information</h3>
        <ul>
          <li>Name, email address, contact number</li>
          <li>Billing and shipping address</li>
          <li>Age, gender, and preferences (if voluntarily shared)</li>
          <li>Payment details</li>
        </ul>
        
        <h3>b. Account Information</h3>
        <ul>
          <li>Username and password (encrypted)</li>
          <li>Order history, saved products, subscription preferences</li>
          <li>Communication preferences</li>
        </ul>
        
        <h3>c. Wellness & Health Information (optional and consent-based)</h3>
        <ul>
          <li>Data related to your wellness goals, routines, or questionnaire results</li>
          <li>Inputs shared through wellness consultations or intelligent analysis tools</li>
        </ul>
        
        <h3>d. Technical & Device Data</h3>
        <ul>
          <li>IP address, browser type, device information</li>
          <li>Cookies, pixel tags, and analytics data</li>
        </ul>
        <h2>3. How We Use Your Data</h2>
        <p>We use your information responsibly to provide smarter, more relevant experiences:</p>
        <ul>
          <li>To process orders, payments, and deliveries</li>
          <li>To personalize product recommendations and wellness solutions</li>
          <li>To manage user accounts, loyalty programs, and subscriptions</li>
          <li>To communicate offers, insights, and updates</li>
          <li>To enhance website performance, marketing, and product innovation</li>
          <li>To conduct research, analytics, and AI-driven personalization</li>
          <li>To comply with legal or regulatory obligations</li>
        </ul>
        
        <h2>4. Intelligent Personalization & AI Insights</h2>
        <p>
          As part of our "Intelligent Wellness" ecosystem, we may use anonymized data and AI analytics to:
        </p>
        <ul>
          <li>Understand usage patterns and preferences</li>
          <li>Recommend personalized skincare or supplement plans</li>
          <li>Improve our predictive and adaptive product development</li>
        </ul>
        <p>
          All such data is handled in compliance with India's Digital Personal Data Protection Act, 2023, 
          ensuring user consent, transparency, and privacy-by-design.
        </p>
        
        <h2>5. Cookies & Tracking Technologies</h2>
        <p>We use cookies and similar technologies to:</p>
        <ul>
          <li>Remember your preferences and login information</li>
          <li>Track website usage for analytics and performance</li>
          <li>Show relevant ads and offers across platforms</li>
        </ul>
        <p>
          You can manage or disable cookies via your browser settings. However, disabling them may 
          affect your shopping experience.
        </p>
        
        <h2>6. Data Protection & Security</h2>
        <p>We follow strict industry standards to secure your data, including:</p>
        <ul>
          <li>SSL encryption and secure HTTPS protocol</li>
          <li>Restricted access to authorized personnel only</li>
          <li>Secure cloud storage and periodic vulnerability audits</li>
        </ul>
        <p>
          While we strive to ensure full protection, no online platform is completely risk-free. 
          You use our services at your discretion.
        </p>
        
        <h2>7. Data Retention</h2>
        <p>
          We retain personal data only as long as necessary for transactions, legal obligations, or service continuity.
          You can request data deletion by contacting us (see Section 11).
        </p>
        
        <h2>8. Sharing of Information</h2>
        <p>We never sell your personal data.</p>
        <p>We may share information only with:</p>
        <ul>
          <li>Trusted service partners (payment gateways, courier partners, IT providers, analytics) under strict confidentiality</li>
          <li>Regulatory authorities if required by law</li>
          <li>Business partners or successors in case of merger, acquisition, or restructuring, with due notice to users</li>
        </ul>
        
        <h2>9. Your Rights & Choices</h2>
        <p>You have full control over your data. You can:</p>
        <ul>
          <li>Access, update, or delete your information</li>
          <li>Withdraw consent for processing</li>
          <li>Opt out of marketing communications</li>
          <li>Request details about how your data is used</li>
        </ul>
        <p>To exercise these rights, email us at info@only-thing.com</p>
        
        <h2>10. Children's Privacy</h2>
        <p>
          Our products and website are intended for users 18 years and older.
          We do not knowingly collect personal information from minors.
        </p>
        
        <h2>11. Contact Us</h2>
        <p>For privacy-related concerns or data requests, please contact:</p>
        <p>
          <strong>Only Thing Health & Wellness LLP</strong><br />
          <strong>Email:</strong> info@only-thing.com
        </p>
        
        <h2>12. Policy Updates</h2>
        <p>
          We may update this Privacy Policy periodically to reflect new regulations, technologies, 
          or service offerings.
        </p>
        <p>
          Updated versions will be posted on this page with a revised "Effective Date."
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}

