/**
 * Only Thing Health & Wellness Design System
 * Matches @only-thing/design-tokens package
 */

export const theme = {
  colors: {
    primary: '#2D5F3F',
    secondary: '#8B4513',
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      light: '#F5F5F5',
      medium: '#9A9A9A',
      dark: '#4A4A4A',
    },
    accent: {
      gold: '#BFA66A',
    },
    semantic: {
      success: '#2D2D2D',
      error: '#1A1A1A',
      warning: '#4A4A4A',
      info: '#666666',
    },
    overlay: {
      light: 'rgba(255, 255, 255, 0.95)',
      dark: 'rgba(0, 0, 0, 0.85)',
    },
  },
  spacing: {
    0: '0',
    1: '0.75rem',
    2: '1.5rem',
    3: '2.25rem',
    4: '3rem',
    5: '3.75rem',
    6: '4.5rem',
    8: '6rem',
    10: '7.5rem',
    12: '9rem',
    16: '12rem',
  },
  typography: {
    fonts: {
      display: '"Arial Black", "Helvetica Neue Bold", sans-serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  transitions: {
    duration: {
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    toast: 1500,
  },
  interactions: {
    scale: {
      press: 0.98,
      hover: 1.02,
    },
    shadow: {
      press: '0 1px 2px rgba(0, 0, 0, 0.1)',
      hover: '0 2px 4px rgba(0, 0, 0, 0.15)',
    },
  },
} as const;

export default theme;
