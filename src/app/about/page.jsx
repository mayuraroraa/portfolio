import React from 'react';
import PageTransition from '@/components/PageTransition';
import About from '@/views/About';
import { getSiteSettings } from '@/lib/db/repositories/settingsRepo';
import { getPublishedSkills, getPublishedCategories } from '@/lib/db/repositories/skillsRepo';

export const metadata = {
  title: 'About Mayur Arora — Full Stack & MERN Developer in Ludhiana, Punjab',
  description:
    'Learn about Mayur Arora, a full stack developer, software developer, and MERN stack engineer based in Mullanpur Dakha, Ludhiana, Punjab, India. Building modern React and Next.js digital products.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Mayur Arora — Full Stack Developer in Mullanpur Dakha, Ludhiana',
    description:
      'The technical journey and software engineering background of Mayur Arora — full stack developer & MERN specialist in Ludhiana, Punjab, India.',
    url: '/about',
    images: [{ url: '/assets/hero.png', width: 1200, height: 630, alt: 'About Mayur Arora Full Stack Developer' }],
  },
};

export default async function AboutPage() {
  const [settings, skills, categories] = await Promise.all([
    getSiteSettings(),
    getPublishedSkills(),
    getPublishedCategories()
  ]);

  return (
    <PageTransition>
      <About settings={settings} skills={skills} categories={categories} />
    </PageTransition>
  );
}
