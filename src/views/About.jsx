'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Lock } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { skillsData } from '@/data/skills';
import heroImage from '@/assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png';
import '@/styles/About.css';

const About = ({ className = '', settings = null }) => {
  const subtitle = settings?.aboutSubtitle || 'I build ideas from the interface to the infrastructure.';
  const bioParagraphs = settings?.aboutBioParagraphs && settings.aboutBioParagraphs.length > 0 
    ? settings.aboutBioParagraphs 
    : [
        'I’m a young full-stack developer exploring technology, AI, creative digital experiences, and entrepreneurship.',
        'From writing interfaces and building backends to experimenting with AI and visual storytelling, I’m constantly turning things I learn into things I can actually build.',
        "The goal isn't to just become a developer. It’s to become a builder."
      ];

  return (
    <div id="about" className={`about-container container ${className}`.trim()}>
      <ScrollReveal yOffset={30}>
        <div className="about-header">
          <h1 className="display-large text-outlined">ABOUT ME</h1>
        </div>
      </ScrollReveal>

      <div className="about-content">
        <ScrollReveal delay={0.2} className="about-text-column">
          <h2 className="about-subtitle">
            {subtitle}
          </h2>
          
          <div className="about-text-blocks">
            {bioParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="about-actions-row">
            <Link href="/skills" className="pill-btn pill-btn-dark">
              Explore Technical Capabilities <ArrowUpRight size={16} />
            </Link>
            <Link href="/admin/login" className="pill-btn pill-btn-outline admin-login-btn">
              <Lock size={15} /> Admin Login
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4} className="about-image-column">
          <div className="about-image-wrapper">
            <img src={heroImage.src || heroImage} alt="Mayur Arora" className="about-portrait" />
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal yOffset={40} delay={0.2}>
        <div className="skills-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <h2 className="skills-heading" style={{ margin: 0 }}>Core Technologies Preview</h2>
            <Link href="/skills" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--accent-deep)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              View full /skills catalog <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="skills-grid">
            {skillsData.map((category, index) => (
              <div key={index} className="skill-category">
                <h3 className="skill-category-title">{category.category}</h3>
                <ul className="skill-list">
                  {category.skills.map((skill, sIndex) => (
                    <li key={sIndex} className="skill-item">
                      <span className="skill-dot"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default About;
