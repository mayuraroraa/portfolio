'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/Skills.css';

export default function SkillsCatalogView({ initialSkills, initialCategories }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [query, setQuery] = useState('');

  const filteredSkills = initialSkills.filter((s) => {
    const matchesCat = selectedCat === 'all' || s.categoryId === selectedCat;
    const matchesQuery = s.name.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getBadgeClass = (label = '') => {
    const l = label.toLowerCase();
    if (l === 'comfortable') return 'level-comfortable';
    if (l === 'practicing') return 'level-practicing';
    if (l === 'learning') return 'level-learning';
    if (l === 'mastered') return 'level-mastered';
    return 'level-comfortable';
  };

  return (
    <div className="skills-page-container container">
      <ScrollReveal yOffset={20}>
        <div className="skills-header">
          <div className="status-indicator" style={{ marginBottom: '1.5rem' }}>
            <div className="status-dot"></div>
            <span>Technical Capabilities</span>
          </div>
          <h1 className="display-large text-outlined">
            SKILLS & ARCHITECTURE
          </h1>
          <p className="skills-subtitle">
            An honest, categorized view of languages, libraries, databases, and developer workflows I build with daily.
          </p>
        </div>
      </ScrollReveal>

      {/* Filter and Search Bar */}
      <ScrollReveal yOffset={30} delay={0.1}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '360px' }}>
            <input
              type="text"
              placeholder="Search technologies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} 
            />
          </div>

          <div className="skills-filter-tabs">
            <button
              className={`skills-filter-btn ${selectedCat === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCat('all')}
            >
              All Technologies [{initialSkills.length}]
            </button>
            {initialCategories.map((c) => {
              const count = initialSkills.filter(s => s.categoryId === (c.id || c.slug)).length;
              return (
                <button
                  key={c.id || c.slug}
                  className={`skills-filter-btn ${selectedCat === (c.id || c.slug) ? 'active' : ''}`}
                  onClick={() => setSelectedCat(c.id || c.slug)}
                >
                  {c.name} [{count}]
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Skills Catalog */}
      {selectedCat === 'all' && !query ? (
        // Grouped by Category View
        initialCategories.map((cat) => {
          const catSkills = initialSkills.filter(s => s.categoryId === (cat.id || cat.slug));
          if (catSkills.length === 0) return null;
          return (
            <div key={cat.id || cat.slug} className="skills-category-block">
              <div className="skills-category-header">
                <div>
                  <h2 className="skills-category-title">{cat.name}</h2>
                  {cat.description && <p className="skills-category-desc">{cat.description}</p>}
                </div>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-tech)', color: 'var(--text-secondary)' }}>
                  {catSkills.length} SKILLS
                </span>
              </div>

              <div className="skills-grid-catalog">
                {catSkills.map((skill, index) => (
                  <motion.div
                    key={skill._id || skill.name}
                    className="skill-catalog-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <div className="skill-card-top">
                      <span className="skill-card-name">{skill.name}</span>
                      <span className={`skill-badge-level ${getBadgeClass(skill.proficiencyLabel)}`}>
                        {skill.proficiencyLabel || 'Comfortable'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        // Filtered Grid View
        <div className="skills-grid-catalog">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill._id || skill.name}
              className="skill-catalog-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
            >
              <div className="skill-card-top">
                <span className="skill-card-name">{skill.name}</span>
                <span className={`skill-badge-level ${getBadgeClass(skill.proficiencyLabel)}`}>
                  {skill.proficiencyLabel || 'Comfortable'}
                </span>
              </div>
            </motion.div>
          ))}
          {filteredSkills.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No skills found matching your filter criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
