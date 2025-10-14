'use client';

import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/lib/theme';
import Link from 'next/link';

interface HeroVideoProps {
  videoSrc: string;
  mobileVideoSrc?: string;
  posterSrc: string;
  title?: string;
  subtitle?: string;
}

const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  background-color: ${theme.colors.black};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.md}) {
    min-height: 500px;
  }
`;

const VideoElement = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: ${theme.zIndex.base};
  filter: grayscale(100%);
`;

const DesktopVideo = styled(VideoElement)`
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileVideo = styled(VideoElement)`
  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const PosterImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: ${theme.zIndex.base};
  filter: grayscale(100%);
  
  @media (min-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: ${theme.zIndex.dropdown};
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: ${theme.zIndex.sticky};
  text-align: center;
  padding: ${theme.spacing[4]};
  max-width: 900px;
  margin: 0 auto;
  margin-top: 20vh;
  
  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: 15vh;
  }
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.display};
  font-size: ${theme.typography.sizes['7xl']};
  font-weight: ${theme.typography.weights.black};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[3]};
  letter-spacing: ${theme.typography.letterSpacing.tight};
  line-height: ${theme.typography.lineHeights.tight};
  text-transform: uppercase;
  
  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.typography.sizes['5xl']};
  }
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes['4xl']};
  }
`;

const Subtitle = styled.p`
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.white};
  margin-bottom: ${theme.spacing[4]};
  opacity: 0.9;
  
  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const CTAContainer = styled.div`
  display: flex;
  gap: ${theme.spacing[2]};
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: ${theme.colors.white};
  color: ${theme.colors.black};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  border: 2px solid ${theme.colors.white};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
  
  &:hover {
    background-color: ${theme.colors.black};
    color: ${theme.colors.white};
    transform: scale(${theme.interactions.scale.hover});
    box-shadow: ${theme.interactions.shadow.hover};
  }
  
  &:active {
    transform: scale(${theme.interactions.scale.press});
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  background-color: transparent;
  color: ${theme.colors.white};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: ${theme.typography.letterSpacing.wide};
  border: 2px solid ${theme.colors.white};
  transition: all ${theme.transitions.duration.base} ${theme.transitions.easing.out};
  
  &:hover {
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
    transform: scale(${theme.interactions.scale.hover});
  }
  
  &:active {
    transform: scale(${theme.interactions.scale.press});
  }
`;

export function HeroVideo({ 
  videoSrc, 
  mobileVideoSrc,
  posterSrc, 
  title = 'The Future of Skincare is Intelligent',
  subtitle
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const mobileVideo = mobileVideoRef.current;

    const handleCanPlay = (videoElement: HTMLVideoElement) => {
      setIsVideoLoaded(true);
      videoElement.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    };

    if (video) {
      const desktopHandler = () => handleCanPlay(video);
      video.addEventListener('canplay', desktopHandler);
    }

    if (mobileVideo && mobileVideoSrc) {
      const mobileHandler = () => handleCanPlay(mobileVideo);
      mobileVideo.addEventListener('canplay', mobileHandler);
    }
    
    return () => {
      if (video) {
        video.removeEventListener('canplay', () => handleCanPlay(video));
      }
      if (mobileVideo) {
        mobileVideo.removeEventListener('canplay', () => handleCanPlay(mobileVideo));
      }
    };
  }, [mobileVideoSrc]);

  return (
    <HeroContainer>
      {/* Video for desktop */}
      <DesktopVideo
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Hero background video"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </DesktopVideo>
      
      {/* Video for mobile */}
      {mobileVideoSrc ? (
        <MobileVideo
          ref={mobileVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Hero background video mobile"
        >
          <source src={mobileVideoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </MobileVideo>
      ) : (
        /* Poster image fallback if no mobile video provided */
        <PosterImage 
          src={posterSrc} 
          alt="Hero background" 
          loading="eager"
        />
      )}
      
      {/* Dark overlay for better text contrast */}
      <Overlay />
      
      {/* HTML text overlay (always accessible, never baked into video) */}
      <ContentContainer>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        
        <CTAContainer>
          <PrimaryButton href="/products" aria-label="Shop our products">
            Shop Now
          </PrimaryButton>
          <SecondaryButton href="/quiz" aria-label="Take the skincare assessment">
            Take the Assessment
          </SecondaryButton>
        </CTAContainer>
      </ContentContainer>
    </HeroContainer>
  );
}

