'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SectionContainer = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  background: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[3]};
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing[8]};
  margin-bottom: ${theme.spacing[16]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const TrustCard = styled(motion.div)`
  text-align: center;
  padding: ${theme.spacing[6]};
  border: 1px solid ${theme.colors.gray.light};
  background: ${theme.colors.white};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.black};
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.gray.light};
  border: 2px solid ${theme.colors.black};
  font-size: ${theme.typography.sizes['3xl']};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -6px;
    border: 2px solid ${theme.colors.gray.light};
    transition: all 0.3s ease;
  }

  ${TrustCard}:hover &::after {
    inset: -10px;
    border-color: ${theme.colors.black};
  }
`;

const TrustTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TrustDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
`;

const TestimonialsSection = styled.div`
  background: ${theme.colors.gray.light};
  padding: ${theme.spacing[12]} ${theme.spacing[6]};
  margin: ${theme.spacing[16]} 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[8]} ${theme.spacing[4]};
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[6]};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled(motion.div)`
  background: ${theme.colors.white};
  padding: ${theme.spacing[6]};
  border-left: 4px solid ${theme.colors.black};
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
`;

const Quote = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.7;
  margin-bottom: ${theme.spacing[4]};
  font-style: italic;

  &::before {
    content: '"';
    font-size: ${theme.typography.sizes['3xl']};
    line-height: 0;
    vertical-align: -0.4em;
    margin-right: ${theme.spacing[1]};
    color: ${theme.colors.black};
  }
`;

const Author = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Rating = styled.div`
  color: ${theme.colors.black};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing[3]};
`;

const CertificationsBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing[8]};
  flex-wrap: wrap;
  padding: ${theme.spacing[8]} 0;
`;

const Certification = styled(motion.div)`
  text-align: center;
`;

const CertLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-top: ${theme.spacing[2]};
`;

const CertBadge = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border: 3px solid ${theme.colors.black};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.black};
  text-align: center;
  padding: ${theme.spacing[2]};
  line-height: 1.2;
  background: ${theme.colors.white};
`;

const trustPoints = [
  {
    icon: '🔬',
    title: 'Clinically Tested',
    description: 'All formulations undergo rigorous double-blind clinical trials'
  },
  {
    icon: '🌿',
    title: 'Clean Formulas',
    description: 'No parabens, sulfates, or synthetic fragrances'
  },
  {
    icon: '🧬',
    title: 'Science-Backed',
    description: 'Peer-reviewed research validates every ingredient'
  },
  {
    icon: '♻️',
    title: 'Sustainable',
    description: 'Eco-friendly packaging and ethical sourcing'
  }
];

const testimonials = [
  {
    quote: 'After just 4 weeks, my skin looks completely transformed. The fine lines around my eyes have visibly reduced, and my complexion is brighter.',
    author: 'Sarah M.',
    rating: 5
  },
  {
    quote: 'I\'ve tried countless skincare brands, but Only Thing is the first that actually delivers on its promises. The science really shows.',
    author: 'Jennifer K.',
    rating: 5
  },
  {
    quote: 'As someone with sensitive skin, I was hesitant. But these formulas are gentle yet incredibly effective. My dermatologist is impressed!',
    author: 'Michael R.',
    rating: 5
  }
];

const certifications = [
  'FDA\nRegistered',
  'Cruelty\nFree',
  'Vegan\nCertified',
  'GMP\nCertified'
];

export function TrustSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <SectionContainer ref={ref}>
      <ContentWrapper>
        <Grid>
          {trustPoints.map((point, index) => (
            <TrustCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <IconWrapper>{point.icon}</IconWrapper>
              <TrustTitle>{point.title}</TrustTitle>
              <TrustDescription>{point.description}</TrustDescription>
            </TrustCard>
          ))}
        </Grid>

        <CertificationsBar>
          {certifications.map((cert, index) => (
            <Certification
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <CertBadge>{cert}</CertBadge>
            </Certification>
          ))}
        </CertificationsBar>
      </ContentWrapper>

      <TestimonialsSection>
        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8 + index * 0.15, duration: 0.6 }}
            >
              <Rating>{'★'.repeat(testimonial.rating)}</Rating>
              <Quote>{testimonial.quote}</Quote>
              <Author>{testimonial.author}</Author>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </TestimonialsSection>
    </SectionContainer>
  );
}
