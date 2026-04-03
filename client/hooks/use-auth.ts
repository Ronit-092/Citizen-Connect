import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  authApi,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
} from '@/lib/api';
import { AuthRequest, RegisterRequest, UserProfile } from '@shared/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authApi.getMe();
          if (response.data?.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            clearAuthToken();
            setIsAuthenticated(false);
          }
        } catch (err) {
          clearAuthToken();
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
          setInitialCheckDone(true);
        }
      } else {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    if (!initialCheckDone) {
      checkAuth();
    }
  }, [initialCheckDone]);

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authApi.register(data);

        if (response.data?.token && response.data?.user) {
          setAuthToken(response.data.token);
          setUser(response.data.user as UserProfile);
          setIsAuthenticated(true);
          setLoading(false);
          return response.data;
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        toast.error(message);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  const login = useCallback(
    async (data: AuthRequest) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authApi.login(data);

        if (response.data?.token && response.data?.user) {
          setAuthToken(response.data.token);
          setUser(response.data.user as UserProfile);
          setIsAuthenticated(true);
          setLoading(false);
          return response.data;
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        toast.error(message);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    navigate('/');
  }, [navigate]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
  };
};
