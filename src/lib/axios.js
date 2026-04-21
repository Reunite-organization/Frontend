import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add language header
    const language = localStorage.getItem('falagiye-language') || 'en';
    config.headers['Accept-Language'] = language;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh-token');
        const response = await instance.post('/auth/refresh', { refreshToken });
        const { token } = response.data;
        
        localStorage.setItem('auth-token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return instance(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
