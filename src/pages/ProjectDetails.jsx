import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails = () => {
  const { id } = useParams();

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <h1 className="display-large" style={{ marginBottom: '4rem' }}>
        Project: {id}
      </h1>
      <div style={{ color: 'var(--text-secondary)' }}>
        <p>Project details coming soon...</p>
      </div>
    </div>
  );
};

export default ProjectDetails;
