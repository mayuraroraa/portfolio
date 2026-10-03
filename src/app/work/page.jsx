import React from 'react';
import PageTransition from '@/components/PageTransition';
import Work from '@/views/Work';

export const metadata = {
  title: 'Work | Mayur Arora',
  description: 'Selected projects and works by Mayur Arora including full-stack web applications and UI designs.',
};

export default function WorkPage() {
  return (
    <PageTransition>
      <Work />
    </PageTransition>
  );
}
