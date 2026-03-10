import React, { useState, useEffect } from 'react';
import Card from '@components/Card';
import LoanApplicationForm from '@components/LoanApplicationForm';
import { useCreditScores, useFraudAlerts } from '@hooks/useMockData';
import { lendingService } from '@services/api';
import './Lending.css';
import { formatCurrency } from '@utils/helpers';

const Lending: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apply' | 'active' | 'eligibility'>('apply');
  const [loans, setLoans] = useState<any[]>([]);
  const [loansLoading, setLoansLoading] = useState(false);
  
  const { data: creditScores, loading: credScoresLoading } = useCreditScores();
  const { data: fraudAlerts, loading: fraudLoading } = useFraudAlerts({ skip: 0, limit: 5 });

  const loading = credScoresLoading || fraudLoading;
  // Fix: Backend returns { credit_scores: [...], total: ... }, not a direct array
  const creditScore = creditScores?.credit_scores?.[0] || null;

  useEffect(() => {
    if (activeTab === 'active') {
      fetchLoans();
    }
  }, [activeTab]);

  const fetchLoans = async () => {
    try {
      setLoansLoading(true);
      const res = await lendingService.getLoans();
      setLoans(res.data.loans || []);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
    } finally {
      setLoansLoading(false);
    }
  };

  const handleApplySuccess = () => {
    alert('Loan application submitted!');
    setActiveTab('active');
  };

  const determineLoanEligibility = () => {
    if (!creditScore) {
      return {
        eligible: false,
        error: true,
        message: 'Eligibility data unavailable. Please refresh or update your financial information.',
      };
    }

    const score = creditScore.score || 700;
    const scoreRange = creditScore.score_range || 'Good';
    const loanEligibility = creditScore.loan_eligibility || { eligible: true, max_amount: 25000 };
    
    // Fraud risk assessment
    const hasFraudAlerts = fraudAlerts && fraudAlerts.alerts && fraudAlerts.alerts.length > 0;
    const fraudRiskLevel = hasFraudAlerts ? 'medium' : 'low';
    const fraudAdjustment = hasFraudAlerts ? 0.8 : 1.0; // 20% reduction if fraud alerts present
    
    // Calculate loan amounts based on credit score
    let baseAmount = loanEligibility.max_amount;
    let recommendedAmount = Math.floor(baseAmount * fraudAdjustment);
    
    // Simulate income-based calculation
    const estimatedMonthlyIncome = score >= 750 ? 5000 : score >= 700 ? 4000 : score >= 650 ? 3500 : 3000;
    const incomeBasedMax = Math.floor(estimatedMonthlyIncome * 8);
    
    // Use the more conservative of income-based or score-based
    recommendedAmount = Math.min(recommendedAmount, incomeBasedMax);
    
    // Interest rate determination
    let minRate: number, maxRate: number;
    if (score >= 800) {
      minRate = 3.5;
      maxRate = 6.5;
    } else if (score >= 740) {
      minRate = 5;
      maxRate = 9;
    } else if (score >= 670) {
      minRate = 8;
      maxRate = 13;
    } else if (score >= 580) {
      minRate = 12;
      maxRate = 18;
    } else {
      minRate = 18;
      maxRate = 25;
    }
    
    // Adjust rates if fraud alerts present
    if (hasFraudAlerts) {
      minRate += 2;
      maxRate += 2;
    }
    
    const maxDuration = score >= 700 ? 60 : score >= 650 ? 48 : 36;
    const isEligible = score >= 580 && !hasFraudAlerts;
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (score >= 740 && !hasFraudAlerts) {
      riskLevel = 'low';
    } else if (score >= 650 && fraudRiskLevel === 'low') {
      riskLevel = 'low';
    } else if (score >= 600 || (score >= 580 && fraudRiskLevel === 'low')) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }
    
    // Determine credit strength percentage
    const creditStrengthPercent = Math.min((score / 850) * 100, 100);
    
    return {
      eligible: isEligible,
      error: false,
      score,
      scoreRange,
      creditStrengthPercent,
      riskLevel,
      fraudAdjustment,
      hasFraudAlerts,
      recommendedAmount,
      maxAmount: baseAmount,
      minRate: parseFloat(minRate.toFixed(1)),
      maxRate: parseFloat(maxRate.toFixed(1)),
      maxDuration,
      estimatedIncome: estimatedMonthlyIncome,
      message: isEligible
        ? `Your credit score of ${score} (${scoreRange}) qualifies you for loans up to ${formatCurrency(recommendedAmount)}.`
        : score < 580
          ? 'Your credit score is below the minimum threshold. Improve your score to qualify for loans.'
          : 'Fraud alerts on your account may affect your loan eligibility. Please review and resolve them.',
    };
  };

  const eligibility = determineLoanEligibility();

  return (
    <div className="lending-page">
      <div className="page-header">
        <h1>Lending</h1>
        <p>Apply for loans and manage your borrowing</p>
      </div>

      <div className="tab-selector">
        <button
          className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`}
          onClick={() => setActiveTab('apply')}
        >
          New Application
        </button>
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Loans
        </button>
        <button
          className={`tab-btn ${activeTab === 'eligibility' ? 'active' : ''}`}
          onClick={() => setActiveTab('eligibility')}
        >
          Eligibility
        </button>
      </div>

      <div className="tab-content fade-in">
        {activeTab === 'apply' && (
          <Card title="Start a New Application" className="full-width">
            <LoanApplicationForm onSuccess={handleApplySuccess} />
          </Card>
        )}

        {activeTab === 'active' && (
          <div className="loans-container">
            {loading ? (
              <div className="loading-state">Finding your active lines of credit...</div>
            ) : (
              <>
                {creditScore && (
                  <Card title="Your Credit Profile" className="loan-card animate-in">
                    <div className="loan-details">
                      <div className="loan-item">
                        <span className="label">Current Score:</span>
                        <span className="value score-accent">{creditScore.score}</span>
                      </div>
                      <div className="loan-item">
                        <span className="label">Credit Tier:</span>
                        <span className="value tier-badge">{creditScore.eligibility_tier}</span>
                      </div>
                      <div className="loan-item">
                        <span className="label">Your Base Rate:</span>
                        <span className="value">{creditScore.interest_rate}% APR</span>
                      </div>
                      <div className="loan-item">
                        <span className="label">Profile Updated:</span>
                        <span className="value">{new Date(creditScore.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {fraudAlerts && fraudAlerts.alerts && fraudAlerts.alerts.length > 0 && (
                  <Card title="Security Status" className="loan-card warning-card">
                    <p className="warning">⚠️ We've found {fraudAlerts.alerts.length} security notices that might affect your rates.</p>
                  </Card>
                )}
                {loansLoading ? (
                  <p>Fetching loan details...</p>
                ) : loans.length > 0 ? (
                  <div className="active-loans-list">
                    {loans.map(loan => (
                      <Card key={loan.id} title={`Active Personal Loan`} className="loan-card active-loan animate-in">
                        <div className="loan-details">
                          <div className="loan-item">
                            <span className="label">Borrowed Amount:</span>
                            <span className="value">{formatCurrency(loan.amount)}</span>
                          </div>
                          <div className="loan-item">
                            <span className="label">Current Status:</span>
                            <span className="value status-approved">{loan.status}</span>
                          </div>
                          <div className="loan-item">
                            <span className="label">Fixed Rate:</span>
                            <span className="value">{loan.interest_rate}%</span>
                          </div>
                          <div className="loan-item">
                            <span className="label">Remaining Term:</span>
                            <span className="value">{loan.duration_months} months</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="loan-card empty-card">
                    <p className="empty-message">You don't have any active loans at the moment.</p>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="eligibility-container">
            {eligibility && !eligibility.error ? (
              <>
                <Card title="Your Loan Eligibility Assessment" className="full-width fade-in">
                  <div className="eligibility-header">
                    <div className="eligibility-status">
                      <div className={`status-badge status-${eligibility.eligible ? 'eligible' : 'not-eligible'}`}>
                        {eligibility.eligible ? '✓ Eligible' : '✕ Not Eligible'}
                      </div>
                      <p className="eligibility-message">{eligibility.message}</p>
                    </div>
                  </div>

                  <div className="eligibility-grid">
                    {/* Credit Score Section */}
                    <div className="eligibility-section">
                      <h3>Credit Profile</h3>
                      <div className="credit-score-display">
                        <div className="score-main">
                          <span className="score-number">{eligibility.score}</span>
                          <span className="score-range">{eligibility.scoreRange}</span>
                        </div>
                      </div>
                      <div className="progress-container">
                        <label>Credit Strength</label>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${eligibility.creditStrengthPercent ?? 0}%` }}
                          ></div>
                        </div>
                        <span className="progress-label">{Math.round(eligibility.creditStrengthPercent ?? 0)}%</span>
                      </div>
                    </div>

                    {/* Loan Offering Section */}
                    <div className="eligibility-section">
                      <h3>Loan Offering</h3>
                      <div className="offering-item">
                        <label>Recommended Amount</label>
                        <div className="value-highlight">{formatCurrency(eligibility.recommendedAmount ?? 0)}</div>
                      </div>
                      <div className="offering-item">
                        <label>Maximum Amount</label>
                        <div className="value-muted">{formatCurrency(eligibility.maxAmount)}</div>
                      </div>
                      <div className="offering-item">
                        <label>Interest Rate Range</label>
                        <div className="value-highlight">{eligibility.minRate}% - {eligibility.maxRate}%</div>
                      </div>
                      <div className="offering-item">
                        <label>Max Repayment (months)</label>
                        <div className="value-muted">{eligibility.maxDuration}</div>
                      </div>
                    </div>

                    {/* Risk Assessment Section */}
                    <div className="eligibility-section">
                      <h3>Risk Assessment</h3>
                      <div className="risk-item">
                        <label>Overall Risk Level</label>
                        <div className={`risk-badge risk-${eligibility.riskLevel ?? 'low'}`}>
                          {eligibility.riskLevel === 'low' ? '🟢' : eligibility.riskLevel === 'medium' ? '🟡' : '🔴'}
                          {eligibility.riskLevel ? eligibility.riskLevel.charAt(0).toUpperCase() + eligibility.riskLevel.slice(1) : 'Unknown'}
                        </div>
                      </div>
                      {eligibility.hasFraudAlerts && (
                        <div className="warning-box">
                          <p>⚠️ Fraud alerts detected - this may affect your interest rates.</p>
                        </div>
                      )}
                      <div className="risk-item">
                        <label>Estimated Monthly Income</label>
                        <div className="value-muted">{formatCurrency(eligibility.estimatedIncome ?? 0)}</div>
                      </div>
                      <div className="risk-item">
                        <label>Income-Based Capacity</label>
                        <div className="value-muted">{formatCurrency((eligibility.estimatedIncome ?? 0) * 8)}</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Next Steps" className="full-width fade-in">
                  <div className="next-steps">
                    {eligibility.eligible ? (
                      <div className="steps-eligible">
                        <p>✓ You're eligible to apply for a loan!</p>
                        <ul>
                          <li>Click on "New Application" to start your loan application</li>
                          <li>Prepare required financial documents</li>
                          <li>Complete the application form</li>
                          <li>Review and sign the loan agreement</li>
                          <li>Funds will be disbursed within 2-3 business days</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="steps-not-eligible">
                        <p>To improve your eligibility:</p>
                        <ul>
                          <li>Increase your credit score by paying bills on time</li>
                          <li>Reduce credit card balances and utilization</li>
                          <li>Resolve any fraud alerts or disputes</li>
                          <li>Verify your income information is up-to-date</li>
                          <li>Avoid taking on new debt</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card title="Eligibility Information" className="full-width">
                <div className="error-state">
                  <p>⚠️ {eligibility?.message || 'Unable to load eligibility data.'}</p>
                  <button className="retry-btn" onClick={() => window.location.reload()}>
                    Refresh Data
                  </button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lending;
