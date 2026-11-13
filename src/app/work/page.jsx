import React from 'react';
import PageTransition from '@/components/PageTransition';
import Work from '@/views/Work';
import { getPublishedProjects } from '@/lib/db/repositories/projectsRepo';

export const metadata = {
  title: 'Full Stack & MERN Developer Projects — Mayur Arora | Ludhiana',
  description:
    'Featured full stack web applications, React apps, Next.js software, and MERN architectural implementations engineered by Mayur Arora in Mullanpur Dakha, Ludhiana, Punjab, India.',
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: 'Featured Projects & Developer Work — Mayur Arora | Ludhiana, Punjab',
    description:
      'Production web apps, full-stack systems, and MERN stack software by Mayur Arora in Mullanpur Dakha, Ludhiana, Punjab, India.',
    url: '/work',
    images: [{ url: '/assets/hero.png', width: 1200, height: 630, alt: 'Mayur Arora Developer Projects' }],
  },
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <PageTransition>
      <Work items={projects} />
    </PageTransition>
  );
}
