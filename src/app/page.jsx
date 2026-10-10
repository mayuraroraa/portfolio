import React from 'react';
import PageTransition from '@/components/PageTransition';
import HomeHero from '@/components/hero/HomeHero';
import Work from '@/views/Work';
import Services from '@/views/Services';
import AboutPreview from '@/components/AboutPreview';
import { getPublishedProjects } from '@/lib/db/repositories/projectsRepo';
import { getPublishedServices } from '@/lib/db/repositories/servicesRepo';
import { getSiteSettings } from '@/lib/db/repositories/settingsRepo';

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
