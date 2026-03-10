import React, { useState } from 'react';
import { useTransactions } from '@hooks/useMockData';
import './TransactionList.css';
import { formatCurrency, formatDateTime } from '@utils/helpers';

interface Transaction {
  id: string;
  sender_name: string;
  recipient_name?: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  description: string;
  type?: string;
}

interface TransactionListProps {
  transactions?: Transaction[];
  fetchFromApi?: boolean;
  userId?: string;
  statusFilter?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions: initialTransactions,
  fetchFromApi = false,
  userId,
  statusFilter,
}) => {
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);

  const { data: apiData, loading: apiLoading } = useTransactions(
    fetchFromApi
      ? { skip, limit, userId, statusFilter, refetchInterval: 15000 }
      : { skip: 0, limit: 20 }
  );

  const transactions = fetchFromApi ? apiData?.transactions || [] : initialTransactions || [];
  const total = fetchFromApi ? apiData?.total || 0 : transactions.length;
  const loading = fetchFromApi ? apiLoading : false;

  if (loading) {
    return (
      <div className="loading-state-container">
        <div className="spinner"></div>
        <p>Fetching transactions...</p>
      </div>
    );
  }

  return (
    <div className="transaction-container">
      {/* Desktop Table View */}
      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Entity / Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any) => (
              <tr key={tx.id} className="transaction-row">
                <td className="entity-cell">
                  <div className="entity-info">
                    <div className="entity-avatar">{tx.recipient_name?.charAt(0) || tx.sender_name?.charAt(0) || 'T'}</div>
                    <div className="entity-details">
                      <span className="entity-name">{tx.recipient_name || tx.sender_name || 'Counterparty'}</span>
                      <span className="entity-sub">{tx.description}</span>
                    </div>
                  </div>
                </td>
                <td className="type">
                  <span className={`type-badge ${tx.type === 'send' || tx.sender_name ? 'outgoing' : 'incoming'}`}>
                    {tx.type === 'send' || tx.sender_name ? 'Outgoing' : 'Incoming'}
                  </span>
                </td>
                <td className={`amount ${tx.type === 'send' || tx.sender_name ? 'negative' : 'positive'}`}>
                  {tx.type === 'send' || tx.sender_name ? '-' : '+'}
                  {formatCurrency(tx.amount, tx.currency || 'USD')}
                </td>
                <td className="status">
                  <span className={`status-badge status-${tx.status}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="date">{formatDateTime(tx.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="transaction-cards-view">
        {transactions.map((tx: any) => (
          <div key={tx.id} className={`tx-card status-${tx.status}`}>
            <div className="tx-card-top">
              <div className="tx-card-avatar">{tx.recipient_name?.charAt(0) || tx.sender_name?.charAt(0) || 'T'}</div>
              <div className="tx-card-meta">
                <span className="tx-card-name">{tx.recipient_name || tx.sender_name || 'Counterparty'}</span>
                <span className="tx-card-date">{formatDateTime(tx.timestamp)}</span>
              </div>
              <div className={`tx-card-amount ${tx.type === 'send' || tx.sender_name ? 'negative' : 'positive'}`}>
                {tx.type === 'send' || tx.sender_name ? '-' : '+'}
                {formatCurrency(tx.amount, tx.currency || 'USD')}
              </div>
            </div>
            <div className="tx-card-middle">
               <span className="tx-card-desc">{tx.description}</span>
            </div>
            <div className="tx-card-bottom">
              <span className={`status-badge status-${tx.status}`}>
                {tx.status}
              </span>
              <span className="tx-type-label">{tx.type === 'send' || tx.sender_name ? 'Transfer Out' : 'Transfer In'}</span>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="empty-state-container">
           <p className="empty-message">No transactions found</p>
        </div>
      )}

      {fetchFromApi && total > limit && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={skip === 0}
            onClick={() => setSkip(Math.max(0, skip - limit))}
          >
            Previous
          </button>
          <span className="pagination-info">
             {skip + 1} - {Math.min(skip + limit, total)} of {total}
          </span>
          <button
            className="pagination-btn"
            disabled={skip + limit >= total}
            onClick={() => setSkip(skip + limit)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
