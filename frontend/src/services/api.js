// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add token from localStorage if needed as fallback
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored auth data
      localStorage.removeItem('token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;