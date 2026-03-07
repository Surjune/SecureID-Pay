import React from 'react';
import Card from '@components/Card';
import TransactionList from '@components/TransactionList';
import FraudAlertBanner from '@components/FraudAlertBanner';
import SpendingInsightsWidget from '@components/SpendingInsightsWidget';
import { useDashboardStats, useRealTimeUpdates } from '@hooks/useMockData';
import './Dashboard.css';
import { formatCurrency } from '@utils/helpers';

const Dashboard: React.FC = () => {
  // Fetch dashboard stats with 15-second auto-refresh
  const { data: dashboardData, loading, error, refetch } = useDashboardStats({
    refetchInterval: 15000,
  });

  // Enable real-time simulation updates
  useRealTimeUpdates(true, 15000);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error || !dashboardData) {
    return (
      <div className="error">
        <p>Failed to load dashboard</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Here's what's happening with your accounts today.</p>
      </div>

      {dashboardData.risk_distribution && dashboardData.risk_distribution.high > 0 && (
        <div className="alerts-container">
          <FraudAlertBanner
            riskLevel="high"
            message={`${dashboardData.risk_distribution.high} suspicious transactions require your immediate attention.`}
          />
        </div>
      )}

      <div className="dashboard-grid">
        <Card title="Transaction Volume" className="balance-card">
          <p className="balance-amount">
            {formatCurrency(dashboardData.total_volume || 0)}
          </p>
          <p className="card-subtext">Total volume over the last 30 days</p>
        </Card>

        <Card title="Transactions" className="score-card">
          <p className="credit-score">{dashboardData.transaction_count || 0}</p>
          <p className="score-label">Total processed this month</p>
        </Card>

        <Card title="Suspicious Activity" className="loans-card">
          <p className="active-loans">{dashboardData.fraud_alerts_count || 0}</p>
          <p className="loans-label">Flagged transactions to review</p>
        </Card>

        <Card title="System Status" className="status-card">
          <p className="status-badge verified">✓ Active & Monitoring</p>
          <p className="status-label">Fraud detection system</p>
        </Card>
      </div>

      <div className="dashboard-content">
        <div className="left-section">
          <Card title="Recent Transactions">
            {dashboardData.recent_transactions && dashboardData.recent_transactions.length > 0 ? (
              <TransactionList transactions={dashboardData.recent_transactions} />
            ) : (
              <p className="empty-state">No transactions yet</p>
            )}
          </Card>
        </div>

        <div className="right-section">
          {dashboardData.trends && (
            <SpendingInsightsWidget
              insights={{
                userId: 'demo-user',
                totalSpending: dashboardData.total_volume || 0,
                categoryBreakdown: {
                  'Payments': dashboardData.total_volume || 0
                },
                averageDailySpend: (dashboardData.total_volume || 0) / 30,
                trend: 'increasing'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
