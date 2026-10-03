import React from 'react';
import PageTransition from '@/components/PageTransition';
import Contact from '@/views/Contact';

export const metadata = {
  title: 'Contact | Mayur Arora',
  description: 'Get in touch with Mayur Arora for web development projects, collaborations, and inquiries.',
};

export default function ContactPage() {
  return (
    <PageTransition>
      <Contact />
    </PageTransition>
  );
}
