import { create } from 'zustand';
import { authAPI } from '../api/endpoints';

const normalizeUserProfile = (payload) => {
  const source = payload?.user || payload || {};
  const role = String(source.role || '').trim().toUpperCase();

  return {
    id: source.id,
    email: source.email,
    full_name: source.full_name,
    phone_number: source.phone_number,
    role,
  };
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Token endpoint may not include role/user fields; always resolve via profile API.
      const profileResponse = await authAPI.getProfile();
      const user = normalizeUserProfile(profileResponse.data);

      if (!user.role) {
        throw new Error('User role missing from profile');
      }

      localStorage.setItem('user_profile', JSON.stringify(user));
      
      set({
        user,
        isAuthenticated: true,
        loading: false,
        initialized: true,
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
    localStorage.removeItem('user_profile');
    set({
      user: null,
      isAuthenticated: false,
      initialized: true,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_profile');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        set({ user: parsedUser });
      } catch {
        localStorage.removeItem('user_profile');
      }
    }

    if (!token) {
      set({ isAuthenticated: false, user: null, initialized: true, loading: false });
      return;
    }

    set({ loading: true });

    try {
      const response = await authAPI.getProfile();
      const user = normalizeUserProfile(response.data);

      if (!user.role) {
        throw new Error('User role missing from profile');
      }

      localStorage.setItem('user_profile', JSON.stringify(user));
      set({
        user,
        isAuthenticated: true,
        initialized: true,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
      set({ isAuthenticated: false, user: null, initialized: true, loading: false });
    }
  },

  setUser: (user) => set({ user }),
}));

export default useAuthStore;
