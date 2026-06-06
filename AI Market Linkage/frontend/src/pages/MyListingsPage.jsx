import { useState, useEffect } from 'react';
import { listingAPI } from '../api/endpoints';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import '../styles/MyListingsPage.css';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await listingAPI.getMyListings();
      setListings(response.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again.');
    }
    setLoading(false);
  };

  const requestDelete = (listingId) => {
    if (deletingId) {
      return;
    }
    setConfirmDeleteId(listingId);
  };

  const cancelDelete = () => {
    if (deletingId) {
      return;
    }
    setConfirmDeleteId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId || deletingId) {
      return;
    }

    setDeletingId(confirmDeleteId);
    setError('');

    try {
      await listingAPI.deleteListing(confirmDeleteId);
      setListings((prev) => prev.filter((item) => item.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError(err.response?.data?.detail || 'Failed to delete listing. Please try again.');
    }

    setDeletingId(null);
  };

  const listingBeingDeleted = listings.find((item) => item.id === confirmDeleteId);

  return (
    <div className="my-listings-page">
      <div className="page-header">
        <h1>My Listings</h1>
        <Link to="/farmer/listings/add" className="btn btn-primary">
          Add New Listing
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

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
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => requestDelete(listing.id)}
                  disabled={deletingId === listing.id}
                >
                  {deletingId === listing.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-listings">
          <p>You have not created any listings yet.</p>
          <Link to="/farmer/listings/add" className="btn btn-primary">
            Create Your First Listing
          </Link>
        </div>
      )}

      {confirmDeleteId && (
        <div className="confirm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="confirm-modal-card">
            <h3 id="delete-modal-title">Delete Listing</h3>
            <p>
              Are you sure you want to delete
              {' '}
              <strong>{listingBeingDeleted?.crop_name || 'this listing'}</strong>
              ? This action cannot be undone.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn btn-secondary" onClick={cancelDelete} disabled={!!deletingId}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={!!deletingId}>
                {deletingId ? 'Deleting...' : 'Delete Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
