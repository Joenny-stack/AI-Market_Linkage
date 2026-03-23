import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../utils/media';
import '../styles/ListingCard.css';

export default function ListingCard({ listing }) {
  const imageUrl = resolveMediaUrl(listing.images?.[0]?.image) || 'https://via.placeholder.com/300x200';
  const confidencePercent = typeof listing.confidence_score === 'number'
    ? `${Math.round(listing.confidence_score * 100)}%`
    : null;
  const recommendedPriceRaw = listing.recommended_price ?? listing.ai_price_recommendation;
  const recommendedPrice = Number(recommendedPriceRaw);
  const hasRecommendedPrice = Number.isFinite(recommendedPrice);
  const hasAI = !!(
    listing.quality_grade
    || listing.predicted_class
    || typeof listing.confidence_score === 'number'
    || hasRecommendedPrice
    || listing.price_variance_flag
  );

  return (
    <div className="listing-card">
      <div className="listing-image">
        <img src={imageUrl} alt={listing.crop_name} />
        <span className={`status ${listing.status.toLowerCase()}`}>
          {listing.status}
        </span>
      </div>

      <div className="listing-content">
        <h3>{listing.crop_name}</h3>
        <p className="category">{listing.category}</p>

        <div className="listing-details">
          <p><strong>Price:</strong> {listing.currency} {listing.price_per_kg || listing.price_per_unit} / kg</p>
          <p><strong>Quantity:</strong> {listing.quantity_kg || listing.quantity_available} kg</p>
          <p><strong>Location:</strong> {listing.district}, {listing.province}</p>
          <p><strong>Farmer:</strong> {listing.farmer_name}</p>
        </div>

        {hasAI && (
          <div className="ai-summary">
            <p><strong>AI Grade:</strong> {listing.quality_grade || 'N/A'}</p>
            <p><strong>Tomato State:</strong> {listing.predicted_class || 'N/A'}</p>
            {confidencePercent && <p><strong>Confidence:</strong> {confidencePercent}</p>}
            {hasRecommendedPrice && (
              <p><strong>AI Recommended Price:</strong> ${recommendedPrice.toFixed(2)}/kg</p>
            )}
            {listing.price_variance_flag === 'OVERPRICED' && (
              <p><strong>Pricing Alert:</strong> Overpriced vs AI recommendation</p>
            )}
            {listing.price_variance_flag === 'UNDERPRICED' && (
              <p><strong>Pricing Alert:</strong> Underpriced vs AI recommendation</p>
            )}
            {listing.pricing_warning && (
              <p><strong>Warning:</strong> {listing.pricing_warning}</p>
            )}
          </div>
        )}

        <p className="description">{(listing.description || '').substring(0, 100)}...</p>

        <Link to={`/listings/${listing.id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
