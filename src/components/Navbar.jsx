'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work', count: '4' },
    { name: 'Services', path: '/services', count: '2' },
    { name: 'About', path: '/about' }
  ];

  return (
    <header className="navbar container">
      <div className="navbar-status">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>Available for New Project</span>
        </div>
      </div>

      <nav className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`nav-link ${pathname === link.path ? 'active' : ''}`}
          >
            {link.name} {link.count && <span className="nav-count">[{link.count}]</span>}
          </Link>
        ))}
      </nav>

      <div className="navbar-action">
        <Link href="/contact" className="pill-btn pill-btn-dark">
          Contact Us <ArrowUpRight size={14} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
