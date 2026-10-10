'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
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
              I am a 17-year-old Class 12 student who is deeply interested in technology, development, AI, and entrepreneurship.
            </p>
            <p className="preview-text text-inverse">
              Alongside school, I am learning full-stack development and building projects to turn what I learn into practical products.
            </p>
            <div className="about-preview-actions">
              <Link href="/about" className="pill-btn pill-btn-light">
                View Full Profile <ArrowRight size={16} />
              </Link>
              <Link href="/admin/login" className="pill-btn pill-btn-outline admin-preview-login-btn">
                <Lock size={15} /> Admin Login
              </Link>
            </div>
          </div>
          <div className="about-preview-image">
            <img src={heroImage.src || heroImage} alt="Mayur" className="preview-photo" />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};

export default AboutPreview;
