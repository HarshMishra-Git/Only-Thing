import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Only Thing',
  description: 'Read the terms and conditions for using Only Thing Health & Wellness services, products, and website.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <ContentPage title="Terms of Service">
        <p><strong>Effective Date:</strong> 15/10/2025</p>
        <p><strong>Only Thing Health & Wellness LLP</strong></p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Only Thing Health & Wellness website, and digital services ("Services"), 
          you agree to these Terms of Service ("Terms"). If you do not agree, you must not use our Services.
        </p>
        
        <h2>2. Eligibility</h2>
        <ul>
          <li>You must be 18 years or older to use our Services.</li>
          <li>By using our Services, you confirm that you have legal capacity to enter into this agreement.</li>
        </ul>
        
        <h2>3. Account Registration & Security</h2>
        <ul>
          <li>Some Services require creating an account. You must provide accurate, current, and complete information.</li>
          <li>You are responsible for maintaining account credentials and all activity under your account.</li>
          <li>Notify us immediately of any unauthorized access.</li>
        </ul>
        
        <h2>4. Products & Services</h2>
        <ul>
          <li>All products (skincare, supplements, wellness solutions) are intended for personal use only.</li>
          <li>Product images, descriptions, and pricing are indicative and may vary slightly.</li>
          <li>We reserve the right to modify, update, or discontinue products at any time without notice.</li>
        </ul>
        <h2>5. Orders & Payments</h2>
        <ul>
          <li>Orders are subject to acceptance and product availability.</li>
          <li>Payments are processed securely via third-party gateways.</li>
          <li>Prices are listed in INR, plus applicable taxes and shipping charges.</li>
          <li>By completing a purchase, you authorize us to charge your selected payment method.</li>
        </ul>
        
        <h2>6. Subscriptions & Recurring Orders (if applicable)</h2>
        <ul>
          <li>Subscription products automatically renew until cancelled.</li>
          <li>You can pause or cancel subscriptions via your account or by contacting support.</li>
          <li>Refunds or credits for partially used subscriptions are at company discretion.</li>
        </ul>
        
        <h2>7. Shipping & Delivery</h2>
        <ul>
          <li>We aim to deliver products within estimated timelines, but delays may occur due to courier, customs, or other external factors.</li>
          <li>Risk of loss passes to the customer upon delivery.</li>
          <li>We are not liable for delays caused by force majeure events (e.g., natural disasters, strikes, pandemics).</li>
        </ul>
        
        <h2>8. Returns & Refunds</h2>
        <ul>
          <li>Returns are accepted only for damaged, defective, or incorrect products within a specified timeframe of delivery.</li>
          <li>Products must be unused, sealed, and in original packaging.</li>
          <li>Refunds will be processed after inspection.</li>
          <li>We reserve the right to decline returns that do not meet criteria.</li>
        </ul>
        
        <h2>9. Health & Product Disclaimer</h2>
        <ul>
          <li>Products are intended for general wellness and skincare support, not a substitute for medical advice.</li>
          <li>Consult a qualified healthcare professional before using supplements or skincare if you have medical conditions or allergies.</li>
          <li>We are not liable for adverse effects from misuse or ignoring product instructions.</li>
        </ul>
        
        <h2>10. Intellectual Property</h2>
        <ul>
          <li>All content on our website, app, and marketing materials — including trademarks, logos, images, videos, and text — is owned or licensed by Only Thing Health & Wellness.</li>
          <li>You may not copy, reproduce, distribute, or use any content without prior written consent.</li>
        </ul>
        
        <h2>11. User Conduct</h2>
        <p>By using our Services, you agree not to:</p>
        <ul>
          <li>Violate any law or regulation</li>
          <li>Upload harmful or malicious content</li>
          <li>Use the Services for commercial purposes without authorization</li>
          <li>Interfere with website functionality or security</li>
        </ul>
        
        <h2>12. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Only Thing Health & Wellness LLP is not liable for any 
          direct, indirect, incidental, or consequential damages arising from:
        </p>
        <ul>
          <li>Use or inability to use the Services</li>
          <li>Product misuse or allergic reactions</li>
          <li>Delays, interruptions, or errors in transactions</li>
        </ul>
        <p>Total liability will not exceed the amount paid for the product or service.</p>
        
        <h2>13. Indemnification</h2>
        <p>
          You agree to indemnify and hold Only Thing Health & Wellness LLP harmless from any claims, damages, 
          or losses arising from your violation of these Terms or misuse of our Services.
        </p>
        
        <h2>14. Privacy & Data</h2>
        <p>
          Your use of our Services is governed by our Privacy Policy, which explains how we collect, use, 
          and protect your data.
        </p>
        
        <h2>15. Governing Law & Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of India, and any disputes will be subject to the exclusive 
          jurisdiction of courts.
        </p>
        
        <h2>16. Changes to Terms</h2>
        <p>
          We may update or modify these Terms at any time. Changes will be effective upon posting, and your 
          continued use of Services constitutes acceptance of the updated Terms.
        </p>
        
        <h2>17. Contact Us</h2>
        <p>For any questions regarding these Terms:</p>
        <p>
          <strong>Only Thing Health & Wellness LLP</strong><br />
          <strong>Email:</strong> info@only-thing.com
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}

