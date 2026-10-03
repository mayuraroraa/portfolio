import React from 'react';
import PageTransition from '@/components/PageTransition';

export const metadata = {
  title: 'Video Editing | Mayur Arora',
  description: 'Video editing portfolio of Mayur Arora.',
};

export default function VideoPage() {
  return (
    <PageTransition>
      <div className="container" style={{ paddingTop: '4rem' }}>
        <h1 className="display-large" style={{ marginBottom: '4rem' }}>
          /VIDEO EDITING
        </h1>
        <div style={{ color: 'var(--text-secondary)' }}>
          <p>Video portfolio coming soon...</p>
        </div>
      </div>
    </PageTransition>
  );
}
