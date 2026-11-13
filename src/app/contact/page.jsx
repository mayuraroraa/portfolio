import React from 'react';
import PageTransition from '@/components/PageTransition';
import Contact from '@/views/Contact';

export const metadata = {
  title: 'Hire & Contact Mayur Arora — Full Stack & MERN Developer | Ludhiana, Punjab',
  description:
    'Get in touch with Mayur Arora for freelance full stack development, software developer contracts, React / Next.js projects, or MERN stack engineering inquiries in Mullanpur Dakha, Ludhiana, Punjab, India.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Hire & Contact Mayur Arora — Full Stack Developer | Ludhiana, Punjab',
    description:
      'Connect with Mayur Arora, a full stack developer and software engineer in Mullanpur Dakha, Ludhiana, Punjab, India for web development projects and contracts.',
    url: '/contact',
    images: [{ url: '/assets/hero.png', width: 1200, height: 630, alt: 'Contact Mayur Arora Full Stack Developer' }],
  },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <Contact />
    </PageTransition>
  );
}
