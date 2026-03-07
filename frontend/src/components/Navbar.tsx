import React, { useState } from 'react';
import { useNotifications } from '@hooks/useMockData';
import './Navbar.css';

interface NavbarProps {
  onMenuClick: () => void;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, userEmail }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: notificationData, refetch: refetchNotifications } = useNotifications({
    skip: 0,
    limit: 20,
    unreadOnly: true,
    refetchInterval: 10000,
  });

  const unreadCount = notificationData?.unread_count || 0;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <h2 className="navbar-title">SecureID-Pay</h2>
      </div>

      <div className="navbar-right">
        <div className="notification-menu">
          <button 
            className="notification-btn" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
              if (!showNotifications) refetchNotifications();
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
              </div>
              <div className="notification-list">
                {notificationData?.notifications && notificationData.notifications.length > 0 ? (
                  notificationData.notifications.map((notif: any) => (
                    <div key={notif.id} className={`notification-item ${notif.status === 'unread' ? 'unread' : ''}`}>
                      <div className="notification-icon">
                        {notif.type === 'fraud' ? '🔴' : notif.type === 'payment' ? '💸' : notif.type === 'security' ? '🛡️' : '🔔'}
                      </div>
                      <div className="notification-content">
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-time">{notif.time || 'Just now'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">You have no new notifications.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-menu">
          <button
            className="profile-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            👤
          </button>
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <p className="user-email">{userEmail || 'demo@secureid.com'}</p>
              </div>
              <a href="/profile" className="dropdown-item">Profile</a>
              <button className="dropdown-item logout-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
