import { useState, useEffect, useRef } from 'react';
import '../styles/ListingFilter.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SOLD', label: 'Sold' },
];

const EMPTY_FILTERS = {
  crop_name: '',
  province: '',
  min_price: '',
  max_price: '',
  status: '',
  quality_grade: '',
};

export default function ListingFilter({ onFilter }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const debounceRef = useRef(null);

  // Debounce filter updates 350ms to reduce noisy API calls
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilter(filters);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [filters, onFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="listing-filter">
      <h3>Filter Listings</h3>

      <div className="filter-group">
        <label>Crop Name</label>
        <input
          type="text"
          name="crop_name"
          value={filters.crop_name}
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
        <label>Quality Grade</label>
        <select name="quality_grade" value={filters.quality_grade} onChange={handleChange}>
          <option value="">All Grades</option>
          <option value="Grade A">Grade A</option>
          <option value="Grade B">Grade B</option>
          <option value="Grade C">Grade C</option>
          <option value="Reject">Reject</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Status</label>
        <div className="status-chips">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`status-chip${filters.status === opt.value ? ' active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, status: opt.value }))}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleReset} className="reset-btn">
        Reset Filters
      </button>
    </div>
  );
}
