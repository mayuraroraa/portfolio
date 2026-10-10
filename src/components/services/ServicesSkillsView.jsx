'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Layers, 
  Video, 
  ArrowUpRight, 
  Terminal, 
  CheckCircle2,
  X
} from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/ServicesSkills.css';

// Default mapping between services and skill category IDs
const SERVICE_CATEGORY_MAP = {
  'full-stack': ['frontend', 'backend', 'database', 'devops'],
  'full-stack-development': ['frontend', 'backend', 'database', 'devops'],
  'video-editing': ['creative'],
  'video-editing-production': ['creative']
};

// Helpful highlight tags for each service
const SERVICE_TAGS_MAP = {
  'full-stack': [
    'Responsive Web Applications',
    'Full-Stack Architecture',
    'REST APIs & Server Logic',
    'Database Modeling & Indexing',
    'Modern UI/UX Ergonomics',
    'CI/CD & Cloud Deployments'
  ],
  'video-editing': [
    'Social Media Edits & Reels',
    'Pacing & Visual Storytelling',
    'Transitions & Sound Design',
    'Motion Graphics & Subtitling',
    'High-Retention Creative Direction'
  ]
};

export default function ServicesSkillsView({ 
  initialServices = [], 
  initialSkills = [], 
  initialCategories = [],
  initialSelectedService = 'all'
}) {
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get('service') || initialSelectedService;
  const [selectedServiceId, setSelectedServiceId] = useState(queryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep selectedServiceId in sync when URL query changes via client-side routing
  React.useEffect(() => {
    const sParam = searchParams?.get('service');
    if (sParam) {
      setSelectedServiceId(sParam);

      const timer = setTimeout(() => {
        const el = document.getElementById(sParam) || 
                   document.querySelector(`[data-service-id="${sParam}"]`) ||
                   document.querySelector('.highlighted-service');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Group services with their connected categories and skills
  const enrichedServices = useMemo(() => {
    return initialServices.map((service, index) => {
      const sId = service.slug || service.id || `service-${index}`;
      
      // Determine which category IDs belong to this service
      let mappedCatIds = SERVICE_CATEGORY_MAP[sId] || service.categoryIds;
      if (!mappedCatIds) {
        // Fallback by keyword in title
        const lowerTitle = (service.title || '').toLowerCase();
        if (lowerTitle.includes('video') || lowerTitle.includes('creative') || lowerTitle.includes('media')) {
          mappedCatIds = ['creative'];
        } else {
          mappedCatIds = ['frontend', 'backend', 'database', 'devops'];
        }
      }

      // Collect categories and skills for this service
      const categoriesForService = initialCategories
        .filter(c => mappedCatIds.includes(c.id) || mappedCatIds.includes(c.slug))
        .map(cat => {
          const catSkills = initialSkills.filter(s => s.categoryId === (cat.id || cat.slug));
          return {
            ...cat,
            skills: catSkills
          };
        })
        .filter(cat => cat.skills.length > 0);

      const totalSkillsCount = categoriesForService.reduce((acc, cat) => acc + cat.skills.length, 0);
      const tags = SERVICE_TAGS_MAP[sId] || [
        'Production Ready Systems',
        'Custom Architecture',
        'End-to-End Implementation'
      ];

      return {
        ...service,
        serviceIndexNumber: String(index + 1).padStart(2, '0'),
        categories: categoriesForService,
        totalSkillsCount,
        tags
      };
    });
  }, [initialServices, initialSkills, initialCategories]);

  // Sort and filter services: If a service is selected (e.g. Video Editing), show it FIRST (before other services)
  const displayedServices = useMemo(() => {
    let list = [...enrichedServices];

    // Priority sorting: put the clicked service FIRST before the others
    if (selectedServiceId !== 'all') {
      const sParam = selectedServiceId.toLowerCase();
      const isTarget = (s) => {
        const sSlug = (s.slug || '').toLowerCase();
        const sId = (s.id || '').toLowerCase();
        return (
          sSlug === sParam || 
          sId === sParam || 
          s._id === selectedServiceId ||
          (sParam.includes('video') && (sId.includes('video') || sSlug.includes('video'))) ||
          (sParam.includes('full-stack') && (sId.includes('full-stack') || sSlug.includes('full-stack')))
        );
      };

      list.sort((a, b) => {
        const aTarget = isTarget(a);
        const bTarget = isTarget(b);
        if (aTarget && !bTarget) return -1;
        if (!aTarget && bTarget) return 1;
        return 0;
      });
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list
        .map(service => {
          const filteredCategories = service.categories
            .map(cat => ({
              ...cat,
              skills: cat.skills.filter(s => 
                s.name.toLowerCase().includes(query) ||
                (s.proficiencyLabel || '').toLowerCase().includes(query) ||
                cat.name.toLowerCase().includes(query)
              )
            }))
            .filter(cat => cat.skills.length > 0);

          const titleMatches = service.title.toLowerCase().includes(query);
          const descMatches = service.description.toLowerCase().includes(query);

          if ((titleMatches || descMatches) && filteredCategories.length === 0) {
            return service;
          }

          return {
            ...service,
            categories: filteredCategories,
            totalSkillsCount: filteredCategories.reduce((acc, c) => acc + c.skills.length, 0)
          };
        })
        .filter(service => {
          const hasMatchingSkills = service.categories.some(c => c.skills.length > 0);
          const titleMatches = service.title.toLowerCase().includes(query);
          const descMatches = service.description.toLowerCase().includes(query);
          return hasMatchingSkills || titleMatches || descMatches;
        });
    }

    return list;
  }, [enrichedServices, selectedServiceId, searchQuery]);

  const getBadgeClass = (label = '') => {
    const l = label.toLowerCase();
    if (l === 'comfortable') return 'level-comfortable';
    if (l === 'practicing') return 'level-practicing';
    if (l === 'learning') return 'level-learning';
    if (l === 'mastered') return 'level-mastered';
    return 'level-comfortable';
  };

  const getServiceIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('video') || t.includes('media')) return <Video size={24} color="var(--accent-deep)" />;
    return <Layers size={24} color="var(--accent-deep)" />;
  };

  const totalAllSkills = initialSkills.length;

  return (
    <div className="services-skills-page container">
      {/* Header Section */}
      <ScrollReveal yOffset={20}>
        <div className="services-skills-header">
          <div className="services-skills-badge">
            <span className="badge-dot"></span>
            <span>CAPABILITIES & DIGITAL SERVICES</span>
          </div>
          <h1 className="display-large text-outlined">
            SERVICES & SKILLS
          </h1>
          <p className="services-skills-subtitle">
            An in-depth explanation of the services I build and deliver, paired directly with the technical stacks, frameworks, and architecture powering each one.
          </p>
        </div>
      </ScrollReveal>

      {/* Search and Service Filter Bar */}
      <ScrollReveal yOffset={25} delay={0.1}>
        <div className="services-skills-controls">
          <div className="services-search-wrapper">
            <input
              type="text"
              placeholder="Search technologies, tools or services (e.g. React, MongoDB, Video)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="services-search-input"
            />
            <Search 
              size={17} 
              style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="services-filter-pills">
            <button
              className={`service-filter-pill ${selectedServiceId === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedServiceId('all')}
            >
              <span>All Services</span>
              <span className="pill-count">[{enrichedServices.length} Services • {totalAllSkills} Skills]</span>
            </button>

            {enrichedServices.map((service) => {
              const sKey = service.slug || service.id || service._id;
              const isActive = selectedServiceId === sKey;
              return (
                <button
                  key={sKey}
                  className={`service-filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedServiceId(sKey)}
                >
                  <span>{service.title}</span>
                  <span className="pill-count">[{service.totalSkillsCount} Skills]</span>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Main Services & Skills List */}
      <div className="services-showcase-list">
        {selectedServiceId !== 'all' && displayedServices.length > 0 && (
          <div className="service-reorder-banner">
            <span>
              ★ Showing <strong>{displayedServices[0]?.title}</strong> first based on your selection.
            </span>
            <button
              onClick={() => setSelectedServiceId('all')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-deep)',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Reset to Default Order ↺
            </button>
          </div>
        )}

        {displayedServices.length === 0 ? (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            margin: '2rem 0'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
              No technologies or services matched "<strong>{searchQuery}</strong>".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedServiceId('all'); }}
              className="pill-btn pill-btn-dark"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedServices.map((service, serviceIdx) => {
            const sKey = (service.slug || service.id || '').toLowerCase();
            const selKey = selectedServiceId.toLowerCase();
            const isCurrentSelected = selectedServiceId !== 'all' && (
              sKey === selKey ||
              service._id === selectedServiceId ||
              (selKey.includes('video') && (sKey.includes('video') || service.title?.toLowerCase().includes('video'))) ||
              (selKey.includes('full-stack') && (sKey.includes('full-stack') || service.title?.toLowerCase().includes('full-stack')))
            );

            return (
              <motion.section 
                id={service.slug || service.id || `service-${serviceIdx}`}
                data-service-id={service.slug || service.id || ''}
                key={service._id || service.slug || service.id || serviceIdx}
                className={`service-showcase-card ${isCurrentSelected ? 'highlighted-service' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: serviceIdx * 0.1 }}
              >
                {/* Service Meta & Icon Header */}
                <div className="service-header-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="service-number">SERVICE {service.serviceIndexNumber}</span>
                    {isCurrentSelected && (
                      <span className="selected-badge">
                        <CheckCircle2 size={13} /> SELECTED • SHOWING FIRST
                      </span>
                    )}
                  </div>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(169, 21, 32, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getServiceIcon(service.title)}
                  </div>
                </div>

              {/* Service Title */}
              <div className="service-heading-row">
                <h2 className="service-main-title">{service.title}</h2>
                <Link 
                  href="/contact" 
                  className="pill-btn pill-btn-dark"
                  style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
                >
                  Request Service <ArrowUpRight size={14} />
                </Link>
              </div>

              {/* Step 1: Explanation of Service */}
              <div className="service-explanation-box">
                <div className="service-explanation-label">
                  <CheckCircle2 size={14} />
                  <span>Service Overview & Deliverables</span>
                </div>
                <p className="service-explanation-text">
                  {service.description}
                </p>

                {/* Service highlights / capability tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="service-tags-row">
                    {service.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="service-tag">
                        • {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Skills Under That Service */}
              <div className="service-skills-section">
                <div className="service-skills-section-title">
                  <h3>
                    <Terminal size={18} color="var(--accent-deep)" />
                    <span>Technical Architecture & Skills Under {service.title}</span>
                  </h3>
                  <span className="skills-count-pill">
                    {service.totalSkillsCount} TECHNOLOGIES
                  </span>
                </div>

                {service.categories.map((category) => (
                  <div key={category.id || category.slug} className="service-category-group">
                    <div className="service-category-group-header">
                      <span className="service-category-group-name">
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-deep)'
                        }}></span>
                        {category.name}
                      </span>
                      {category.description && (
                        <span className="service-category-group-desc">
                          {category.description}
                        </span>
                      )}
                    </div>

                    <div className="service-skills-grid">
                      {category.skills.map((skill) => (
                        <div 
                          key={skill._id || skill.name} 
                          className="service-skill-item"
                        >
                          <span className="service-skill-name">{skill.name}</span>
                          <span className={`service-skill-badge ${getBadgeClass(skill.proficiencyLabel)}`}>
                            {skill.proficiencyLabel || 'Comfortable'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          );
        })
      )}
      </div>

      {/* Bottom Call To Action Banner */}
      <ScrollReveal yOffset={30}>
        <div className="services-cta-banner">
          <div className="services-cta-content">
            <h3>Have a project that requires these skills?</h3>
            <p>
              Whether you need a full-stack digital product built from scratch or high-impact video storytelling, I’m ready to engineer your vision.
            </p>
          </div>
          <Link href="/contact" className="services-cta-btn">
            Let's Build Together <ArrowUpRight size={18} />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  );
}
