import React from 'react';
import PageTransition from '@/components/PageTransition';
import HomeHero from '@/components/hero/HomeHero';
import Work from '@/views/Work';
import Services from '@/views/Services';
import AboutPreview from '@/components/AboutPreview';

export default function HomePage() {
  return (
    <PageTransition>
      <div className="single-page-content">
        <HomeHero className="home" />
        <Work className="home" />
        <Services className="home" />
        <AboutPreview className="home" />
      </div>
    </PageTransition>
  );
}
