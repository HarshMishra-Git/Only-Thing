'use client';

import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

const SectionContainer = styled.section`
  padding: ${theme.spacing[16]} ${theme.spacing[4]};
  background: ${theme.colors.black};
  color: ${theme.colors.white};

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
  color: ${theme.colors.gray.light};
  display: block;
  margin-bottom: ${theme.spacing[3]};
`;

const Heading = styled.h2`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(${theme.typography.sizes['3xl']}, 5vw, ${theme.typography.sizes['5xl']});
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  text-transform: uppercase;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.gray.light};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing[8]};

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[12]};
  }
`;

const ComparisonCard = styled(motion.div)`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray.light};
  overflow: hidden;
`;

const ImageComparison = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  cursor: col-resize;
  user-select: none;
`;

const ComparisonImage = styled.div<{ src: string; position?: 'before' | 'after' }>`
  position: ${props => props.position === 'after' ? 'relative' : 'absolute'};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const BeforeImage = styled(ComparisonImage)`
  clip-path: ${props => `inset(0 ${100 - (props as any).clipPosition}% 0 0)`};
  z-index: 2;
`;

const Slider = styled.div<{ position: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.position}%;
  width: 4px;
  height: 100%;
  background: ${theme.colors.white};
  z-index: 3;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: ${theme.colors.white};
    border-radius: 50%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: '⟷';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${theme.colors.black};
    font-size: ${theme.typography.sizes.lg};
    font-weight: ${theme.typography.weights.bold};
    z-index: 1;
  }
`;

const Label = styled.div<{ type: 'before' | 'after' }>`
  position: absolute;
  ${props => props.type === 'before' ? 'left: 16px' : 'right: 16px'};
  top: 16px;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background: rgba(0, 0, 0, 0.8);
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: ${theme.typography.weights.bold};
  z-index: 4;
`;

const CardContent = styled.div`
  padding: ${theme.spacing[6]};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
`;

const CardTitle = styled.h3`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  margin-bottom: ${theme.spacing[3]};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const CardDescription = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.gray.dark};
  line-height: 1.6;
  margin-bottom: ${theme.spacing[4]};
`;

const Stats = styled.div`
  display: flex;
  gap: ${theme.spacing[6]};
  flex-wrap: wrap;
`;

const Stat = styled.div``;

const StatValue = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.black};
  line-height: 1;
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.gray.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

interface ComparisonData {
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  timeline: string;
  improvement: string;
}

const comparisons: ComparisonData[] = [
  {
    title: 'Fine Lines & Wrinkles',
    description: 'Cellular Renewal Serum dramatically reduced fine lines around eyes and forehead',
    beforeImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=800&q=80',
    timeline: '8 Weeks',
    improvement: '+87%'
  },
  {
    title: 'Skin Hydration & Texture',
    description: 'Hydration Matrix Cream restored moisture barrier and improved skin smoothness',
    beforeImage: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    timeline: '4 Weeks',
    improvement: '+92%'
  }
];

function BeforeAfterComparison({ data }: { data: ComparisonData }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <ComparisonCard>
      <ImageComparison
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        <Label type="after">After</Label>
        <Label type="before">Before</Label>
        
        <ComparisonImage src={data.afterImage} position="after" />
        <BeforeImage src={data.beforeImage} clipPosition={sliderPosition} />
        <Slider position={sliderPosition} />
      </ImageComparison>

      <CardContent>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
        <Stats>
          <Stat>
            <StatValue>{data.timeline}</StatValue>
            <StatLabel>Timeline</StatLabel>
          </Stat>
          <Stat>
            <StatValue>{data.improvement}</StatValue>
            <StatLabel>Improvement</StatLabel>
          </Stat>
        </Stats>
      </CardContent>
    </ComparisonCard>
  );
}

export function ResultsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <SectionContainer ref={ref}>
      <ContentWrapper>
        <SectionHeader>
          <Eyebrow>Real Results From Real People</Eyebrow>
          <Heading>
            Proven<br />Transformations
          </Heading>
          <Description>
            See the measurable improvements our clients experience.
            All results documented in clinical settings with standardized photography.
          </Description>
        </SectionHeader>

        <ComparisonGrid>
          {comparisons.map((comparison, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <BeforeAfterComparison data={comparison} />
            </motion.div>
          ))}
        </ComparisonGrid>
      </ContentWrapper>
    </SectionContainer>
  );
}
