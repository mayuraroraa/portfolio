import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Work', path: '/work', count: '4' },
    { name: 'Services', path: '/services', count: '2' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
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
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.name} {link.count && <span className="nav-count">[{link.count}]</span>}
          </Link>
        ))}
      </nav>

      <div className="navbar-action">
        <Link to="/contact" className="pill-btn pill-btn-dark">
          Contact Us <ArrowUpRight size={14} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
