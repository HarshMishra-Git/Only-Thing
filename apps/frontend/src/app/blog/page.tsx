import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Only Thing',
  description: 'Skincare tips, science insights, and wellness advice from the Only Thing team.',
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <ContentPage title="Blog & Insights">
        <p>
          Welcome to the Only Thing blog. Here we share science-backed skincare advice, ingredient 
          spotlights, and wellness tips from our team of dermatologists and biochemists.
        </p>

        <h2>Recent Articles</h2>
        <p>
          Our blog is currently being populated with content. Check back soon for:
        </p>
        <ul>
          <li>Ingredient deep-dives and scientific explanations</li>
          <li>Skincare routines for different concerns and skin types</li>
          <li>Clinical research summaries and latest dermatology findings</li>
          <li>Seasonal skincare tips and product recommendations</li>
          <li>Behind-the-scenes looks at our formulation process</li>
        </ul>

        <h2>Newsletter</h2>
        <p>
          Subscribe to our newsletter to receive new blog posts, exclusive content, and early access 
          to new products directly in your inbox.
        </p>

        <h2>Topics We Cover</h2>
        <h3>Skin Science</h3>
        <p>
          Understanding how your skin works at the cellular level to make informed product choices.
        </p>

        <h3>Active Ingredients</h3>
        <p>
          In-depth analysis of key skincare actives, their mechanisms of action, and proper usage.
        </p>

        <h3>Routine Building</h3>
        <p>
          Step-by-step guides for creating effective skincare routines tailored to your needs.
        </p>

        <h3>Wellness & Lifestyle</h3>
        <p>
          How diet, sleep, stress, and other lifestyle factors impact your skin health.
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}

