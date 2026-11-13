import React, { Suspense } from 'react';
import PageTransition from '@/components/PageTransition';
import ServicesSkillsView from '@/components/services/ServicesSkillsView';
import { getPublishedServices } from '@/lib/db/repositories/servicesRepo';
import { getPublishedSkills, getPublishedCategories } from '@/lib/db/repositories/skillsRepo';

export const metadata = {
  title: 'Technical Skills & Tech Stack — MERN Stack & Full Stack Developer | Mayur Arora',
  description:
    'Comprehensive software engineering skills of Mayur Arora, a full stack developer, react developer, next.js developer, and MERN stack developer in Mullanpur Dakha, Ludhiana, Punjab: MongoDB, Express, React, Node.js, Next.js, and TypeScript.',
  alternates: {
    canonical: '/skills',
  },
  openGraph: {
    title: 'MERN Stack & Full Stack Developer Skills — Mayur Arora | Ludhiana, Punjab',
    description:
      'Explore full stack proficiencies, MERN stack architecture, React, and Next.js competencies by Mayur Arora in Mullanpur Dakha, Ludhiana, Punjab, India.',
    url: '/skills',
    images: [{ url: '/assets/hero.png', width: 1200, height: 630, alt: 'Mayur Arora Developer Skills' }],
  },
};

export default async function SkillsPage({ searchParams }) {
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
