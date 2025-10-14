'use client';

import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { HeroVideo } from '@/components/hero/HeroVideo';

const Section = styled.section`
  padding: ${theme.spacing[8]} ${theme.spacing[3]};
  max-width: 1440px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]} ${theme.spacing[2]};
  }
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.black};
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.tight};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
`;

const ProductCard = styled(Link)`
  display: block;
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[3]};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
  
  &:hover {
    border-color: ${theme.colors.black};
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

const ProductImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${theme.colors.gray.light};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.sizes['3xl']};
  color: ${theme.colors.gray.medium};
`;

const ProductTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[1]};
`;

const ProductPrice = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
`;

const TrustSection = styled.div`
  background-color: ${theme.colors.gray.light};
  padding: ${theme.spacing[6]} ${theme.spacing[3]};
  text-align: center;
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  max-width: 1200px;
  margin: 0 auto;
`;

const TrustItem = styled.div`
  padding: ${theme.spacing[3]};
`;

const TrustIcon = styled.div`
  font-size: ${theme.typography.sizes['3xl']};
  margin-bottom: ${theme.spacing[2]};
`;

const TrustTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[1]};
`;

const TrustDescription = styled.p`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
`;

// Featured Only Thing products
const featuredProducts = [
  { id: '1', name: 'ONLY EXOSKIN', price: '$89.99', slug: 'only-exoskin' },
  { id: '2', name: 'ONLY CELL REPAIR', price: '$79.99', slug: 'only-cell-repair' },
  { id: '3', name: 'ONLY DAY & NIGHT', price: '$54.99', slug: 'only-day-night' },
  { id: '4', name: 'ONLY BIO-COLLAGEN', price: '$49.99', slug: 'only-bio-collagen' },
];

export function HomePage() {
  return (
    <main>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      
      {/* Hero Section with Video */}
      <HeroVideo
        videoSrc="/videos/hero.mp4"
        posterSrc="/images/hero-poster.jpg"
        title="The Future of Skincare is Intelligent"
      />
      
      {/* Main content starts here */}
      <div id="main-content">
        {/* Trust Indicators */}
        <TrustSection>
          <TrustGrid>
            <TrustItem>
              <TrustIcon>🔬</TrustIcon>
              <TrustTitle>Clinically Proven</TrustTitle>
              <TrustDescription>
                All formulations backed by peer-reviewed research
              </TrustDescription>
            </TrustItem>
            <TrustItem>
              <TrustIcon>🌱</TrustIcon>
              <TrustTitle>Clean Ingredients</TrustTitle>
              <TrustDescription>
                No parabens, sulfates, or synthetic fragrances
              </TrustDescription>
            </TrustItem>
            <TrustItem>
              <TrustIcon>🎯</TrustIcon>
              <TrustTitle>Personalized</TrustTitle>
              <TrustDescription>
                Recommendations tailored to your unique skin
              </TrustDescription>
            </TrustItem>
            <TrustItem>
              <TrustIcon>♻️</TrustIcon>
              <TrustTitle>Sustainable</TrustTitle>
              <TrustDescription>
                Eco-friendly packaging and carbon-neutral shipping
              </TrustDescription>
            </TrustItem>
          </TrustGrid>
        </TrustSection>

        {/* Featured Products */}
        <Section>
          <SectionTitle>Featured Products</SectionTitle>
          <ProductGrid>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} href={`/products/${product.slug}`}>
                <ProductImage>📦</ProductImage>
                <ProductTitle>{product.name}</ProductTitle>
                <ProductPrice>{product.price}</ProductPrice>
              </ProductCard>
            ))}
          </ProductGrid>
        </Section>
      </div>
    </main>
  );
}
