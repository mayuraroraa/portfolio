import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '../data/services';
import ScrollReveal from '../components/ScrollReveal';
import './Services.css';

const Services = () => {
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <div id="services" className="services-container container">
      <ScrollReveal yOffset={20}>
        <h1 className="text-outlined">SERVICES</h1>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2} className="services-list-wrapper">
        <div className="services-list">
          {servicesData.map((service, index) => (
            <div 
              key={service.id} 
              className={`service-item ${hoveredService === service.id ? 'active' : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
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
