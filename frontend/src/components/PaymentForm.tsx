import React, { useState } from 'react';
import './PaymentForm.css';
import { paymentsService } from '@services/api';

interface PaymentFormProps {
  onSuccess?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    recipientId: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await paymentsService.sendPayment({
        recipient_id: formData.recipientId,
        amount: parseFloat(formData.amount),
        description: formData.description,
      });
      setFormData({ recipientId: '', amount: '', description: '' });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="recipientId">Recipient ID</label>
        <input
          type="text"
          id="recipientId"
          name="recipientId"
          value={formData.recipientId}
          onChange={handleChange}
          placeholder="Enter recipient user ID"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter payment description"
          rows={3}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Processing...' : 'Send Payment'}
      </button>
    </form>
  );
};

export default PaymentForm;
