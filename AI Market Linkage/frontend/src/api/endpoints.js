import apiClient from './client';

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
  getListings: (params) => apiClient.get('/listings/', { params }),
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

export default {
  authAPI,
  farmerAPI,
  listingAPI,
  inquiryAPI,
};
