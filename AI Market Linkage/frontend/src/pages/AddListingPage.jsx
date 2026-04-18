import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI, classifyTomatoImage, listingAPI } from '../api/endpoints';
import AIQualityResult from '../components/AIQualityResult';
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
    location: '',
    province: '',
    district: '',
    latitude: '',
    longitude: '',
    gps_latitude: '',
    gps_longitude: '',
    status: 'AVAILABLE',
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiPrediction, setAiPrediction] = useState('');
  const [aiConfidence, setAiConfidence] = useState(null);
  const [aiGrade, setAiGrade] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPriceRecommendation, setAiPriceRecommendation] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [detectedLocation, setDetectedLocation] = useState('');

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by this browser. Enter location manually.');
      return;
    }

    setGeoLoading(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));

        setFormData((prev) => ({
          ...prev,
          latitude: String(lat),
          longitude: String(lng),
          gps_latitude: String(lat),
          gps_longitude: String(lng),
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          const address = data?.address || {};
          const city = address.city || address.town || address.village || '';
          const state = address.state || address.county || '';
          const locationText = [city, state].filter(Boolean).join(', ');

          setDetectedLocation(locationText || 'Location detected');
          setFormData((prev) => ({
            ...prev,
            district: prev.district || city,
            province: prev.province || state,
            location: locationText || prev.location || city || state,
          }));
        } catch {
          setDetectedLocation(`${lat}, ${lng}`);
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Please enter location manually.');
        } else {
          setGeoError('Could not detect location. Please enter location manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };
  // Auto-fetch price recommendation when grade + crop are known
  useEffect(() => {
    const crop = formData.crop_name.trim();
    if (!aiGrade || !crop) {
      setAiPriceRecommendation(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setPriceLoading(true);
      try {
        const resp = await aiAPI.recommendPrice(
          crop || 'Tomatoes',
          formData.location.trim() || formData.province.trim() || 'Harare',
          aiGrade,
          parseFloat(formData.quantity_available) || 100,
        );
        if (!cancelled) setAiPriceRecommendation(resp.data.recommended_price);
      } catch {
        if (!cancelled) setAiPriceRecommendation(null);
      } finally {
        if (!cancelled) setPriceLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [aiGrade, formData.crop_name, formData.location, formData.province, formData.quantity_available]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'latitude' ? { gps_latitude: value } : {}),
      ...(name === 'longitude' ? { gps_longitude: value } : {}),
      ...(name === 'gps_latitude' ? { latitude: value } : {}),
      ...(name === 'gps_longitude' ? { longitude: value } : {}),
    }));
  };

  const handleImageChange = async (e) => {
    const selectedImages = Array.from(e.target.files || []);
    setImages(selectedImages);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!selectedImages.length) {
      setImagePreview('');
      setAiPrediction('');
      setAiConfidence(null);
      setAiGrade('');
      setAiError('');
      setAiLoading(false);
      setAiPriceRecommendation(null);
      return;
    }

    setImagePreview(URL.createObjectURL(selectedImages[0]));

    await analyzeImage(selectedImages[0]);
  };

  const analyzeImage = async (imageFile) => {
    if (!imageFile) {
      return;
    }

    setAiLoading(true);
    setAiError('');
    try {
      const prediction = await classifyTomatoImage(imageFile);
      setAiPrediction(prediction.class || '');
      setAiConfidence(typeof prediction.confidence === 'number' ? prediction.confidence : null);
      setAiGrade(prediction.grade || '');
    } catch {
      setAiPrediction('');
      setAiConfidence(null);
      setAiGrade('');
      setAiError('AI analysis unavailable. Listing can still be created.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleReanalyze = async () => {
    if (!images.length || aiLoading) {
      return;
    }

    await analyzeImage(images[0]);
  };

  const buildListingPayload = (includeAI = true) => {
    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value !== '' && value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    images.forEach((image) => {
      payload.append('images', image);
    });

    if (includeAI && aiPrediction && aiGrade && typeof aiConfidence === 'number') {
      payload.append('ai_class', aiPrediction);
      payload.append('quality_grade', aiGrade);
      payload.append('confidence_score', String(aiConfidence));
    }

    if (typeof aiPriceRecommendation === 'number') {
      payload.append('recommended_price', String(aiPriceRecommendation));
    }

    return payload;
  };

  const shouldRetryWithoutAI = (err) => {
    const responseData = err?.response?.data;
    const text = JSON.stringify(responseData || '').toLowerCase();
    return text.includes('unexpected field') || text.includes('ai_class') || text.includes('quality_grade') || text.includes('confidence_score');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payloadWithAI = buildListingPayload(true);
      await listingAPI.createListing(payloadWithAI);
      navigate('/farmer/listings');
    } catch (err) {
      if (aiPrediction && shouldRetryWithoutAI(err)) {
        try {
          const payloadWithoutAI = buildListingPayload(false);
          await listingAPI.createListing(payloadWithoutAI);
          navigate('/farmer/listings');
          return;
        } catch (retryErr) {
          setError(retryErr.response?.data?.detail || 'Failed to create listing');
        }
      } else {
        setError(err.response?.data?.detail || 'Failed to create listing');
      }
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
              <label>Quantity Available (kg) *</label>
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
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price Per Kg *</label>
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

          <div className="form-group">
            <label>Detected Location</label>
            {geoLoading && <p className="hint">Detecting location...</p>}
            {!geoLoading && detectedLocation && <p className="hint">Detected: {detectedLocation}</p>}
            {!geoLoading && geoError && <p className="ai-error">{geoError}</p>}
            <button type="button" className="btn btn-secondary btn-sm" onClick={detectLocation} disabled={geoLoading}>
              {geoLoading ? 'Detecting...' : 'Detect My GPS Location'}
            </button>
          </div>

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
              <label>Location <span className="optional-label">(optional)</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Gweru, Midlands"
              />
            </div>

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

          {/* Coordinates are set automatically by GPS detection above. Manual override is available if needed. */}
          {formData.latitude && formData.longitude && (
            <p className="hint" style={{ marginBottom: '0.5rem' }}>
              📍 GPS coordinates captured: {formData.latitude}, {formData.longitude}
            </p>
          )}
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

            {imagePreview && (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Selected produce" className="image-preview" />
              </div>
            )}

            {aiLoading && <p className="ai-loading">Analyzing tomato quality...</p>}

            {!aiLoading && (aiPrediction || aiGrade || typeof aiConfidence === 'number') && (
              <AIQualityResult
                prediction={aiPrediction}
                confidence={aiConfidence}
                grade={aiGrade}
                recommendedPrice={aiPriceRecommendation}
                priceLoading={priceLoading}
              />
            )}

            {!aiLoading && aiError && <p className="ai-error">{aiError}</p>}

            {!!images.length && (
              <div className="ai-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleReanalyze}
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Analyzing...' : 'Re-analyze'}
                </button>
              </div>
            )}
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
