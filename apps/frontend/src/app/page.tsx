import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { VideoHeroSection } from '@/components/hero/VideoHeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { ScienceSection } from '@/components/sections/ScienceSection';
import { VideoContentSection } from '@/components/sections/VideoContentSection';
import { ProductShowcaseSection } from '@/components/sections/ProductShowcaseSection';
import { ResultsSection } from '@/components/sections/ResultsSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { CTASection } from '@/components/sections/CTASection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Only Thing Health & Wellness | Intelligent Skincare',
  description: 'Only Thing Health & Wellness is a personalized skincare platform offering premium clinical-grade products backed by science. Sign in with Google to receive personalized product recommendations, take skin assessments, and shop our science-backed formulations.',
  openGraph: {
    title: 'Only Thing Health & Wellness | Intelligent Skincare',
    description: 'Only Thing Health & Wellness is a personalized skincare platform. Sign in with Google to receive personalized product recommendations and shop science-backed formulations.',
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
      <VideoHeroSection />
      <FeaturesSection />
      <ScienceSection />
      <VideoContentSection />
      <ProductShowcaseSection />
      <ResultsSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </>
  );
}

