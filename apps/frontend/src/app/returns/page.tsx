import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | Only Thing',
  description: 'Our hassle-free return and refund policy.',
};

export default function ReturnsPage() {
  return (
    <>
      <Header />
      <ContentPage title="Returns & Refunds">
        <p>
          Your satisfaction is our priority. If you're not completely happy with your purchase, 
          we offer a hassle-free return and refund process.
        </p>

        <h2>90-Day Satisfaction Guarantee</h2>
        <p>
          We stand behind the quality and efficacy of our products. If you're not satisfied with 
          your results after 90 days of consistent use, we'll refund your purchase in full.
        </p>

        <h2>Return Window</h2>
        <ul>
          <li><strong>Unused Products:</strong> 30 days from delivery date</li>
          <li><strong>Opened/Used Products:</strong> 90 days from delivery date (Satisfaction Guarantee)</li>
          <li><strong>Damaged/Defective Products:</strong> 14 days from delivery date</li>
        </ul>

        <h2>How to Initiate a Return</h2>
        <ol>
          <li>Contact our customer service team via email or phone</li>
          <li>Provide your order number and reason for return</li>
          <li>Receive return authorization and shipping label</li>
          <li>Pack the product securely and ship it back</li>
          <li>Receive refund within 5-7 business days of return receipt</li>
        </ol>

        <h2>Return Conditions</h2>
        <p>
          For a successful return:
        </p>
        <ul>
          <li>Product must be in original packaging (for unused returns)</li>
          <li>At least 50% of product remaining (for satisfaction guarantee returns)</li>
          <li>Proof of purchase required</li>
          <li>Return shipping is free for defective/damaged items</li>
          <li>Customer pays return shipping for other returns</li>
        </ul>

        <h2>Refund Process</h2>
        <p>
          Once we receive and inspect your return:
        </p>
        <ul>
          <li>Refund processed within 2 business days</li>
          <li>Amount credited to original payment method</li>
          <li>Email confirmation sent</li>
          <li>Bank processing may take 5-7 additional days</li>
        </ul>

        <h2>Exchanges</h2>
        <p>
          If you'd like to exchange a product for a different item:
        </p>
        <ul>
          <li>Exchanges processed as return + new order</li>
          <li>No additional shipping charges for defective exchanges</li>
          <li>Contact us to arrange the exchange</li>
        </ul>

        <h2>Non-Returnable Items</h2>
        <p>
          For hygiene and safety reasons, the following cannot be returned:
        </p>
        <ul>
          <li>Gift cards</li>
          <li>Sale items marked as final sale</li>
          <li>Products purchased from unauthorized retailers</li>
        </ul>

        <h2>Damaged or Defective Products</h2>
        <p>
          If you receive a damaged or defective product:
        </p>
        <ul>
          <li>Contact us within 14 days of delivery</li>
          <li>Provide photos of the damaged product and packaging</li>
          <li>We'll send a replacement immediately</li>
          <li>Free return shipping provided</li>
        </ul>

        <h2>Questions?</h2>
        <p>
          Our customer service team is here to help with any return or refund questions. 
          Contact us at returns@onlything.com or call 1800-XXX-XXXX (Mon-Fri, 9 AM - 6 PM IST).
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}
