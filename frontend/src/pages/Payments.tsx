import React, { useState } from 'react';
import Card from '@components/Card';
import PaymentForm from '@components/PaymentForm';
import TransactionList from '@components/TransactionList';
import { useTransactions } from '@hooks/useMockData';
import './Payments.css';

const Payments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const { data: transactionData, loading, refetch } = useTransactions({
    skip: 0,
    limit: 20,
    refetchInterval: 10000,
  });

  const transactions = transactionData?.transactions || [];

  const handlePaymentSuccess = () => {
    alert('Payment simulation sent!');
    setActiveTab('history');
    refetch();
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1>Payments</h1>
        <p>Send money and view transaction history</p>
      </div>

      <div className="tab-selector">
        <button
          className={`tab-btn ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send Payment
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Transaction History ({transactions.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'send' && (
          <Card title="Send Payment (Demo)" className="full-width">
            <PaymentForm onSuccess={handlePaymentSuccess} />
          </Card>
        )}

        {activeTab === 'history' && (
          <Card title="Transaction History" className="full-width">
            {loading ? (
              <p>Loading transactions...</p>
            ) : (
              <TransactionList transactions={transactions} />
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Payments;
