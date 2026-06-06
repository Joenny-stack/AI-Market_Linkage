import { useAuthStore } from '../context/authStore';

/**
 * Custom hook for checking user permissions
 */
export const usePermissions = () => {
  const { user } = useAuthStore();

  const can = (action) => {
    if (!user) return false;

    // Farmer permissions
    if (user.role === 'FARMER') {
      if (action === 'create:listing') return true;
      if (action === 'view:inquiries') return true;
      if (action === 'update:profile') return true;
    }

    // Buyer permissions
    if (user.role === 'BUYER') {
      if (action === 'view:listings') return true;
      if (action === 'create:inquiry') return true;
    }

    // Admin permissions
    if (user.role === 'ADMIN') {
      return true; // Admin can do everything
    }

    return false;
  };

  const isFarmer = () => user?.role === 'FARMER';
  const isBuyer = () => user?.role === 'BUYER';
  const isAdmin = () => user?.role === 'ADMIN';

  return { can, isFarmer, isBuyer, isAdmin };
};

export default usePermissions;
