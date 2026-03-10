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
  const creditScore = creditScores && creditScores.length > 0 ? creditScores[0] : null;

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
    if (!creditScore) return null;

    const score = creditScore.score || 700;
    const isEligible = score >= 600;
    const maxAmount = score >= 750 ? 50000 : score >= 700 ? 25000 : 10000;
    const minRate = score >= 750 ? 2.5 : score >= 700 ? 5.0 : 8.0;
    const maxRate = minRate + 5;
    const maxDuration = score >= 700 ? 60 : 36;

    return {
      eligible: isEligible,
      max_amount: maxAmount,
      min_rate: minRate,
      max_rate: maxRate,
      max_duration: maxDuration,
      reason: isEligible 
        ? 'Your credit score qualifies you for loans'
        : 'Improve your credit score to qualify for loans',
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

        {activeTab === 'eligibility' && eligibility && (
          <Card title="Your Personalized Loan Offerings" className="full-width fade-in">
            <div className="eligibility-details">
              <div className="eligibility-item">
                <span className="label">What you qualify for:</span>
                <span className={`status ${eligibility.eligible ? 'eligible' : 'not-eligible'}`}>
                  {eligibility.eligible ? 'Successfully Qualified' : 'Action Required to Qualify'}
                </span>
              </div>
              <div className="eligibility-item">
                <span className="label">Possible Credit Limit:</span>
                <span className="value">{formatCurrency(eligibility.max_amount)}</span>
              </div>
              <div className="eligibility-item">
                <span className="label">Estimated APR Range:</span>
                <span className="value">{eligibility.min_rate}% - {eligibility.max_rate}%</span>
              </div>
              <div className="eligibility-item">
                <span className="label">Maximum Repayment Period:</span>
                <span className="value">{eligibility.max_duration} months</span>
              </div>
              <p className="eligibility-reason">{eligibility.reason}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Lending;
