'use client';

import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '@/lib/theme';
import { motion, useScroll, useTransform } from 'framer-motion';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(-10px); }
  75% { transform: translateY(-30px) translateX(5px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const dataFlow = keyframes`
  0% { transform: translateX(-100%) translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%) translateY(20px); opacity: 0; }
`;

// Styled Components
const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  max-height: 1080px;
  width: 100%;
  overflow: hidden;
  background: ${theme.colors.black};
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  opacity: 0.4;
  filter: grayscale(100%);
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  z-index: 1;
`;

// Data Particles Canvas
const ParticlesCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  opacity: 0.6;
`;

// Floating Data Points
const DataPoint = styled(motion.div)<{ $delay: number; $duration: number }>`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${theme.colors.white};
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: ${float} ${props => props.$duration}s infinite ease-in-out ${props => props.$delay}s;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${pulse} 2s infinite;
  }
`;

// Data Stream Lines
const DataStream = styled.div<{ $delay: number }>`
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${theme.colors.white} 50%,
    transparent
  );
  opacity: 0.3;
  animation: ${dataFlow} 4s infinite linear ${props => props.$delay}s;
`;

// Content Container
const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${theme.spacing[10]} ${theme.spacing[4]} ${theme.spacing[8]};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[12]} ${theme.spacing[3]} ${theme.spacing[6]};
  }
`;

// Glowing Badge
const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  margin-bottom: ${theme.spacing[4]};
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.gold};
    border-radius: 50%;
    box-shadow: 0 0 15px ${theme.colors.accent.gold};
    animation: ${pulse} 2s infinite;
  }
`;

const BadgeText = styled.span`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

// Main Headline
const Headline = styled(motion.h1)`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  line-height: 1.1;
  margin-bottom: ${theme.spacing[4]};
  letter-spacing: -0.02em;
  text-transform: uppercase;
  
  background: linear-gradient(
    135deg,
    ${theme.colors.white} 0%,
    #e0e0e0 50%,
    ${theme.colors.white} 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
`;

const Subheadline = styled(motion.p)`
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: ${theme.colors.gray.medium};
  max-width: 800px;
  margin: 0 auto ${theme.spacing[8]};
  line-height: 1.6;
  font-weight: ${theme.typography.weights.regular};
`;

// CTA Buttons
const CTAContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[4]};
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(motion.button)`
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  border: none;
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.duration.base};
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const SecondaryButton = styled(motion.button)`
  padding: ${theme.spacing[4]} ${theme.spacing[8]};
  background: transparent;
  color: ${theme.colors.white};
  border: 2px solid ${theme.colors.white};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.duration.base};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${theme.colors.white};
    transition: left ${theme.transitions.duration.base};
    z-index: -1;
  }
  
  &:hover {
    color: ${theme.colors.black};
    
    &::before {
      left: 0;
    }
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

// Stats Display
const StatsContainer = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing[8]};
  margin-top: ${theme.spacing[8]};
  
  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing[4]};
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing[3]};
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: ${theme.typography.fonts.display};
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.gray.medium};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

// Scroll Indicator
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: ${theme.spacing[6]};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[2]};
  color: ${theme.colors.white};
  opacity: 0.6;
  z-index: 10;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

const MouseIcon = styled.div`
  width: 24px;
  height: 36px;
  border: 2px solid ${theme.colors.white};
  border-radius: 12px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 8px;
    background: ${theme.colors.white};
    border-radius: 2px;
    animation: scroll 2s infinite;
  }
  
  @keyframes scroll {
    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(12px); }
  }
`;

const ScrollText = styled.span`
  font-size: ${theme.typography.sizes.xs};
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

interface EnhancedHeroSectionProps {
  videoSrc?: string;
  posterSrc?: string;
}

export const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  videoSrc = '/videos/hero.mp4',
  posterSrc = '/images/hero-poster.jpg',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState([
    { number: '95', label: 'Clinical Efficacy', suffix: '%' },
    { number: '10K', label: 'Happy Customers', suffix: '+' },
    { number: '20', label: 'Years Research', suffix: '+' },
  ]);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.globalAlpha = 1 - distance / 150;
            ctx.stroke();
          }
        }
      }
      
      // Update and draw particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.globalAlpha = 1;
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <HeroContainer>
      <VideoBackground
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
      >
        <source src={videoSrc} type="video/mp4" />
      </VideoBackground>
      
      <VideoOverlay />
      <ParticlesCanvas ref={canvasRef} />
      
      {/* Floating Data Points */}
      {[...Array(15)].map((_, i) => (
        <DataPoint
          key={i}
          $delay={i * 0.5}
          $duration={5 + Math.random() * 3}
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 90 + 5}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
      
      {/* Data Streams */}
      {[...Array(8)].map((_, i) => (
        <DataStream
          key={`stream-${i}`}
          $delay={i * 0.5}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      
      <ContentContainer>
        <Badge
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BadgeText>#Intelligent Skincare • #Powered by Science</BadgeText>
        </Badge>
        
        <Headline
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The Future of<br />Skincare is Intelligent
        </Headline>
        
        <Subheadline
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Science-backed, data-driven intelligent solutions crafted for the future.
          Backed by clinical research and powered by innovation.
        </Subheadline>
        
        <CTAContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <PrimaryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Shop Now
          </PrimaryButton>
          <SecondaryButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Take the Assessment
          </SecondaryButton>
        </CTAContainer>
        
        <StatsContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
            >
              <StatNumber>
                {stat.number}
                {stat.suffix}
              </StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsContainer>
      </ContentContainer>
      
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 2 }}
        whileHover={{ opacity: 1 }}
      >
        <MouseIcon />
        <ScrollText>Scroll</ScrollText>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default EnhancedHeroSection;
