import { useAuthStore } from '../context/authStore';

export const useAuth = () => {
  return useAuthStore();
};

export default useAuth;
