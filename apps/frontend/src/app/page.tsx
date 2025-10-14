import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AdvancedHomePage } from '@/components/home/AdvancedHomePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Only Thing Health & Wellness | Intelligent Skincare',
  description: 'Premium clinical-grade skincare backed by science. Personalized recommendations based on your unique skin needs.',
  openGraph: {
    title: 'Only Thing Health & Wellness | Intelligent Skincare',
    description: 'Premium clinical-grade skincare backed by science.',
    type: 'website',
    url: 'https://onlything.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Only Thing Health & Wellness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Only Thing Health & Wellness | Intelligent Skincare',
    description: 'Premium clinical-grade skincare backed by science.',
    images: ['/images/og-image.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <AdvancedHomePage />
      <Footer />
    </>
  );
}
