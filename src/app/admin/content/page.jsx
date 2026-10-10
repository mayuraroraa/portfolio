'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Globe } from 'lucide-react';

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    siteTitle: 'Mayur Arora | Full-Stack Developer & Builder',
    siteDescription: '17-year-old full-stack developer building digital products, web applications, and AI experiences that are clear, robust, and highly functional.',
    contactHeading: 'HAVE A PROJECT IN MIND?',
    contactSubtext: "Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone."
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setForm({
            siteTitle: data.siteTitle || '',
            siteDescription: data.siteDescription || '',
            contactHeading: data.contactHeading || 'HAVE A PROJECT IN MIND?',
            contactSubtext: data.contactSubtext || "Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone."
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
        Loading site content & SEO configuration...
      </div>
    );
  }

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Site Content & SEO</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Configure global website metadata, contact page messaging, and search indexing parameters.
          </p>
        </div>
      </div>

      {success && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid var(--admin-success)',
          borderRadius: '8px',
          color: 'var(--admin-success)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={16} /> Content and metadata updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Globe size={18} color="var(--admin-accent)" />
            <h2 className="admin-panel-title">Search Engine & Social Metadata</h2>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">SEO Page Title Tag</label>
            <input
              type="text"
              required
              className="admin-input"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Meta Description</label>
            <textarea
              rows={3}
              required
              className="admin-textarea"
              value={form.siteDescription}
              onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-panel">
          <h2 className="admin-panel-title" style={{ marginBottom: '1rem' }}>Contact Section Messaging</h2>
          <div className="admin-form-group">
            <label className="admin-form-label">Contact Heading Title</label>
            <input
              type="text"
              required
              className="admin-input"
              value={form.contactHeading}
              onChange={(e) => setForm({ ...form, contactHeading: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Contact Subtitle Narrative</label>
            <textarea
              rows={3}
              required
              className="admin-textarea"
              value={form.contactSubtext}
              onChange={(e) => setForm({ ...form, contactSubtext: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: '0.8rem 2rem' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Update Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
