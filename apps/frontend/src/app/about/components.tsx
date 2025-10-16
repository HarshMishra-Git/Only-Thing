'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';

// Base Styles
export const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
`;

export const HeroSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.black} 0%, ${theme.colors.gray.dark} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing[10]} ${theme.spacing[3]};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
    opacity: 0.1;
  }
`;

export const HeroTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
  color: ${theme.colors.white};
  position: relative;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes['4xl']};
  }
`;

export const HeroTagline = styled.div`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.accent.gold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wider};
  margin-bottom: ${theme.spacing[3]};
  position: relative;
  z-index: 1;
`;

export const HeroSubtitle = styled.p`
  font-size: ${theme.typography.sizes.xl};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  color: ${theme.colors.white};
  position: relative;
  z-index: 1;
`;

export const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.xl}) {
    max-width: 1200px;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 900px;
  }
`;

export const Section = styled.section`
  margin-bottom: ${theme.spacing[10]};
`;

export const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing[2]};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${theme.colors.primary};
  }
`;

export const Paragraph = styled.p`
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.8;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[3]};
  text-align: center;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

// 4P Approach Components
export const FourPContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${theme.spacing[8]} 0;
`;

export const CircularDiagram = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 320px;
    height: 320px;
  }
`;

export const CircleSegment = styled.div<{ rotation: number; color: string }>`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: right bottom;
  transform: rotate(${props => props.rotation}deg);
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${props => props.color};
    border-radius: 100% 0 0 0;
    opacity: 0.8;
  }
`;

export const CenterCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 140px;
  background: ${theme.colors.white};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.lg};
  border: 2px solid ${theme.colors.black};
  z-index: 2;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 110px;
    height: 110px;
  }
`;

export const CenterLogo = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.black};
  font-size: ${theme.typography.sizes.base};
  text-transform: uppercase;
  text-align: center;
  line-height: 1.1;
  color: ${theme.colors.black};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.sm};
  }
`;

export const CenterTagline = styled.div`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.dark};
  text-align: center;
  margin-top: 4px;
`;

export const SegmentLabel = styled.div<{ position: { top: string; left: string } }>`
  position: absolute;
  top: ${props => props.position.top};
  left: ${props => props.position.left};
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${theme.colors.white};
  z-index: 3;
`;

export const SegmentTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  margin-bottom: 4px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.base};
  }
`;

export const SegmentDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.3;
  max-width: 120px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.xs};
    max-width: 100px;
  }
`;

// Core Beliefs Components
export const BeliefsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[6]};
`;

export const BeliefCard = styled.div`
  background: ${theme.colors.gray.light};
  border: 2px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  text-align: center;
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.inOut};
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.lg};
  }
`;

export const BeliefIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto ${theme.spacing[3]};
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
    stroke: ${theme.colors.white};
    fill: none;
    stroke-width: 2;
  }
`;

export const BeliefTitle = styled.h4`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
`;

export const BeliefDescription = styled.p`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
`;

// Quote Component
export const StoryQuote = styled.blockquote`
  font-size: ${theme.typography.sizes['2xl']};
  font-style: italic;
  color: ${theme.colors.primary};
  text-align: center;
  margin: ${theme.spacing[6]} 0;
  padding: ${theme.spacing[4]};
  border-left: 4px solid ${theme.colors.primary};
  background: ${theme.colors.gray.light};
  position: relative;

  &::before {
    content: '"';
    font-size: ${theme.typography.sizes['4xl']};
    color: ${theme.colors.primary};
    position: absolute;
    top: -10px;
    left: ${theme.spacing[3]};
  }
`;

// Values Components
export const ValuesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`;

export const ValueCard = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  text-align: center;
  background: ${theme.colors.white};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.inOut};
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const ValueIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.primary};
  border-radius: 50%;
  
  svg {
    width: 32px;
    height: 32px;
    stroke: ${theme.colors.white};
    fill: none;
    stroke-width: 2;
  }
`;

export const ValueTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
`;

export const ValueDescription = styled.p`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
`;

// Stats Components
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`;

export const StatCard = styled.div`
  text-align: center;
  background: ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  border: 2px solid transparent;
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.inOut};
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: scale(1.02);
  }
`;

export const StatNumber = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.primary};
`;

export const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
`;