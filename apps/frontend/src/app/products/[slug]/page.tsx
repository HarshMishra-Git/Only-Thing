'use client';

import { use } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { getProductBySlug, formatPrice } from '@/lib/mockData';
import { useState } from 'react';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: ${theme.spacing[6]} ${theme.spacing[3]};
`;

const Breadcrumbs = styled.div`
  display: flex;
  gap: ${theme.spacing[1]};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
`;

const BreadcrumbLink = styled(Link)`
  color: ${theme.colors.gray.dark};
  
  &:hover {
    color: ${theme.colors.black};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ProductImages = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const MainImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${theme.colors.gray.light};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  margin-bottom: ${theme.spacing[2]};
`;

const ProductInfo = styled.div``;

const ProductCategory = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
`;

const ProductTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  margin: ${theme.spacing[2]} 0;
  text-transform: uppercase;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const Stars = styled.div`
  color: ${theme.colors.black};
  font-size: ${theme.typography.sizes.lg};
`;

const ReviewCount = styled.span`
  color: ${theme.colors.gray.dark};
  font-size: ${theme.typography.sizes.sm};
`;

const ProductPrice = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[3]};
`;

const ShortDescription = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray.light};
`;

const StockStatus = styled.div<{ inStock: boolean }>`
  font-size: ${theme.typography.sizes.sm};
  color: ${props => props.inStock ? theme.colors.black : theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[3]};
`;

const AddToCartSection = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  border: 1px solid ${theme.colors.gray.dark};
`;

const QtyButton = styled.button`
  width: 48px;
  height: 48px;
  background: ${theme.colors.white};
  border: none;
  cursor: pointer;
  font-size: ${theme.typography.sizes.lg};
  transition: background ${theme.transitions.duration.fast};
  
  &:hover {
    background: ${theme.colors.gray.light};
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const QtyDisplay = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.weights.semibold};
  border-left: 1px solid ${theme.colors.gray.light};
  border-right: 1px solid ${theme.colors.gray.light};
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  cursor: pointer;
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    background-color: ${theme.colors.gray.dark};
    transform: scale(${theme.interactions.scale.hover});
  }
  
  &:active {
    transform: scale(${theme.interactions.scale.press});
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing[6]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
`;

const Description = styled.div`
  font-size: ${theme.typography.sizes.base};
  line-height: ${theme.typography.lineHeights.relaxed};
  color: ${theme.colors.gray.dark};
`;

const IngredientsGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[3]};
`;

const IngredientCard = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[3]};
`;

const IngredientName = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[1]};
`;

const IngredientConcentration = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[2]};
  display: block;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  padding: ${theme.spacing[1]} 0;
  color: ${theme.colors.gray.dark};
  
  &:before {
    content: '✓';
    margin-right: ${theme.spacing[1]};
    color: ${theme.colors.black};
    font-weight: ${theme.typography.weights.bold};
  }
`;

const EvidenceCard = styled.div`
  background-color: ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[3]};
`;

const EvidenceTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
`;

const EvidenceSummary = styled.p`
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[2]};
`;

const EvidenceResult = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.black};
  font-weight: ${theme.typography.weights.semibold};
`;

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <PageContainer>
          <ContentContainer>
            <h1>Product not found</h1>
            <Link href="/products">Back to products</Link>
          </ContentContainer>
        </PageContainer>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <Header />
      <PageContainer>
        <ContentContainer>
          <Breadcrumbs>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
            <span>/</span>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            <span>/</span>
            <span>{product.name}</span>
          </Breadcrumbs>

          <ProductGrid>
            <ProductImages>
              <MainImage>📦</MainImage>
            </ProductImages>

            <ProductInfo>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductTitle>{product.name}</ProductTitle>
              
              <ProductRating>
                <Stars>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                  ))}
                </Stars>
                <ReviewCount>{product.rating} ({product.reviewCount} reviews)</ReviewCount>
              </ProductRating>

              <ProductPrice>{formatPrice(product.price, product.currency)}</ProductPrice>
              
              <ShortDescription>{product.shortDescription}</ShortDescription>

              <StockStatus inStock={product.stock > 0}>
                {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
              </StockStatus>

              <AddToCartSection>
                <QuantitySelector>
                  <QtyButton onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    −
                  </QtyButton>
                  <QtyDisplay>{quantity}</QtyDisplay>
                  <QtyButton onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                    +
                  </QtyButton>
                </QuantitySelector>
                
                <AddToCartButton onClick={handleAddToCart} disabled={product.stock === 0}>
                  {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                </AddToCartButton>
              </AddToCartSection>
            </ProductInfo>
          </ProductGrid>

          <Section>
            <SectionTitle>About This Product</SectionTitle>
            <Description>{product.description}</Description>
          </Section>

          <Section>
            <SectionTitle>Key Ingredients</SectionTitle>
            <IngredientsGrid>
              {product.ingredients.map((ingredient, index) => (
                <IngredientCard key={index}>
                  <IngredientName>{ingredient.name}</IngredientName>
                  {ingredient.concentration && (
                    <IngredientConcentration>Concentration: {ingredient.concentration}</IngredientConcentration>
                  )}
                  <BenefitsList>
                    {ingredient.benefits.map((benefit, i) => (
                      <BenefitItem key={i}>{benefit}</BenefitItem>
                    ))}
                  </BenefitsList>
                </IngredientCard>
              ))}
            </IngredientsGrid>
          </Section>

          {product.clinicalEvidence && product.clinicalEvidence.length > 0 && (
            <Section>
              <SectionTitle>Clinical Evidence</SectionTitle>
              {product.clinicalEvidence.map((evidence, index) => (
                <EvidenceCard key={index}>
                  <EvidenceTitle>{evidence.studyTitle}</EvidenceTitle>
                  <EvidenceSummary>{evidence.summary}</EvidenceSummary>
                  {evidence.result && <EvidenceResult>{evidence.result}</EvidenceResult>}
                </EvidenceCard>
              ))}
            </Section>
          )}
        </ContentContainer>
      </PageContainer>
      <Footer />
    </>
  );
}
