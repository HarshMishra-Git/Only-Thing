'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const PageContainer = styled.div`
  padding-top: 73px;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  background: linear-gradient(135deg, ${theme.colors.black} 0%, ${theme.colors.gray.dark} 100%);
  color: ${theme.colors.white};
  padding: ${theme.spacing[10]} ${theme.spacing[3]};
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
  color: ${theme.colors.white};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes['4xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${theme.typography.sizes.xl};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  color: ${theme.colors.white};
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${theme.spacing[8]} ${theme.spacing[3]};
  
  @media (max-width: ${theme.breakpoints.xl}) {
    max-width: 1200px;
  }
  
  @media (max-width: ${theme.breakpoints.lg}) {
    max-width: 900px;
  }
`;

const Section = styled.section`
  margin-bottom: ${theme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.black};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
`;

const Paragraph = styled.p`
  font-size: ${theme.typography.sizes.lg};
  line-height: 1.8;
  color: ${theme.colors.gray.dark};
  margin-bottom: ${theme.spacing[3]};
`;

const ValuesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`;

const ValueCard = styled.div`
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[4]};
  text-align: center;
`;

const ValueIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
    stroke: ${theme.colors.black};
    fill: none;
    stroke-width: 1.5;
  }
`;

const ValueTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[2]};
  text-transform: uppercase;
`;

const ValueDescription = styled.p`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
`;

export default function AboutPage() {
  const values = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Science-Backed',
      description: 'Every formula is grounded in clinical research and developed with medical professionals.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3C7.58172 3 4 6.58172 4 11C4 15.4183 7.58172 19 12 19C16.4183 19 20 15.4183 20 11C20 6.58172 16.4183 3 12 3Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 8V11L14 13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 19C8 19 9 21 12 21C15 21 16 19 16 19" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 5C9 5 10 3 12 3C14 3 15 5 15 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Pure & Natural',
      description: 'We use only the highest quality ingredients with no artificial fillers or harmful additives.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Transparent',
      description: 'Full disclosure of ingredients, dosages, and sources. No proprietary blends, no secrets.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Sustainable',
      description: 'Committed to environmentally responsible sourcing and packaging for a healthier planet.'
    }
  ];

  const stats = [
    { number: '100K+', label: 'Happy Customers' },
    { number: '15+', label: 'Premium Products' },
    { number: '5★', label: 'Average Rating' },
    { number: '50+', label: 'Clinical Studies' }
  ];

  return (
    <>
      <Header />
      <PageContainer>
        <HeroSection>
          <HeroTitle>About Only Thing</HeroTitle>
          <HeroSubtitle>
            Redefining wellness through science, transparency, and purpose
          </HeroSubtitle>
        </HeroSection>

        <ContentContainer>
          <Section>
            <SectionTitle>Our Story</SectionTitle>
            <Paragraph>
              Only Thing was founded on a simple belief: wellness should be straightforward, 
              science-backed, and accessible to everyone. In a market saturated with gimmicks 
              and empty promises, we saw the need for a brand that prioritizes transparency, 
              quality, and real results.
            </Paragraph>
            <Paragraph>
              Our journey began when our founders, frustrated with the lack of honest information 
              in the supplement industry, decided to create something different. We partnered with 
              leading researchers, doctors, and nutritionists to develop formulations that actually work.
            </Paragraph>
            <Paragraph>
              Today, Only Thing stands as a trusted name in wellness, helping thousands of people 
              achieve their health goals with products they can feel confident about.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>Our Values</SectionTitle>
            <ValuesList>
              {values.map((value, index) => (
                <ValueCard key={index}>
                  <ValueIcon>{value.icon}</ValueIcon>
                  <ValueTitle>{value.title}</ValueTitle>
                  <ValueDescription>{value.description}</ValueDescription>
                </ValueCard>
              ))}
            </ValuesList>
          </Section>

          <Section>
            <SectionTitle>Our Mission</SectionTitle>
            <Paragraph>
              We exist to empower individuals to take control of their health through products 
              that are scientifically proven, ethically sourced, and transparently communicated. 
              We believe that everyone deserves access to supplements they can trust—products that 
              are honest about what they contain and what they can do.
            </Paragraph>
            <Paragraph>
              Our commitment extends beyond our products. We're dedicated to educating our 
              community, advancing wellness research, and operating in a way that's sustainable 
              for both people and planet.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>By The Numbers</SectionTitle>
            <StatsGrid>
              {stats.map((stat, index) => (
                <StatCard key={index}>
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatCard>
              ))}
            </StatsGrid>
          </Section>
        </ContentContainer>
      </PageContainer>
      <Footer />
    </>
  );
}

