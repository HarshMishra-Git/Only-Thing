'use client';

import React from 'react';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import {
  PageContainer,
  HeroSection,
  HeroTitle,
  HeroTagline,
  HeroSubtitle,
  ContentContainer,
  Section,
  SectionTitle,
  Paragraph,
  StoryQuote,
  FourPContainer,
  CircularDiagram,
  CircleSegment,
  CenterCircle,
  CenterLogo,
  CenterTagline,
  SegmentLabel,
  SegmentTitle,
  SegmentDescription,
  BeliefsList,
  BeliefCard,
  BeliefIcon,
  BeliefTitle,
  BeliefDescription,
  ValuesList,
  ValueCard,
  ValueIcon,
  ValueTitle,
  ValueDescription,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel
} from './components';
import { theme } from '@/lib/theme';

export default function AboutPage() {
  // 4P Approach Data
  const fourPSegments = [
    {
      title: 'Preventive',
      description: 'Strengthen from within',
      color: '#C8A882', // Gold/Beige
      rotation: 0,
      labelPosition: { top: '25%', left: '25%' }
    },
    {
      title: 'Proactive',
      description: 'Act before issues arise',
      color: '#8DC3A7', // Teal Green
      rotation: 90,
      labelPosition: { top: '25%', left: '75%' }
    },
    {
      title: 'Personalized',
      description: 'Tailored to your biology & lifestyle',
      color: '#A8D5BA', // Light Green
      rotation: 180,
      labelPosition: { top: '75%', left: '75%' }
    },
    {
      title: 'Predictive',
      description: 'Anticipate needs before symptoms',
      color: '#5F9F7F', // Darker Green
      rotation: 270,
      labelPosition: { top: '75%', left: '25%' }
    }
  ];

  // Core Beliefs Data
  const coreBeliefs = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 01-.586 1.414L12 14l-2.414-2.414A2 2 0 019 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Intelligent Skincare',
      description: 'Driven by cellular science and adaptive bioactive ingredients.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Powered By Science',
      description: 'Rooted in clinical validation and next-gen biotechnology.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Crafted For The Future',
      description: 'Merging nature, AI, and innovation for long-term wellbeing.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Backed By Data',
      description: 'Every claim supported by measurable, scientific evidence.'
    }
  ];

  // Innovation Values
  const innovationValues = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Bio-Science Innovation',
      description: 'Cutting-edge biotechnology meets traditional wisdom for breakthrough formulations.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m17 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Clinically Validated',
      description: 'Every formula undergoes rigorous testing and clinical validation for proven efficacy.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Adaptive Wellness',
      description: 'AI-powered personalization that evolves with your unique biological needs.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7.5,4.21 12,6.81 16.5,4.21" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7.5,19.79 7.5,14.6 3,12" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="21,12 16.5,14.6 16.5,19.79" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="12,22.81 12,17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Holistic Integration',
      description: 'Complete wellness ecosystem connecting skin, nutrition, and overall health.'
    }
  ];

  // Updated stats
  const stats = [
    { number: 'India\'s 1st', label: 'Intelligent Wellness' },
    { number: '4P', label: 'Approach Framework' },
    { number: '100%', label: 'Science-Backed' },
    { number: 'AI-Powered', label: 'Personalization' }
  ];

  return (
    <>
      <Header />
      <PageContainer>
        <HeroSection>
          <HeroTagline>Health & Wellness</HeroTagline>
          <HeroTitle>Only Thing</HeroTitle>
          <HeroSubtitle>
            India's 1st Science-Backed, Data-Driven Intelligent Health & Skincare Company
          </HeroSubtitle>
        </HeroSection>

        <ContentContainer>
          {/* Our Story Section */}
          <Section>
            <SectionTitle>Our Story</SectionTitle>
            <SectionTitle style={{ fontSize: theme.typography.sizes['2xl'], margin: `${theme.spacing[4]} 0` }}>The Beginning of Intelligent Wellness</SectionTitle>
            
            <Paragraph>
              In a world overflowing with trends, shortcuts, and empty promises, we asked a simple question:
            </Paragraph>
            
            <StoryQuote>
              What if wellness could think for itself?
            </StoryQuote>
            
            <Paragraph>
              That question became the spark behind Only Thing Health & Wellness — India's first company dedicated to creating science-backed, data-driven intelligent solutions for health, beauty, and longevity.
            </Paragraph>
            
            <Paragraph>
              Born from a belief that the body and mind are not separate, but deeply connected systems, we built our philosophy on intelligence — the ability to listen, adapt, and evolve. We envisioned products that don't just feel good, but are proven to work.
            </Paragraph>
            
            <Paragraph>
              Formulas that use clinical science, biotechnology, and real data to deliver results that are measurable, meaningful, and personal. Every drop, every ingredient, and every innovation we create is guided by one purpose — to help people live smarter, look younger, and feel stronger, from the cell to the soul.
            </Paragraph>
            
            <StoryQuote style={{ borderLeft: `4px solid ${theme.colors.accent.gold}`, background: 'transparent' }}>
              Because in the end, there's only one thing that matters — truth backed by science.
            </StoryQuote>
          </Section>

          {/* 4P Approach Section */}
          <Section>
            <SectionTitle>Our 4P Approach</SectionTitle>
            <SectionTitle style={{ fontSize: theme.typography.sizes['2xl'], margin: `${theme.spacing[2]} 0 ${theme.spacing[6]} 0` }}>The Future of Intelligent Wellness</SectionTitle>
            
            <Paragraph>
              At the core of our innovation lies the 4P Approach, a next-generation framework that powers our vision for global and local wellness.
            </Paragraph>
            
            <FourPContainer>
              <CircularDiagram>
                {fourPSegments.map((segment, index) => (
                  <React.Fragment key={index}>
                    <CircleSegment 
                      rotation={segment.rotation} 
                      color={segment.color}
                    />
                    <SegmentLabel position={segment.labelPosition}>
                      <SegmentTitle>{segment.title}</SegmentTitle>
                      <SegmentDescription>{segment.description}</SegmentDescription>
                    </SegmentLabel>
                  </React.Fragment>
                ))}
                <CenterCircle>
                  <CenterLogo>Only Thing</CenterLogo>
                  <CenterTagline>Powered by Science & Data</CenterTagline>
                </CenterCircle>
              </CircularDiagram>
            </FourPContainer>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing[4], marginTop: theme.spacing[6] }}>
              <div>
                <h3 style={{ fontFamily: theme.typography.fonts.display, fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: '#C8A882', marginBottom: theme.spacing[2] }}>1. Preventive</h3>
                <p style={{ fontSize: theme.typography.sizes.base, lineHeight: '1.6', color: theme.colors.gray.dark }}>Wellness starts before illness begins. Our science-led formulations work to fortify your system, protecting and maintaining your body's natural intelligence.</p>
              </div>
              
              <div>
                <h3 style={{ fontFamily: theme.typography.fonts.display, fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: '#8DC3A7', marginBottom: theme.spacing[2] }}>2. Proactive</h3>
                <p style={{ fontSize: theme.typography.sizes.base, lineHeight: '1.6', color: theme.colors.gray.dark }}>We empower people to take charge of their health with real data, biofeedback, and science-based solutions that encourage informed, everyday wellness decisions.</p>
              </div>
              
              <div>
                <h3 style={{ fontFamily: theme.typography.fonts.display, fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: '#A8D5BA', marginBottom: theme.spacing[2] }}>3. Personalized</h3>
                <p style={{ fontSize: theme.typography.sizes.base, lineHeight: '1.6', color: theme.colors.gray.dark }}>Every body, skin, and cell is unique. We design intelligent, adaptive products tailored to your biology, lifestyle, and local needs — creating personalized wellness at scale.</p>
              </div>
              
              <div>
                <h3 style={{ fontFamily: theme.typography.fonts.display, fontSize: theme.typography.sizes.xl, fontWeight: theme.typography.weights.bold, color: '#5F9F7F', marginBottom: theme.spacing[2] }}>4. Predictive</h3>
                <p style={{ fontSize: theme.typography.sizes.base, lineHeight: '1.6', color: theme.colors.gray.dark }}>Using data, AI, and biological insights, we aim to anticipate needs before symptoms appear, building a predictive model of wellness that evolves with you.</p>
              </div>
            </div>
            
            <Paragraph style={{ marginTop: theme.spacing[6], fontStyle: 'italic', color: theme.colors.primary }}>
              Together, these four pillars form our foundation — a fusion of science, technology, and human intelligence shaping the next era of health and beauty.
            </Paragraph>
          </Section>

          {/* Core Beliefs Section */}
          <Section>
            <SectionTitle>Our Core Beliefs</SectionTitle>
            <Paragraph>
              At Only Thing Health & Wellness, we believe that true beauty and wellness begin with intelligence — not intuition alone. We are India's first science-backed, data-driven wellness company dedicated to creating intelligent solutions that bridge skincare, nutrition, and overall well-being.
            </Paragraph>
            
            <BeliefsList>
              {coreBeliefs.map((belief, index) => (
                <BeliefCard key={index}>
                  <BeliefIcon>{belief.icon}</BeliefIcon>
                  <BeliefTitle>{belief.title}</BeliefTitle>
                  <BeliefDescription>{belief.description}</BeliefDescription>
                </BeliefCard>
              ))}
            </BeliefsList>
            
            <Paragraph style={{ marginTop: theme.spacing[6] }}>
              Our philosophy is simple yet profound: every formulation, every ingredient, and every claim must be powered by science and validated by data. We combine cutting-edge bioscience, AI-assisted research, and clinically proven actives to design products that understand your body's evolving needs — and respond intelligently.
            </Paragraph>
          </Section>

          {/* Innovation Values Section */}
          <Section>
            <SectionTitle>Innovation & Excellence</SectionTitle>
            <Paragraph>
              Whether it's Intelligent Skincare that adapts to your skin's cellular rhythms or Smart Nutrition that supports your gut-brain-skin axis, our innovations are crafted for the future — where self-care meets bio-science.
            </Paragraph>
            
            <ValuesList>
              {innovationValues.map((value, index) => (
                <ValueCard key={index}>
                  <ValueIcon>{value.icon}</ValueIcon>
                  <ValueTitle>{value.title}</ValueTitle>
                  <ValueDescription>{value.description}</ValueDescription>
                </ValueCard>
              ))}
            </ValuesList>
            
            <StoryQuote style={{ marginTop: theme.spacing[6] }}>
              At Only Thing Health & Wellness, we don't chase trends. We decode biology, map data, and design transformation.
            </StoryQuote>
          </Section>

          {/* Mission Statement */}
          <Section>
            <SectionTitle>Our Mission</SectionTitle>
            <Paragraph>
              We don't just create products; we build intelligent ecosystems for wellness — adaptive, personalized, and future-ready. Our mission is to empower individuals to take control of their health through products that are scientifically proven, ethically sourced, and transparently communicated.
            </Paragraph>
            <Paragraph>
              We believe that everyone deserves access to supplements and skincare they can trust — products that are honest about what they contain and what they can do. Our commitment extends beyond our products to educating our community, advancing wellness research, and operating sustainably for both people and planet.
            </Paragraph>
          </Section>

          {/* By The Numbers */}
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

