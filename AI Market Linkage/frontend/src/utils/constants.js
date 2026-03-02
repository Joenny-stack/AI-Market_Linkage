export const MAP_CONFIG = {
  // Leaflet configuration
  mapProvider: 'leaflet', // or 'google'
  defaultZoom: 10,
  defaultCenter: [-17.8, 31.0], // Default center (Zimbabwe)
  attribution: '&copy; OpenStreetMap contributors'
};

export const API_TIMEOUT = 10000; // 10 seconds

export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFiles: 5
};

export const LISTING_CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Legumes',
  'Dairy',
  'Meat',
  'Spices',
  'Herbs',
  'Other'
];

export const UNITS = [
  'kg',
  'ton',
  'bag',
  'crate',
  'bundle',
  'box',
  'liter',
  'unit'
];

export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'ZWL',
  'KES',
  'UGX'
];

export const INQUIRIES_STATUSES = {
  NEW: 'New',
  RESPONDED: 'Responded'
};

export const LISTING_STATUSES = {
  AVAILABLE: 'Available',
  SOLD: 'Sold',
  PENDING: 'Pending'
};
