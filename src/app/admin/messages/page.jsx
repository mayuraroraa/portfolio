'use client';

import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Archive, Trash2, DollarSign, Briefcase } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        if (data.length > 0) {
          setSelectedMessage(prev => prev || data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadMessages();
        if (selectedMessage?._id === id) {
          setSelectedMessage(prev => ({ ...prev, status }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedMessage(null);
        loadMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Inquiry Messages Inbox</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Inbound client opportunities stored securely in MongoDB.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          Loading inquiries...
        </div>
      ) : messages.length === 0 ? (
        <div className="admin-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <Mail size={40} style={{ color: 'var(--admin-text-muted)', margin: '0 auto 1rem auto' }} />
          <h3>No inquiries received yet</h3>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Messages submitted via the contact form will appear here with instant read/unread management.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '1.5rem' }}>
          {/* List Column */}
          <div className="admin-panel" style={{ padding: '0.75rem', maxHeight: '75vh', overflowY: 'auto' }}>
            {messages.map((m) => (
              <div
                key={m._id}
                onClick={() => {
                  setSelectedMessage(m);
                  if (m.status === 'unread') updateStatus(m._id, 'read');
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: selectedMessage?._id === m._id ? 'var(--admin-card-hover)' : 'transparent',
                  border: selectedMessage?._id === m._id ? '1px solid var(--admin-border)' : '1px solid transparent',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: m.status === 'unread' ? '800' : '600', fontSize: '0.95rem' }}>
                    {m.name}
                  </span>
                  <span className={`admin-badge ${m.status === 'unread' ? 'admin-badge-warning' : 'admin-badge-success'}`}>
                    {m.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                  {m.email}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--font-tech)' }}>
                  {new Date(m.createdAt).toLocaleDateString()} • {m.projectType}
                </div>
              </div>
            ))}
          </div>

          {/* Details Column */}
          {selectedMessage ? (
            <div className="admin-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{selectedMessage.name}</h2>
                  <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--admin-accent)', fontSize: '0.9rem' }}>
                    {selectedMessage.email}
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {selectedMessage.status !== 'read' && (
                    <button className="admin-btn admin-btn-outline" onClick={() => updateStatus(selectedMessage._id, 'read')}>
                      <CheckCircle2 size={14} /> Mark Read
                    </button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <button className="admin-btn admin-btn-outline" onClick={() => updateStatus(selectedMessage._id, 'archived')}>
                      <Archive size={14} /> Archive
                    </button>
                  )}
                  <button className="admin-btn admin-btn-outline" onClick={() => handleDelete(selectedMessage._id)} title="Delete message">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.85rem', background: 'var(--admin-input-bg)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                    <Briefcase size={14} /> Project Scope
                  </div>
                  <div style={{ fontWeight: '700', marginTop: '0.25rem' }}>{selectedMessage.projectType || 'Not specified'}</div>
                </div>

                <div style={{ padding: '0.85rem', background: 'var(--admin-input-bg)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                    <DollarSign size={14} /> Budget Range
                  </div>
                  <div style={{ fontWeight: '700', marginTop: '0.25rem' }}>{selectedMessage.budget || 'Not specified'}</div>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label className="admin-form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Client Message
                </label>
                <div style={{
                  padding: '1.25rem',
                  background: 'var(--admin-input-bg)',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border)',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedMessage.message}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                {selectedMessage.ip && <span>Origin IP: {selectedMessage.ip}</span>}
              </div>
            </div>
          ) : (
            <div className="admin-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
              Select an inquiry from the list to view complete details.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
