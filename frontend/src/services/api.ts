import axios, { AxiosInstance } from 'axios';

declare global {
  interface ImportMeta {
    env: {
      VITE_API_BASE_URL?: string;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Service
export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData: any) =>
    apiClient.post('/auth/register', userData),

  logout: () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },

  // Fetch current user from /api/auth/me which now safely returns realistic mock data
  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};


// Payments Service
export const paymentsService = {
  sendPayment: (data: { recipient_id: string; amount: number; description: string }) =>
    apiClient.post('/payment/send', data),
  
  getTransactions: (limit?: number, offset?: number) =>
    apiClient.get('/transactions', { params: { limit, offset } }),
  
  getTransaction: (id: string) =>
    apiClient.get(`/transactions/${id}`),
};

// Lending Service
export const lendingService = {
  applyForLoan: (data: any) =>
    apiClient.post('/loan/apply', data),
  
  checkLoanEligibility: () =>
    apiClient.get('/loan/eligibility'),
  
  getLoans: () =>
    apiClient.get('/loans'),
  
  getLoanDetails: (id: string) =>
    apiClient.get(`/loans/${id}`),
};

// Fraud Service
export const fraudService = {
  checkTransaction: (transactionData: any) =>
    apiClient.post('/fraud/check', transactionData),
  
  getFraudAlerts: () =>
    apiClient.get('/fraud/alerts'),
};

// Insights Service
export const insightsService = {
  getSpendingInsights: () =>
    apiClient.get('/insights/spending'),
  
  getCategoryBreakdown: () =>
    apiClient.get('/insights/categories'),
};

// Dashboard Service
export const dashboardService = {
  getDashboardData: () =>
    apiClient.get('/dashboard'),
  
  getBalance: () =>
    apiClient.get('/dashboard/balance'),
  
  getCreditScore: () =>
    apiClient.get('/dashboard/credit-score'),
};

export default apiClient;
