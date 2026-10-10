'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { projectsData } from '@/data/projects';
import '@/styles/Work.css';

const Work = ({ className = '', items = null }) => {
  const displayProjects = items && items.length > 0 ? items : projectsData;

  return (
    <div id="work" className={`work-container container ${className}`.trim()}>
      <ScrollReveal yOffset={20}>
        <div className="work-header">
          <div className="work-title-wrapper">
            <h1 className="display-large text-outlined">WORK</h1>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2}>
        <div className="projects-grid">
          {displayProjects.map((project) => {
            const imgSrc = project.thumbnailUrl || (project.image?.src || project.image);
            const detailHref = `/project/${project.slug || project.id}`;
            const targetLiveUrl = project.liveUrl && project.liveUrl !== '#' ? project.liveUrl : detailHref;

            return (
              <div key={project._id || project.id} className="project-card">
                <div className="project-image-wrapper">
                  <span className="project-badge">{project.category.toUpperCase()}</span>
                  <img src={imgSrc} alt={project.title} className="project-image" loading="lazy" />
                  <div className="project-overlay">
                    <a 
                      href={targetLiveUrl} 
                      target={targetLiveUrl.startsWith('http') || targetLiveUrl.startsWith('/assets') ? '_blank' : '_self'} 
                      rel="noreferrer" 
                      className="overlay-btn" 
                      aria-label={`View ${project.title}`}
                    >
                      <ArrowUpRight size={24} />
                    </a>
                  </div>
                </div>

                <div className="project-info">
                  <Link href={detailHref} style={{ color: 'inherit' }}>
                    <h3 style={{ transition: 'color 0.2s ease', cursor: 'pointer' }}>
                      {project.title}
                    </h3>
                  </Link>
                  <p className="project-description">{project.shortDescription || project.description}</p>
                  <div className="project-tags">
                    {(project.technologies || []).slice(0, 3).map((tech, i) => (
                      <span key={i} className="tag">{tech}</span>
                    ))}
                    {(project.technologies || []).length > 3 && (
                      <span className="tag">+{(project.technologies || []).length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Work;
