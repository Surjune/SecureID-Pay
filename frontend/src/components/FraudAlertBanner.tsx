import React from 'react';
import './FraudAlertBanner.css';

interface FraudAlertBannerProps {
  riskLevel: 'low' | 'medium' | 'high';
  message: string;
  onDismiss?: () => void;
}

const FraudAlertBanner: React.FC<FraudAlertBannerProps> = ({
  riskLevel,
  message,
  onDismiss,
}) => {
  const icons = {
    low: '✓',
    medium: '⚠',
    high: '🚨',
  };

  return (
    <div className={`fraud-alert fraud-alert-${riskLevel}`}>
      <div className="alert-content">
        <span className="alert-icon">{icons[riskLevel]}</span>
        <div className="alert-text">
          <p className="alert-title">
            {riskLevel === 'low' && 'Low Risk'}
            {riskLevel === 'medium' && 'Medium Risk Alert'}
            {riskLevel === 'high' && 'High Risk Alert'}
          </p>
          <p className="alert-message">{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button className="dismiss-btn" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
};

export default FraudAlertBanner;
