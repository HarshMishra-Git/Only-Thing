/**
 * Only Thing Health & Wellness Design System
 * Premium Monochrome Clinical-Luxury UI Tokens
 */

// Color Palette - Strict Monochrome
export const colors = {
  // Primary Black
  black: '#000000',
  
  // White
  white: '#FFFFFF',
  
  // Neutral Gray
  gray: {
    light: '#F5F5F5',    // Backgrounds
    medium: '#9A9A9A',   // Secondary text, borders
    dark: '#4A4A4A',     // Subtle accents
  },
  
  // Gold Accent (use sparingly for micro-feedback only)
  accent: {
    gold: '#BFA66A',
  },
  
  // Semantic Colors (monochrome variants)
  semantic: {
    success: '#2D2D2D',
    error: '#1A1A1A',
    warning: '#4A4A4A',
    info: '#666666',
  },
  
  // Opacity variations (for overlays)
  overlay: {
    light: 'rgba(255, 255, 255, 0.95)',
    dark: 'rgba(0, 0, 0, 0.85)',
  },
} as const;

// Typography
export const typography = {
  // Font Families
  fonts: {
    display: '"Arial Black", "Helvetica Neue Bold", sans-serif', // Heavy black geometric
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  // Font Sizes (modular scale based on 16px base)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  // Font Weights
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Spacing Scale (12px base)
export const spacing = {
  0: '0',
  1: '0.75rem',    // 12px
  2: '1.5rem',     // 24px
  3: '2.25rem',    // 36px
  4: '3rem',       // 48px
  5: '3.75rem',    // 60px
  6: '4.5rem',     // 72px
  8: '6rem',       // 96px
  10: '7.5rem',    // 120px
  12: '9rem',      // 144px
  16: '12rem',     // 192px
} as const;

// Breakpoints (mobile-first)
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Shadows (subtle, minimal)
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
} as const;

// Border Radius (minimal, clean edges)
export const radii = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  full: '9999px',
} as const;

// Transitions
export const transitions = {
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
} as const;

// Z-Index Scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
} as const;

// Micro-interactions (scale on hover/press)
export const interactions = {
  scale: {
    press: 0.98,
    hover: 1.02,
  },
  shadow: {
    press: '0 1px 2px rgba(0, 0, 0, 0.1)',
    hover: '0 2px 4px rgba(0, 0, 0, 0.15)',
  },
} as const;

// Export complete theme object
export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  radii,
  transitions,
  zIndex,
  interactions,
} as const;

// Type exports
export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
