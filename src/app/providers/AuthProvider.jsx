import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import { toast } from 'sonner';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const navigate = useNavigate();
  
  // Prevent multiple auth checks
  const checkingAuth = useRef(false);

  const checkAuth = useCallback(async () => {
    if (checkingAuth.current) return;
    checkingAuth.current = true;
    
    const token = localStorage.getItem('auth-token');

    if (!token) {
      setIsLoading(false);
      checkingAuth.current = false;
      return;
    }

    try {
      const response = await axios.get('/api/auth/status');

      if (response.data.success) {
        const { authenticated, user, profile } = response.data.data;

        if (authenticated) {
          setUser(user);
          setProfile(profile?.hasProfile ? profile : null);
          setNeedsProfile(!profile?.hasProfile);
          setIsAuthenticated(true);
          localStorage.setItem('user-data', JSON.stringify(user));
        } else {
          throw new Error('Not authenticated');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // Try refresh token
      try {
        const refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken) {
          const refreshResponse = await axios.post('/api/auth/refresh-token', { refreshToken });
          if (refreshResponse.data.success) {
            localStorage.setItem('auth-token', refreshResponse.data.data.token);
            checkingAuth.current = false;
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
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
      checkingAuth.current = false;
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

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
            setNeedsProfile(false);
          }
        } catch (profileError) {
          if (profileError.response?.status === 403) {
            setProfile(null);
            setNeedsProfile(true);
          }
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

  const loginWithGoogle = useCallback(async (credential) => {
    try {
      const response = await axios.post('/api/auth/google', { credential });

      if (response.data.success) {
        const { token, refreshToken, user, isNewUser } = response.data.data;

        localStorage.setItem('auth-token', token);
        localStorage.setItem('refresh-token', refreshToken);
        localStorage.setItem('user-data', JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        let hasWantedProfile = false;

        try {
          const profileResponse = await axios.get('/api/wanted/profile');
          if (profileResponse.data.success && profileResponse.data.data) {
            setProfile(profileResponse.data.data);
            setNeedsProfile(false);
            hasWantedProfile = true;
          } else {
            setProfile(null);
            setNeedsProfile(true);
          }
        } catch (profileError) {
          setProfile(null);
          setNeedsProfile(true);
        }

        toast.success(
          isNewUser ? 'Google account connected. Complete your profile.' : 'Signed in with Google.',
        );

        return { success: true, needsProfile: !hasWantedProfile };
      }

      return { success: false, error: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Google sign-in failed';
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
        setNeedsProfile(true); 
        setIsAuthenticated(true);

        toast.success(response.data.message || 'Account created! Please complete your profile.');
        return { success: true, needsProfile: true };
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
      setNeedsProfile(false);
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
        setNeedsProfile(false);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const getAccessToken = useCallback(() => localStorage.getItem('auth-token'), []);

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    needsProfile,
    login,
    loginWithGoogle,
    register,
    logout,
    refreshProfile,
    checkAuth,
    getAccessToken,
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
