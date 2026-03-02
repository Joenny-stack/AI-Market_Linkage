import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/RegisterPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    role: 'BUYER',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    const success = await register(
      formData.email,
      formData.full_name,
      formData.phone_number,
      formData.role,
      formData.password,
      formData.password2
    );

    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create Account</h1>
        <p>Join the AI Market Linkage platform</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+1-234-567-8900"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Account Type</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="FARMER">Farmer</option>
              <option value="BUYER">Buyer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="form-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}
