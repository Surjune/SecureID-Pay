import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Payments', path: '/payments', icon: '💳' },
  { label: 'Lending', path: '/lending', icon: '🏦' },
  { label: 'Insights', path: '/insights', icon: '📈' },
  { label: 'Fraud Detection', path: '/fraud', icon: '🚨' },
  { label: 'Profile', path: '/profile', icon: '👤' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Auto-show on desktop via hover if viewport is medium-ish; mobile uses isOpen
  const isVisible = isOpen || hovered;

  // Handles closing on mobile when route changes
  useEffect(() => {
    if (window.innerWidth <= 1100 && onClose) {
      onClose();
    }
    setHovered(false);
  }, [location.pathname]);

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Edge trigger strip for desktop hover-to-reveal */}
      <div
        className="sidebar-edge-trigger"
        onMouseEnter={() => setHovered(true)}
      />

      <aside
        ref={sidebarRef}
        className={`sidebar ${isVisible ? 'open' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="sidebar-inner">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon">💎</div>
              <div className="logo-text">
                <span className="logo-name">SecureID</span>
                <span className="logo-sub">Pay</span>
              </div>
            </div>
            <button className="close-btn" onClick={onClose} aria-label="Close menu">
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav" role="navigation">
            {menuItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">JD</div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Premium Account</span>
              </div>
            </div>
            <button className="logout-btn">
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
