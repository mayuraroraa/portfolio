'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import heroImage from '@/assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png';
import './AboutPreview.css';

const AboutPreview = ({ settings = null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const bioParagraphs = settings?.aboutBioParagraphs?.length > 0
    ? settings.aboutBioParagraphs
    : [
        'I am a 17-year-old Class 12 student with an unrelenting passion for technology, software development, AI, and entrepreneurship.',
        'From architecting robust full-stack applications to experimenting with generative models and dynamic user interfaces, I focus on turning what I learn into real, usable products.',
        'My goal is not simply to write code, but to engineer impactful digital experiences that solve practical problems.'
      ];

  return (
    <ScrollReveal yOffset={30}>
      <section id="about" className="about-preview-container container">
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
              <a
                href="#about"
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="pill-btn pill-btn-light"
              >
                View Full Profile <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="about-preview-image">
            <img src={heroImage.src || heroImage} alt="Mayur" className="preview-photo" />
          </div>
        </div>

        {/* INTERACTIVE FULL PROFILE MODAL */}
        {isModalOpen && (
          <div 
            className="profile-modal-backdrop"
            onClick={() => setIsModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <div 
              className="profile-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="profile-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close profile modal"
              >
                <X size={18} />
              </button>

              <div className="profile-modal-header">
                <div className="profile-modal-avatar-wrapper">
                  <img src={heroImage.src || heroImage} alt="Mayur Arora" className="profile-modal-avatar" />
                  <div>
                    <span className="profile-badge">
                      <Sparkles size={12} /> Class 12 Builder
                    </span>
                    <h3 id="profile-modal-title" className="profile-modal-name">Mayur Arora</h3>
                    <p className="profile-modal-subtitle">Full-Stack Developer & AI Systems Enthusiast</p>
                  </div>
                </div>
              </div>

              <div className="profile-modal-body">
                <div className="profile-modal-section">
                  <h4>Biography & Mission</h4>
                  {bioParagraphs.map((para, i) => (
                    <p key={i} className="profile-modal-text">{para}</p>
                  ))}
                </div>

                <div className="profile-modal-section">
                  <h4>Key Capabilities</h4>
                  <div className="profile-capabilities-grid">
                    <div className="profile-cap-item">
                      <CheckCircle2 size={16} className="cap-icon" />
                      <div>
                        <strong>Modern Frontend Engineering</strong>
                        <p>React 19, Next.js 16 App Router, Framer Motion, Vanilla CSS Design Tokens</p>
                      </div>
                    </div>
                    <div className="profile-cap-item">
                      <CheckCircle2 size={16} className="cap-icon" />
                      <div>
                        <strong>Backend & API Architecture</strong>
                        <p>Node.js, Edge Runtime, RESTful APIs, Zod schema validation, JWT sessions</p>
                      </div>
                    </div>
                    <div className="profile-cap-item">
                      <CheckCircle2 size={16} className="cap-icon" />
                      <div>
                        <strong>Database & Cloud Platforms</strong>
                        <p>MongoDB Atlas, Indexing & Aggregations, Vercel deployments, CI/CD pipelines</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-modal-actions">
                  <a 
                    href="#contact" 
                    onClick={() => setIsModalOpen(false)}
                    className="pill-btn pill-btn-dark"
                  >
                    Start a Conversation <ArrowRight size={14} />
                  </a>
                  <a 
                    href="#services" 
                    onClick={() => setIsModalOpen(false)}
                    className="pill-btn pill-btn-outline"
                    style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                  >
                    View Services & Skills
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </ScrollReveal>
  );
};

export default AboutPreview;
