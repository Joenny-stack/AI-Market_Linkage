import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listingAPI, inquiryAPI } from '../api/endpoints';
import useAuthStore from '../context/authStore';
import { resolveMediaUrl } from '../utils/media';
import '../styles/ListingDetailPage.css';

export default function ListingDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    message: '',
    contact_phone: '',
  });
  const [inquirySuccess, setInquirySuccess] = useState('');
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await listingAPI.getListingDetail(id);
      setListing(response.data);
    } catch (error) {
      setFetchError('Unable to load this listing. It may have been removed or there was a connection problem.');
    }
    setLoading(false);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryError('');
    setInquirySuccess('');
    try {
      await inquiryAPI.createInquiry({
        listing: id,
        ...inquiryData,
      });
      setShowInquiryForm(false);
      setInquiryData({ message: '', contact_phone: '' });
      setInquirySuccess('Your inquiry has been sent! The farmer will contact you shortly.');
    } catch (error) {
      setInquiryError(error.response?.data?.detail || 'Failed to send inquiry. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading listing...</div>;
  if (fetchError) return (
    <div className="listing-detail-page">
      <div className="fetch-error" style={{ margin: '2rem auto', maxWidth: '600px' }}>
        <span>{fetchError}</span>
        <button className="retry-btn" onClick={fetchListing}>Retry</button>
      </div>
    </div>
  );
  if (!listing) return <div className="not-found">Listing not found</div>;

  const mainImage = resolveMediaUrl(listing.images?.[0]?.image);
  const recommendedPriceRaw = listing.recommended_price ?? listing.ai_price_recommendation;
  const recommendedPrice = Number(recommendedPriceRaw);
  const hasRecommendedPrice = Number.isFinite(recommendedPrice);
  const hasAI = !!(
    listing.quality_grade
    || listing.predicted_class
    || typeof listing.confidence_score === 'number'
    || hasRecommendedPrice
    || listing.price_variance_flag
    || listing.pricing_warning
  );
  const confidencePercent = typeof listing.confidence_score === 'number'
    ? `${Math.round(listing.confidence_score * 100)}%`
    : 'N/A';

  return (
    <div className="listing-detail-page">
      <div className="listing-detail-container">
        <div className="listing-gallery">
          {mainImage ? (
            <img src={mainImage} alt={listing.crop_name} className="main-image" />
          ) : (
            <img src="https://via.placeholder.com/500x400" alt={listing.crop_name} />
          )}

          {listing.images && listing.images.length > 1 && (
            <div className="thumbnail-gallery">
              {listing.images.map(img => (
                <img key={img.id} src={resolveMediaUrl(img.image)} alt="thumbnail" />
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
              <h2>{listing.currency} {listing.price_per_kg || listing.price_per_unit}</h2>
              <p>per kg</p>
            </div>
            <div className="quantity">
              <p><strong>Available:</strong> {listing.quantity_kg || listing.quantity_available} kg</p>
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

          {hasAI && (
            <div className="ai-section">
              <h3>AI Quality Assessment</h3>
              <div className="detail-row">
                <span>Quality Grade:</span>
                <span>{listing.quality_grade || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span>Tomato State:</span>
                <span>{listing.predicted_class || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span>Confidence:</span>
                <span>{confidencePercent}</span>
              </div>
              {hasRecommendedPrice && (
                <div className="detail-row">
                  <span>AI Recommended Price:</span>
                  <span>${recommendedPrice.toFixed(2)}/kg</span>
                </div>
              )}
              {listing.price_variance_flag && listing.price_variance_flag !== 'FAIR' && (
                <div className="detail-row">
                  <span>Pricing Alert:</span>
                  <span>
                    {listing.price_variance_flag === 'OVERPRICED'
                      ? 'Overpriced vs AI recommendation'
                      : 'Underpriced vs AI recommendation'}
                  </span>
                </div>
              )}
              {listing.pricing_warning && (
                <div className="detail-row">
                  <span>Warning:</span>
                  <span>{listing.pricing_warning}</span>
                </div>
              )}
            </div>
          )}

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
              onClick={() => { setShowInquiryForm(!showInquiryForm); setInquiryError(''); setInquirySuccess(''); }}
            >
              {showInquiryForm ? 'Cancel' : 'Send Inquiry'}
            </button>
          )}

          {inquirySuccess && <div className="success-message" style={{ marginTop: '1rem' }}>{inquirySuccess}</div>}
          {inquiryError && <div className="error-message" style={{ marginTop: '1rem' }}>{inquiryError}</div>}

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
