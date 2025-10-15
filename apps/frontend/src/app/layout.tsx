import type { Metadata } from 'next';
import { ThemeProvider } from '@/styles/ThemeProvider';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { BackToTop } from '@/components/ui/BackToTop';

export const metadata: Metadata = {
  metadataBase: new URL('https://onlything.com'),
  title: {
    default: 'Only Thing Health & Wellness',
    template: '%s | Only Thing Health & Wellness',
  },
  description: 'Only Thing Health & Wellness is a personalized skincare e-commerce platform. Users can sign in with Google to receive personalized product recommendations, take skin assessments, purchase clinical-grade skincare products, and track their skincare journey.',
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
        <link rel="icon" href="/images/logo/ot-logo-white.png" type="image/png" />
        <link rel="shortcut icon" href="/images/logo/ot-logo-white.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo/ot-logo-white.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <ThemeProvider>
          <GlobalStyles />
          <ToastProvider />
          <AuthProvider>
            {children}
            <BackToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

