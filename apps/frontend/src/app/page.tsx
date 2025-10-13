import { HeroVideo } from '@/components/hero/HeroVideo';
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

export default function HomePage() {
  return (
    <main>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      
      {/* Hero Section with Video */}
      <HeroVideo
        videoSrc="/videos/hero-loop.mp4"
        posterSrc="/images/hero-poster.jpg"
        title="The Future of Skincare is Intelligent"
      />
      
      {/* Main content starts here */}
      <section id="main-content">
        {/* Additional sections will be added here */}
      </section>
    </main>
  );
}
