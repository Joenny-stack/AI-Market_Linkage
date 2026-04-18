import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('session_expired') === '1';
  const nextParam = searchParams.get('next') || '/dashboard';
  const nextPath = nextParam.startsWith('/') ? nextParam : '/dashboard';
  const { login, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      navigate(nextPath);
    } else {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <p>Sign in to your account</p>

        {sessionExpired && (
          <div className="warning-message">
            Your session has expired. Please log in again to continue.
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="form-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
