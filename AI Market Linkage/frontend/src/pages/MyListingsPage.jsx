import { useState, useEffect } from 'react';
import { listingAPI } from '../api/endpoints';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import '../styles/MyListingsPage.css';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await listingAPI.getMyListings();
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
    setLoading(false);
  };

  return (
    <div className="my-listings-page">
      <div className="page-header">
        <h1>My Listings</h1>
        <Link to="/farmer/listings/add" className="btn btn-primary">
          Add New Listing
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading listings...</div>
      ) : listings.length > 0 ? (
        <div className="listings-grid">
          {listings.map(listing => (
            <div key={listing.id} className="listing-card-wrapper">
              <ListingCard listing={listing} />
              <div className="listing-actions">
                <Link to={`/farmer/listings/${listing.id}/edit`} className="btn btn-sm">
                  Edit
                </Link>
                <button className="btn btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-listings">
          <p>You haven't created any listings yet.</p>
          <Link to="/farmer/listings/add" className="btn btn-primary">
            Create Your First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
