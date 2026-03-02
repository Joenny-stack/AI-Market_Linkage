import { create } from 'zustand';
import { authAPI } from '../api/endpoints';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { access, refresh, email: userEmail, full_name, role } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      set({
        user: {
          email: userEmail,
          full_name,
          role,
        },
        isAuthenticated: true,
        loading: false,
      });
      
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        loading: false,
      });
      return false;
    }
  },

  register: async (email, full_name, phone_number, role, password, password2) => {
    set({ loading: true, error: null });
    try {
      await authAPI.register({
        email,
        full_name,
        phone_number,
        role,
        password,
        password2,
      });
      set({ loading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Registration failed',
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      const response = await authAPI.getProfile();
      set({
        user: response.data,
        isAuthenticated: true,
      });
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
