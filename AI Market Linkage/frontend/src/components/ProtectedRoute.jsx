import { Navigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, initialized } = useAuthStore();
  const userRole = String(user?.role || '').trim().toUpperCase();
  const required = String(requiredRole || '').trim().toUpperCase();

  if (!initialized) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (required && userRole !== required) {
    return <Navigate to="/" />;
  }

  return children;
}
