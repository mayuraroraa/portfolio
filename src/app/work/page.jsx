import React from 'react';
import PageTransition from '@/components/PageTransition';
import Work from '@/views/Work';
import { getPublishedProjects } from '@/lib/db/repositories/projectsRepo';

export const metadata = {
  title: 'Work | Mayur Arora',
  description: 'Selected projects and works by Mayur Arora including full-stack web applications and UI designs.',
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <PageTransition>
      <Work items={projects} />
    </PageTransition>
  );
}
