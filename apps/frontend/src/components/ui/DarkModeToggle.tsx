'use client';

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@only-thing/design-tokens';

const ToggleButton = styled(motion.button)`
  position: fixed;
  bottom: ${theme.spacing[4]};
  left: ${theme.spacing[4]};
  width: 56px;
  height: 56px;
  border-radius: ${theme.radii.full};
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  box-shadow: ${theme.shadows.xl};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.md}) {
    width: 48px;
    height: 48px;
    bottom: ${theme.spacing[3]};
    left: ${theme.spacing[3]};
  }
`;

const IconContainer = styled(motion.div)`
  width: 24px;
  height: 24px;
`;

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDark(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  return (
    <ToggleButton
      onClick={() => setIsDark(!isDark)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <IconContainer
            key="sun"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </IconContainer>
        ) : (
          <IconContainer
            key="moon"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </IconContainer>
        )}
      </AnimatePresence>
    </ToggleButton>
  );
}
