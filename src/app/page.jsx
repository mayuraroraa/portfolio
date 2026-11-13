import React from 'react';
import PageTransition from '@/components/PageTransition';
import HomeHero from '@/components/hero/HomeHero';
import Work from '@/views/Work';
import Services from '@/views/Services';
import AboutPreview from '@/components/AboutPreview';
import { getPublishedProjects } from '@/lib/db/repositories/projectsRepo';
import { getPublishedServices } from '@/lib/db/repositories/servicesRepo';
import { getSiteSettings } from '@/lib/db/repositories/settingsRepo';

export const metadata = {
  title: 'Mayur Arora — Full Stack Developer & MERN Developer | Mullanpur Dakha, Ludhiana',
  description:
    'Full stack developer, software developer, react developer, next.js developer, and mern stack developer in Mullanpur Dakha, specifically Ludhiana, Punjab, India. Building modern web applications, scalable backends, and digital products.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mayur Arora — Full Stack & MERN Developer in Mullanpur Dakha, Ludhiana',
    description:
      'Official portfolio of Mayur Arora, a full stack developer, software developer, and MERN stack engineer in Mullanpur Dakha, Ludhiana, Punjab, India. Explore production Next.js & React projects.',
    url: '/',
    images: [{ url: '/assets/hero.png', width: 1200, height: 630, alt: 'Mayur Arora Full Stack & MERN Developer Ludhiana' }],
  },
};

export default async function HomePage() {
  const [projects, services, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
    getSiteSettings()
  ]);

  return (
    <PageTransition>
      <div className="single-page-content">
        <HomeHero className="home" settings={settings} />
        <Work className="home" items={projects} />
        <Services className="home" items={services} />
        <AboutPreview className="home" settings={settings} />
      </div>
    </PageTransition>
  );
}
