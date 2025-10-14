'use client';

import { Global, css } from '@emotion/react';
import { theme } from '@/lib/theme';

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        /* CSS Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          font-size: 16px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          font-family: ${theme.typography.fonts.body};
          font-size: ${theme.typography.sizes.base};
          line-height: ${theme.typography.lineHeights.normal};
          color: ${theme.colors.black};
          background-color: ${theme.colors.white};
          overflow-x: hidden;
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
          font-family: ${theme.typography.fonts.display};
          font-weight: ${theme.typography.weights.black};
          line-height: ${theme.typography.lineHeights.tight};
          color: ${theme.colors.black};
        }

        h1 {
          font-size: ${theme.typography.sizes['6xl']};
          letter-spacing: ${theme.typography.letterSpacing.tight};
        }

        h2 {
          font-size: ${theme.typography.sizes['5xl']};
        }

        h3 {
          font-size: ${theme.typography.sizes['3xl']};
        }

        p {
          margin-bottom: ${theme.spacing[2]};
          color: ${theme.colors.black};
        }

        a {
          color: inherit;
          text-decoration: none;
          transition: opacity ${theme.transitions.duration.fast} ${theme.transitions.easing.out};
        }

        a:hover {
          opacity: 0.8;
        }

        button {
          font-family: inherit;
          cursor: pointer;
          border: none;
          background: none;
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid ${theme.colors.black};
          outline-offset: 2px;
        }

        /* Skip to content link for accessibility */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: ${theme.colors.black};
          color: ${theme.colors.white};
          padding: ${theme.spacing[1]};
          z-index: ${theme.zIndex.toast};
          text-decoration: none;
        }

        .skip-link:focus {
          top: 0;
        }

        /* Grayscale filter for images */
        .grayscale-image {
          filter: grayscale(100%);
        }

        /* Selection */
        ::selection {
          background-color: ${theme.colors.black};
          color: ${theme.colors.white};
        }

        /* Scrollbar (minimal monochrome) */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${theme.colors.gray.light};
        }

        ::-webkit-scrollbar-thumb {
          background: ${theme.colors.gray.medium};
          border-radius: ${theme.radii.sm};
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.black};
        }

        /* Responsive typography */
        @media (max-width: ${theme.breakpoints.md}) {
          html {
            font-size: 14px;
          }

          h1 {
            font-size: ${theme.typography.sizes['4xl']};
          }

          h2 {
            font-size: ${theme.typography.sizes['3xl']};
          }
        }
      `}
    />
  );
}

