import { Link } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import '../styles/DashboardPage.css';

export default function FarmerDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Farmer Dashboard</h1>
        <p>Welcome back, {user?.full_name}!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📋 My Listings</h3>
          <p>Manage your agricultural product listings</p>
          <Link to="/farmer/listings" className="card-link">
            View Listings →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>➕ Add New Listing</h3>
          <p>Create a new product listing for sale</p>
          <Link to="/farmer/listings/add" className="card-link">
            Add Listing →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>💬 Buyer Inquiries</h3>
          <p>View and respond to buyer inquiries</p>
          <Link to="/farmer/inquiries" className="card-link">
            View Inquiries →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>👤 Profile Settings</h3>
          <p>Update your farmer profile information</p>
          <Link to="/profile" className="card-link">
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
