'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const SectionContainer = styled.section`
  position: relative;
  padding: ${theme.spacing[10]} ${theme.spacing[4]};
  background: ${theme.colors.white};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[6]} ${theme.spacing[3]};
  }
`;

const CircularVideoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 0 8px rgba(45, 95, 63, 0.1), 0 0 0 16px rgba(45, 95, 63, 0.05);
  z-index: 2;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    width: 280px;
    height: 280px;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin: ${theme.spacing[4]} auto;
    width: 240px;
    height: 240px;
  }
`;

const MainContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  min-height: 600px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    min-height: auto;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px 1fr;
  gap: ${theme.spacing[4]};
  align-items: center;
  position: relative;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr 280px 1fr;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const TextContent = styled.div`
  color: ${theme.colors.black};
`;

const Eyebrow = styled.span`
  display: block;
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[3]};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['2xl']}, 4vw, ${theme.typography.sizes['4xl']});
  font-weight: ${theme.typography.weights.black};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: ${theme.colors.black};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes['2xl']};
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
  gap: ${theme.spacing[2]};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing[6]};
  text-align: center;
  justify-content: center;
  padding: ${theme.spacing[3]};
  background: ${theme.colors.gray.light};
  border-radius: ${theme.radii.base};
`;

// Smart Visual Elements Components
const LeftFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  padding-right: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding-right: 0;
  }
`;

const RightFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  padding-left: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding-left: 0;
  }
`;

const FeatureCard = styled.div`
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.gray.light};
  border-radius: ${theme.radii.lg};
  padding: ${theme.spacing[4]};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.inOut};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, ${theme.colors.primary} 0%, ${theme.colors.accent.gold} 100%);
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[8]};
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[2]};
`;

const FeatureIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 18px;
    height: 18px;
    stroke: ${theme.colors.white};
    fill: none;
    stroke-width: 2;
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  margin: 0;
`;

const FeatureDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.5;
  color: ${theme.colors.gray.dark};
  margin: 0;
`;

const FeatureSubtext = styled.p`
  font-size: ${theme.typography.sizes.xs};
  line-height: 1.4;
  color: ${theme.colors.gray.medium};
  margin-top: ${theme.spacing[1]};
  font-style: italic;
`;

export function VideoContentSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414L12 14l-2.414-2.414A2 2 0 019 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Intelligent Skincare',
      description: 'Intelligent Skincare is the evolution of beauty — where science, data, and biology come together to create products that think, adapt, and deliver measurable results.',
      subtext: 'It\'s not just skincare — it\'s skin intelligence.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Powered by Science',
      description: 'Because real wellness doesn\'t guess — it proves. Every formula, protocol, and ingredient we create is backed by measurable science not trends. We collaborate with researchers, dermatologists, and data scientists to decode how your body and skin truly function.',
      subtext: 'Evidence-based wellness for measurable results.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Crafted for the Future',
      description: 'Because wellness isn\'t about now — it\'s about next. We design with tomorrow in mind — merging biotechnology, AI insights, and sustainable innovation to future-proof your skin, health, and well-being.',
      subtext: 'Every formula evolves with you and your environment.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Backed by Agile Data',
      description: 'Because your body changes — and your wellness should too. We believe data isn\'t static — it\'s alive, evolving, and deeply personal. That\'s why our systems learn from you — your biology, your habits, your environment — to refine your wellness experience over time.',
      subtext: 'Adaptive wellness that evolves with you.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Assured Product Purity & Efficacy',
      description: 'Because integrity is the foundation of intelligence. Every formula at Only Thing is built with uncompromising purity and verified performance. We go beyond "clean beauty" — ensuring that every ingredient is clinically validated, ethically sourced, and scientifically tested for real, measurable results.',
      subtext: 'Uncompromising purity meets proven performance.'
    }
  ];

  // Split features into left and right
  const leftFeatures = features.slice(0, Math.ceil(features.length / 2));
  const rightFeatures = features.slice(Math.ceil(features.length / 2));

  return (
    <SectionContainer ref={ref}>
      <MainContainer>
        <HeaderSection>
          <Eyebrow>EXPERIENCE THE DIFFERENCE</Eyebrow>
          <Heading>
            INTELLIGENT<br />WELLNESS ECOSYSTEM
          </Heading>
          <TagLine>
            We support the highest standards of Quality and Transparency.
          </TagLine>
        </HeaderSection>
        
        <ContentGrid>
          {/* Left Features */}
          <LeftFeatures>
            {leftFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
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
          </LeftFeatures>
          
          {/* Center Circular Video */}
          <CircularVideoWrapper>
            <video autoPlay loop muted playsInline>
              <source src="/videos/v1.mp4" type="video/mp4" />
            </video>
          </CircularVideoWrapper>
          
          {/* Right Features */}
          <RightFeatures>
            {rightFeatures.map((feature, index) => (
              <motion.div
                key={index + leftFeatures.length}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: (index + leftFeatures.length) * 0.1, duration: 0.6 }}
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
          </RightFeatures>
        </ContentGrid>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          style={{ textAlign: 'center', marginTop: theme.spacing[8] }}
        >
          <CTAButton href="/products">
            Discover Your Formula
          </CTAButton>
        </motion.div>
      </MainContainer>
    </SectionContainer>
  );
}
