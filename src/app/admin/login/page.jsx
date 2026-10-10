'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import '@/styles/Admin.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimited, setRateLimited] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setRateLimited(false);

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRateLimited(true);
        }
        setError(data.error || 'Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      // Successful login -> Hard navigate to ensure browser includes freshly set HTTP-Only cookie
      window.location.href = '/admin/dashboard';
    } catch {
      setError('A secure connection could not be established. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div 
      data-admin-theme="dark"
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--admin-bg)'
      }}
    >
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: 'var(--admin-card-bg)',
        border: '1px solid var(--admin-border)',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--admin-accent-glow)',
            color: 'var(--admin-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <ShieldCheck size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'var(--admin-text-main)' }}>
            Administrator Access
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
            Private authentication portal for portfolio management.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div 
            role="alert"
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: rateLimited ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${rateLimited ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.25)'}`,
              borderRadius: '8px',
              color: rateLimited ? '#fbbf24' : '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            {rateLimited ? <AlertTriangle size={18} /> : null}
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} noValidate>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="admin-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="Enter administrator email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Mail 
                size={16} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', pointerEvents: 'none' }} 
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="admin-input"
                style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Lock 
                size={16} 
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', pointerEvents: 'none' }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            {loading ? 'Verifying session...' : (
              <>
                Sign In to Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security Assurance Footer */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--admin-border)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--admin-text-muted)'
        }}>
          <span>Server-verified HTTP-Only authentication active.</span>
        </div>
      </div>
    </div>
  );
}
