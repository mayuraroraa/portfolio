'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import HeroPortrait from '@/components/interactive-image/HeroPortrait';

const HomeHero = ({ className = '' }) => {
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
          <span className="text-outlined">MAYUR</span> ARORA
        </motion.h1>

        {/* HERO PORTRAIT WITH UNIFIED CROSS-DEVICE POINTER EVENTS */}
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
            <h2>Full-Stack Developer</h2>
            <p className="text-secondary">
              17-year-old developer building digital products and AI
              experiences that are clear, robust, and highly functional.
            </p>
            <Link to="/contact" href="/contact" className="pill-btn pill-btn-dark mt-4">
              Contact Us
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="hero-socials">
            <a
              href="https://wa.me/+918360825752"
              target="_blank"
              rel="noreferrer"
              className="pill-btn pill-btn-outline"
            >
              Whatsapp
            </a>

            <a
              href="mailto:[EMAIL_ADDRESS]"
              target="_blank"
              rel="noreferrer"
              className="pill-btn pill-btn-outline"
            >
              Mail
            </a>

            <a
              href="https://www.instagram.com/mayurraroraa/"
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
