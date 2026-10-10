'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, ShieldCheck } from 'lucide-react';

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    heroRoleTitle: 'Full-Stack Developer',
    heroHeadline: 'MAYUR ARORA',
    heroBio: '17-year-old developer building digital products and AI experiences that are clear, robust, and highly functional.',
    publicContactEmail: 'mayuraroraa@gmail.com',
    aboutSubtitle: 'I build ideas from the interface to the infrastructure.',
    aboutBioParagraphs: '',
    socialLinks: {
      whatsapp: 'https://wa.me/+918360825752',
      email: 'mayuraroraa@gmail.com',
      instagram: 'https://www.instagram.com/mayurraroraa/',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setForm({
            heroRoleTitle: data.heroRoleTitle || 'Full-Stack Developer',
            heroHeadline: data.heroHeadline || 'MAYUR ARORA',
            heroBio: data.heroBio || '',
            publicContactEmail: data.publicContactEmail || '',
            aboutSubtitle: data.aboutSubtitle || '',
            aboutBioParagraphs: Array.isArray(data.aboutBioParagraphs) 
              ? data.aboutBioParagraphs.join('\n\n') 
              : (data.aboutBioParagraphs || ''),
            socialLinks: {
              whatsapp: data.socialLinks?.whatsapp || '',
              email: data.socialLinks?.email || '',
              instagram: data.socialLinks?.instagram || '',
              github: data.socialLinks?.github || '',
              linkedin: data.socialLinks?.linkedin || ''
            }
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMsg('');

    const payload = {
      ...form,
      aboutBioParagraphs: form.aboutBioParagraphs
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const d = await res.json();
        setErrorMsg(d.error || 'Failed to update profile.');
        setSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setErrorMsg('Network error while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Loading profile...</div>;
  }

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Developer Profile & Bio</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Modify homepage hero narrative, about story, and social connectivity.
          </p>
        </div>
      </div>

      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
        color: 'var(--admin-text-main)'
      }}>
        <ShieldCheck size={20} color="var(--admin-success)" />
        <span>
          <strong>Asset Integrity Protected:</strong> Editing biography, headlines, and links preserves your exact hero portrait and interactive reveal mask.
        </span>
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
          <Check size={16} /> Profile updated and live caches revalidated successfully!
        </div>
      )}

      {errorMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid var(--admin-danger)',
          borderRadius: '8px',
          color: 'var(--admin-danger)',
          marginBottom: '1.5rem'
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-panel">
          <h2 className="admin-panel-title" style={{ marginBottom: '1.25rem' }}>Hero Introduction</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Hero Headline</label>
              <input
                type="text"
                required
                className="admin-input"
                value={form.heroHeadline}
                onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Role Title</label>
              <input
                type="text"
                required
                className="admin-input"
                value={form.heroRoleTitle}
                onChange={(e) => setForm({ ...form, heroRoleTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Hero Short Bio</label>
            <textarea
              rows={3}
              required
              className="admin-textarea"
              value={form.heroBio}
              onChange={(e) => setForm({ ...form, heroBio: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-panel">
          <h2 className="admin-panel-title" style={{ marginBottom: '1.25rem' }}>About Section Story</h2>
          <div className="admin-form-group">
            <label className="admin-form-label">About Subtitle</label>
            <input
              type="text"
              required
              className="admin-input"
              value={form.aboutSubtitle}
              onChange={(e) => setForm({ ...form, aboutSubtitle: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Bio Paragraphs (separate paragraphs with blank line)</label>
            <textarea
              rows={6}
              required
              className="admin-textarea"
              value={form.aboutBioParagraphs}
              onChange={(e) => setForm({ ...form, aboutBioParagraphs: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-panel">
          <h2 className="admin-panel-title" style={{ marginBottom: '1.25rem' }}>Social Connectivity & Direct Inquiries</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Public Email Address</label>
              <input
                type="email"
                required
                className="admin-input"
                value={form.publicContactEmail}
                onChange={(e) => setForm({ ...form, publicContactEmail: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">WhatsApp Contact Link</label>
              <input
                type="text"
                className="admin-input"
                value={form.socialLinks.whatsapp}
                onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, whatsapp: e.target.value } })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Instagram Profile</label>
              <input
                type="text"
                className="admin-input"
                value={form.socialLinks.instagram}
                onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">GitHub Profile</label>
              <input
                type="text"
                className="admin-input"
                value={form.socialLinks.github}
                onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: '0.8rem 2rem' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
