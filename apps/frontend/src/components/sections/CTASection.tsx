'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionContainer = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[3]};
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: repeating-linear-gradient(
    45deg,
    ${theme.colors.white} 0,
    ${theme.colors.white} 2px,
    transparent 2px,
    transparent 10px
  );
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
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
    #e0e0e0 50%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(${theme.typography.sizes.base}, 1.5vw, ${theme.typography.sizes.xl});
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${theme.spacing[10]};
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing[10]};
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[5]} ${theme.spacing[10]};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.lg};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 3px solid ${theme.colors.white};
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
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.5s ease;
  }

  &:hover {
    background: transparent;
    color: ${theme.colors.white};
    transform: translateY(-4px);
    box-shadow: 0 25px 70px rgba(255, 255, 255, 0.3);

    &::before {
      left: 100%;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[4]} ${theme.spacing[8]};
    font-size: ${theme.typography.sizes.base};
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[5]} ${theme.spacing[10]};
  background: transparent;
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.lg};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;

  &:hover {
    border-color: ${theme.colors.white};
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-4px);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[4]} ${theme.spacing[8]};
    font-size: ${theme.typography.sizes.base};
  }
`;

const Guarantee = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.light};
  margin: 0 auto;
`;

const GuaranteeIcon = styled.div`
  font-size: ${theme.typography.sizes['2xl']};
`;

export function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  return (
    <SectionContainer ref={ref}>
      <BackgroundPattern />
      <ContentWrapper
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Eyebrow>Start Your Transformation Today</Eyebrow>
        <Heading>
          Ready To Experience<br />The Difference?
        </Heading>
        <Description>
          Join thousands who have transformed their skin with our
          science-backed formulations. Get personalized recommendations
          based on your unique skin profile.
        </Description>

        <CTAButtons>
          <PrimaryButton href="/quiz">
            Take The Skin Quiz
          </PrimaryButton>
          <SecondaryButton href="/products">
            Shop All Products
          </SecondaryButton>
        </CTAButtons>

        <Guarantee>
          <GuaranteeIcon>✓</GuaranteeIcon>
          <span>60-Day Money-Back Guarantee • Free Shipping on Orders $75+</span>
        </Guarantee>
      </ContentWrapper>
    </SectionContainer>
  );
}
