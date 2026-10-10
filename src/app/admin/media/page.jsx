'use client';

import React, { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Copy, Check, ShieldCheck } from 'lucide-react';

export default function AdminMediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [altText, setAltText] = useState('');

  const loadMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', altText || file.name);

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to upload media asset.');
        setUploading(false);
        return;
      }

      setAltText('');
      loadMedia();
    } catch {
      setErrorMsg('Network error during file upload.');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (asset) => {
    if (asset.isProtected) {
      alert('This is a protected system hero asset and cannot be deleted.');
      return;
    }

    if (!confirm(`Delete media asset "${asset.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${asset._id || asset.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadMedia();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Media Library</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Store and manage thumbnails, mockups, and photos. Protected hero portrait assets are safeguarded.
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="admin-panel" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '2.5rem' }}>
        <UploadCloud size={40} style={{ color: 'var(--admin-accent)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Upload New Portfolio Media
        </h3>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
          PNG, JPEG, WebP, SVG supported up to 5MB. Files are verified for secure MIME types and saved with sanitized keys.
        </p>

        {errorMsg && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            maxWidth: '500px',
            margin: '0 auto 1rem auto'
          }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', maxWidth: '400px', margin: '0 auto' }}>
          <label className="admin-btn admin-btn-primary" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
            {uploading ? 'Uploading & Processing...' : 'Choose File to Upload'}
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              disabled={uploading}
              onChange={handleUpload} 
            />
          </label>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Asset Catalog ({media.length})</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Loading media assets...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.25rem'
          }}>
            {media.map((item) => (
              <div 
                key={item._id || item.id}
                style={{
                  background: 'var(--admin-sidebar-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ width: '100%', height: '140px', background: '#0a0a0a', position: 'relative' }}>
                  <img 
                    src={item.url} 
                    alt={item.altText || item.filename} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                  {item.isProtected && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      left: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.9)',
                      color: '#ffffff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <ShieldCheck size={12} /> PROTECTED HERO
                    </div>
                  )}
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.filename}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--font-tech)' }}>
                    {item.mimeType} • {item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : 'Local'}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <button 
                      className="admin-btn admin-btn-outline" 
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'center' }}
                      onClick={() => copyUrl(item.url, item._id || item.id)}
                    >
                      {copiedId === (item._id || item.id) ? (
                        <>
                          <Check size={12} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy URL
                        </>
                      )}
                    </button>

                    {!item.isProtected && (
                      <button 
                        className="admin-icon-btn" 
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handleDelete(item)}
                        title="Delete Asset"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
