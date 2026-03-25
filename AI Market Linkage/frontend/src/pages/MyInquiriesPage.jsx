import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inquiryAPI } from '../api/endpoints';
import '../styles/InquiriesPage.css';

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await inquiryAPI.getByerInquiries();
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
    setLoading(false);
  };

  return (
    <div className="inquiries-page">
      <h1>My Inquiries</h1>

      {loading ? (
        <div className="loading">Loading inquiries...</div>
      ) : inquiries.length > 0 ? (
        <div className="inquiries-list">
          {inquiries.map(inquiry => (
            <div key={inquiry.id} className="inquiry-card">
              <div className="inquiry-header">
                <h3>{inquiry.listing_crop}</h3>
                <span className={`status ${inquiry.status.toLowerCase()}`}>
                  {inquiry.status}
                </span>
              </div>
              <p><strong>Listing Price:</strong> {inquiry.listing_currency || 'USD'} {inquiry.listing_price} / {inquiry.listing_unit || 'kg'}</p>
              {inquiry.listing_location && <p><strong>Location:</strong> {inquiry.listing_location}</p>}
              <p><strong>Your Message:</strong> {inquiry.message}</p>
              <p><strong>Date:</strong> {new Date(inquiry.created_at).toLocaleDateString()}</p>
              <Link to={`/listings/${inquiry.listing}`} className="inquiry-link">Open Listing</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-inquiries">
          <p>You haven't sent any inquiries yet.</p>
        </div>
      )}
    </div>
  );
}
