import type { Metadata } from 'next';
import { ThemeProvider } from '@/styles/ThemeProvider';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { BackToTop } from '@/components/ui/BackToTop';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';

export const metadata: Metadata = {
  metadataBase: new URL('https://onlything.com'),
  title: {
    default: 'Only Thing Health & Wellness',
    template: '%s | Only Thing Health & Wellness',
  },
  description: 'Premium clinical-grade skincare backed by science and personalized for your unique skin needs.',
  keywords: ['skincare', 'clinical skincare', 'intelligent skincare', 'personalized skincare', 'health', 'wellness'],
  authors: [{ name: 'Only Thing Health & Wellness LLP' }],
  creator: 'Only Thing Health & Wellness LLP',
  publisher: 'Only Thing Health & Wellness LLP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider>
          <GlobalStyles />
          <ToastProvider />
          <AuthProvider>
            {children}
            <BackToTop />
            <DarkModeToggle />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

