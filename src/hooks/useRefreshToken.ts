import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const API_BASE_URL = 'https://krystal-agent-hub.onrender.com/api';

export const useRefreshToken = () => {
  const { logout } = useAuth();

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('userToken', data.token);
          return data.token;
        }
      }

      // If refresh fails, logout user
      logout();
      toast.error('Session expired. Please log in again.');
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      toast.error('Session expired. Please log in again.');
      return null;
    }
  }, [logout]);

  const checkAndRefreshToken = useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      // Check if token is expired by trying to decode it
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Refresh token if it expires in the next 5 minutes
      if (payload.exp - currentTime < 300) {
        await refreshToken();
      }
    } catch (error) {
      console.error('Error checking token:', error);
      // If token is malformed, logout
      logout();
    }
  }, [refreshToken, logout]);

  useEffect(() => {
    // Check token immediately
    checkAndRefreshToken();

    // Set up interval to check token every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAndRefreshToken]);

  return { refreshToken };
};