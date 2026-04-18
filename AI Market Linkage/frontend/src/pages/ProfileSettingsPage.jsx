import { useState, useEffect } from 'react';
import { authAPI } from '../api/endpoints';
import '../styles/ProfileSettingsPage.css';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetchError('');
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      setFetchError('Failed to load your profile. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setSaveError('');

    try {
      await authAPI.updateProfile(profile);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setSaveError(error.response?.data?.detail || 'Failed to save changes. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="profile-settings-page">
      <div className="profile-container">
        <h1>Profile Settings</h1>

        {fetchError && <div className="error-message">{fetchError}</div>}
        {success && <div className="success-message">{success}</div>}
        {saveError && <div className="error-message">{saveError}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              readOnly
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={profile.phone_number}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
