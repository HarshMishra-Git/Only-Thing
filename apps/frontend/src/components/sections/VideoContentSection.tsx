'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const SectionContainer = styled.section`
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${theme.colors.black};

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 70vh;
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
  opacity: 0.5;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 2;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};
  text-align: center;
  color: ${theme.colors.white};
`;

const Eyebrow = styled.span`
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

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 6vw, ${theme.typography.sizes['6xl']});
  font-weight: ${theme.typography.weights.black};
  line-height: 1.05;
  margin-bottom: ${theme.spacing[6]};
  text-transform: uppercase;
  letter-spacing: -0.025em;
  
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #d0d0d0 50%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: clamp(${theme.typography.sizes['2xl']}, 8vw, ${theme.typography.sizes['4xl']});
  }
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(${theme.typography.sizes.base}, 1.5vw, ${theme.typography.sizes.xl});
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing[8]};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
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
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover {
    background: transparent;
    color: ${theme.colors.white};
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.3);

    &::before {
      width: 400px;
      height: 400px;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[8]};
  margin-top: ${theme.spacing[12]};

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const FeatureItem = styled(motion.div)`
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[3]};
  font-family: ${theme.typography.fonts.display};
`;

const FeatureLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.light};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: ${theme.typography.weights.medium};
`;

const features = [
  { icon: '🧬', label: 'Advanced Biotechnology' },
  { icon: '🔬', label: 'Clinical Testing' },
  { icon: '✨', label: 'Transformative Results' }
];

export function VideoContentSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  return (
    <SectionContainer ref={ref}>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/videos/v1.mp4" type="video/mp4" />
      </VideoBackground>
      <Overlay />

      <ContentWrapper
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Eyebrow>Experience The Difference</Eyebrow>
        <Heading>
          Intelligent Skincare<br />That Evolves With You
        </Heading>
        <Description>
          Our adaptive formulations use cutting-edge biotechnology to respond to
          your skin's changing needs. Experience personalized care that delivers
          visible results in as little as 28 days.
        </Description>
        <CTAButton href="/products">
          Discover Your Formula
        </CTAButton>

        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureLabel>{feature.label}</FeatureLabel>
            </FeatureItem>
          ))}
        </FeatureGrid>
      </ContentWrapper>
    </SectionContainer>
  );
}
