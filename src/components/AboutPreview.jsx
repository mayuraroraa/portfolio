'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import heroImage from '@/assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png';
import './AboutPreview.css';

const AboutPreview = () => {
  return (
    <ScrollReveal yOffset={30}>
      <section className="about-preview-container container">
        <div className="about-preview highlight-div">
          <div className="about-preview-content">
            <h2 className="preview-heading">Who am I?</h2>
            <p className="preview-text text-inverse">
              I am a full-stack developer and software engineer based in Mullanpur Dakha, Ludhiana, Punjab, India.
            </p>
            <p className="preview-text text-inverse">
              Specializing in the MERN stack (MongoDB, Express, React, Node.js) and Next.js, I build high-performance web applications and digital solutions that turn vision into scalable reality.
            </p>
            <div className="about-preview-actions">
              <Link href="/about" className="pill-btn pill-btn-light">
                View Full Profile <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="about-preview-image">
            <img src={heroImage.src || heroImage} alt="Mayur Arora — Full Stack & MERN Developer in Mullanpur Dakha, Ludhiana" className="preview-photo" />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default AboutPreview;
