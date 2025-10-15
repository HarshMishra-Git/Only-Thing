'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

const SectionContainer = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  background: ${theme.colors.gray.light};
  position: relative;

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
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[12]};
  align-items: center;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[8]};
  }
`;

const TextContent = styled.div``;

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
  margin-bottom: ${theme.spacing[6]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.dark};
  line-height: 1.7;
  margin-bottom: ${theme.spacing[6]};
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const StatItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.white};
  border-left: 4px solid ${theme.colors.black};
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  line-height: 1;
  min-width: 120px;
`;

const StatLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  font-weight: ${theme.typography.weights.medium};
`;

const VisualizationArea = styled.div`
  position: relative;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.light};
  padding: ${theme.spacing[8]};
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing[6]};
    min-height: 400px;
  }
`;

const ChartTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.black};
  margin-bottom: ${theme.spacing[6]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BarsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  flex: 1;
`;

const BarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
`;

const BarLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.gray.dark};
  min-width: 120px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 80px;
    font-size: ${theme.typography.sizes.xs};
  }
`;

const BarTrack = styled.div`
  flex: 1;
  height: 40px;
  background: ${theme.colors.gray.light};
  position: relative;
  overflow: hidden;
`;

const BarFill = styled(motion.div)<{ color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: ${theme.spacing[3]};
`;

const BarValue = styled.span`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.white};
`;

const ChartLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[6]};
  padding-top: ${theme.spacing[6]};
  border-top: 1px solid ${theme.colors.gray.light};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.dark};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const LegendDot = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background: ${props => props.color};
  border-radius: 2px;
`;

const stats = [
  { number: '95%', label: 'Customer Satisfaction Rate' },
  { number: '10,000+', label: 'Clinical Study Participants' },
  { number: '28 Days', label: 'Average Visible Improvement' }
];

const chartData = [
  { label: 'Hydration', value: 92, color: '#1a1a1a' },
  { label: 'Firmness', value: 87, color: '#2d2d2d' },
  { label: 'Radiance', value: 94, color: '#404040' },
  { label: 'Smoothness', value: 89, color: '#595959' }
];

export function ScienceSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <SectionContainer ref={ref}>
      <ContentWrapper>
        <Grid>
          <TextContent>
            <Eyebrow>The Science Behind Results</Eyebrow>
            <Heading>
              Clinically Proven<br />Performance
            </Heading>
            <Description>
              Our formulations undergo rigorous double-blind clinical trials with
              measurable endpoints. Every claim is backed by peer-reviewed research
              and real-world data from thousands of users.
            </Description>

            <StatsList>
              {stats.map((stat, index) => (
                <StatItem
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                >
                  <StatNumber>{stat.number}</StatNumber>
                  <StatLabel>{stat.label}</StatLabel>
                </StatItem>
              ))}
            </StatsList>
          </TextContent>

          <VisualizationArea>
            <ChartTitle>Key Performance Indicators</ChartTitle>
            
            <BarsContainer>
              {chartData.map((item, index) => (
                <BarWrapper key={index}>
                  <BarLabel>{item.label}</BarLabel>
                  <BarTrack>
                    <BarFill
                      color={item.color}
                      initial={{ width: '0%' }}
                      animate={inView ? { width: `${item.value}%` } : {}}
                      transition={{ delay: index * 0.15 + 0.5, duration: 1, ease: 'easeOut' }}
                    >
                      <BarValue>{item.value}%</BarValue>
                    </BarFill>
                  </BarTrack>
                </BarWrapper>
              ))}
            </BarsContainer>

            <ChartLegend>
              <LegendItem>
                <LegendDot color={theme.colors.black} />
                Clinical Trial Results
              </LegendItem>
              <LegendItem>
                <LegendDot color={theme.colors.gray.medium} />
                8-Week Study Period
              </LegendItem>
            </ChartLegend>
          </VisualizationArea>
        </Grid>
      </ContentWrapper>
    </SectionContainer>
  );
}
