import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { projectsData } from '../data/projects';
import './Work.css';

const Work = () => {
  return (
    <div id="work" className="work-container container">
      
      <ScrollReveal yOffset={20}>
        <div className="work-header">
          <div className="work-title-wrapper">
            <h1 className="display-large text-outlined">WORK</h1>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2}>
        <div className="projects-grid">
          {projectsData.map((project, index) => (
            <div key={project.id} className="project-card">
              
              <div className="project-image-wrapper">
                <span className="project-badge">{project.category.toUpperCase()}</span>
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="project-overlay">
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="overlay-btn">
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
          ))}
        </div>
      </ScrollReveal>

    </div>
  );
};

export default Work;
