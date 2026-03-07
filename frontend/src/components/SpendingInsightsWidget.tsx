import React from 'react';

interface SpendingInsights {
  userId: string;
  totalSpending: number;
  categoryBreakdown: Record<string, number>;
  averageDailySpend: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface SpendingInsightsWidgetProps {
  insights: SpendingInsights;
}

import './SpendingInsightsWidget.css';
import { formatCurrency } from '@utils/helpers';

const SpendingInsightsWidget: React.FC<SpendingInsightsWidgetProps> = ({ insights }) => {
  const trendEmoji = {
    increasing: '📈',
    stable: '→',
    decreasing: '📉',
  };

  return (
    <div className="spending-widget">
      <div className="widget-header">
        <h3>Spending Insights</h3>
        <span className={`trend-indicator trend-${insights.trend}`}>
          {trendEmoji[insights.trend]}
        </span>
      </div>

      <div className="spending-stats">
        <div className="stat">
          <p className="stat-label">Total Spending</p>
          <p className="stat-value">{formatCurrency(insights.totalSpending)}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Daily Average</p>
          <p className="stat-value">{formatCurrency(insights.averageDailySpend)}</p>
        </div>
        <div className="stat">
          <p className="stat-label">Trend</p>
          <p className="stat-value capitalize">{insights.trend}</p>
        </div>
      </div>

      <div className="categories">
        <h4>Category Breakdown</h4>
        {Object.entries(insights.categoryBreakdown).map(([category, amount]) => (
          <div key={category} className="category-item">
            <span className="category-name">{category}</span>
            <div className="category-bar">
              <div 
                className="category-fill" 
                style={{
                  width: `${(amount / insights.totalSpending) * 100}%`
                }}
              />
            </div>
            <span className="category-amount">{formatCurrency(amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingInsightsWidget;
