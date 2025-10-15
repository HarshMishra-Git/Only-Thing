'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionContainer = styled.section`
  padding: ${theme.spacing[10]} ${theme.spacing[4]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[8]} ${theme.spacing[3]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[6]} ${theme.spacing[3]};
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
  font-size: 11px;
  font-weight: ${theme.typography.weights.medium};
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${theme.colors.gray.light};
  margin-bottom: ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 10px;
  }
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(32px, 5vw, 56px);
  font-weight: ${theme.typography.weights.black};
  line-height: 1.15;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.015em;
  
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #e0e0e0 50%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: clamp(28px, 6vw, 48px);
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: clamp(24px, 7vw, 36px);
    margin-bottom: ${theme.spacing[3]};
  }
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: clamp(14px, 1.5vw, 17px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: ${theme.spacing[6]};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 14px;
    margin-bottom: ${theme.spacing[5]};
  }
`;

const CTAButtons = styled.div`
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
  padding: 16px 40px;
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: 15px;
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
    background: rgba(255, 255, 255, 0.2);
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
    padding: 14px 36px;
    font-size: 14px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 12px 28px;
    font-size: 13px;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 40px;
  background: transparent;
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-weight: ${theme.typography.weights.bold};
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${theme.colors.white};
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 14px 36px;
    font-size: 14px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 12px 28px;
    font-size: 13px;
  }
`;

const Guarantee = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: ${theme.typography.fonts.body};
  font-size: 13px;
  color: ${theme.colors.gray.light};
  margin: 0 auto;
  border-radius: 4px;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 11px;
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    flex-direction: column;
    gap: ${theme.spacing[1]};
    text-align: center;
  }
`;

const GuaranteeIcon = styled.div`
  font-size: 20px;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    font-size: 18px;
  }
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
