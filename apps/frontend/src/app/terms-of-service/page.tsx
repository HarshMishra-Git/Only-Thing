import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Only Thing',
  description: 'Read our terms and conditions for using Only Thing services.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <ContentPage title="Terms of Service">
        <p><strong>Effective Date:</strong> January 1, 2025</p>
        <p><strong>Last Updated:</strong> January 1, 2025</p>
        <p>
          Welcome to Only Thing Health & Wellness LLP. These Terms of Service govern your 
          use of our website and purchase of our products.
        </p>
        <h2>1. General Terms</h2>
        <p>
          By using our website and services, you confirm that you are at least 18 years old and 
          legally capable of entering into binding contracts.
        </p>
        <h2>2. Products and Services</h2>
        <ul>
          <li>All products subject to availability</li>
          <li>Prices subject to change without notice</li>
          <li>We reserve the right to refuse service</li>
        </ul>
        <h2>3. Returns and Refunds</h2>
        <p>Please refer to our Returns & Refunds page for our 90-day satisfaction guarantee.</p>
        <h2>Contact Information</h2>
        <p>Email: legal@onlything.com | Phone: 1800-XXX-XXXX</p>
      </ContentPage>
      <Footer />
    </>
  );
}

