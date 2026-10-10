import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Code2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { getPublishedProjectBySlug } from '@/lib/db/repositories/projectsRepo';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const project = await getPublishedProjectBySlug(resolvedParams.id);

  if (!project) {
    return {
      title: 'Project Not Found | Mayur Arora',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} | Mayur Arora`,
    description: project.shortDescription || project.description,
    openGraph: {
      title: `${project.title} | Mayur Arora`,
      description: project.shortDescription,
      images: [project.thumbnailUrl || '/assets/hero.png'],
    }
  };
}

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const project = await getPublishedProjectBySlug(resolvedParams.id);

  if (!project) {
    return (
      <PageTransition>
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
          <h1 className="display-large" style={{ marginBottom: '1.5rem' }}>PROJECT NOT FOUND</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            The project "{resolvedParams.id}" does not exist or may have been unpublished.
          </p>
          <Link href="/work" className="pill-btn pill-btn-dark">
            <ArrowLeft size={16} /> Return to Works
          </Link>
        </div>
      </PageTransition>
    );
  }

  const imageSrc = project.thumbnailUrl || (project.image?.src || project.image);

  return (
    <PageTransition>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '8rem' }}>
        {/* Back Link */}
        <Link 
          href="/work" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--text-secondary)', 
            fontSize: '0.875rem', 
            marginBottom: '3rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to all projects
        </Link>

        {/* Project Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{
              background: 'var(--text-primary)',
              color: 'var(--card-bg)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              {project.category}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-tech)' }}>
              RELEASED {project.year}
            </span>
          </div>

          <h1 className="display-large" style={{ textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            {project.title}
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: '1.6' }}>
            {project.shortDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '4rem' }}>
          {project.liveUrl && project.liveUrl !== '#' && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="pill-btn pill-btn-dark"
            >
              Launch Live Experience <ArrowUpRight size={16} />
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="pill-btn pill-btn-outline"
            >
              <Code2 size={16} /> Source Code
            </a>
          )}
        </div>

        {/* Hero Image Showcase */}
        {imageSrc && (
          <div style={{
            width: '100%',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            backgroundColor: '#111',
            boxShadow: 'var(--shadow-floating)',
            marginBottom: '4rem',
            maxHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={imageSrc} 
              alt={project.title} 
              style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain' }} 
            />
          </div>
        )}

        {/* Technical Overview & Details */}
        <div className="project-details-grid">
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              Project Overview & Architecture
            </h2>
            <div style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap'
            }}>
              {project.description}
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Technology Stack
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {(project.technologies || []).map((tech, i) => (
                <span 
                  key={i} 
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    fontFamily: 'var(--font-tech)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div>Category: <strong style={{ color: 'var(--text-primary)' }}>{project.category}</strong></div>
              <div>Timeline: <strong style={{ color: 'var(--text-primary)' }}>{project.year}</strong></div>
              <div>Status: <strong style={{ color: 'var(--text-primary)' }}>Production Ready</strong></div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
