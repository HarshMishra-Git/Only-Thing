'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { EnhancedProductCard } from '@/components/enhanced';
import Link from 'next/link';

const SectionContainer = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  background: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[3]};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const Eyebrow = styled.span`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${theme.colors.gray.medium};
  display: block;
  margin-bottom: ${theme.spacing[3]};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 5vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  max-width: 700px;
  margin: 0 auto ${theme.spacing[8]} auto;
  line-height: 1.7;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[12]};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.base};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 2px solid ${theme.colors.black};
  transition: all 0.3s ease;
  margin: 0 auto;
  display: flex;
  width: fit-content;

  &:hover {
    background: transparent;
    color: ${theme.colors.black};
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

const products = [
  {
    id: '1',
    name: 'Cellular Renewal Serum',
    description: 'Advanced peptide complex with 5% retinal for accelerated skin regeneration',
    price: 89.00,
    rating: 4.8,
    reviewCount: 324,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    badge: 'Best Seller',
    inStock: true
  },
  {
    id: '2',
    name: 'Hydration Matrix Cream',
    description: 'Hyaluronic acid spheres + ceramide blend for 72-hour moisture retention',
    price: 75.00,
    rating: 4.9,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    badge: 'New',
    inStock: true
  },
  {
    id: '3',
    name: 'Vitamin C Brightening Complex',
    description: '20% L-Ascorbic Acid with ferulic acid for radiance and even tone',
    price: 95.00,
    rating: 4.7,
    reviewCount: 289,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
    badge: 'Clinical Favorite',
    inStock: true
  }
];

export function ProductShowcaseSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <SectionContainer ref={ref}>
      <ContentWrapper>
        <SectionHeader>
          <Eyebrow>Featured Products</Eyebrow>
          <Heading>
            Our Best-Performing<br />Formulations
          </Heading>
          <Description>
            Clinically-tested, science-backed products designed to deliver
            measurable results. Each formula is precision-engineered for maximum efficacy.
          </Description>
        </SectionHeader>

        <ProductsGrid>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <EnhancedProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                reviewCount={product.reviewCount}
                image={product.image}
                badge={product.badge}
                inStock={product.inStock}
              />
            </motion.div>
          ))}
        </ProductsGrid>

        <ViewAllButton href="/products">
          View All Products
        </ViewAllButton>
      </ContentWrapper>
    </SectionContainer>
  );
}
