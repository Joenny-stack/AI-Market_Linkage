import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditListingPage.css';

export default function EditListingPage() {
  const navigate = useNavigate();

  return (
    <div className="edit-listing-page">
      <h1>Edit Listing</h1>
      <p>Edit listing form - similar to Add Listing with pre-filled data</p>
      <button onClick={() => navigate('/farmer/listings')} className="btn">
        Back to Listings
      </button>
    </div>
  );
}
