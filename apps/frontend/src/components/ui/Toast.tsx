'use client';

import { Toaster } from 'react-hot-toast';
import { theme } from '@/lib/theme';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: theme.colors.white,
          color: theme.colors.black,
          border: `1px solid ${theme.colors.gray.light}`,
          padding: theme.spacing[3],
          fontFamily: theme.typography.fonts.body,
          fontSize: theme.typography.sizes.base,
          boxShadow: theme.shadows.lg,
        },
        success: {
          iconTheme: {
            primary: theme.colors.black,
            secondary: theme.colors.white,
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: theme.colors.white,
          },
        },
      }}
    />
  );
}

