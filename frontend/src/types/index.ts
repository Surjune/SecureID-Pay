// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  incomeType: 'stable' | 'variable';
  kyc_verified: boolean;
  created_at: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  recipientId: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

// Loan Types
export interface Loan {
  id: string;
  userId: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  purpose: string;
  created_at: string;
}

export interface LoanApplication {
  userId: string;
  amount: number;
  duration: number;
  purpose: string;
  incomeProof?: File;
}

// Fraud Types
export interface FraudAlert {
  id: string;
  userId: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
}

// Credit Score Types
export interface CreditScore {
  userId: string;
  score: number;
  lastUpdated: string;
}

// Spending Insights Types
export interface SpendingInsights {
  userId: string;
  totalSpending: number;
  categoryBreakdown: Record<string, number>;
  averageDailySpend: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Dashboard Types
export interface DashboardData {
  user: User;
  balance: number;
  recentTransactions: Transaction[];
  activeLoans: Loan[];
  creditScore: CreditScore;
  fraudAlerts: FraudAlert[];
  spendingInsights: SpendingInsights;
}
