import React from 'react';
import PageTransition from '@/components/PageTransition';
import About from '@/views/About';

export const metadata = {
  title: 'About | Mayur Arora',
  description: 'Learn more about Mayur Arora, a 17-year-old full-stack developer exploring technology, AI, and creative digital experiences.',
};

export default function AboutPage() {
  return (
    <PageTransition>
      <About />
    </PageTransition>
  );
}
