import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@hooks/useMockData';
import './Navbar.css';

interface NavbarProps {
  onMenuClick: () => void;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, userEmail }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: notificationData, refetch: refetchNotifications } = useNotifications({
    skip: 0,
    limit: 20,
    unreadOnly: true,
    refetchInterval: 15000,
  });

  const unreadCount = notificationData?.unread_count || 0;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={dropdownRef}>
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle Menu">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="navbar-brand">
          <span className="brand-logo">💎</span>
          <h2 className="navbar-title">SecureID-Pay</h2>
        </div>
      </div>

      <div className="navbar-right">
        <div className="notification-menu">
          <button 
            className={`nav-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
              if (!showNotifications) refetchNotifications();
            }}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          
          <div className={`notification-dropdown ${showNotifications ? 'open' : ''}`}>
            <div className="notification-header">
              <h3>Notifications</h3>
              <span className="unread-dot-label">{unreadCount} Unread</span>
            </div>
            <div className="notification-list">
              {notificationData?.notifications && notificationData.notifications.length > 0 ? (
                notificationData.notifications.map((notif: any) => (
                  <div key={notif.id} className={`notification-item ${notif.status === 'unread' ? 'unread' : ''}`}>
                    <div className="notification-icon-wrapper">
                      {notif.type === 'fraud' ? '🚨' : notif.type === 'payment' ? '💳' : '🔔'}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notif.message}</p>
                      <span className="notification-time">{notif.time || 'Just now'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-notifications">
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
            <div className="notification-footer">
              <button className="view-all-btn">View All Notifications</button>
            </div>
          </div>
        </div>

        <div className="profile-menu">
          <button
            className={`profile-btn-trigger ${showProfile ? 'active' : ''}`}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            aria-label="User Profile"
          >
            <div className="avatar-small">JD</div>
            <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div className={`profile-dropdown-menu ${showProfile ? 'open' : ''}`}>
            <div className="profile-dropdown-header">
              <p className="user-email-label">Logged in as</p>
              <p className="user-email-value">{userEmail || 'demo@secureid.com'}</p>
            </div>
            <div className="profile-dropdown-links">
              <a href="/profile" className="dropdown-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Account Settings
              </a>
              <button className="dropdown-link logout-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
