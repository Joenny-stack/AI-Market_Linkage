import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingAPI } from '../api/endpoints';
import '../styles/AddListingPage.css';

export default function AddListingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crop_name: '',
    category: '',
    description: '',
    quantity_available: '',
    unit: 'kg',
    price_per_unit: '',
    currency: 'USD',
    harvest_date: '',
    province: '',
    district: '',
    gps_latitude: '',
    gps_longitude: '',
    status: 'AVAILABLE',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await listingAPI.createListing(formDataToSend);
      navigate('/farmer/listings');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing');
    }
    setLoading(false);
  };

  return (
    <div className="add-listing-page">
      <h1>Create New Listing</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="listing-form">
        <div className="form-section">
          <h2>Product Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Crop Name *</label>
              <input
                type="text"
                name="crop_name"
                value={formData.crop_name}
                onChange={handleChange}
                required
                placeholder="e.g., Tomatoes"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Vegetables"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your product..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity Available *</label>
              <input
                type="number"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                required
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option value="kg">Kilogram (kg)</option>
                <option value="ton">Ton</option>
                <option value="bag">Bag</option>
                <option value="crate">Crate</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price Per Unit *</label>
              <input
                type="number"
                step="0.01"
                name="price_per_unit"
                value={formData.price_per_unit}
                onChange={handleChange}
                required
                placeholder="10.50"
              />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Location & Dates</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Harvest Date *</label>
              <input
                type="date"
                name="harvest_date"
                value={formData.harvest_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Province *</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                placeholder="Province name"
              />
            </div>

            <div className="form-group">
              <label>District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                placeholder="District name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GPS Latitude *</label>
              <input
                type="number"
                step="0.0001"
                name="gps_latitude"
                value={formData.gps_latitude}
                onChange={handleChange}
                required
                placeholder="e.g., -17.8252"
              />
            </div>

            <div className="form-group">
              <label>GPS Longitude *</label>
              <input
                type="number"
                step="0.0001"
                name="gps_longitude"
                value={formData.gps_longitude}
                onChange={handleChange}
                required
                placeholder="e.g., 31.0335"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Images</h2>
          <div className="form-group">
            <label>Upload Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="hint">{images.length} image(s) selected</p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/farmer/listings')}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
