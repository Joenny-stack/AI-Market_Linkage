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
    const dashboardPath = userRole === 'BUYER' ? '/buyer/dashboard' : '/farmer/dashboard';
    return (
      <div className="access-denied-page">
        <div className="access-denied-container">
          <h2>Access Restricted</h2>
          <p>
            This page is available to <strong>{required.charAt(0) + required.slice(1).toLowerCase()}s</strong> only.
            Your account is registered as a <strong>{userRole.charAt(0) + userRole.slice(1).toLowerCase()}</strong>.
          </p>
          <a href={dashboardPath} className="btn btn-primary">Go to My Dashboard</a>
        </div>
      </div>
    );
  }

  return children;
}
