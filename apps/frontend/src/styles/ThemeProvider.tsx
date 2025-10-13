'use client';

import { ReactNode } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { theme } from '@only-thing/design-tokens';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <EmotionThemeProvider theme={theme}>
      {children}
    </EmotionThemeProvider>
  );
}
