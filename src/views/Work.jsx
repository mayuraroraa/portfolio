'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { projectsData } from '@/data/projects';
import '@/styles/Work.css';

const Work = ({ className = '' }) => {
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
          {projectsData.map((project) => {
            const imgSrc = project.image?.src || project.image;
            return (
              <div key={project.id} className="project-card">
                <div className="project-image-wrapper">
                  <span className="project-badge">{project.category.toUpperCase()}</span>
                  <img src={imgSrc} alt={project.title} className="project-image" />
                  <div className="project-overlay">
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="overlay-btn" aria-label={`View ${project.title}`}>
                      <ArrowUpRight size={24} />
                    </a>
                  </div>
                </div>

                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="tag">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && <span className="tag">+{project.technologies.length - 3}</span>}
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
