import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const edgeTriggerRef = useRef<HTMLDivElement>(null);

  // Auto-show on desktop via hover; mobile uses isOpen from parent
  const isVisible = isOpen || hovered;

  const handleMouseEnterSidebar = useCallback(() => setHovered(true), []);
  const handleMouseLeaveSidebar = useCallback(() => setHovered(false), []);
  const handleEdgeEnter = useCallback(() => setHovered(true), []);

  // Close hovered state when route changes on mobile
  useEffect(() => {
    if (window.innerWidth <= 768 && onClose) {
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

      {/* Invisible edge trigger strip */}
      <div
        ref={edgeTriggerRef}
        className="sidebar-edge-trigger"
        onMouseEnter={handleEdgeEnter}
      />

      <aside
        ref={sidebarRef}
        className={`sidebar ${isVisible ? 'open' : ''}`}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
      >
        {/* Collapsed edge indicator (icons only, visible when sidebar is away) */}
        <div className="sidebar-collapsed-hint" aria-hidden="true">
          {menuItems.map((item) => (
            <span key={item.path} className="hint-icon">{item.icon}</span>
          ))}
        </div>

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
                  {isActive && <span className="nav-active-dot" />}
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
              <span className="logout-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
