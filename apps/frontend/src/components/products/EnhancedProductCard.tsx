'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import Link from 'next/link';

// Animations
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const badgePulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

// Styled Components
const CardContainer = styled(motion.article)`
  position: relative;
  background: ${theme.colors.white};
  border-radius: ${theme.radii.lg};
  overflow: hidden;
  cursor: pointer;
  transition: all ${theme.transitions.duration.base};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: ${theme.colors.gray.light};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform ${theme.transitions.duration.slow};
  
  ${CardContainer}:hover & {
    transform: scale(1.1);
  }
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity ${theme.transitions.duration.base};
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }
`;

// Badges
const BadgesContainer = styled.div`
  position: absolute;
  top: ${theme.spacing[3]};
  left: ${theme.spacing[3]};
  right: ${theme.spacing[3]};
  display: flex;
  gap: ${theme.spacing[2]};
  flex-wrap: wrap;
  z-index: 2;
`;

const Badge = styled(motion.span)<{ $variant: 'bestseller' | 'new' | 'clinical' | 'sale' }>`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: ${theme.radii.sm};
  backdrop-filter: blur(10px);
  animation: ${badgePulse} 2s infinite;
  
  ${props => {
    switch (props.$variant) {
      case 'bestseller':
        return `
          background: rgba(191, 166, 106, 0.9);
          color: ${theme.colors.black};
        `;
      case 'new':
        return `
          background: rgba(255, 255, 255, 0.9);
          color: ${theme.colors.black};
        `;
      case 'clinical':
        return `
          background: rgba(0, 0, 0, 0.8);
          color: ${theme.colors.white};
          border: 1px solid ${theme.colors.white};
        `;
      case 'sale':
        return `
          background: rgba(234, 67, 53, 0.9);
          color: ${theme.colors.white};
        `;
      default:
        return '';
    }
  }}
`;

// Quick Action Buttons
const QuickActions = styled(motion.div)`
  position: absolute;
  top: ${theme.spacing[3]};
  right: ${theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  opacity: 0;
  transform: translateX(20px);
  transition: all ${theme.transitions.duration.base};
  z-index: 3;
  
  ${CardContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${theme.colors.white};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${theme.shadows.md};
  transition: all ${theme.transitions.duration.fast};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.lg};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// Content Section
const ContentSection = styled.div`
  padding: ${theme.spacing[4]};
`;

const Category = styled.div`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing[1]};
  font-weight: ${theme.typography.weights.semibold};
`;

const ProductName = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[2]};
  line-height: 1.3;
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  line-height: 1.5;
  margin-bottom: ${theme.spacing[3]};
  
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Features
const FeaturesContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
  flex-wrap: wrap;
`;

const FeatureTag = styled.span`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.gray.light};
  font-size: ${theme.typography.sizes.xs};
  border-radius: ${theme.radii.base};
  color: ${theme.colors.gray.dark};
  font-weight: ${theme.typography.weights.medium};
`;

// Rating
const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span<{ $filled: boolean }>`
  color: ${props => props.$filled ? theme.colors.accent.gold : theme.colors.gray.medium};
  font-size: ${theme.typography.sizes.base};
`;

const ReviewCount = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
`;

// Pricing
const PricingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[3]};
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.spacing[2]};
`;

const Price = styled.span`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
`;

const ComparePrice = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.medium};
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: #EA4335;
  color: ${theme.colors.white};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
  border-radius: ${theme.radii.base};
`;

// Add to Cart Button
const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border-radius: ${theme.radii.base};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${theme.colors.gray.dark};
    transition: left ${theme.transitions.duration.base};
  }
  
  &:hover::before {
    left: 0;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
`;

// Hover Info Overlay
const HoverInfo = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  padding: ${theme.spacing[4]};
  transform: translateY(100%);
  transition: transform ${theme.transitions.duration.base};
  
  ${CardContainer}:hover & {
    transform: translateY(0);
  }
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[2]};
  
  &::before {
    content: '✓';
    color: ${theme.colors.accent.gold};
    font-weight: bold;
  }
`;

// Interface
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  features: string[];
  badges?: Array<'bestseller' | 'new' | 'clinical' | 'sale'>;
  benefits?: string[];
  inStock: boolean;
}

interface EnhancedProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onWishlist?: (productId: string) => void;
}

export const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onWishlist,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlist?.(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
      <CardContainer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <ImageContainer>
          <ProductImage src={product.image} alt={product.name} />
          <ShimmerEffect />
          <ImageOverlay />
          
          {/* Badges */}
          <BadgesContainer>
            {product.badges?.map((badge, index) => (
              <Badge
                key={index}
                $variant={badge}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {badge === 'bestseller' && 'Best Seller'}
                {badge === 'new' && 'New Launch'}
                {badge === 'clinical' && 'Clinical Grade'}
                {badge === 'sale' && `${discount}% OFF`}
              </Badge>
            ))}
          </BadgesContainer>
          
          {/* Quick Actions */}
          <QuickActions>
            <ActionButton
              onClick={handleWishlistClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </ActionButton>
            
            <ActionButton
              onClick={handleQuickViewClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </ActionButton>
          </QuickActions>
          
          {/* Hover Info */}
          {product.benefits && (
            <HoverInfo>
              <BenefitsList>
                {product.benefits.slice(0, 3).map((benefit, index) => (
                  <BenefitItem key={index}>{benefit}</BenefitItem>
                ))}
              </BenefitsList>
            </HoverInfo>
          )}
        </ImageContainer>
        
        <ContentSection>
          <Category>{product.category}</Category>
          <ProductName>{product.name}</ProductName>
          <Description>{product.description}</Description>
          
          {/* Features */}
          {product.features.length > 0 && (
            <FeaturesContainer>
              {product.features.slice(0, 3).map((feature, index) => (
                <FeatureTag key={index}>{feature}</FeatureTag>
              ))}
            </FeaturesContainer>
          )}
          
          {/* Rating */}
          <RatingContainer>
            <Stars>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} $filled={star <= Math.round(product.rating)}>
                  ★
                </Star>
              ))}
            </Stars>
            <ReviewCount>({product.reviewCount})</ReviewCount>
          </RatingContainer>
          
          {/* Pricing */}
          <PricingContainer>
            <PriceGroup>
              <Price>${product.price.toFixed(2)}</Price>
              {product.compareAtPrice && (
                <ComparePrice>${product.compareAtPrice.toFixed(2)}</ComparePrice>
              )}
            </PriceGroup>
            {discount > 0 && (
              <DiscountBadge>Save {discount}%</DiscountBadge>
            )}
          </PricingContainer>
          
          {/* Add to Cart */}
          <AddToCartButton
            onClick={handleAddToCartClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!product.inStock}
          >
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </AddToCartButton>
        </ContentSection>
      </CardContainer>
    </Link>
  );
};

export default EnhancedProductCard;
