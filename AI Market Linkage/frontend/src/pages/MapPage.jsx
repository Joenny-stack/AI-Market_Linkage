import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { listingAPI } from '../api/endpoints';
import '../styles/MapPage.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER = [-19.0154, 29.1549]; // Zimbabwe centroid

export default function MapPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await listingAPI.getListings();
      const data = response.data?.results || response.data || [];
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      setFetchError('Failed to load map listings. Please check your connection and try again.');
      setListings([]);
    }
    setLoading(false);
  };

  const markerListings = useMemo(
    () => listings.filter((listing) => {
      const lat = Number(listing.latitude ?? listing.gps_latitude);
      const lng = Number(listing.longitude ?? listing.gps_longitude);
      return Number.isFinite(lat) && Number.isFinite(lng);
    }),
    [listings]
  );

  const mapCenter = markerListings.length
    ? [
        Number(markerListings[0].latitude ?? markerListings[0].gps_latitude),
        Number(markerListings[0].longitude ?? markerListings[0].gps_longitude),
      ]
    : DEFAULT_CENTER;

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>Listings Map</h1>
        <p>{markerListings.length} listing(s) with valid coordinates</p>
      </div>

      {loading ? (
        <div className="loading">Loading map data...</div>
      ) : fetchError ? (
        <div className="fetch-error" style={{ margin: '1.5rem' }}>
          <span>{fetchError}</span>
          <button className="retry-btn" onClick={fetchListings}>Retry</button>
        </div>
      ) : (
        <MapContainer center={mapCenter} zoom={7} className="listings-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markerListings.map((listing) => {
            const lat = Number(listing.latitude ?? listing.gps_latitude);
            const lng = Number(listing.longitude ?? listing.gps_longitude);
            return (
              <Marker key={listing.id} position={[lat, lng]} icon={markerIcon}>
                <Popup>
                  <div className="map-popup">
                    <h4>{listing.crop_name}</h4>
                    <p><strong>Price:</strong> {listing.currency} {listing.price_per_kg || listing.price_per_unit}/kg</p>
                    <p><strong>Location:</strong> {listing.location || `${listing.district || ''}, ${listing.province || ''}`}</p>
                    <Link to={`/listings/${listing.id}`}>View details</Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
