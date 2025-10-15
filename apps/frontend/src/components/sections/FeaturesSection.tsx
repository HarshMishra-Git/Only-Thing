'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionContainer = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  background: ${theme.colors.white};
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[3]};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[12]};
`;

const Eyebrow = styled.span`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${theme.colors.gray.DEFAULT};
  display: block;
  margin-bottom: ${theme.spacing[3]};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 5vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${theme.spacing[6]};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[8]};
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${theme.colors.black}, ${theme.colors.gray.DEFAULT});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: ${theme.colors.black};

    &::before {
      transform: scaleX(1);
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[6]};
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[4]};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border: 2px solid ${theme.colors.black};
    opacity: 0;
    transition: all 0.3s ease;
  }

  ${FeatureCard}:hover &::after {
    inset: -8px;
    opacity: 1;
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const FeatureDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.7;
  margin-bottom: ${theme.spacing[4]};
`;

const FeatureHighlight = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};

  &::before {
    content: '→';
    font-size: ${theme.typography.sizes.lg};
    transition: transform 0.3s ease;
  }

  ${FeatureCard}:hover &::before {
    transform: translateX(4px);
  }
`;

const features = [
  {
    icon: '01',
    title: 'Intelligent Formulation',
    description: 'AI-powered ingredient combinations that adapt to your unique skin profile. Our proprietary algorithm analyzes 50+ biomarkers to create your perfect match.',
    highlight: 'Personalized Science'
  },
  {
    icon: '02',
    title: 'Clinical Efficacy',
    description: 'Every product undergoes rigorous clinical trials with measurable results. 95% efficacy rate backed by double-blind studies and peer-reviewed research.',
    highlight: 'Proven Results'
  },
  {
    icon: '03',
    title: 'Advanced Delivery',
    description: 'Liposomal encapsulation technology ensures active ingredients penetrate deeper. 5X more effective than conventional formulations.',
    highlight: 'Enhanced Absorption'
  },
  {
    icon: '04',
    title: 'Real-Time Tracking',
    description: 'Monitor your skin transformation with our advanced analytics. Track hydration, elasticity, and cellular regeneration metrics daily.',
    highlight: 'Data-Driven Insights'
  }
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <SectionContainer ref={ref}>
      <ContentWrapper>
        <SectionHeader>
          <Eyebrow>Why Choose Only Thing</Eyebrow>
          <Heading>
            Science Meets<br />Luxury
          </Heading>
          <Description>
            We combine cutting-edge biotechnology with clinical-grade ingredients
            to deliver transformative skincare that actually works.
          </Description>
        </SectionHeader>

        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <FeatureHighlight>{feature.highlight}</FeatureHighlight>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </ContentWrapper>
    </SectionContainer>
  );
}
