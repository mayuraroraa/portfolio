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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mayurarora.dev';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#151515',
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mayur Arora — Full-Stack Developer & MERN Developer | Mullanpur Dakha, Ludhiana, Punjab',
    template: '%s | Mayur Arora — Developer Ludhiana',
  },
  description:
    'Official portfolio of Mayur Arora, a full stack developer, software developer, react developer, next.js developer, mern developer, mern stack developer and web developer in Mullanpur Dakha, specifically Ludhiana, Punjab, India. Building high-performance web applications and scalable digital solutions.',
  keywords: [
    // Requested core developer titles
    'full stack developer',
    'software developer',
    'react developer',
    'next.js developer',
    'nextjs developer',
    'mern developer',
    'mern stack developer',
    'web developer',

    // Local geo-targeted keywords (Mullanpur Dakha, Ludhiana, Punjab, India)
    'full stack developer in mullanpur dakha',
    'software developer in mullanpur dakha',
    'react developer in mullanpur dakha',
    'next.js developer in mullanpur dakha',
    'mern developer in mullanpur dakha',
    'mern stack developer in mullanpur dakha',
    'web developer in mullanpur dakha',

    'full stack developer ludhiana',
    'software developer ludhiana',
    'react developer ludhiana',
    'next.js developer ludhiana',
    'mern developer ludhiana',
    'mern stack developer ludhiana',
    'web developer ludhiana',
    'full stack developer in ludhiana',
    'software developer in ludhiana',
    'react developer in ludhiana',
    'next.js developer in ludhiana',
    'mern developer in ludhiana',
    'mern stack developer in ludhiana',
    'web developer in ludhiana',

    'full stack developer in punjab',
    'software developer in punjab',
    'react developer in punjab',
    'next.js developer in punjab',
    'mern developer in punjab',
    'mern stack developer in punjab',
    'web developer in punjab',
    'developer in punjab india',

    'full stack developer india',
    'software developer india',
    'react developer india',
    'next.js developer india',
    'mern developer india',
    'mern stack developer india',
    'web developer india',

    // Developer portfolio intent
    'Mayur Arora',
    'Mayur Arora developer',
    'Mayur Arora portfolio',
    'full stack developer portfolio',
    'developer portfolio',
    'software developer portfolio',
    'react developer portfolio',
    'nextjs developer portfolio',
    'mern stack developer portfolio',
    'web developer portfolio',
    'best developer portfolio',
    'hire full stack developer',
    'hire mern developer ludhiana',
    'hire react developer ludhiana',
    'freelance web developer ludhiana',
  ],
  authors: [{ name: 'Mayur Arora', url: siteUrl }],
  creator: 'Mayur Arora',
  publisher: 'Mayur Arora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Mayur Arora — Full-Stack Developer & MERN Developer in Mullanpur Dakha, Ludhiana',
    description:
      'Official portfolio of Mayur Arora — full stack developer, software developer, react developer, next.js developer, mern developer, and web developer based in Mullanpur Dakha, Ludhiana, Punjab, India.',
    url: siteUrl,
    siteName: 'Mayur Arora — Developer Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/hero.png',
        width: 1200,
        height: 630,
        alt: 'Mayur Arora — Full Stack Developer & Software Developer in Ludhiana, Punjab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mayur Arora — Full Stack & MERN Developer | Ludhiana, Punjab',
    description:
      'Full stack developer, software developer, and MERN stack engineer in Mullanpur Dakha, Ludhiana, Punjab, India.',
    creator: '@mayurraroraa',
    images: ['/assets/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Mayur Arora',
      alternateName: [
        'Mayur Arora Developer',
        'Mayur Arora Full Stack Developer',
        'Mayur Arora MERN Developer',
        'Mayur Arora Software Developer',
        'Mayur',
        'mayuraroraa'
      ],
      jobTitle: 'Full-Stack Developer, MERN Stack Developer & Software Developer',
      description:
        'Full stack developer, software developer, react developer, next.js developer, and mern stack developer based in Mullanpur Dakha, specifically Ludhiana, Punjab, India.',
      url: siteUrl,
      image: `${siteUrl}/assets/hero.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mullanpur Dakha',
        addressLocality: 'Mullanpur Dakha, Ludhiana',
        addressRegion: 'Punjab',
        postalCode: '141101',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://github.com/mayurarora',
        'https://www.instagram.com/mayurraroraa/',
        'https://twitter.com/mayurraroraa',
      ],
      knowsAbout: [
        'Full Stack Development',
        'Software Development',
        'React Development',
        'Next.js Development',
        'MERN Stack (MongoDB, Express.js, React, Node.js)',
        'MERN Developer',
        'Web Development',
        'JavaScript',
        'TypeScript',
        'React.js',
        'Next.js',
        'Node.js',
        'Express.js',
        'MongoDB',
        'REST APIs',
        'Web Performance Optimization',
        'UI/UX Architecture',
        'Mullanpur Dakha',
        'Ludhiana',
        'Punjab',
        'India',
      ],
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Full Stack & MERN Developer',
        occupationalCategory: '15-1254.00',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Mayur Arora — Full Stack & MERN Developer Portfolio',
      description:
        'Official portfolio of Mayur Arora, a full stack developer, software developer, and MERN stack engineer based in Mullanpur Dakha, Ludhiana, Punjab, India.',
      author: {
        '@id': `${siteUrl}/#person`,
      },
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: 'Mayur Arora — Developer Profile',
      mainEntity: {
        '@id': `${siteUrl}/#person`,
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
