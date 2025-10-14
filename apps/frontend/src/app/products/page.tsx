'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@only-thing/design-tokens';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { mockProducts, formatPrice } from '@/lib/mockData';

const PageContainer = styled.div`
  padding-top: 73px; /* Header height */
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background-color: ${theme.colors.gray.light};
  padding: ${theme.spacing[6]} ${theme.spacing[3]};
  text-align: center;
`;

const PageTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
`;

const PageDescription = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  max-width: 600px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  max-width: 1680px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.xl}) {
    max-width: 1440px;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    max-width: 1200px;
    padding: ${theme.spacing[6]} ${theme.spacing[3]};
  }
`;

const Sidebar = styled.aside`
  @media (max-width: ${theme.breakpoints.lg}) {
    border-bottom: 1px solid ${theme.colors.gray.light};
    padding-bottom: ${theme.spacing[3]};
    margin-bottom: ${theme.spacing[3]};
  }
`;

const FilterSection = styled.div`
  margin-bottom: ${theme.spacing[4]};
`;

const FilterTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
`;

const FilterButton = styled.button<{ active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${theme.spacing[1]} 0;
  background: none;
  border: none;
  color: ${props => props.active ? theme.colors.black : theme.colors.gray.dark};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${props => props.active ? theme.typography.weights.semibold : theme.typography.weights.regular};
  cursor: pointer;
  transition: color ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
  
  &:hover {
    color: ${theme.colors.black};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
`;

const MotionProductsGrid = motion(ProductsGrid);

const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[3]};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  
  &:hover {
    border-color: ${theme.colors.black};
    transform: translateY(-8px) rotateX(2deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 0 20px rgba(191, 166, 106, 0.1);
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
  font-size: ${theme.typography.sizes['4xl']};
  color: ${theme.colors.gray.medium};
`;

const ProductCategory = styled.span`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  margin-bottom: ${theme.spacing[1]};
`;

const ProductTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[1]};
  flex: 1;
`;

const ProductShortDesc = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[2]};
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing[2]};
  border-top: 1px solid ${theme.colors.gray.light};
`;

const ProductPrice = styled.p`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
`;

const ResultsCount = styled.p`
  margin-bottom: ${theme.spacing[3]};
  color: ${theme.colors.gray.dark};
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'serums', name: 'Serums' },
    { id: 'moisturizers', name: 'Moisturizers' },
    { id: 'cleansers', name: 'Cleansers' },
    { id: 'treatments', name: 'Treatments' },
  ];
  
  const filteredProducts = selectedCategory === 'all'
    ? mockProducts
    : mockProducts.filter(p => p.category === selectedCategory);
  
  return (
    <>
      <Header />
      <PageContainer>
        <PageHeader>
          <PageTitle>Our Products</PageTitle>
          <PageDescription>
            Clinically-proven formulations backed by science
          </PageDescription>
        </PageHeader>
        
        <ContentContainer>
          <Sidebar>
            <FilterSection>
              <FilterTitle>Category</FilterTitle>
              {categories.map(category => (
                <FilterButton
                  key={category.id}
                  active={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </FilterButton>
              ))}
            </FilterSection>
          </Sidebar>
          
          <div>
            <ResultsCount>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </ResultsCount>
            
            <MotionProductsGrid
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {filteredProducts.map(product => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard href={`/products/${product.slug}`}>
                    <ProductImage>📦</ProductImage>
                    <ProductCategory>{product.category}</ProductCategory>
                    <ProductTitle>{product.name}</ProductTitle>
                    <ProductShortDesc>{product.shortDescription}</ProductShortDesc>
                    <ProductFooter>
                      <ProductPrice>{formatPrice(product.price, product.currency)}</ProductPrice>
                      <ProductRating>
                        ⭐ {product.rating} ({product.reviewCount})
                      </ProductRating>
                    </ProductFooter>
                  </ProductCard>
                </motion.div>
              ))}
            </MotionProductsGrid>
          </div>
        </ContentContainer>
      </PageContainer>
      <Footer />
    </>
  );
}
