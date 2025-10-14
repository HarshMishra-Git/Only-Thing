'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';

const BackToTopButton = styled(motion.button)`
  position: fixed;
  bottom: ${theme.spacing[4]};
  right: ${theme.spacing[4]};
  width: 56px;
  height: 56px;
  border-radius: ${theme.radii.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.xl};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 48px;
    height: 48px;
    bottom: ${theme.spacing[3]};
    right: ${theme.spacing[3]};
  }
`;

const ProgressRing = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
`;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <BackToTopButton
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to top"
        >
          <ProgressRing width="56" height="56">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke={theme.colors.gray.dark}
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke={theme.colors.white}
              strokeWidth="3"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </ProgressRing>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </BackToTopButton>
      )}
    </AnimatePresence>
  );
}

