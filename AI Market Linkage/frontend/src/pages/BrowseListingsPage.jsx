import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listingAPI } from '../api/endpoints';
import ListingCard from '../components/ListingCard';
import ListingFilter from '../components/ListingFilter';
import '../styles/BrowseListingsPage.css';

export default function BrowseListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await listingAPI.getListings(filters);
      setListings(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
    setLoading(false);
  };

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
          {loading ? (
            <div className="loading">Loading listings...</div>
          ) : listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="no-listings">
              <p>No listings found. Try adjusting your filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
