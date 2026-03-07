import React from 'react';
import Card from '@components/Card';
import SpendingInsightsWidget from '@components/SpendingInsightsWidget';
import { useDashboardStats } from '@hooks/useMockData';
import './Insights.css';

const Insights: React.FC = () => {
  const { data: dashboardData, loading, error, refetch } = useDashboardStats({
    refetchInterval: 20000,
  });

  if (loading) {
    return <div className="loading">Loading insights...</div>;
  }

  if (error || !dashboardData) {
    return (
      <div className="error">
        <p>Failed to load insights</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  const insights = {
    userId: 'demo-user',
    totalSpending: dashboardData.total_volume || 0,
    categoryBreakdown: {
      'Payments': dashboardData.total_volume || 0
    },
    averageDailySpend: (dashboardData.total_volume || 0) / 30,
    trend: 'increasing' as const,
  };

  const financialScore = Math.min(10, (dashboardData.transaction_count || 0) / 10);

  return (
    <div className="insights-page">
      <div className="page-header">
        <h1>Spending & Returns</h1>
        <p>Track where your money goes and discover optimization opportunities.</p>
      </div>

      <div className="insights-container">
        <div className="main-widget">
          <SpendingInsightsWidget insights={insights} />
        </div>

        <div className="side-cards">
          <Card title="Monthly Summary" className="tips-card">
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">📊</span>
                <p>Total Transactions: {dashboardData.transaction_count || 0}</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🚨</span>
                <p>Fraud Alerts: {dashboardData.fraud_alerts_count || 0}</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">⚠️</span>
                <p>High Risk: {dashboardData.risk_distribution?.high || 0}</p>
              </div>
              <div className="tip-item">
                <span className="tip-icon">✅</span>
                <p>Low Risk: {dashboardData.risk_distribution?.low || 0}</p>
              </div>
            </div>
          </Card>

          <Card title="Financial Health Score" className="score-card">
            <div className="financial-score">
              <div className="score-circle">
                <span className="score-number">{financialScore.toFixed(1)}</span>
                <span className="score-label">/10</span>
              </div>
              <p className="score-message">Based on your recent transaction history</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Insights;
