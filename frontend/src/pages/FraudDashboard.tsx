import React, { useState } from 'react';
import Card from '@components/Card';
import { useFraudAlerts } from '@hooks/useMockData';
import './FraudDashboard.css';
import { formatDateTime, formatCurrency } from '@utils/helpers';

const FraudDashboard: React.FC = () => {
  const [skip] = useState(0);
  const { data: fraudData, loading, error, updateAlertStatus } = useFraudAlerts({
    skip,
    limit: 20,
    refetchInterval: 10000,
  });

  const alerts = fraudData?.alerts || [];
  const unreadCount = fraudData?.unread_count || 0;

  const handleStatusChange = async (alertId: string, status: 'reviewed' | 'approved' | 'blocked') => {
    try {
      await updateAlertStatus(alertId, status);
      alert(`Alert marked as ${status}`);
    } catch (error) {
      console.error('Failed to update alert:', error);
      alert('Failed to update alert status');
    }
  };

  if (loading) {
    return <div className="loading">Loading fraud alerts...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Failed to load fraud alerts</p>
      </div>
    );
  }

  return (
    <div className="fraud-dashboard-page">
      <div className="page-header">
        <h1>Security & Fraud Monitoring</h1>
        <p>Review and resolve flagged transactions across your network.</p>
      </div>

      <Card title="Risk Overview" className="summary-card">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total Alerts</span>
            <span className="summary-value">{fraudData?.total || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending Review</span>
            <span className="summary-value">{unreadCount}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">High Risk</span>
            <span className="summary-value">{alerts.filter((a: any) => a.risk_level === 'high').length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Medium Risk</span>
            <span className="summary-value">{alerts.filter((a: any) => a.risk_level === 'medium').length}</span>
          </div>
        </div>
      </Card>

      <div className="alerts-container">
        {alerts.length > 0 ? (
          alerts.map((alert: any) => (
            <Card key={alert.id} className={`alert-card alert-${alert.risk_level}`}>
              <div className="alert-header">
                <div className="alert-info">
                  <h3>{alert.transaction_id}</h3>
                  <p className="alert-amount">
                    Amount: {formatCurrency(alert.amount || 0)}
                  </p>
                  <p className="alert-reason">{alert.reason}</p>
                  <p className="alert-timestamp">{formatDateTime(alert.created_at)}</p>
                </div>
                <div className="alert-actions">
                  <select
                    value={alert.status || 'pending'}
                    onChange={(e) => handleStatusChange(alert.id, e.target.value as any)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <span className={`risk-badge risk-${alert.risk_level}`}>
                    {alert.risk_level?.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="empty-card">
            <p className="empty-message">No suspicious activity detected. All systems normal.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FraudDashboard;
