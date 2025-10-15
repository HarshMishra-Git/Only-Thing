'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

const SectionContainer = styled.section`
  position: relative;
  padding: ${theme.spacing[12]} ${theme.spacing[4]};
  background: ${theme.colors.white};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[8]} ${theme.spacing[3]};
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background: ${theme.colors.gray.light};
  overflow: hidden;
  border-radius: ${theme.radii.lg};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    height: 500px;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    height: 400px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
  gap: ${theme.spacing[8]};
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[8]};
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
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[6]};
  
  &::before {
    content: '🌱';
    font-size: ${theme.typography.sizes.xl};
  }
`;

export function VideoContentSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <SectionContainer ref={ref}>
      <Grid>
        <VideoWrapper>
          <video autoPlay loop muted playsInline>
            <source src="/videos/v1.mp4" type="video/mp4" />
          </video>
        </VideoWrapper>

        <TextContent>
          <Eyebrow>EXPERIENCE THE DIFFERENCE</Eyebrow>
          <Heading>
            WELCOME TO<br />CAPSULE CULTURE
          </Heading>
          <Description>
            SpoiledChild gives you control of your future and impact on the planet. 
            Our products have been designed to be refillable reusable or recyclable.
          </Description>
          <SubDescription>
            By joining our auto-refill subscription you become part of our mission 
            to reduce waste produced by our industry.
          </SubDescription>
          <SubDescription>
            When you commit to SpoiledChild, you are choosing change as consistency 
            is the key to transformative results.
          </SubDescription>
          <TagLine>Stay youth-full and waste less.</TagLine>
          <CTAButton href="/products">
            Discover Your Formula
          </CTAButton>
        </TextContent>
      </Grid>
    </SectionContainer>
  );
}
