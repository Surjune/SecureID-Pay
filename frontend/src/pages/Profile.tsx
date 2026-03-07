import React, { useState, useEffect } from 'react';
import Card from '@components/Card';
import { authService } from '@services/api';
import type { User } from '../types/index';
import './Profile.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phone: response.data.phone,
      });
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    alert('Profile update not yet implemented');
    setEditMode(false);
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">Failed to load profile</div>;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your personal information and security preferences.</p>
      </div>

      <div className="profile-container">
        <Card className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">{user.firstName.charAt(0)}</div>
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="user-email">{user.email}</p>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Email</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone</span>
              <span className="value">{user.phone}</span>
            </div>
            <div className="detail-item">
              <span className="label">Income Type</span>
              <span className="value">{user.incomeType === 'stable' ? 'Stable Income' : 'Variable Income'}</span>
            </div>
            <div className="detail-item">
              <span className="label">KYC Status</span>
              <span className={`status ${user.kyc_verified ? 'verified' : 'unverified'}`}>
                {user.kyc_verified ? '✓ Verified' : 'Pending Verification'}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Member Since</span>
              <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>

          {editMode && (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn">Save Changes</button>
            </form>
          )}
        </Card>

        <Card title="Security Settings" className="settings-card">
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Password</h4>
                <p>Change your password</p>
              </div>
              <button className="action-btn">Update</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Two-Factor Authentication</h4>
                <p>Enhance your account security</p>
              </div>
              <button className="action-btn">{user.kyc_verified ? 'Enabled' : 'Enable'}</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Login Activity</h4>
                <p>Review your recent activity</p>
              </div>
              <button className="action-btn">View</button>
            </div>
          </div>
        </Card>
      </div>

      <div className="danger-zone">
        <Card className="danger-card">
          <h3>Account Deletion</h3>
          <p>Permanently remove your account and all associated data. This action cannot be reversed.</p>
          <button className="logout-btn">Logout</button>
          <button className="delete-btn">Delete Account</button>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
