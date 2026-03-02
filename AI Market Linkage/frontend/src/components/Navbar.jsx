import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

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

          {isAuthenticated ? (
            <>
              {user?.role === 'FARMER' && (
                <>
                  <Link to="/farmer/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/farmer/listings/add" className="nav-link">
                    Add Listing
                  </Link>
                </>
              )}

              {user?.role === 'BUYER' && (
                <>
                  <Link to="/buyer/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </>
              )}

              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/register" className="nav-button register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
