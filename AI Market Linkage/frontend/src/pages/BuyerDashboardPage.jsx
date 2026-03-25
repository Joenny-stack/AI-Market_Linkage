import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiryAPI, listingAPI } from '../api/endpoints';
import useAuthStore from '../context/authStore';
import '../styles/DashboardPage.css';

export default function BuyerDashboardPage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);

  useEffect(() => {
    loadBuyerStats();
  }, []);

  const loadBuyerStats = async () => {
    try {
      const [listingsRes, inquiriesRes] = await Promise.all([
        listingAPI.getListings(),
        inquiryAPI.getByerInquiries(),
      ]);
      const listingData = listingsRes.data?.results || listingsRes.data || [];
      setListings(Array.isArray(listingData) ? listingData : []);
      setInquiriesCount(Array.isArray(inquiriesRes.data) ? inquiriesRes.data.length : 0);
    } catch (error) {
      console.error('Failed loading buyer stats', error);
    }
  };

  const mappedListings = useMemo(
    () => listings.filter((l) => Number.isFinite(Number(l.latitude ?? l.gps_latitude))
      && Number.isFinite(Number(l.longitude ?? l.gps_longitude))),
    [listings]
  );

  const pricingAlerts = useMemo(
    () => listings.filter((l) => l.price_variance_flag === 'OVERPRICED').length,
    [listings]
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Buyer Dashboard</h1>
        <p>Welcome, {user?.full_name}!</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <p className="stat-label">Live Listings</p>
          <h3>{listings.length}</h3>
        </div>
        <div className="dashboard-stat-card">
          <p className="stat-label">Mappable Listings</p>
          <h3>{mappedListings.length}</h3>
        </div>
        <div className="dashboard-stat-card">
          <p className="stat-label">My Inquiries</p>
          <h3>{inquiriesCount}</h3>
        </div>
        <div className="dashboard-stat-card warning">
          <p className="stat-label">Potential Overpriced</p>
          <h3>{pricingAlerts}</h3>
        </div>
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
          <h3>🗺️ Farmer Map</h3>
          <p>Locate farmers and produce clusters visually</p>
          <Link to="/map" className="card-link">
            Open Map →
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>💬 My Inquiries</h3>
          <p>Track the inquiries you have sent to farmers</p>
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
      </div>
    </div>
  );
}
