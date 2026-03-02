import { Navigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}
