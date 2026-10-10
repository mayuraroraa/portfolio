'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, 
  Sparkles, 
  Layers, 
  Mail, 
  Plus, 
  Database, 
  Activity 
} from 'lucide-react';

export default function AdminOverviewClient() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Stats loading error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
        Loading platform telemetry and database statistics...
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner / System Health */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1.25rem 1.5rem',
        background: 'var(--admin-card-bg)',
        border: '1px solid var(--admin-border)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--admin-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>Database Provider</div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--admin-text-main)' }}>
              {stats?.system?.database || 'MongoDB Resilient Layer'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="admin-badge admin-badge-success">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
            SYSTEM OPERATIONAL
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--font-tech)' }}>
            ENV: {stats?.system?.nodeEnv?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        {/* Projects */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>PORTFOLIO PROJECTS</span>
            <FolderGit2 size={18} />
          </div>
          <div className="admin-stat-value">{stats?.projects?.total ?? 0}</div>
          <div className="admin-stat-subtext">
            <span style={{ color: 'var(--admin-success)', fontWeight: '600' }}>
              {stats?.projects?.published ?? 0} published
            </span>
            {stats?.projects?.drafts > 0 && ` • ${stats.projects.drafts} drafts`}
          </div>
        </div>

        {/* Skills */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>SKILLS & TECHNOLOGIES</span>
            <Sparkles size={18} />
          </div>
          <div className="admin-stat-value">{stats?.skills?.total ?? 0}</div>
          <div className="admin-stat-subtext">
            Organized across {stats?.skills?.categories ?? 0} categories
          </div>
        </div>

        {/* Services */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>SERVICES OFFERED</span>
            <Layers size={18} />
          </div>
          <div className="admin-stat-value">{stats?.services?.total ?? 0}</div>
          <div className="admin-stat-subtext">
            {stats?.services?.published ?? 0} published services
          </div>
        </div>

        {/* Messages */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span>INQUIRY MESSAGES</span>
            <Mail size={18} />
          </div>
          <div className="admin-stat-value">{stats?.messages?.total ?? 0}</div>
          <div className="admin-stat-subtext">
            {stats?.messages?.unread > 0 ? (
              <span style={{ color: 'var(--admin-warning)', fontWeight: '700' }}>
                {stats.messages.unread} unread inquiry
              </span>
            ) : (
              <span style={{ color: 'var(--admin-success)' }}>Inbox all caught up</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Quick Content Actions</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/admin/projects" className="admin-btn admin-btn-primary">
            <Plus size={16} /> Add New Project
          </Link>
          <Link href="/admin/skills" className="admin-btn admin-btn-outline">
            <Plus size={16} /> Add Skill / Tech
          </Link>
          <Link href="/admin/services" className="admin-btn admin-btn-outline">
            <Plus size={16} /> Manage Services
          </Link>
          <Link href="/admin/profile" className="admin-btn admin-btn-outline">
            Edit Profile & Bio
          </Link>
          <Link href="/admin/messages" className="admin-btn admin-btn-outline">
            View Inquiries {stats?.messages?.unread > 0 && `(${stats.messages.unread})`}
          </Link>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={18} color="var(--admin-accent)" />
            <h2 className="admin-panel-title">Recent Administrative Activity</h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            Real-time server mutations
          </span>
        </div>

        {stats?.recentLogs && stats.recentLogs.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Actor</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLogs.map((log, idx) => (
                  <tr key={log._id || idx}>
                    <td>
                      <span className="admin-badge admin-badge-success" style={{ fontFamily: 'var(--font-tech)' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {log.resourceType} {log.resourceId && `(${log.resourceId})`}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{log.actorEmail}</td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-tech)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
            No recent administrative actions recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
