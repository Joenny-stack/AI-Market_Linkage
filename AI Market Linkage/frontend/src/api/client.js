import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Preserve the current path so the user can be returned after login
      const returnTo = window.location.pathname + window.location.search;
      const loginUrl = returnTo && returnTo !== '/login'
        ? `/login?session_expired=1&next=${encodeURIComponent(returnTo)}`
        : '/login?session_expired=1';
      window.location.href = loginUrl;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
