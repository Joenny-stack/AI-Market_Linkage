import apiClient from './client';

export const getTomatoClassificationErrorMessage = (err) => {
  const status = err?.response?.status;
  const responseData = err?.response?.data;
  const apiMessage = String(responseData?.error || responseData?.detail || '').trim();
  const normalized = apiMessage.toLowerCase();

  if (normalized.includes('file too large')) {
    return 'Image is too large. Please upload an image up to 5MB.';
  }

  if (normalized.includes('invalid file type')) {
    return 'Unsupported image format. Use JPG, JPEG, PNG, GIF, or WEBP.';
  }

  if (normalized.includes('image file is required')) {
    return 'Please select an image before running AI analysis.';
  }

  if (status === 503 || normalized.includes('classifier unavailable')) {
    return 'AI service is temporarily unavailable. Try again shortly.';
  }

  if (status === 400 && apiMessage) {
    return apiMessage;
  }

  if (status >= 500) {
    return 'AI analysis failed due to a server error. Please try again.';
  }

  return 'AI analysis unavailable. Listing can still be created.';
};

const normalizeListingParams = (params = {}) => {
  const next = { ...params };

  // Backward compatibility for older clients that still send crop.
  if (!next.crop_name && next.crop) {
    next.crop_name = next.crop;
  }
  delete next.crop;

  // Remove empty values to avoid noisy query strings.
  return Object.fromEntries(
    Object.entries(next).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
};

export const classifyTomatoImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await apiClient.post('/ai/classify-tomato/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

// Authentication API calls
export const authAPI = {
  register: (data) => apiClient.post('/auth/register/', data),
  login: (email, password) => apiClient.post('/auth/login/', { email, password }),
  refresh: (refresh_token) => apiClient.post('/auth/refresh/', { refresh: refresh_token }),
  getProfile: () => apiClient.get('/auth/profile/me/'),
  updateProfile: (data) => apiClient.put('/auth/profile/update_profile/', data),
};

// Farmer API calls
export const farmerAPI = {
  getProfile: () => apiClient.get('/farmers/me/'),
  updateProfile: (data) => apiClient.put('/farmers/me/', data),
  getAllFarmers: (params) => apiClient.get('/farmers/', { params }),
};

// Listing API calls
export const listingAPI = {
  getListings: (params) => apiClient.get('/listings/', { params: normalizeListingParams(params) }),
  getListingDetail: (id) => apiClient.get(`/listings/${id}/`),
  createListing: (data) => apiClient.post('/listings/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateListing: (id, data) => apiClient.put(`/listings/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteListing: (id) => apiClient.delete(`/listings/${id}/`),
  getMyListings: () => apiClient.get('/listings/my_listings/'),
  addImages: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return apiClient.post(`/listings/${id}/add_images/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

// Inquiry API calls
export const inquiryAPI = {
  getInquiries: (params) => apiClient.get('/inquiries/', { params }),
  createInquiry: (data) => apiClient.post('/inquiries/', data),
  getByerInquiries: () => apiClient.get('/inquiries/buyer/'),
  getFarmerInquiries: () => apiClient.get('/inquiries/farmer/'),
  markResponded: (id) => apiClient.patch(`/inquiries/${id}/mark_responded/`),
};

// AI API calls
export const aiAPI = {
  classifyTomatoImage,
  recommendPrice: (crop, location, grade, quantity) =>
    apiClient.post('/ai/recommend-price/', { crop, location, grade, quantity }),
};

export default {
  authAPI,
  farmerAPI,
  listingAPI,
  inquiryAPI,
  aiAPI,
};
