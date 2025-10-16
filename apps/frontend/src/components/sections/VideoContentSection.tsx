'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const SectionContainer = styled.section`
  position: relative;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  overflow: hidden;
  min-height: 800px;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[8]} ${theme.spacing[3]};
    min-height: auto;
  }
`;

const MainContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  height: 100%;
`;

const CentralVideoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 
    0 0 0 3px ${theme.colors.white},
    0 0 0 6px ${theme.colors.primary},
    0 20px 40px rgba(45, 95, 63, 0.15);
  z-index: 10;
  background: ${theme.colors.white};
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    width: 250px;
    height: 250px;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin: ${theme.spacing[6]} auto;
    width: 200px;
    height: 200px;
  }
`;

const FeatureCardsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  
  @media (max-width: ${theme.breakpoints.md}) {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};
    margin-top: ${theme.spacing[6]};
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

// Header Section
const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[10]};
  position: relative;
  z-index: 5;
`;

// Horizontal Feature Card Styles
const FeatureCard = styled.div<{ position: { top: string; left: string; right?: string } }>`
  position: absolute;
  top: ${props => props.position.top};
  left: ${props => props.position.left};
  right: ${props => props.position.right || 'auto'};
  width: 280px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.light};
  border-radius: ${theme.radii.xl};
  padding: ${theme.spacing[4]};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.inOut};
  backdrop-filter: blur(10px);
  z-index: 5;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(45, 95, 63, 0.15);
    border-color: ${theme.colors.primary};
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    width: 260px;
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  margin-bottom: ${theme.spacing[3]};
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 20px;
    height: 20px;
    stroke: ${theme.colors.white};
    fill: none;
    stroke-width: 2;
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  margin: 0;
  line-height: 1.2;
`;

const FeatureDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.5;
  color: ${theme.colors.gray.dark};
  margin: 0 0 ${theme.spacing[2]} 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FeatureSubtext = styled.p`
  font-size: ${theme.typography.sizes.xs};
  line-height: 1.3;
  color: ${theme.colors.primary};
  margin: 0;
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
      subtext: 'It\'s not just skincare — it\'s skin intelligence.',
      position: { top: '15%', left: '8%' }
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Powered by Science',
      description: 'Real wellness doesn\'t guess — it proves. Every formula is backed by measurable science, not trends.',
      subtext: 'Evidence-based wellness for measurable results.',
      position: { top: '45%', left: '5%' }
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Crafted for the Future',
      description: 'We design with tomorrow in mind — merging biotechnology, AI insights, and sustainable innovation.',
      subtext: 'Every formula evolves with you and your environment.',
      position: { top: '75%', left: '12%' }
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Backed by Agile Data',
      description: 'Your body changes — and your wellness should too. Our systems learn from your biology, habits, and environment.',
      subtext: 'Adaptive wellness that evolves with you.',
      position: { top: '15%', right: '8%' }
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Assured Product Purity & Efficacy',
      description: 'Integrity is the foundation of intelligence. Every ingredient is clinically validated and scientifically tested.',
      subtext: 'Uncompromising purity meets proven performance.',
      position: { top: '75%', right: '12%' }
    }
  ];

  return (
    <SectionContainer ref={ref}>
      <MainContainer>
        <HeaderSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
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
        
        <FeatureCardsContainer>
          {/* Central Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CentralVideoWrapper>
              <video autoPlay loop muted playsInline>
                <source src="/videos/v1.mp4" type="video/mp4" />
              </video>
            </CentralVideoWrapper>
          </motion.div>
          
          {/* Positioned Feature Cards */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                x: feature.position.left ? -50 : 50,
                y: 20
              }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + (index * 0.1),
                type: "spring",
                stiffness: 100
              }}
            >
              <FeatureCard position={feature.position}>
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
        </FeatureCardsContainer>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ 
            textAlign: 'center', 
            marginTop: theme.spacing[8],
            position: 'relative',
            zIndex: 15
          }}
        >
          <CTAButton href="/products">
            Discover Your Formula
          </CTAButton>
        </motion.div>
      </MainContainer>
    </SectionContainer>
  );
}
