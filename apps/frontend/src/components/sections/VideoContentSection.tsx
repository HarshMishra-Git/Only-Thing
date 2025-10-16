'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const SectionContainer = styled.section`
  padding: ${theme.spacing[4]} ${theme.spacing[4]};
  background: ${theme.colors.white};
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: flex-start;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[4]} ${theme.spacing[3]};
    min-height: auto;
  }
`;

const MainContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: ${theme.spacing[5]};
  align-items: start;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 320px 1fr;
    gap: ${theme.spacing[4]};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const VideoWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  max-height: 720px;
  border-radius: ${theme.radii.base};
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background: ${theme.colors.black};
  position: sticky;
  top: 100px;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    max-width: 300px;
    height: 500px;
    margin: 0 auto;
    position: relative;
    top: auto;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  max-width: 700px;
  padding-bottom: ${theme.spacing[3]};
`;

const TextContent = styled.div`
  color: ${theme.colors.black};
`;

const Eyebrow = styled.span`
  display: block;
  font-family: ${theme.typography.fonts.body};
  font-size: 10px;
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[1]};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: ${theme.typography.weights.black};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: ${theme.colors.black};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.xl};
  }
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  line-height: 1.7;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
`;

const SubDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  line-height: 1.7;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[4]};
`;

const CTAButton = styled(Link)`
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

  &:hover {
    background: transparent;
    color: ${theme.colors.black};
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const TagLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  font-family: ${theme.typography.fonts.body};
  font-size: 11px;
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing[2]};
  text-align: center;
  justify-content: center;
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  background: ${theme.colors.gray.light};
  border-radius: ${theme.radii.base};
`;

// Header Section
const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[2]};
  position: relative;
  z-index: 5;
`;

// Horizontal Feature Card Styles
const FeatureCard = styled.div`
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.gray.light};
  border-radius: ${theme.radii.base};
  padding: ${theme.spacing[2]};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.inOut};
  
  &:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 16px rgba(45, 95, 63, 0.12);
    border-color: ${theme.colors.primary};
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[1]};
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 16px;
    height: 16px;
    stroke: ${theme.colors.white};
    fill: none;
    stroke-width: 2;
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: 13px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  margin: 0;
  line-height: 1.2;
`;

const FeatureDescription = styled.p`
  font-size: 11px;
  line-height: 1.4;
  color: ${theme.colors.gray.dark};
  margin: 0;
`;

const FeatureSubtext = styled.p`
  font-size: 10px;
  line-height: 1.2;
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing[1]};
  font-weight: ${theme.typography.weights.medium};
  font-style: italic;
`;

export function VideoContentSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414L12 14l-2.414-2.414A2 2 0 019 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Intelligent Skincare',
      description: 'Evolution of beauty where science, data, and biology create products that think, adapt, and deliver measurable results.',
      subtext: 'It\'s not just skincare — it\'s skin intelligence.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Powered by Science',
      description: 'Real wellness doesn\'t guess — it proves. Every formula is backed by measurable science, not trends.',
      subtext: 'Evidence-based wellness for measurable results.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Crafted for the Future',
      description: 'We design with tomorrow in mind — merging biotechnology, AI insights, and sustainable innovation.',
      subtext: 'Every formula evolves with you and your environment.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Backed by Agile Data',
      description: 'Your body changes — and your wellness should too. Our systems learn from your biology, habits, and environment.',
      subtext: 'Adaptive wellness that evolves with you.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Assured Product Purity & Efficacy',
      description: 'Integrity is the foundation of intelligence. Every ingredient is clinically validated and scientifically tested.',
      subtext: 'Uncompromising purity meets proven performance.'
    }
  ];

  return (
    <SectionContainer ref={ref}>
      <MainContainer>
        {/* Video on LEFT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <VideoWrapper>
            <video autoPlay loop muted playsInline>
              <source src="/videos/v1.mp4" type="video/mp4" />
            </video>
          </VideoWrapper>
        </motion.div>
        
        {/* Content on RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <HeaderSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Eyebrow>EXPERIENCE THE DIFFERENCE</Eyebrow>
              <Heading>
                INTELLIGENT<br />WELLNESS ECOSYSTEM
              </Heading>
              <TagLine>
                We support the highest standards of Quality and Transparency.
              </TagLine>
            </motion.div>
          </HeaderSection>
          
          {/* Stacked Cards */}
          <CardsContainer>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + (index * 0.1)
                }}
              >
                <FeatureCard>
                  <FeatureHeader>
                    <FeatureIcon>
                      {feature.icon}
                    </FeatureIcon>
                    <FeatureTitle>{feature.title}</FeatureTitle>
                  </FeatureHeader>
                  <FeatureDescription>
                    {feature.description}
                  </FeatureDescription>
                  <FeatureSubtext>
                    {feature.subtext}
                  </FeatureSubtext>
                </FeatureCard>
              </motion.div>
            ))}
          </CardsContainer>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{ marginTop: theme.spacing[3] }}
          >
            <CTAButton href="/products">
              Discover Your Formula
            </CTAButton>
          </motion.div>
        </div>
      </MainContainer>
    </SectionContainer>
  );
}
