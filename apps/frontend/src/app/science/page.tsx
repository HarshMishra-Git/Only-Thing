import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { ContentPage } from '@/components/common/ContentPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Science | Only Thing',
  description: 'Learn about the clinical research and scientific principles behind Only Thing skincare.',
};

export default function SciencePage() {
  return (
    <>
      <Header />
      <ContentPage title="The Science">
        <p>
          At Only Thing, every formulation is backed by peer-reviewed clinical research and developed 
          according to the highest scientific standards. Our approach combines dermatological expertise 
          with cutting-edge biochemistry to create products that deliver measurable results.
        </p>

        <h2>Evidence-Based Formulation</h2>
        <p>
          We believe in complete transparency about the science behind our products. Every ingredient is 
          selected based on published clinical studies demonstrating efficacy for specific skin concerns.
        </p>

        <h3>Our Scientific Principles</h3>
        <ul>
          <li><strong>Clinical Concentrations:</strong> We use active ingredients at clinically proven effective concentrations</li>
          <li><strong>Peer-Reviewed Research:</strong> All formulations backed by published scientific studies</li>
          <li><strong>Dermatologist Testing:</strong> Products tested on all skin types and tones</li>
          <li><strong>Stability Testing:</strong> Rigorous testing ensures ingredient potency over time</li>
          <li><strong>pH Optimization:</strong> Formulations pH-balanced for optimal skin compatibility</li>
        </ul>

        <h2>Clinical Testing Process</h2>
        <p>
          Before any product reaches you, it undergoes extensive clinical testing to ensure both safety 
          and efficacy. Our testing protocol includes:
        </p>
        <ol>
          <li>In-vitro laboratory testing for ingredient stability and compatibility</li>
          <li>Dermatologist-supervised patch testing for skin sensitivity</li>
          <li>90-day clinical trials measuring visible results</li>
          <li>Long-term safety and efficacy monitoring</li>
        </ol>

        <h2>Key Active Ingredients</h2>
        
        <h3>Vitamin C (L-Ascorbic Acid)</h3>
        <p>
          Clinically proven to reduce hyperpigmentation by 40-50% in 8-12 weeks. Our stabilized formulation 
          maintains potency and minimizes oxidation.
        </p>

        <h3>Retinol</h3>
        <p>
          The gold standard for anti-aging, our time-released retinol formulation reduces fine lines and 
          improves skin texture without irritation.
        </p>

        <h3>Niacinamide</h3>
        <p>
          Multi-functional ingredient that regulates oil production, minimizes pores, and strengthens the 
          skin barrier. Effective at 5-10% concentrations.
        </p>

        <h3>Hyaluronic Acid</h3>
        <p>
          Our triple-weight formulation (high, medium, and low molecular weight) ensures deep hydration 
          at multiple skin layers for 72-hour moisture retention.
        </p>

        <h2>Research Partnerships</h2>
        <p>
          We collaborate with leading dermatology research institutions and biochemistry labs to stay at 
          the forefront of skincare science. Our formulation team includes PhD biochemists and board-certified 
          dermatologists with over 25 years of combined experience.
        </p>

        <h2>Transparency Commitment</h2>
        <p>
          We publish detailed clinical study results and ingredient information for all our products. 
          Visit our Ingredients page for complete transparency about what goes into each formulation.
        </p>
      </ContentPage>
      <Footer />
    </>
  );
}

