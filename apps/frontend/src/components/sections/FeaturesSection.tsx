'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

const SectionContainer = styled.section`
  padding: ${theme.spacing[10]} ${theme.spacing[4]};
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[8]} ${theme.spacing[3]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[6]} ${theme.spacing[3]};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: left;
  margin-bottom: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    text-align: center;
    margin-bottom: ${theme.spacing[6]};
  }
`;

const Eyebrow = styled.span`
  font-family: ${theme.typography.fonts.body};
  font-size: 12px;
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${theme.colors.gray.medium};
  display: block;
  margin-bottom: ${theme.spacing[2]};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(28px, 4vw, 48px);
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  line-height: 1.2;
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
  letter-spacing: -0.01em;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: 15px;
  color: ${theme.colors.gray.dark};
  max-width: 600px;
  margin: 0;
  line-height: 1.6;
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin: 0 auto;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[8]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[6]};
  }
`;

const LeftContent = styled.div`
  padding-right: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding-right: 0;
  }
`;

const RightInfographic = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.md}) {
    order: -1;
  }
`;

const InfographicContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[2]};
    gap: ${theme.spacing[2]};
  }
`;

const InfographicCard = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: ${theme.spacing[4]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]};
  }
`;

const InfographicIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${theme.spacing[2]};
  filter: grayscale(0.3);
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 36px;
    margin-bottom: ${theme.spacing[1]};
  }
`;

const InfographicTitle = styled.h4`
  font-family: ${theme.typography.fonts.display};
  font-size: 16px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 13px;
  }
`;

const InfographicValue = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: 32px;
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  line-height: 1;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 24px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    gap: ${theme.spacing[2]};
    margin-top: ${theme.spacing[4]};
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${theme.colors.white};
  border-left: 3px solid ${theme.colors.black};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${theme.spacing[3]};
  align-items: start;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, ${theme.colors.black}, ${theme.colors.gray.medium});
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);

    &::before {
      transform: scaleY(1);
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[3]};
    gap: ${theme.spacing[2]};
  }
`;

const IconWrapper = styled.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: ${theme.typography.weights.bold};
  font-family: ${theme.typography.fonts.display};
  position: relative;
  border-radius: 4px;
  
  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border: 2px solid ${theme.colors.black};
    opacity: 0;
    transition: all 0.3s ease;
    border-radius: 6px;
  }

  ${FeatureCard}:hover &::after {
    inset: -6px;
    opacity: 1;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    min-width: 36px;
    font-size: 16px;
  }
`;

const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeatureTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: 15px;
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 13px;
  }
`;

const FeatureDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: 13px;
  color: ${theme.colors.gray.dark};
  line-height: 1.5;
  margin: 0;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 12px;
  }
`;


const features = [
  {
    icon: '01',
    title: 'Intelligent Formulation',
    description: 'AI-powered ingredient combinations adapted to your unique skin profile with 50+ biomarkers analysis.'
  },
  {
    icon: '02',
    title: 'Clinical Efficacy',
    description: 'Rigorous clinical trials with 95% efficacy rate backed by double-blind studies and peer-reviewed research.'
  },
  {
    icon: '03',
    title: 'Advanced Delivery',
    description: 'Liposomal encapsulation technology ensures 5X deeper penetration than conventional formulations.'
  },
  {
    icon: '04',
    title: 'Real-Time Tracking',
    description: 'Monitor your transformation with advanced analytics tracking hydration, elasticity, and regeneration.'
  }
];

const infographics = [
  { icon: '🔬', title: 'Science', value: '50+', subtitle: 'Biomarkers' },
  { icon: '✓', title: 'Efficacy', value: '95%', subtitle: 'Success Rate' },
  { icon: '⚡', title: 'Absorption', value: '5X', subtitle: 'More Effective' },
  { icon: '📊', title: 'Tracking', value: '24/7', subtitle: 'Real-Time' }
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <SectionContainer ref={ref}>
      <ContentWrapper>
        <MainLayout>
          <LeftContent>
            <SectionHeader>
              <Eyebrow>Why Choose Only Thing</Eyebrow>
              <Heading>
                Science Meets<br />Luxury
              </Heading>
              <Description>
                Cutting-edge biotechnology with clinical-grade ingredients
                for transformative skincare that delivers proven results.
              </Description>
            </SectionHeader>

            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <IconWrapper>{feature.icon}</IconWrapper>
                  <FeatureContent>
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    <FeatureDescription>{feature.description}</FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </LeftContent>

          <RightInfographic>
            <InfographicContainer>
              {infographics.map((item, index) => (
                <InfographicCard
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6, type: 'spring' }}
                >
                  <InfographicIcon>{item.icon}</InfographicIcon>
                  <InfographicValue>{item.value}</InfographicValue>
                  <InfographicTitle>{item.subtitle}</InfographicTitle>
                </InfographicCard>
              ))}
            </InfographicContainer>
          </RightInfographic>
        </MainLayout>
      </ContentWrapper>
    </SectionContainer>
  );
}
