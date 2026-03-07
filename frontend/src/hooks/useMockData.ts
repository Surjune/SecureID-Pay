import { useEffect, useState } from 'react';
import mockApi from '../services/mockApi';

interface UseQueryOptions {
  skip?: number;
  limit?: number;
  refetchInterval?: number; // ms
}

export function useDashboardStats(options: UseQueryOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refetchInterval = 0 } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await mockApi.fetchDashboardStats();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refetchInterval > 0) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [refetchInterval]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
}

export function useTransactions(options: UseQueryOptions & { userId?: string; statusFilter?: string } = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { skip = 0, limit = 20, userId, statusFilter, refetchInterval = 0 } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await mockApi.fetchTransactions(skip, limit, userId, statusFilter);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refetchInterval > 0) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [skip, limit, userId, statusFilter, refetchInterval]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, loading, error, refetch };
}

export function useFraudAlerts(options: UseQueryOptions = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { skip = 0, limit = 20, refetchInterval = 0 } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await mockApi.fetchFraudAlerts(skip, limit);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fraud alerts');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refetchInterval > 0) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [skip, limit, refetchInterval]);

  const refetch = async () => {
    await fetchData();
  };

  const updateAlertStatus = async (alertId: string, status: 'reviewed' | 'approved' | 'blocked') => {
    try {
      await mockApi.updateFraudAlertStatus(alertId, status);
      await fetchData(); // Refetch after update
    } catch (err) {
      console.error('Failed to update alert status:', err);
      throw err;
    }
  };

  return { data, loading, error, refetch, updateAlertStatus };
}

export function useNotifications(options: UseQueryOptions & { unreadOnly?: boolean; userId?: string } = {}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { skip = 0, limit = 20, unreadOnly = false, userId, refetchInterval = 0 } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await mockApi.fetchNotifications(skip, limit, unreadOnly, userId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refetchInterval > 0) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [skip, limit, unreadOnly, userId, refetchInterval]);

  const refetch = async () => {
    await fetchData();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await mockApi.markNotificationAsRead(notificationId);
      await fetchData(); // Refetch after update
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await mockApi.markAllNotificationsAsRead(userId);
      await fetchData(); // Refetch after update
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  };

  return { data, loading, error, refetch, markAsRead, markAllAsRead };
}

export function useCreditScores(userId?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = userId
          ? await mockApi.fetchCreditScoreByUserId(userId)
          : await mockApi.fetchCreditScores();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credit scores');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, loading, error };
}

// Hook for real-time simulation
export function useRealTimeUpdates(enabled: boolean = true, interval: number = 15000) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const startSimulation = async () => {
      try {
        setIsSimulating(true);
        await mockApi.simulateBatchUpdate();
        setUpdateCount((prev) => prev + 1);
      } catch (err) {
        console.error('Error during simulation:', err);
      } finally {
        setIsSimulating(false);
      }
    };

    // Run immediately, then at intervals
    startSimulation();
    intervalId = setInterval(startSimulation, interval);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [enabled, interval]);

  return { isSimulating, updateCount };
}
