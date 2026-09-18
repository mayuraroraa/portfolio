import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { skillsData } from '../data/skills';
import heroImage from '../assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png';
import './About.css';

const About = () => {
  return (
    <div id="about" className="about-container container">
      
      <ScrollReveal yOffset={30}>
        <div className="about-header">
          <h1 className="display-large text-outlined">ABOUT ME</h1>
        </div>
      </ScrollReveal>

      <div className="about-content">
        <ScrollReveal delay={0.2} className="about-text-column">
          <h2 className="about-subtitle">I build ideas from the interface
to the infrastructure.</h2>
          
          <div className="about-text-blocks">
            <p>
             I’m a young full-stack developer exploring technology, AI, creative digital experiences, and entrepreneurship.
            </p>
            <p>
         I’m a young full-stack developer exploring technology, AI, creative digital experiences, and entrepreneurship.From writing interfaces and building backends to experimenting with AI and visual storytelling, I’m constantly turning things I learn into things I can actually build.
            </p>
            <p>
            The goal isn't to just become a developer.
It’s to become a builder.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4} className="about-image-column">
          <div className="about-image-wrapper">
            <img src={heroImage} alt="Mayur" className="about-portrait" />
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal yOffset={40} delay={0.2}>
        <div className="skills-section">
          <h2 className="skills-heading">Technologies I work with</h2>
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
