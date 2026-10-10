'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  User, 
  FileText, 
  Mail, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import '@/styles/Admin.css';

const NAV_ITEMS = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Skills & Tech', href: '/admin/skills', icon: Sparkles },
  { name: 'Services', href: '/admin/services', icon: Layers },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Profile & About', href: '/admin/profile', icon: User },
  { name: 'Site Content', href: '/admin/content', icon: FileText },
  { name: 'Contact Inbox', href: '/admin/messages', icon: Mail },
  { name: 'Settings & Security', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-admin-theme', savedTheme);

    // Fetch me
    fetch('/api/admin/auth/me')
      .then(res => {
        if (!res.ok) {
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        } else {
          return res.json();
        }
      })
      .then(data => {
        if (data?.user?.email) setUserEmail(data.user.email);
      })
      .catch(() => {});
  }, [pathname, router]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('admin_theme', nextTheme);
    document.documentElement.setAttribute('data-admin-theme', nextTheme);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  // If on login page, don't show the dashboard shell
  if (pathname === '/admin/login') {
    return <div className="admin-shell">{children}</div>;
  }

  return (
    <div className="admin-shell" data-admin-theme={theme}>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="admin-modal-backdrop" 
          style={{ zIndex: 45 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-badge">
            <span className="admin-logo-dot"></span>
            <span>MAYUR CMS</span>
          </div>
          <button 
            className="admin-icon-btn mobile-only" 
            style={{ display: sidebarOpen ? 'flex' : 'none' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav-links">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--admin-text-main)' }}>
              Administrator
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              {userEmail}
            </span>
          </div>
          <button className="admin-icon-btn" onClick={handleLogout} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              className="admin-icon-btn mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} />
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', fontFamily: 'var(--font-tech)' }}>
              CMS DASHBOARD / {pathname.replace('/admin', '').replace('/', '').toUpperCase() || 'OVERVIEW'}
            </span>
          </div>

          <div className="admin-topbar-right">
            <Link 
              href="/" 
              target="_blank" 
              className="admin-btn admin-btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <span>Live Site</span>
              <ExternalLink size={14} />
            </Link>

            <button 
              className="admin-icon-btn" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </header>

        <main className="admin-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
