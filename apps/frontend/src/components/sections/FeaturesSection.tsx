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
  color: ${theme.colors.gray.medium};
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
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[4]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
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
    background: linear-gradient(90deg, ${theme.colors.black}, ${theme.colors.gray.medium});
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
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[3]};
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
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const FeatureDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[3]};
`;

const FeatureHighlight = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};

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
    title: 'Science-Backed Innovation',
    description: 'We combine biotechnology, clinical research, and data intelligence to create solutions that work at a cellular level. Every formulation is built on measurable science — not trends — ensuring real transformation for your body, skin, and mind.',
    highlight: 'Because wellness should be proven, not promised'
  },
  {
    icon: '02',
    title: 'Intelligent Personalisation',
    description: 'No two bodies are the same — your health solutions shouldn't be either. Through intelligent systems and expert insights, we design personalised protocols and products that evolve with your biology, goals, and lifestyle.',
    highlight: 'Wellness that adapts to you'
  },
  {
    icon: '03',
    title: 'Results, Not Rituals',
    description: 'We believe in results you can see, feel, and measure. From your skin's glow to your gut balance, every outcome is tracked, analysed, and refined — ensuring every step you take moves you closer to your best self.',
    highlight: 'Designed for impact, not empty routines'
  },
  {
    icon: '04',
    title: 'Conscious Luxury',
    description: 'Luxury for us isn't excess — it's intelligence, intention, and impact. Our products and practices are crafted with clean science, sustainable ethics, and uncompromising quality to bring wellness that feels as good as it looks.',
    highlight: 'Minimal. Modern. Meaningful'
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
            Wellness that's proven, not promised. We combine biotechnology, clinical research, 
            and data intelligence to create solutions that work at a cellular level.
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
