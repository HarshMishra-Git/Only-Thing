'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${theme.colors.black};
  padding: ${theme.spacing[8]} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 550px;
    padding: ${theme.spacing[6]} 0;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    min-height: 500px;
    padding: ${theme.spacing[4]} 0;
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
  filter: blur(3px) brightness(0.7);
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 2;
  backdrop-filter: blur(1px);
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 1200px;
  width: 100%;
  padding: 0 ${theme.spacing[6]};
  color: ${theme.colors.white};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 ${theme.spacing[4]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing[3]};
  }
`;

const Eyebrow = styled(motion.span)`
  display: inline-block;
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(10px, 1.5vw, ${theme.typography.sizes.sm});
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${theme.colors.gray.light};
  margin-bottom: ${theme.spacing[3]};
  opacity: 0.9;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
    letter-spacing: 0.1em;
  }
`;

const MainHeading = styled(motion.h1)`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(32px, 6vw, 72px);
  font-weight: ${theme.typography.weights.black};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  
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
    font-size: clamp(28px, 8vw, 56px);
    line-height: 1.15;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: clamp(24px, 9vw, 40px);
    margin-bottom: ${theme.spacing[3]};
  }
`;

const SubHeading = styled(motion.p)`
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(14px, 1.8vw, 18px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: ${theme.spacing[6]};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-weight: ${theme.typography.weights.regular};

  strong {
    font-weight: ${theme.typography.weights.bold};
    color: ${theme.colors.white};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 15px;
    max-width: 600px;
    margin-bottom: ${theme.spacing[5]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    max-width: 100%;
    margin-bottom: ${theme.spacing[4]};
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[3]};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing[2]};
    margin-bottom: ${theme.spacing[4]};
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  border: 2px solid ${theme.colors.white};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  
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

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 12px 28px;
    font-size: 13px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 10px 24px;
    font-size: 12px;
    letter-spacing: 0.06em;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: transparent;
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover {
    background: ${theme.colors.white};
    color: ${theme.colors.black};
    border-color: ${theme.colors.white};
    transform: translateY(-3px);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 12px 28px;
    font-size: 13px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 10px 24px;
    font-size: 12px;
    letter-spacing: 0.06em;
  }
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[6]};
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing[4]};
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(28px, 4vw, 42px);
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  line-height: 1;
  margin-bottom: ${theme.spacing[1]};
  letter-spacing: -0.02em;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const StatLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(10px, 1.2vw, 13px);
  color: ${theme.colors.gray.light};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: ${theme.typography.weights.medium};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
  }
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

const MuteButton = styled(motion.button)`
  position: absolute;
  top: 120px;
  right: ${theme.spacing[6]};
  z-index: 100;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.8);
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.6);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    width: 50px;
    height: 50px;
    top: 100px;
    right: ${theme.spacing[5]};
    font-size: 20px;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 46px;
    height: 46px;
    top: 90px;
    right: ${theme.spacing[4]};
    font-size: 18px;
  }
`;

export function VideoHeroSection() {
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <HeroContainer>
      <VideoBackground ref={videoRef} autoPlay loop muted playsInline>
        <source src="/videos/OT Video.mp4" type="video/mp4" />
      </VideoBackground>
      <VideoOverlay />

      <MuteButton
        onClick={toggleMute}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.8 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        title={isMuted ? 'Click to unmute' : 'Click to mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </MuteButton>

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
