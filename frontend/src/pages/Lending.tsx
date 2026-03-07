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

      <div className="tab-content">
        {activeTab === 'apply' && (
          <Card title="Loan Application" className="full-width">
            <LoanApplicationForm onSuccess={handleApplySuccess} />
          </Card>
        )}

        {activeTab === 'active' && (
          <div className="loans-container">
            {loading ? (
              <p>Loading information...</p>
            ) : (
              <>
                {creditScore && (
                  <Card title="Credit Profile" className="loan-card">
                    <div className="loan-details">
                      <div className="loan-item">
                        <span className="label">Credit Score:</span>
                        <span className="value">{creditScore.score}</span>
                      </div>
                      <div className="loan-item">
                        <span className="label">Eligibility Tier:</span>
                        <span className="value">{creditScore.eligibility_tier}</span>
                      </div>
                      <div className="loan-item">
                        <span className="label">Interest Rate Offered:</span>
                        <span className="value">{creditScore.interest_rate}%</span>
                      </div>
                      <div className="loan-item">
                        <span className="label">Last Updated:</span>
                        <span className="value">{new Date(creditScore.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {fraudAlerts && fraudAlerts.alerts && fraudAlerts.alerts.length > 0 && (
                  <Card title="Security Status" className="loan-card">
                    <p className="warning">⚠️ {fraudAlerts.alerts.length} security notices found</p>
                  </Card>
                )}
                {loansLoading ? (
                  <p>Loading your loans...</p>
                ) : loans.length > 0 ? (
                  <div className="active-loans-list">
                    {loans.map(loan => (
                      <Card key={loan.id} title={`Personal Loan`} className="loan-card active-loan">
                        <div className="loan-details">
                          <div className="loan-item">
                            <span className="label">Amount:</span>
                            <span className="value">{formatCurrency(loan.amount)}</span>
                          </div>
                          <div className="loan-item">
                            <span className="label">Status:</span>
                            <span className="value status-approved">{loan.status}</span>
                          </div>
                          <div className="loan-item">
                            <span className="label">Rate:</span>
                            <span className="value">{loan.interest_rate}%</span>
                          </div>
                          <div className="loan-item">
                            <span className="label">Duration:</span>
                            <span className="value">{loan.duration_months} mo</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="loan-card empty-card">
                    <p className="empty-message">You have no active loans.</p>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'eligibility' && eligibility && (
          <Card title="Loan Eligibility" className="full-width">
            <div className="eligibility-details">
              <div className="eligibility-item">
                <span className="label">Eligibility Status:</span>
                <span className={`status ${eligibility.eligible ? 'eligible' : 'not-eligible'}`}>
                  {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
                </span>
              </div>
              <div className="eligibility-item">
                <span className="label">Max Loan Amount:</span>
                <span className="value">{formatCurrency(eligibility.max_amount)}</span>
              </div>
              <div className="eligibility-item">
                <span className="label">Interest Rate Range:</span>
                <span className="value">{eligibility.min_rate}% - {eligibility.max_rate}%</span>
              </div>
              <div className="eligibility-item">
                <span className="label">Max Duration:</span>
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
