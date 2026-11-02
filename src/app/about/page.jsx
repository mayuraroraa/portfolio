import React from 'react';
import PageTransition from '@/components/PageTransition';
import About from '@/views/About';
import { getSiteSettings } from '@/lib/db/repositories/settingsRepo';

export const metadata = {
  title: 'About | Mayur Arora',
  description: 'Learn more about Mayur Arora, a 17-year-old full-stack developer exploring technology, AI, and creative digital experiences.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <PageTransition>
      <About settings={settings} />
    </PageTransition>
  );
}
