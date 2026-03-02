import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listingAPI, inquiryAPI } from '../api/endpoints';
import useAuthStore from '../context/authStore';
import '../styles/ListingDetailPage.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    message: '',
    contact_phone: '',
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await listingAPI.getListingDetail(id);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    }
    setLoading(false);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await inquiryAPI.createInquiry({
        listing: id,
        ...inquiryData,
      });
      setShowInquiryForm(false);
      setInquiryData({ message: '', contact_phone: '' });
      alert('Inquiry sent successfully!');
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert('Failed to send inquiry');
    }
  };

  if (loading) return <div className="loading">Loading listing...</div>;
  if (!listing) return <div className="not-found">Listing not found</div>;

  return (
    <div className="listing-detail-page">
      <div className="listing-detail-container">
        <div className="listing-gallery">
          {listing.images && listing.images.length > 0 ? (
            <img src={listing.images[0].image} alt={listing.crop_name} className="main-image" />
          ) : (
            <img src="https://via.placeholder.com/500x400" alt={listing.crop_name} />
          )}

          {listing.images && listing.images.length > 1 && (
            <div className="thumbnail-gallery">
              {listing.images.map(img => (
                <img key={img.id} src={img.image} alt="thumbnail" />
              ))}
            </div>
          )}
        </div>

        <div className="listing-info">
          <span className={`status ${listing.status.toLowerCase()}`}>{listing.status}</span>
          <h1>{listing.crop_name}</h1>
          <p className="category">{listing.category}</p>

          <div className="price-section">
            <div className="price">
              <h2>{listing.currency} {listing.price_per_unit}</h2>
              <p>per {listing.unit}</p>
            </div>
            <div className="quantity">
              <p><strong>Available:</strong> {listing.quantity_available} {listing.unit}</p>
            </div>
          </div>

          <div className="details-section">
            <h3>Details</h3>
            <div className="detail-row">
              <span>Harvest Date:</span>
              <span>{new Date(listing.harvest_date).toLocaleDateString()}</span>
            </div>
            <div className="detail-row">
              <span>Location:</span>
              <span>{listing.district}, {listing.province}</span>
            </div>
            <div className="detail-row">
              <span>Coordinates:</span>
              <span>{listing.gps_latitude}, {listing.gps_longitude}</span>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <p>{listing.description}</p>
          </div>

          <div className="farmer-section">
            <h3>Farmer</h3>
            <p><strong>Name:</strong> {listing.farmer_name}</p>
            <p><strong>Email:</strong> {listing.farmer_email}</p>
          </div>

          {isAuthenticated && user?.role === 'BUYER' && user?.id !== listing.farmer && (
            <button
              className="inquiry-btn"
              onClick={() => setShowInquiryForm(!showInquiryForm)}
            >
              {showInquiryForm ? 'Cancel' : 'Send Inquiry'}
            </button>
          )}

          {showInquiryForm && (
            <form className="inquiry-form" onSubmit={handleInquirySubmit}>
              <textarea
                required
                value={inquiryData.message}
                onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                placeholder="Tell the farmer about your inquiry..."
              />
              <input
                type="tel"
                required
                value={inquiryData.contact_phone}
                onChange={(e) => setInquiryData({ ...inquiryData, contact_phone: e.target.value })}
                placeholder="Your contact phone"
              />
              <button type="submit" className="submit-btn">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
