'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import HeroPortrait from '@/components/interactive-image/HeroPortrait';

const HomeHero = ({ className = '', settings = null }) => {
  const headlineParts = (settings?.heroHeadline || 'MAYUR ARORA').split(' ');
  const firstWord = headlineParts[0] || 'MAYUR';
  const restWords = headlineParts.slice(1).join(' ') || 'ARORA';

  const roleTitle = settings?.heroRoleTitle || 'Full-Stack Developer';
  const bioText = settings?.heroBio || '17-year-old developer building digital products and AI experiences that are clear, robust, and highly functional.';
  const configuredEmail = settings?.publicContactEmail;
  const configuredWhatsapp = settings?.socialLinks?.whatsapp;
  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/mayurraroraa/';

  const rawEmail = configuredEmail && configuredEmail.includes('@') 
    ? configuredEmail 
    : 'mayuraroraa@gmail.com';
  const mailHref = `mailto:${rawEmail}`;

  const cleanWhatsappDigits = configuredWhatsapp 
    ? configuredWhatsapp.replace(/\D/g, '') 
    : '918360825752';
  const whatsappHref = configuredWhatsapp && configuredWhatsapp.startsWith('http')
    ? configuredWhatsapp
    : `https://wa.me/${cleanWhatsappDigits}`;

  return (
    <div id="home" className={`home-container container ${className}`.trim()}>
      <div className="hero-section">
        {/* HERO TITLE */}
        <motion.h1
          className="display-huge hero-title"
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          <span className="text-outlined">{firstWord}</span> {restWords}
        </motion.h1>

        {/* HERO PORTRAIT WITH UNIFIED CROSS-DEVICE POINTER EVENTS - EXACT ORIGINAL ASSET PRESERVED */}
        <HeroPortrait />

        {/* HERO META */}
        <motion.div
          className="hero-meta"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.8,
          }}
        >
          <div className="hero-role">
            <h2>{roleTitle}</h2>
            <p className="text-secondary">
              {bioText}
            </p>
            <a href="#contact" className="pill-btn pill-btn-dark mt-4">
              Contact Us
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="hero-socials">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn pill-btn-outline"
              title="Connect via WhatsApp"
            >
              WhatsApp
            </a>

            <a
              href={mailHref}
              className="pill-btn pill-btn-outline"
              title="Send an Email"
            >
              Mail
            </a>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="pill-btn pill-btn-outline"
            >
              Instagram
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeHero;
