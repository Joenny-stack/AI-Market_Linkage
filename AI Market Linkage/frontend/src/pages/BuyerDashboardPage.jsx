import { Link } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/DashboardPage.css';

export default function BuyerDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Buyer Dashboard</h1>
        <p>Welcome, {user?.full_name}!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🔍 Browse Listings</h3>
          <p>Find agricultural products from farmers</p>
          <Link to="/listings" className="card-link">
            Browse Products →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>💬 My Inquiries</h3>
          <p>View inquiries you've sent to farmers</p>
          <Link to="/buyer/inquiries" className="card-link">
            View Inquiries →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>👤 Profile Settings</h3>
          <p>Update your buyer profile information</p>
          <Link to="/profile" className="card-link">
            Edit Profile →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>🗺️ Saved Locations</h3>
          <p>Track nearby farmers and products</p>
          <Link to="/listings" className="card-link">
            Explore Map →
          </Link>
        </div>
      </div>
    </div>
  );
}
