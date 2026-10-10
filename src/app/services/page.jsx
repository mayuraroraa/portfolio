import React, { Suspense } from 'react';
import PageTransition from '@/components/PageTransition';
import ServicesSkillsView from '@/components/services/ServicesSkillsView';
import { getPublishedServices } from '@/lib/db/repositories/servicesRepo';
import { getPublishedSkills, getPublishedCategories } from '@/lib/db/repositories/skillsRepo';

export const metadata = {
  title: 'Services & Skills | Mayur Arora',
  description: 'In-depth overview of services offered by Mayur Arora (Full-Stack Development and Video Editing) along with the complete technical skills, tools, and proficiencies powering each service.',
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
