import { useCallback, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../api/endpoints';
import ListingCard from '../components/ListingCard';
import ListingFilter from '../components/ListingFilter';
import '../styles/BrowseListingsPage.css';

export default function BrowseListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [filters, setFilters] = useState({});

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await listingAPI.getListings(filters);
      setListings(response.data.results || response.data);
    } catch (error) {
      setFetchError('Failed to load listings. Please check your connection and try again.');
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const mappedCount = useMemo(
    () => listings.filter((l) => Number.isFinite(Number(l.latitude ?? l.gps_latitude))
      && Number.isFinite(Number(l.longitude ?? l.gps_longitude))).length,
    [listings]
  );

  return (
    <div className="browse-listings-page">
      <h1>Browse Listings</h1>
      <div className="browse-toolbar">
        <p>{listings.length} listing(s) found. {mappedCount} can be viewed on map.</p>
        <Link to="/map" className="map-cta-link">Open Listings Map</Link>
      </div>

      <div className="browse-container">
        <aside className="sidebar">
          <ListingFilter onFilter={setFilters} />
        </aside>

        <section className="listings-section">
          {fetchError && (
            <div className="fetch-error">
              <span>{fetchError}</span>
              <button className="retry-btn" onClick={fetchListings}>Retry</button>
            </div>
          )}
          {loading ? (
            <div className="loading">Loading listings...</div>
          ) : !fetchError && listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : !fetchError ? (
            <div className="no-listings">
              <p>No listings found. Try adjusting your filters.</p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
