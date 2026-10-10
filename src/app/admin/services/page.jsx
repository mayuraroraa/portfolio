'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    icon: 'Layers',
    status: 'published',
    sortOrder: 1
  });

  const loadServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setForm({
      title: '',
      slug: '',
      description: '',
      icon: 'Layers',
      status: 'published',
      sortOrder: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingService(s);
    setForm({
      title: s.title || '',
      slug: s.slug || '',
      description: s.description || '',
      icon: s.icon || 'Layers',
      status: s.status || 'published',
      sortOrder: s.sortOrder || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingService 
        ? `/api/admin/services/${editingService._id || editingService.id}` 
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setIsModalOpen(false);
        loadServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm(`Delete service "${s.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services/${s._id || s.id}`, { method: 'DELETE' });
      if (res.ok) loadServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Services Management</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Configure developer & creative offerings displayed on the homepage and /services route.
          </p>
        </div>

        <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="admin-panel">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading services...
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Service Title</th>
                  <th>Description</th>
                  <th>Icon</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id || s.id}>
                    <td style={{ fontFamily: 'var(--font-tech)' }}>#{s.sortOrder || 1}</td>
                    <td style={{ fontWeight: '700' }}>{s.title}</td>
                    <td style={{ maxWidth: '400px', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                      {s.description}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-success">{s.icon || 'Layers'}</span>
                    </td>
                    <td>
                      <span className={`admin-badge ${s.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                        {s.status || 'published'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-icon-btn" onClick={() => openEditModal(s)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="admin-icon-btn" onClick={() => handleDelete(s)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button className="admin-icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Service Title</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Full-Stack Development"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Icon Identifier</label>
                <select
                  className="admin-select"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                >
                  <option value="Layers">Layers</option>
                  <option value="Video">Video</option>
                  <option value="Code">Code</option>
                  <option value="Laptop">Laptop</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Service Description</label>
                <textarea
                  rows={4}
                  required
                  className="admin-textarea"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Explain what value you deliver for this service..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Sort Order</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Status</label>
                  <select
                    className="admin-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
