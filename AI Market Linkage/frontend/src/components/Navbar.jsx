import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, initialized, logout } = useAuthStore();
  const navigate = useNavigate();
  const normalizedRole = String(user?.role || '').trim().toUpperCase();
  const dashboardPath = normalizedRole === 'BUYER' ? '/buyer/dashboard' : '/farmer/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🌾 AI Market Linkage
        </Link>

        <div className="navbar-menu">
          <Link to="/listings" className="nav-link">
            Browse Listings
          </Link>

          {!initialized ? (
            <div className="navbar-skeleton navbar-fade-enter" aria-hidden="true">
              <span className="navbar-skeleton-item" />
              <span className="navbar-skeleton-item" />
              <span className="navbar-skeleton-item" />
            </div>
          ) : isAuthenticated ? (
            <div className="navbar-resolved navbar-fade-enter">
              <Link to={dashboardPath} className="nav-link">
                Dashboard
              </Link>

              {normalizedRole === 'FARMER' && (
                <>
                  <Link to="/farmer/listings/add" className="nav-link">
                    Add Listing
                  </Link>
                </>
              )}

              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-resolved navbar-fade-enter">
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/register" className="nav-button register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
