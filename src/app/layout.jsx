import React from 'react';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import '@/index.css';
import '@/styles/Home.css';
import '@/styles/About.css';
import '@/styles/Work.css';
import '@/styles/Services.css';
import '@/styles/Contact.css';
import '@/components/Navbar.css';
import '@/components/AboutPreview.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#151515',
};

export const metadata = {
  title: 'Mayur Arora | Full-Stack Developer & Builder',
  description: '17-year-old full-stack developer building digital products, web applications, and AI experiences that are clear, robust, and highly functional.',
  keywords: ['Mayur Arora', 'Full-Stack Developer', 'Portfolio', 'Web Development', 'React', 'Next.js', 'AI'],
  authors: [{ name: 'Mayur Arora' }],
  creator: 'Mayur Arora',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Mayur Arora | Full-Stack Developer & Builder',
    description: '17-year-old developer building digital products and AI experiences that are clear, robust, and highly functional.',
    url: 'https://mayurarora.dev',
    siteName: 'Mayur Arora Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mayur Arora | Full-Stack Developer',
    description: '17-year-old developer building digital products and AI experiences that are clear, robust, and highly functional.',
    creator: '@mayurraroraa',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">
          <CustomCursor />
          <Navbar />
          <main className="page-wrapper">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
