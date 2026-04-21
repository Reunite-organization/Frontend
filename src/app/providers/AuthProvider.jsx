import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import { toast } from 'sonner';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth-token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get user profile from wanted API
      const response = await axios.get('/api/wanted/profile');
      
      if (response.data.success) {
        setProfile(response.data.data);
        // User is stored in localStorage after login
        const userData = localStorage.getItem('user-data');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token might be expired, try refresh
      try {
        const refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken) {
          const refreshResponse = await axios.post('/api/auth/refresh-token', { refreshToken });
          if (refreshResponse.data.success) {
            localStorage.setItem('auth-token', refreshResponse.data.data.token);
            await checkAuth();
            return;
          }
        }
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
      }
      
      // Clear invalid tokens
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user-data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        
        localStorage.setItem('auth-token', token);
        localStorage.setItem('refresh-token', refreshToken);
        localStorage.setItem('user-data', JSON.stringify(user));
        
        setUser(user);
        setIsAuthenticated(true);
        
        toast.success(response.data.message || 'Welcome back!');
        
        // Try to fetch wanted profile
        try {
          const profileResponse = await axios.get('/api/wanted/profile');
          if (profileResponse.data.success) {
            setProfile(profileResponse.data.data);
          }
        } catch (profileError) {
          // Profile might not exist yet
          setProfile(null);
        }
        
        return { success: true };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        
        localStorage.setItem('auth-token', token);
        localStorage.setItem('refresh-token', refreshToken);
        localStorage.setItem('user-data', JSON.stringify(user));
        
        setUser(user);
        setProfile(null);
        setIsAuthenticated(true);
        
        toast.success(response.data.message || 'Account created successfully!');
        return { success: true };
      }
      
      return { success: false, error: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh-token');
      if (refreshToken) {
        await axios.post('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user-data');
      setUser(null);
      setProfile(null);
      setIsAuthenticated(false);
      navigate('/');
      toast.success('Logged out successfully');
    }
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await axios.get('/api/wanted/profile');
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    checkAuth,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
