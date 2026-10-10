'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star, X, Search } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    year: '2024',
    technologies: 'React, Next.js, CSS',
    thumbnailUrl: '/assets/golden-earth-school/assets/images/Gemini_Generated_Image_zc9rrazc9rrazc9r - Removed.png',
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    status: 'published',
    sortOrder: 1
  });

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setForm({
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: 'Web Development',
      year: new Date().getFullYear().toString(),
      technologies: 'React, TypeScript, CSS',
      thumbnailUrl: '/assets/solo-leveling-todolist/solo-leveling-mockup.png',
      liveUrl: '#',
      githubUrl: '#',
      featured: false,
      status: 'published',
      sortOrder: projects.length + 1
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      category: p.category || 'Web Development',
      year: p.year || '2024',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : (p.technologies || ''),
      thumbnailUrl: p.thumbnailUrl || (p.image?.src || p.image) || '',
      liveUrl: p.liveUrl || '#',
      githubUrl: p.githubUrl || '#',
      featured: Boolean(p.featured),
      status: p.status || 'published',
      sortOrder: p.sortOrder || 1
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder),
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const url = editingProject 
        ? `/api/admin/projects/${editingProject._id || editingProject.id}` 
        : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to save project');
        setSubmitting(false);
        return;
      }

      setIsModalOpen(false);
      loadProjects();
    } catch {
      setErrorMsg('Network error while saving project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Are you sure you want to delete "${p.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.id}`, { method: 'DELETE' });
      if (res.ok) {
        loadProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Projects Management</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Manage public portfolio works, drafts, technologies, and live URLs without Git commits.
          </p>
        </div>

        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            className="admin-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search projects by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="admin-panel">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading projects from MongoDB...
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Thumbnail</th>
                  <th>Title & Slug</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => {
                  const img = p.thumbnailUrl || (p.image?.src || p.image);
                  return (
                    <tr key={p._id || p.id}>
                      <td style={{ fontFamily: 'var(--font-tech)', width: '60px' }}>
                        #{p.sortOrder || 1}
                      </td>
                      <td style={{ width: '80px' }}>
                        <div style={{ width: '60px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#222' }}>
                          <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '700' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--font-tech)' }}>
                          /project/{p.slug || p.id}
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <span className={`admin-badge ${p.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                          {p.status || 'published'}
                        </span>
                      </td>
                      <td>
                        {p.featured ? (
                          <Star size={16} fill="var(--admin-warning)" color="var(--admin-warning)" />
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)' }}>—</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="admin-icon-btn" onClick={() => openEditModal(p)} title="Edit Project">
                            <Edit2 size={15} />
                          </button>
                          <button className="admin-icon-btn" onClick={() => handleDelete(p)} title="Delete Project">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            No projects found matching your search.
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button className="admin-icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Project Title</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Modern E-Commerce Platform"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">URL Slug</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. modern-ecommerce"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Category</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Web Development"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Year</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Sort Order</label>
                  <input
                    type="number"
                    required
                    className="admin-input"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Technologies (comma separated)</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="React, Next.js, Node.js, MongoDB"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Thumbnail URL or Asset Path</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  placeholder="/assets/golden-earth-school/assets/images/... or https://"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Live Demo URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Source Code (GitHub) URL</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Short Description (for cards)</label>
                <textarea
                  rows={2}
                  required
                  className="admin-textarea"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Brief summary shown on project card..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Detailed Description (for project detail page)</label>
                <textarea
                  rows={4}
                  required
                  className="admin-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Comprehensive technical deep-dive, architecture decisions, and features..."
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <span>Feature on Homepage</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>Status:</span>
                  <select
                    className="admin-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="admin-btn admin-btn-primary">
                  {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
