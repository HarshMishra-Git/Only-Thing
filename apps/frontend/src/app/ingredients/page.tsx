import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ingredients | Only Thing',
  description: 'Complete transparency about every ingredient we use and what we avoid.',
};

export default function IngredientsPage() {
  return (
    <>
      <Header />
      <ContentPage title="Ingredient Transparency">
        <p>
          We believe you deserve to know exactly what you're putting on your skin. Every ingredient 
          in our formulations is carefully selected, clinically tested, and clearly disclosed.
        </p>

        <h2>What We Use</h2>
        
        <h3>Active Ingredients</h3>
        <ul>
          <li><strong>Vitamin C (L-Ascorbic Acid):</strong> Brightening and antioxidant protection</li>
          <li><strong>Retinol:</strong> Anti-aging and skin texture improvement</li>
          <li><strong>Niacinamide (Vitamin B3):</strong> Pore refinement and oil control</li>
          <li><strong>Hyaluronic Acid:</strong> Deep hydration and plumping</li>
          <li><strong>Peptides:</strong> Collagen support and firmness</li>
          <li><strong>Ceramides:</strong> Skin barrier repair and protection</li>
          <li><strong>Alpha Hydroxy Acids (AHAs):</strong> Gentle exfoliation</li>
          <li><strong>Salicylic Acid:</strong> Pore-clearing and acne treatment</li>
          <li><strong>Azelaic Acid:</strong> Hyperpigmentation and redness reduction</li>
          <li><strong>Centella Asiatica:</strong> Soothing and healing</li>
        </ul>

        <h2>What We Avoid</h2>
        <p>
          Our formulations are free from ingredients that have been shown to cause irritation, 
          disrupt hormones, or harm the environment:
        </p>
        <ul>
          <li>Parabens (preservatives linked to hormone disruption)</li>
          <li>Sulfates (harsh cleansing agents that strip natural oils)</li>
          <li>Phthalates (plasticizers with potential health risks)</li>
          <li>Synthetic fragrances (common allergens and irritants)</li>
          <li>Synthetic dyes (unnecessary cosmetic additives)</li>
          <li>Mineral oil and petrolatum (pore-clogging ingredients)</li>
          <li>Formaldehyde and formaldehyde-releasing preservatives</li>
          <li>Triclosan (antibacterial agent linked to resistance)</li>
          <li>Oxybenzone (chemical sunscreen ingredient)</li>
        </ul>

        <h2>Clean Beauty Standards</h2>
        <p>
          All our formulations meet the following criteria:
        </p>
        <ul>
          <li><strong>Cruelty-Free:</strong> Never tested on animals</li>
          <li><strong>Vegan:</strong> No animal-derived ingredients</li>
          <li><strong>Sustainably Sourced:</strong> Ingredients from ethical and renewable sources</li>
          <li><strong>Dermatologist-Tested:</strong> Safe for all skin types and tones</li>
          <li><strong>Non-Comedogenic:</strong> Won't clog pores</li>
          <li><strong>pH-Balanced:</strong> Formulated to match skin's natural pH</li>
        </ul>

        <h2>Packaging & Sustainability</h2>
        <p>
          Our commitment to clean ingredients extends to sustainable packaging:
        </p>
        <ul>
          <li>Recyclable glass and aluminum containers</li>
          <li>FSC-certified paper boxes</li>
          <li>Biodegradable packing materials</li>
          <li>Carbon-neutral shipping</li>
          <li>Refill program to reduce waste</li>
        </ul>

        <h2>Full Ingredient Lists</h2>
        <p>
          For complete ingredient lists of each product, please visit the individual product pages. 
          If you have any questions about specific ingredients or potential allergens, our customer 
          service team is available to help.
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}
