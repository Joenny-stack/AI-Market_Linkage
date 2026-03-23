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
    province: '',
    district: '',
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

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
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
          formData.province.trim() || 'Harare',
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
  }, [aiGrade, formData.crop_name, formData.province, formData.quantity_available]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      payload.append(key, formData[key]);
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
