import React from 'react';
import PageTransition from '@/components/PageTransition';
import Services from '@/views/Services';

export const metadata = {
  title: 'Services | Mayur Arora',
  description: 'Services provided by Mayur Arora: Full-Stack Development and Video Editing.',
};

export default function ServicesPage() {
  return (
    <PageTransition>
      <Services />
    </PageTransition>
  );
}
