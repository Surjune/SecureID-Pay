import axios, { AxiosInstance } from 'axios';

// Configure API base URL with environment variable support
const envApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = envApiUrl ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`) : 'http://localhost:8000/api';

class MockApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // ====== User Endpoints ======
  async fetchUsers() {
    try {
      const response = await this.api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async fetchUserById(userId: string) {
    try {
      const response = await this.api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }

  // ====== Transaction Endpoints ======
  async fetchTransactions(
    skip: number = 0,
    limit: number = 20,
    userId?: string,
    statusFilter?: string
  ) {
    try {
      const params: any = { 
        skip: Math.max(skip ?? 0, 0),
        limit: Math.max(limit ?? 20, 1)
      };
      if (userId) params.user_id = userId;
      if (statusFilter) params.status_filter = statusFilter;

      const response = await this.api.get('/transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async fetchTransactionById(transactionId: string) {
    try {
      const response = await this.api.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${transactionId}:`, error);
      throw error;
    }
  }

  // ====== Fraud Alert Endpoints ======
  async fetchFraudAlerts(skip: number = 0, limit: number = 20) {
    try {
      const response = await this.api.get('/fraud-alerts', { params: { skip, limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching fraud alerts:', error);
      throw error;
    }
  }

  async fetchFraudAlertById(alertId: string) {
    try {
      const response = await this.api.get(`/fraud-alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fraud alert ${alertId}:`, error);
      throw error;
    }
  }

async updateFraudAlertStatus(
  alertId: string,
  status: 'reviewed' | 'approved' | 'blocked'
) {
  try {
    const response = await this.api.put(`/fraud-alerts/${alertId}`, null, {
      params: { status }
    });

    return response.data;
  } catch (error) {
    console.error(`Error updating fraud alert ${alertId}:`, error);
    throw error;
  }
}
  // ====== Credit Score Endpoints ======
  async fetchCreditScores() {
    try {
      const response = await this.api.get('/credit-scores');
      return response.data;
    } catch (error) {
      console.error('Error fetching credit scores:', error);
      throw error;
    }
  }

  async fetchCreditScoreByUserId(userId: string) {
    try {
      const response = await this.api.get(`/credit-scores/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching credit score for ${userId}:`, error);
      throw error;
    }
  }

  // ====== Notification Endpoints ======
  async fetchNotifications(
    skip: number = 0,
    limit: number = 20,
    unreadOnly: boolean = false,
    userId?: string
  ) {
    try {
      const params: any = { skip, limit, unread_only: unreadOnly };
      if (userId) params.user_id = userId;

      const response = await this.api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      const response = await this.api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId?: string) {
    try {
      const params = userId ? { user_id: userId } : {};
      const response = await this.api.put('/notifications/read-all', {}, { params });
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // ====== Dashboard Endpoints ======
  async fetchDashboardStats() {
    try {
      const response = await this.api.get('/dashboard-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async fetchDashboardSummary() {
    try {
      const response = await this.api.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  // ====== Simulation Endpoints (for real-time demo) ======
  async simulateNewTransaction() {
    try {
      const response = await this.api.post('/simulate/new-transaction');
      return response.data;
    } catch (error) {
      console.error('Error simulating new transaction:', error);
      throw error;
    }
  }

  async simulateFraudAlert() {
    try {
      const response = await this.api.post('/simulate/fraud-alert');
      return response.data;
    } catch (error) {
      console.error('Error simulating fraud alert:', error);
      throw error;
    }
  }

  async simulateNotification(type: 'payment' | 'fraud' | 'credit' = 'payment') {
    try {
      const response = await this.api.post('/simulate/notification', { type });
      return response.data;
    } catch (error) {
      console.error('Error simulating notification:', error);
      throw error;
    }
  }

  async simulateBatchUpdate() {
    try {
      const response = await this.api.post('/simulate/batch-update');
      return response.data;
    } catch (error) {
      console.error('Error simulating batch update:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const mockApi = new MockApiService();
export default mockApi;
