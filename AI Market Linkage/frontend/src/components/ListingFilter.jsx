import { useState, useEffect } from 'react';
import { listingAPI } from '../api/endpoints';
import '../styles/ListingFilter.css';

export default function ListingFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    crop: '',
    province: '',
    min_price: '',
    max_price: '',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    onFilter(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      crop: '',
      province: '',
      min_price: '',
      max_price: '',
      status: 'AVAILABLE',
    });
  };

  return (
    <div className="listing-filter">
      <h3>Filter Listings</h3>

      <div className="filter-group">
        <label>Crop Name</label>
        <input
          type="text"
          name="crop"
          value={filters.crop}
          onChange={handleChange}
          placeholder="Search crop..."
        />
      </div>

      <div className="filter-group">
        <label>Province</label>
        <input
          type="text"
          name="province"
          value={filters.province}
          onChange={handleChange}
          placeholder="Enter province..."
        />
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            name="min_price"
            value={filters.min_price}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            name="max_price"
            value={filters.max_price}
            onChange={handleChange}
            placeholder="10000"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="AVAILABLE">Available</option>
          <option value="SOLD">Sold</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      <button onClick={handleReset} className="reset-btn">
        Reset Filters
      </button>
    </div>
  );
}
