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
      ? { skip, limit, userId, statusFilter, refetchInterval: 10000 }
      : { skip: 0, limit: 0 } // Disabled if not fetching from API
  );

  // Use API data if fetching, otherwise use provided transactions
  const transactions = fetchFromApi ? apiData?.transactions || [] : initialTransactions || [];
  const total = fetchFromApi ? apiData?.total || 0 : transactions.length;
  const loading = fetchFromApi ? apiLoading : false;

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="transaction-list">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx: any) => (
            <tr key={tx.id} className={`transaction-row status-${tx.status}`}>
              <td className="description">{tx.description || tx.sender_name}</td>
              <td className="type">
                {tx.type === 'send' || tx.sender_name ? '→' : '←'}
              </td>
              <td className="amount">
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

      {transactions.length === 0 && (
        <p className="empty-message">No transactions yet</p>
      )}

      {fetchFromApi && total > limit && (
        <div className="pagination">
          <button
            disabled={skip === 0}
            onClick={() => setSkip(Math.max(0, skip - limit))}
          >
            Previous
          </button>
          <span>
            Showing {skip + 1} - {Math.min(skip + limit, total)} of {total}
          </span>
          <button
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
