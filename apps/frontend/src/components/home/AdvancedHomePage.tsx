'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HeroVideo } from '@/components/hero/HeroVideo';
import toast from 'react-hot-toast';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';

// ========================================
// STYLED COMPONENTS
// ========================================

const PageContainer = styled.main`
  background: ${theme.colors.white};
  overflow-x: hidden;
`;

// Hero Section - Full viewport with cinematic feel
const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.black};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    height: 80vh;
    min-height: 500px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  color: ${theme.colors.white};
  max-width: 900px;
  padding: 0 ${theme.spacing[3]};
  animation: fadeInUp 1s ease-out;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 5vw, ${theme.typography.sizes['6xl']});
  font-weight: ${theme.typography.weights.black};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  background: linear-gradient(
    45deg,
    ${theme.colors.white},
    ${theme.colors.gray.light},
    ${theme.colors.white}
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xl};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.gray.light};
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const CTAGroup = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.base};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid ${theme.colors.white};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    background: transparent;
    color: ${theme.colors.white};
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  background: transparent;
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.base};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid ${theme.colors.white};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: ${theme.colors.white};
    color: ${theme.colors.black};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Trust Bar - Social proof strip
const TrustBar = styled.section`
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  padding: ${theme.spacing[4]} ${theme.spacing[3]};
  overflow: hidden;
`;

const TrustScroll = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const TrustIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// Featured Products Section
const Section = styled.section<{ background?: string }>`
  padding: ${theme.spacing[12]} ${theme.spacing[3]};
  background: ${props => props.background || theme.colors.white};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(180deg, rgba(191, 166, 106, 0.03) 0%, transparent 100%);
    pointer-events: none;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[8]} ${theme.spacing[3]};
  }
`;

const Container = styled.div`
  max-width: 1680px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.xl}) {
    max-width: 1440px;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 1200px;
    padding: 0 ${theme.spacing[3]};
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['2xl']}, 4vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin-bottom: ${theme.spacing[3]};
  color: ${theme.colors.black};
`;

const SectionSubtitle = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const MotionProductGrid = motion(ProductGrid);

const ProductCard = styled(Link)`
  position: relative;
  display: block;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid ${theme.colors.gray.light};
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  transform-style: preserve-3d;

  &:hover {
    border-color: ${theme.colors.black};
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 0 20px rgba(191, 166, 106, 0.1);
    transform: translateY(-12px) rotateX(2deg);
    
    img {
      transform: scale(1.08);
      filter: grayscale(0%);
    }
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: ${theme.colors.gray.light};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: transform 0.4s ease;
  }
`;

const ProductBadge = styled.div`
  position: absolute;
  top: ${theme.spacing[2]};
  right: ${theme.spacing[2]};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
  animation: pulse 2s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
`;

const ProductInfo = styled.div`
  padding: ${theme.spacing[4]};
`;

const ProductCategory = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.gray.medium};
  margin-bottom: ${theme.spacing[1]};
`;

const ProductTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.black};
`;

const ProductDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[3]};
`;

const ProductPrice = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
`;

// Science Section - Clinical credibility
const ScienceSection = styled(Section)`
  background: ${theme.colors.gray.light};
`;

const ScienceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[6]};
  margin-top: ${theme.spacing[8]};
`;

const MotionScienceGrid = motion(ScienceGrid);

const ScienceCard = styled.div`
  text-align: center;
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.light};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.black};
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }
`;

const ScienceIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    stroke: ${theme.colors.black};
  }
`;

const ScienceTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.black};
`;

const ScienceDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
`;

const ScienceStat = styled.div`
  margin-top: ${theme.spacing[3]};
  padding-top: ${theme.spacing[3]};
  border-top: 1px solid ${theme.colors.gray.light};
  
  strong {
    display: block;
    font-family: ${theme.typography.fonts.display};
    font-size: ${theme.typography.sizes['3xl']};
    font-weight: ${theme.typography.weights.black};
    color: ${theme.colors.black};
    margin-bottom: ${theme.spacing[1]};
  }
  
  span {
    font-family: ${theme.typography.fonts.body};
    font-size: ${theme.typography.sizes.sm};
    color: ${theme.colors.gray.medium};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

// Quiz CTA Section - Personalization driver
const QuizCTASection = styled.section`
  position: relative;
  padding: ${theme.spacing[16]} ${theme.spacing[3]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(191, 166, 106, 0.1) 0%, transparent 100%);
    z-index: 1;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[10]} ${theme.spacing[3]};
  }
`;

const QuizCTAContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
`;

const QuizCTATitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['2xl']}, 4vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing[4]};
  letter-spacing: -0.02em;
  color: ${theme.colors.white};
`;

const QuizCTADescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xl};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.gray.light};
`;

const QuizCTAButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.lg};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid ${theme.colors.white};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: transparent;
    color: ${theme.colors.white};
    transform: scale(1.05);
  }
`;

const QuizCTAFeatures = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing[6]};
  margin-top: ${theme.spacing[8]};
  flex-wrap: wrap;
`;

const QuizCTAFeature = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: ${theme.colors.accent.gold};
    border-radius: 50%;
    color: ${theme.colors.black};
    font-weight: ${theme.typography.weights.bold};
  }
`;

// Results Section - Before/After social proof
const ResultsSection = styled(Section)`
  background: ${theme.colors.white};
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing[6]};
  margin-top: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ResultCard = styled.div`
  background: ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  border: 1px solid ${theme.colors.gray.light};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.black};
    transform: translateY(-4px);
  }
`;

const ResultImages = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
`;

const ResultImage = styled.div`
  aspect-ratio: 1;
  background: ${theme.colors.gray.light};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  filter: grayscale(100%);
`;

const ResultTestimonial = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  line-height: 1.6;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[3]};
  font-style: italic;
  
  &::before {
    content: '"';
  }
  
  &::after {
    content: '"';
  }
`;

const ResultAuthor = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ResultProduct = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.medium};
  margin-top: ${theme.spacing[1]};
`;

// Ingredient Transparency Section
const IngredientsSection = styled(Section)`
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  border-bottom: 4px solid ${theme.colors.white};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding-left: ${theme.spacing[2]};
    padding-right: ${theme.spacing[2]};
  }
`;

const IngredientsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing[4]};
  }
`;

const IngredientsTextGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[6]};
  align-items: start;
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[3]};
  }
`;

const IngredientsText = styled.div`
  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
  }
`;

const IngredientsTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['2xl']}, 4vw, ${theme.typography.sizes['4xl']});
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing[4]};
  letter-spacing: -0.02em;
`;

const IngredientsDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.8;
  margin-bottom: ${theme.spacing[2]};
  color: ${theme.colors.gray.light};
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing[4]} 0;
`;

const IngredientsListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[3]};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  line-height: 1.6;
  
  &::before {
    content: '✓';
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    background: ${theme.colors.accent.gold};
    border-radius: 50%;
    color: ${theme.colors.black};
    font-weight: ${theme.typography.weights.bold};
    margin-top: 2px;
  }
`;

const IngredientsVisualWrapper = styled.div`
  text-align: center;
`;

const IngredientsVisualTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['2xl']}, 4vw, ${theme.typography.sizes['4xl']});
  font-weight: ${theme.typography.weights.black};
  text-transform: uppercase;
  margin-bottom: ${theme.spacing[6]};
  color: ${theme.colors.white};
  text-align: center;
  letter-spacing: -0.02em;
`;

const IngredientsVisual = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[4]};
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    max-width: 350px;
    gap: ${theme.spacing[2]};
  }
`;

const IngredientBox = styled.div`
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[3]};
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${theme.colors.accent.gold};
    transform: scale(1.05);
  }
`;

const IngredientIcon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    stroke: ${theme.colors.white};
  }
`;

const IngredientName = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ========================================
// DATA
// ========================================

const featuredProducts = [
  {
    id: '1',
    name: 'ONLY EXOSKIN',
    category: 'Advanced Serum',
    description: 'Highly advanced multi-action elixir with exosomes, PDRN, peptides, and ceramides',
    price: '$89.99',
    badge: 'Best Seller',
    slug: 'only-exoskin',
  },
  {
    id: '2',
    name: 'ONLY CELL REPAIR',
    category: 'Face Serum',
    description: 'Ultra-advanced face serum with dual peptide technology for cellular repair',
    price: '$79.99',
    badge: 'Clinical Grade',
    slug: 'only-cell-repair',
  },
  {
    id: '3',
    name: 'ONLY DAY & NIGHT',
    category: 'Anti-Aging Capsule',
    description: 'India\'s first 24-hour anti-aging regimen - advanced formula for longevity',
    price: '$54.99',
    badge: 'New Launch',
    slug: 'only-day-night',
  },
  {
    id: '4',
    name: 'ONLY SOLLIGENT',
    category: 'Sunscreen SPF 50+',
    description: 'Next-gen hybrid intelligent sunscreen with antioxidant skincare shield',
    price: '$49.99',
    badge: 'Dermatologist Approved',
    slug: 'only-solligent',
  },
];

const scienceData = [
  {
    icon: '🔬',
    title: 'Peer-Reviewed Research',
    description: 'All formulations backed by published clinical studies',
    stat: '100%',
    statLabel: 'Evidence-Based',
  },
  {
    icon: '🧪',
    title: 'Clinical Testing',
    description: 'Dermatologist-tested on all skin types and tones',
    stat: '90 Days',
    statLabel: 'Trial Period',
  },
  {
    icon: '📊',
    title: 'Real Results',
    description: 'Proven efficacy with measurable outcomes',
    stat: '95%',
    statLabel: 'Satisfaction Rate',
  },
  {
    icon: '🎓',
    title: 'Expert Formulated',
    description: 'Developed by PhD biochemists and dermatologists',
    stat: '25+',
    statLabel: 'Years Experience',
  },
];

const resultsData = [
  {
    id: '1',
    testimonial: 'After 6 weeks, my dark spots faded significantly. My skin looks brighter and more even-toned than ever.',
    author: 'Sarah M.',
    product: 'Vitamin C Serum',
  },
  {
    id: '2',
    testimonial: 'The hydration is incredible. My fine lines are less visible and my skin feels plump and healthy.',
    author: 'Jessica L.',
    product: 'Hyaluronic Complex',
  },
  {
    id: '3',
    testimonial: 'No irritation from retinol for the first time! My skin texture improved dramatically in just 4 weeks.',
    author: 'Amanda K.',
    product: 'Retinol Night Cream',
  },
];

const ingredientsHighlights = [
  'No parabens, sulfates, or phthalates',
  'No synthetic fragrances or dyes',
  'Cruelty-free and vegan formulations',
  'Sustainably sourced active ingredients',
  'Clinical-grade concentrations',
  'Dermatologist-tested and approved',
];

const keyIngredients = [
  { icon: '🍊', name: 'Vitamin C' },
  { icon: '💧', name: 'Hyaluronic Acid' },
  { icon: '🌿', name: 'Niacinamide' },
  { icon: '✨', name: 'Retinol' },
];

// ========================================
// COMPONENT
// ========================================

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export function AdvancedHomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [productsRef, productsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [scienceRef, scienceInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageContainer>
      {/* Skip to content for accessibility */}
      <a href="#main-content" style={{ 
        position: 'absolute', 
        left: '-9999px',
        zIndex: 999
      }}>
        Skip to content
      </a>

      {/* Hero Section */}
      <HeroSection id="hero">
        <HeroVideo
          videoSrc="/videos/hero.mp4"
          mobileVideoSrc="/videos/mobile.mp4"
          posterSrc=""
          title="The Future of Skincare is Intelligent"
        />
      </HeroSection>

      {/* Trust Bar */}
      <TrustBar>
        <TrustScroll>
          <TrustItem>
            <TrustIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </TrustIcon>
            Clinically Proven
          </TrustItem>
          <TrustItem>
            <TrustIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </TrustIcon>
            Clean Ingredients
          </TrustItem>
          <TrustItem>
            <TrustIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </TrustIcon>
            Personalized
          </TrustItem>
          <TrustItem>
            <TrustIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </TrustIcon>
            Sustainable
          </TrustItem>
          <TrustItem>
            <TrustIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </TrustIcon>
            Award-Winning
          </TrustItem>
        </TrustScroll>
      </TrustBar>

      <div id="main-content">
        {/* Featured Products Section */}
        <Section>
          <Container>
            <SectionHeader>
              <SectionTitle>Featured Products</SectionTitle>
              <SectionSubtitle>
                Clinically-proven formulations designed for visible results
              </SectionSubtitle>
            </SectionHeader>
            <MotionProductGrid
              ref={productsRef}
              variants={containerVariants}
              initial="hidden"
              animate={productsInView ? 'visible' : 'hidden'}
            >
              {featuredProducts.map((product, index) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard href={`/products/${product.slug}`}>
                    <ProductImageContainer>
                      {product.badge && <ProductBadge>{product.badge}</ProductBadge>}
                      <img src={`/images/products/${product.slug}.jpg`} alt={product.name} />
                    </ProductImageContainer>
                    <ProductInfo>
                      <ProductCategory>{product.category}</ProductCategory>
                      <ProductTitle>{product.name}</ProductTitle>
                      <ProductDescription>{product.description}</ProductDescription>
                      <ProductPrice>{product.price}</ProductPrice>
                    </ProductInfo>
                  </ProductCard>
                </motion.div>
              ))}
            </MotionProductGrid>
          </Container>
        </Section>

        {/* Science Section */}
        <ScienceSection>
          <Container>
            <SectionHeader>
              <SectionTitle>Backed by Science</SectionTitle>
              <SectionSubtitle>
                Evidence-based skincare with measurable results
              </SectionSubtitle>
            </SectionHeader>
            <MotionScienceGrid
              ref={scienceRef}
              variants={containerVariants}
              initial="hidden"
              animate={scienceInView ? 'visible' : 'hidden'}
            >
              <motion.div variants={itemVariants}>
                <ScienceCard>
                <ScienceIcon>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </ScienceIcon>
                <ScienceTitle>Peer-Reviewed Research</ScienceTitle>
                <ScienceDescription>All formulations backed by published clinical studies</ScienceDescription>
                <ScienceStat>
                  <div><AnimatedCounter end={100} suffix="%" /></div>
                  <span>Evidence-Based</span>
                </ScienceStat>
              </ScienceCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ScienceCard>
                <ScienceIcon>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                    <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </ScienceIcon>
                <ScienceTitle>Clinical Testing</ScienceTitle>
                <ScienceDescription>Dermatologist-tested on all skin types and tones</ScienceDescription>
                <ScienceStat>
                  <div><AnimatedCounter end={90} suffix=" Days" /></div>
                  <span>Trial Period</span>
                </ScienceStat>
              </ScienceCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ScienceCard>
                  <ScienceIcon>
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </ScienceIcon>
                <ScienceTitle>Real Results</ScienceTitle>
                <ScienceDescription>Proven efficacy with measurable outcomes</ScienceDescription>
                <ScienceStat>
                  <div><AnimatedCounter end={95} suffix="%" /></div>
                  <span>Satisfaction Rate</span>
                </ScienceStat>
              </ScienceCard>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ScienceCard>
                  <ScienceIcon>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </ScienceIcon>
                  <ScienceTitle>Expert Formulated</ScienceTitle>
                  <ScienceDescription>Developed by PhD biochemists and dermatologists</ScienceDescription>
                  <ScienceStat>
                    <div><AnimatedCounter end={25} suffix="+" /></div>
                    <span>Years Experience</span>
                  </ScienceStat>
                </ScienceCard>
              </motion.div>
            </MotionScienceGrid>
          </Container>
        </ScienceSection>

        {/* Quiz CTA Section */}
        <QuizCTASection>
          <QuizCTAContent>
            <QuizCTATitle>Find Your Perfect Routine</QuizCTATitle>
            <QuizCTADescription>
              Take our 2-minute clinical assessment and receive personalized product 
              recommendations backed by dermatological science.
            </QuizCTADescription>
            <QuizCTAButton href="/quiz">Take the Assessment</QuizCTAButton>
            <QuizCTAFeatures>
              <QuizCTAFeature>Science-Based</QuizCTAFeature>
              <QuizCTAFeature>Personalized</QuizCTAFeature>
              <QuizCTAFeature>2 Minutes</QuizCTAFeature>
            </QuizCTAFeatures>
          </QuizCTAContent>
        </QuizCTASection>

        {/* Results Section */}
        <ResultsSection>
          <Container>
            <SectionHeader>
              <SectionTitle>Real Results</SectionTitle>
              <SectionSubtitle>
                See the transformative power of clinical-grade skincare
              </SectionSubtitle>
            </SectionHeader>
            <ResultsGrid>
              {resultsData.map((result) => (
                <ResultCard key={result.id}>
                  <ResultImages>
                    <ResultImage>Before</ResultImage>
                    <ResultImage>After</ResultImage>
                  </ResultImages>
                  <ResultTestimonial>{result.testimonial}</ResultTestimonial>
                  <ResultAuthor>{result.author}</ResultAuthor>
                  <ResultProduct>Used: {result.product}</ResultProduct>
                </ResultCard>
              ))}
            </ResultsGrid>
          </Container>
        </ResultsSection>

        {/* Ingredients Transparency Section */}
        <IngredientsSection>
          <Container>
            <IngredientsContent>
              <IngredientsVisualWrapper>
                <IngredientsVisualTitle>Key Ingredients</IngredientsVisualTitle>
                <IngredientsVisual>
                  <IngredientBox>
                  <IngredientIcon>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
                    </svg>
                  </IngredientIcon>
                  <IngredientName>Vitamin C</IngredientName>
                </IngredientBox>
                <IngredientBox>
                  <IngredientIcon>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
                      <path d="M12 12l8-5M12 12v10M12 12L4 7" opacity="0.5" />
                    </svg>
                  </IngredientIcon>
                  <IngredientName>Hyaluronic Acid</IngredientName>
                </IngredientBox>
                <IngredientBox>
                  <IngredientIcon>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                      <path d="M8 12h8M12 8v8" />
                      <circle cx="12" cy="12" r="6" opacity="0.3" />
                    </svg>
                  </IngredientIcon>
                  <IngredientName>Niacinamide</IngredientName>
                </IngredientBox>
                <IngredientBox>
                  <IngredientIcon>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      <circle cx="12" cy="12" r="4" opacity="0.3" />
                    </svg>
                  </IngredientIcon>
                  <IngredientName>Retinol</IngredientName>
                </IngredientBox>
              </IngredientsVisual>
              </IngredientsVisualWrapper>
              
              <IngredientsTextGrid>
                <IngredientsText>
                  <IngredientsTitle>Ingredient Transparency</IngredientsTitle>
                  <IngredientsDescription>
                    We believe in complete transparency. Every ingredient is carefully 
                    selected, clinically tested, and clearly disclosed.
                  </IngredientsDescription>
                </IngredientsText>
                <IngredientsText>
                  <IngredientsList>
                    {ingredientsHighlights.map((item, index) => (
                      <IngredientsListItem key={index}>{item}</IngredientsListItem>
                    ))}
                  </IngredientsList>
                  <SecondaryButton href="/ingredients">
                    View Full Ingredient List
                  </SecondaryButton>
                </IngredientsText>
              </IngredientsTextGrid>
            </IngredientsContent>
          </Container>
        </IngredientsSection>
      </div>
    </PageContainer>
  );
}

