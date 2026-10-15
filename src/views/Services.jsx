'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, X, Cpu, CheckCircle2 } from 'lucide-react';
import { servicesData } from '@/data/services';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/Services.css';

const Services = ({ className = '', items = null }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const [activeModalService, setActiveModalService] = useState(null);
  const displayServices = items && items.length > 0 ? items : servicesData;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalService(null);
      }
    };
    if (activeModalService) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeModalService]);

  return (
    <section id="services" className={`services-container container ${className}`.trim()}>
      <span id="skills" aria-hidden="true" style={{ position: 'relative', top: '-20px' }}></span>

      <ScrollReveal yOffset={20}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="text-outlined">SERVICES</h1>
          <a 
            href="#services" 
            onClick={() => {
              setActiveModalService({
                title: 'Full-Stack Architecture & Systems',
                description: 'Comprehensive overview of the core technologies, design systems, data layers, and infrastructure powering each application.',
                capabilities: [
                  { name: 'Frontend Architecture', detail: 'React 19, Next.js 16 App Router, Framer Motion, Vanilla CSS Design Tokens' },
                  { name: 'Backend & Edge Logic', detail: 'Stateless JWT Session Auth (jose), Next.js Route Handlers, Zod Validation' },
                  { name: 'Database & Models', detail: 'MongoDB Atlas, Aggregation Pipelines, Resilient In-Memory Fallback Dataset' },
                  { name: 'Security & Optimization', detail: 'CSP Header Enforcement, Bcryptjs Password Hashing, Sliding-Window Rate Limiter' },
                  { name: 'Deployment & CI/CD', detail: 'Vercel Edge Network, Zero-Git Live Revalidation, Automatic Asset Compression' }
                ]
              });
            }}
            className="pill-btn pill-btn-dark"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
          >
            <span>View All Skills & Architecture</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2} className="services-list-wrapper">
        <div className="services-list">
          {displayServices.map((service) => {
            const sid = service.slug || service.id || service._id;
            const targetUrl = '#services';
            const isHovered = hoveredService === sid;

            return (
              <a 
                key={sid} 
                href={targetUrl}
                onClick={() => {
                  setActiveModalService({
                    title: service.title,
                    description: service.description,
                    capabilities: (service.slug?.includes('video') || service.title?.toLowerCase().includes('video')) ? [
                      { name: 'High-Retention Visual Direction', detail: 'Storytelling, pacing, frame-accurate cuts, and viewer retention optimization' },
                      { name: 'Motion Design & VFX', detail: 'Dynamic typography, graphic overlays, masking, and visual transitions' },
                      { name: 'Sound Architecture', detail: 'Multi-layer audio mixing, SFX soundscapes, Foley design, and voice enhancement' },
                      { name: 'Color Grading & Delivery', detail: 'LUT management, color matching, and multi-platform aspect ratio exports' }
                    ] : [
                      { name: 'Responsive Web Architecture', detail: 'Mobile-first fluid responsive layouts, accessible semantic HTML5' },
                      { name: 'Component Systems & Tokens', detail: 'Tailored CSS variables, high-performance interactions, and pointer physics' },
                      { name: 'Full-Stack Integration', detail: 'Next.js App Router, MongoDB Atlas database modeling, and REST APIs' },
                      { name: 'Production Hardening', detail: 'Rate limiting, CSRF/XSS protection, and secure CMS administration' }
                    ]
                  });
                }}
                className={`service-item ${isHovered ? 'active' : ''}`}
                onMouseEnter={() => setHoveredService(sid)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="service-content">
                  <h2 className="service-title">{service.title}</h2>
                  <div className="service-desc-wrapper">
                    <p className="service-desc">{service.description}</p>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      color: 'var(--accent-deep)', 
                      fontSize: '0.8rem', 
                      fontWeight: '700',
                      marginTop: '0.6rem'
                    }}>
                      Open service architecture & skills <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
                <div className="service-action">
                  <ArrowUpRight 
                    size={26} 
                    style={{ 
                      transition: 'transform 0.3s ease',
                      transform: isHovered ? 'translate(4px, -4px)' : 'none',
                      color: isHovered ? 'var(--accent-deep)' : 'inherit'
                    }} 
                  />
                </div>
              </a>
            );
          })}
        </div>
      </ScrollReveal>

      {/* INTERACTIVE SERVICE ARCHITECTURE & SKILLS MODAL */}
      {activeModalService && (
        <div 
          className="services-modal-backdrop"
          onClick={() => setActiveModalService(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="services-modal-title"
        >
          <div 
            className="services-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="services-modal-close"
              onClick={() => setActiveModalService(null)}
              aria-label="Close architecture modal"
            >
              <X size={18} />
            </button>

            <div className="services-modal-header">
              <span className="services-badge">
                <Cpu size={13} /> Architecture & Stack
              </span>
              <h3 id="services-modal-title" className="services-modal-name">
                {activeModalService.title}
              </h3>
              <p className="services-modal-subtitle">
                {activeModalService.description}
              </p>
            </div>

            <div className="services-modal-body">
              <div className="services-modal-section">
                <h4>Technical Pillars & Capabilities</h4>
                <div className="services-capabilities-grid">
                  {(activeModalService.capabilities || []).map((cap, i) => (
                    <div key={i} className="services-cap-item">
                      <CheckCircle2 size={16} className="cap-icon" />
                      <div>
                        <strong>{cap.name}</strong>
                        <p>{cap.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="services-modal-actions">
                <a 
                  href="#contact" 
                  onClick={() => setActiveModalService(null)}
                  className="pill-btn pill-btn-dark"
                >
                  Discuss a Project <ArrowRight size={14} />
                </a>
                <a 
                  href="#services" 
                  onClick={() => setActiveModalService(null)}
                  className="pill-btn pill-btn-outline"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                >
                  Back to Services
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
