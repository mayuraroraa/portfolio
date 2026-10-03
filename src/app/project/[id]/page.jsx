import React from 'react';
import PageTransition from '@/components/PageTransition';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    title: `Project: ${resolvedParams.id} | Mayur Arora`,
    description: `Details for project ${resolvedParams.id}`,
  };
}

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <PageTransition>
      <div className="container" style={{ paddingTop: '4rem' }}>
        <h1 className="display-large" style={{ marginBottom: '4rem' }}>
          Project: {id}
        </h1>
        <div style={{ color: 'var(--text-secondary)' }}>
          <p>Project details coming soon...</p>
        </div>
      </div>
    </PageTransition>
  );
}
