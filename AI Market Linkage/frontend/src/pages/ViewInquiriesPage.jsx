import { useState, useEffect } from 'react';
import { inquiryAPI } from '../api/endpoints';
import '../styles/InquiriesPage.css';

export default function ViewInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await inquiryAPI.getFarmerInquiries();
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
    setLoading(false);
  };

  const handleMarkResponded = async (inquiryId) => {
    try {
      await inquiryAPI.markResponded(inquiryId);
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  return (
    <div className="inquiries-page">
      <h1>Buyer Inquiries</h1>

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
              <p><strong>From:</strong> {inquiry.buyer_name} ({inquiry.buyer_email})</p>
              <p><strong>Phone:</strong> {inquiry.contact_phone}</p>
              <p><strong>Message:</strong> {inquiry.message}</p>
              <p><strong>Date:</strong> {new Date(inquiry.created_at).toLocaleDateString()}</p>
              
              {inquiry.status === 'NEW' && (
                <button
                  onClick={() => handleMarkResponded(inquiry.id)}
                  className="btn btn-sm"
                >
                  Mark as Responded
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-inquiries">
          <p>You have no inquiries yet.</p>
        </div>
      )}
    </div>
  );
}
