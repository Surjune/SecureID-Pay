import React, { useState } from 'react';
import './LoanApplicationForm.css';
import { lendingService } from '@services/api';

interface LoanApplicationFormProps {
  onSuccess?: () => void;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await lendingService.applyForLoan({
        amount: parseFloat(formData.amount),
        duration: parseInt(formData.duration),
        purpose: formData.purpose,
      });
      setFormData({ amount: '', duration: '', purpose: '' });
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Loan application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="loan-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="amount">Loan Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter loan amount"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Duration (months)</label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
        >
          <option value="">Select duration</option>
          <option value="3">3 months</option>
          <option value="6">6 months</option>
          <option value="12">12 months</option>
          <option value="24">24 months</option>
          <option value="36">36 months</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="purpose">Loan Purpose</label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Describe the purpose of your loan"
          rows={4}
          required
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Submitting...' : 'Apply for Loan'}
      </button>
    </form>
  );
};

export default LoanApplicationForm;
