'use client';

import { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '@only-thing/design-tokens';

const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: ${theme.radii.md};
  user-select: none;
  cursor: ew-resize;
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const AfterImage = styled(Image)<{ clipWidth: number }>`
  clip-path: inset(0 ${props => 100 - props.clipWidth}% 0 0);
`;

const Slider = styled(motion.div)<{ position: number }>`
  position: absolute;
  top: 0;
  left: ${props => props.position}%;
  width: 4px;
  height: 100%;
  background: ${theme.colors.white};
  cursor: ew-resize;
  transform: translateX(-50%);
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    background: ${theme.colors.white};
    border-radius: ${theme.radii.full};
    box-shadow: ${theme.shadows.lg};
  }
  
  &::after {
    content: '⟷';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${theme.typography.sizes.xl};
    color: ${theme.colors.black};
    font-weight: ${theme.typography.weights.bold};
    z-index: 1;
  }
`;

const Label = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  top: ${theme.spacing[3]};
  ${props => props.position}: ${theme.spacing[3]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  background: rgba(0, 0, 0, 0.7);
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: ${theme.radii.sm};
  z-index: 5;
`;

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = 'Before',
  afterLabel = 'After'
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <Container
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <ImageContainer>
        <Image src={beforeImage} alt={beforeLabel} />
      </ImageContainer>
      
      <ImageContainer>
        <AfterImage src={afterImage} alt={afterLabel} clipWidth={sliderPosition} />
      </ImageContainer>

      <Label position="left">{beforeLabel}</Label>
      <Label position="right">{afterLabel}</Label>

      <Slider
        position={sliderPosition}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(e, info) => {
          const container = (e.target as HTMLElement).parentElement;
          if (!container) return;
          const rect = container.getBoundingClientRect();
          const percentage = ((info.point.x - rect.left) / rect.width) * 100;
          setSliderPosition(Math.max(0, Math.min(100, percentage)));
        }}
      />
    </Container>
  );
}
