'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/data/services';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/Services.css';

const Services = ({ className = '', items = null }) => {
  const [hoveredService, setHoveredService] = useState(null);
  const displayServices = items && items.length > 0 ? items : servicesData;

  return (
    <div id="services" className={`services-container container ${className}`.trim()}>
      <ScrollReveal yOffset={20}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="text-outlined">SERVICES</h1>
          <Link 
            href="/services" 
            className="pill-btn pill-btn-dark"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
          >
            <span>View All Skills & Architecture</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2} className="services-list-wrapper">
        <div className="services-list">
          {displayServices.map((service) => {
            const sid = service.slug || service.id || service._id;
            const targetUrl = `/services?service=${sid}`;
            const isHovered = hoveredService === sid;

            return (
              <Link 
                key={sid} 
                href={targetUrl}
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
              </Link>
            );
          })}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Services;
