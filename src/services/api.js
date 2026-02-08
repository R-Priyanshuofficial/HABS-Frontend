import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('habs_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('habs_auth_token');
      localStorage.removeItem('habs_auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Hospitals API
export const hospitalAPI = {
  getAll: (params = {}) => api.get('/hospitals', { params }),
  getById: (id) => api.get(`/hospitals/${id}`),
  search: (term) => api.get(`/hospitals/search/${term}`),
  updateQueue: (id, data) => api.patch(`/hospitals/${id}/queue`, data),
};

// Specialties API
export const specialtyAPI = {
  getAll: (params = {}) => api.get('/specialties', { params }),
  searchBySymptom: (symptom) => api.get(`/specialties/search-symptom/${symptom}`),
};

// Slots API
export const slotAPI = {
  getAll: (params = {}) => api.get('/slots', { params }),
  getById: (id) => api.get(`/slots/${id}`),
  getByHospital: (hospitalId, params = {}) => api.get(`/slots/hospital/${hospitalId}`, { params }),
  create: (data) => api.post('/slots', data),
  update: (id, data) => api.put(`/slots/${id}`, data),
  delete: (id) => api.delete(`/slots/${id}`),
  toggle: (id) => api.patch(`/slots/${id}/toggle`),
  close: (id) => api.patch(`/slots/${id}/close`),
};

// Bookings API (Updated for authenticated users)
export const bookingAPI = {
  create: (data) => api.post('/bookings', data), // One-click booking
  getMyBookings: () => api.get('/bookings/me'), // Get authenticated user's bookings
  getById: (id) => api.get(`/bookings/${id}`),
  getByHospital: (hospitalId, params = {}) => api.get(`/bookings/hospital/${hospitalId}`, { params }),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
