import React, { Suspense } from 'react';
import PageTransition from '@/components/PageTransition';
import ServicesSkillsView from '@/components/services/ServicesSkillsView';
import { getPublishedServices } from '@/lib/db/repositories/servicesRepo';
import { getPublishedSkills, getPublishedCategories } from '@/lib/db/repositories/skillsRepo';

export const metadata = {
  title: 'Hire Full Stack & MERN Developer — Services by Mayur Arora | Ludhiana',
  description:
    'Hire Mayur Arora, a full stack developer, software developer, react developer, and MERN stack engineer in Mullanpur Dakha, Ludhiana, Punjab, India. Custom web apps, Next.js solutions, and API engineering.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Hire Full Stack & MERN Developer — Mayur Arora | Mullanpur Dakha, Ludhiana',
    description:
      'Professional web development, React / Next.js engineering, and full stack MERN software services in Ludhiana, Punjab, India by Mayur Arora.',
    url: '/services',
    images: [{ url: '/assets/hero.png', width: 1200, height: 630, alt: 'Hire Mayur Arora Full Stack Developer' }],
  },
};

export default async function ServicesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialService = resolvedSearchParams?.service || 'all';

  const [services, skills, categories] = await Promise.all([
    getPublishedServices(),
    getPublishedSkills(),
    getPublishedCategories()
  ]);

  const publishedSkills = skills;
  const publishedCategories = categories;

  return (
    <PageTransition>
      <Suspense fallback={
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading services & technical architecture...
        </div>
      }>
        <ServicesSkillsView 
          initialServices={services} 
          initialSkills={publishedSkills} 
          initialCategories={publishedCategories} 
          initialSelectedService={initialService}
        />
      </Suspense>
    </PageTransition>
  );
}
