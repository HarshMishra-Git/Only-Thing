'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${theme.colors.black};

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 600px;
  }
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 1;
  opacity: 0.6;
  filter: brightness(0.8);
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 2;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 1200px;
  padding: 0 ${theme.spacing[4]};
  color: ${theme.colors.white};
`;

const Eyebrow = styled(motion.span)`
  display: inline-block;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${theme.colors.gray.light};
  margin-bottom: ${theme.spacing[4]};
  opacity: 0.9;
`;

const MainHeading = styled(motion.h1)`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(48px, 8vw, 120px);
  font-weight: ${theme.typography.weights.black};
  line-height: 0.95;
  margin-bottom: ${theme.spacing[5]};
  text-transform: uppercase;
  letter-spacing: -0.03em;
  
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #e0e0e0 50%,
    #ffffff 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  text-shadow: 0 0 80px rgba(255, 255, 255, 0.3);

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: clamp(36px, 10vw, 64px);
  }
`;

const SubHeading = styled(motion.p)`
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(${theme.typography.sizes.lg}, 2vw, ${theme.typography.sizes['2xl']});
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: ${theme.spacing[8]};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-weight: ${theme.typography.weights.regular};

  strong {
    font-weight: ${theme.typography.weights.bold};
    color: ${theme.colors.white};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.base};
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing[8]};
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.base};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 2px solid ${theme.colors.white};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    transition: left 0.5s ease;
  }

  &:hover {
    background: transparent;
    color: ${theme.colors.white};
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: transparent;
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.base};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${theme.colors.white};
    color: ${theme.colors.black};
    border-color: ${theme.colors.white};
    transform: translateY(-3px);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[8]};
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 5vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  line-height: 1;
  margin-bottom: ${theme.spacing[2]};
  letter-spacing: -0.02em;
`;

const StatLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.light};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: ${theme.typography.weights.medium};
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: ${theme.spacing[6]};
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
  cursor: pointer;
`;

const ScrollText = styled.span`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.light};
  text-transform: uppercase;
  letter-spacing: 0.2em;
`;

const ScrollArrow = styled(motion.div)`
  width: 2px;
  height: 40px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    ${theme.colors.white} 50%,
    transparent 100%
  );
  border-radius: 2px;
`;

export function VideoHeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <HeroContainer>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/videos/v1.mp4" type="video/mp4" />
      </VideoBackground>
      <VideoOverlay />

      <ContentWrapper
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Eyebrow
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Science-Backed • Clinically Proven • Results Driven
        </Eyebrow>

        <MainHeading
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          The Future of<br />Skincare is<br />Intelligent
        </MainHeading>

        <SubHeading
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Precision-engineered formulations that <strong>adapt to your skin</strong>.
          Advanced biotechnology meets clinical luxury for transformative results.
        </SubHeading>

        <CTAContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <PrimaryButton href="/quiz">
            Start Your Analysis
          </PrimaryButton>
          <SecondaryButton href="/products">
            Explore Products
          </SecondaryButton>
        </CTAContainer>

        <StatsContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <StatItem>
            <StatValue>95%</StatValue>
            <StatLabel>Efficacy Rate</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>10K+</StatValue>
            <StatLabel>Verified Results</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>20+</StatValue>
            <StatLabel>Clinical Trials</StatLabel>
          </StatItem>
        </StatsContainer>
      </ContentWrapper>

      <ScrollIndicator
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <ScrollText>Scroll</ScrollText>
        <ScrollArrow
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </ScrollIndicator>
    </HeroContainer>
  );
}
