'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/data/services';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/Services.css';

const Services = ({ className = '' }) => {
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <div id="services" className={`services-container container ${className}`.trim()}>
      <ScrollReveal yOffset={20}>
        <h1 className="text-outlined">SERVICES</h1>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2} className="services-list-wrapper">
        <div className="services-list">
          {servicesData.map((service) => (
            <div 
              key={service.id} 
              className={`service-item ${hoveredService === service.id ? 'active' : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() => setHoveredService(hoveredService === service.id ? null : service.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHoveredService(hoveredService === service.id ? null : service.id);
                }
              }}
            >
              <div className="service-content">
                <h2 className="service-title">{service.title}</h2>
                <div className="service-desc-wrapper">
                  <p className="service-desc">{service.description}</p>
                </div>
              </div>
              <div className="service-action">
                {hoveredService === service.id ? (
                  <span className="close-icon">✕</span>
                ) : (
                  <ArrowUpRight size={24} />
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Services;
