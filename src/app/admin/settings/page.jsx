'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Key, Check, AlertCircle, Palette, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Appearance
  const [accentColor, setAccentColor] = useState('#A91520');
  const [appearanceSaved, setAppearanceSaved] = useState(false);

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setCurrentUser(d.user);
          setNewEmail(d.user.email);
        }
      })
      .catch(console.error);

    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => {
        if (d?.appearance?.accentColor) {
          setAccentColor(d.appearance.accentColor);
        }
      })
      .catch(console.error);
  }, []);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailErrorMsg('');
    setEmailSuccessMsg('');
    setUpdatingEmail(true);

    try {
      const res = await fetch('/api/admin/auth/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: emailCurrentPassword,
          newEmail
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setEmailErrorMsg(data.error || 'Failed to update email.');
        return;
      }

      setEmailSuccessMsg('Administrator login email updated successfully!');
      setEmailCurrentPassword('');
      setCurrentUser(prev => prev ? { ...prev, email: data.newEmail } : null);
      setTimeout(() => setEmailSuccessMsg(''), 4000);
    } catch {
      setEmailErrorMsg('Network error while updating email.');
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters in length.');
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update password.');
        setUpdating(false);
        return;
      }

      setSuccessMsg('Master password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setErrorMsg('Network error while updating password.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveAccent = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appearance: { accentColor }
        })
      });
      if (res.ok) {
        setAppearanceSaved(true);
        setTimeout(() => setAppearanceSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Platform Security & Settings</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Manage master credentials, active session parameters, and public visual tokens.
          </p>
        </div>
      </div>

      {/* Active Session Info */}
      <div className="admin-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <ShieldCheck size={20} color="var(--admin-success)" />
          <h2 className="admin-panel-title">Active Administrator Session</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', background: 'var(--admin-input-bg)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>Session Identity</div>
            <div style={{ fontWeight: '700', marginTop: '0.2rem' }}>{currentUser?.email || 'Authenticated Admin'}</div>
          </div>
          <div style={{ padding: '0.85rem', background: 'var(--admin-input-bg)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>Assigned Privilege</div>
            <div style={{ fontWeight: '700', marginTop: '0.2rem', textTransform: 'uppercase' }}>
              {currentUser?.role || 'superadmin'}
            </div>
          </div>
          <div style={{ padding: '0.85rem', background: 'var(--admin-input-bg)', borderRadius: '8px' }}>
            <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>Cookie Attributes</div>
            <div style={{ fontWeight: '700', marginTop: '0.2rem', fontFamily: 'var(--font-tech)' }}>
              HTTP-Only, SameSite=Lax
            </div>
          </div>
        </div>
      </div>

      {/* Change Login Email Panel */}
      <div className="admin-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Mail size={20} color="var(--admin-accent)" />
          <h2 className="admin-panel-title">Change Administrator Login Email</h2>
        </div>

        {emailSuccessMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--admin-success)',
            borderRadius: '8px',
            color: 'var(--admin-success)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} /> {emailSuccessMsg}
          </div>
        )}

        {emailErrorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--admin-danger)',
            borderRadius: '8px',
            color: 'var(--admin-danger)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} /> {emailErrorMsg}
          </div>
        )}

        <form onSubmit={handleEmailChange} style={{ maxWidth: '500px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">New Administrator Login Email</label>
            <input
              type="email"
              required
              className="admin-input"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Verify Current Password</label>
            <input
              type="password"
              required
              className="admin-input"
              value={emailCurrentPassword}
              onChange={(e) => setEmailCurrentPassword(e.target.value)}
              placeholder="Enter password to authorize email change"
            />
          </div>

          <button type="submit" disabled={updatingEmail} className="admin-btn admin-btn-primary" style={{ marginTop: '0.5rem' }}>
            <Mail size={15} /> {updatingEmail ? 'Updating Email...' : 'Update Login Email'}
          </button>
        </form>
      </div>

      {/* Change Password Panel */}
      <div className="admin-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Key size={20} color="var(--admin-accent)" />
          <h2 className="admin-panel-title">Change Master Password</h2>
        </div>

        {successMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--admin-success)',
            borderRadius: '8px',
            color: 'var(--admin-success)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--admin-danger)',
            borderRadius: '8px',
            color: 'var(--admin-danger)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ maxWidth: '500px' }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Current Password</label>
            <input
              type="password"
              required
              className="admin-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter existing password"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">New Password (min. 8 characters)</label>
            <input
              type="password"
              required
              className="admin-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Confirm New Password</label>
            <input
              type="password"
              required
              className="admin-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <button type="submit" disabled={updating} className="admin-btn admin-btn-primary" style={{ marginTop: '0.5rem' }}>
            <Lock size={15} /> {updating ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Appearance Customization */}
      <div className="admin-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Palette size={20} color="var(--admin-accent)" />
          <h2 className="admin-panel-title">Public Accent Color</h2>
        </div>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Customize the deep accent highlight used across buttons and badge states on the public portfolio.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '300px' }}>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            style={{ width: '45px', height: '40px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'transparent' }}
          />
          <input
            type="text"
            className="admin-input"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            style={{ fontFamily: 'var(--font-tech)' }}
          />
          <button className="admin-btn admin-btn-outline" onClick={handleSaveAccent}>
            Save
          </button>
        </div>
        {appearanceSaved && (
          <div style={{ color: 'var(--admin-success)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            Accent color preference saved!
          </div>
        )}
      </div>
    </div>
  );
}
