import React from 'react';
import Card from '@components/Card';
import TransactionList from '@components/TransactionList';
import FraudAlertBanner from '@components/FraudAlertBanner';
import SpendingInsightsWidget from '@components/SpendingInsightsWidget';
import { useDashboardStats, useRealTimeUpdates } from '@hooks/useMockData';
import './Dashboard.css';
import { formatCurrency } from '@utils/helpers';

const Dashboard: React.FC = () => {
  const { data: dashboardData, loading, error, refetch } = useDashboardStats({
    refetchInterval: 15000,
  });

  useRealTimeUpdates(true, 15000);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your financial data...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Load Dashboard</h3>
        <p>Something went wrong while fetching your recent activity.</p>
        <button className="retry-btn" onClick={refetch}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div className="header-main">
          <h1>Financial Overview</h1>
          <p className="header-subtitle">Welcome back! Here's a summary of your activity from the last 30 days.</p>
        </div>
        <div className="header-actions">
           <button className="refresh-btn" onClick={refetch}>Refresh Data</button>
        </div>
      </header>

      {dashboardData.risk_distribution && dashboardData.risk_distribution.high > 0 && (
        <section className="alerts-section">
          <FraudAlertBanner
            riskLevel="high"
            message={`Urgent: We've identified ${dashboardData.risk_distribution.high} transactions that require your review for potential fraud.`}
          />
        </section>
      )}

      <section className="metrics-grid">
        <Card title="Total Volume" className="metric-card volume">
          <div className="metric-value">{formatCurrency(dashboardData.total_volume || 0)}</div>
          <p className="metric-label">Aggregated funds processed this month</p>
        </Card>

        <Card title="Transaction Count" className="metric-card count">
          <div className="metric-value">{dashboardData.transaction_count || 0}</div>
          <p className="metric-label">Total number of verified transfers</p>
        </Card>

        <Card title="Security Alerts" className="metric-card security">
          <div className="metric-value danger-text">{dashboardData.fraud_alerts_count || 0}</div>
          <p className="metric-label">Flagged events needing attention</p>
        </Card>

        <Card title="Monitoring" className="metric-card status">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            <span className="status-text">Live Guard Active</span>
          </div>
          <p className="metric-label">Continuous fraud protection is on</p>
        </Card>
      </section>

      <div className="dashboard-layout">
        <main className="recent-activity">
          <Card title="Recent Transactions">
            {dashboardData.recent_transactions && dashboardData.recent_transactions.length > 0 ? (
              <TransactionList transactions={dashboardData.recent_transactions} />
            ) : (
              <div className="empty-transactions">
                <p>No recent transactions recorded.</p>
              </div>
            )}
          </Card>
        </main>

        <aside className="insights-panel">
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
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
