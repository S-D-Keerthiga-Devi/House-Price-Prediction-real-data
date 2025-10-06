import axios from 'axios';

// Fix the API_URL to properly handle environment variables
const API_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : 'http://localhost:4000/api';

console.log('Rent Agreement Service using API URL:', API_URL);

// Create a new rent agreement
export const createRentAgreement = async (agreementData) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_URL}/rent-agreement`, agreementData, {
      withCredentials: true,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error creating rent agreement:', error);
    throw error.response?.data || { message: 'Failed to create rent agreement' };
  }
};

// Get all rent agreements for the logged-in user
export const getUserRentAgreements = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/rent-agreement`, {
      withCredentials: true,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching rent agreements:', error);
    throw error.response?.data || { message: 'Failed to fetch rent agreements' };
  }
};

// Get a specific rent agreement by ID
export const getRentAgreementById = async (id) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/rent-agreement/${id}`, {
      withCredentials: true,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    // Validate response structure before returning
    if (!response || !response.data) {
      throw new Error('Invalid response structure');
    }
    
    return response;
  } catch (error) {
    console.error('Error in getRentAgreementById:', error);
    throw error.response?.data || { message: 'Failed to fetch rent agreement', error: error.message };
  }
};

// Update a rent agreement
export const updateRentAgreement = async (id, agreementData) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await axios.put(`${API_URL}/rent-agreement/${id}`, agreementData, {
      withCredentials: true,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating rent agreement:', error);
    throw error.response?.data || { message: 'Failed to update rent agreement' };
  }
};

// Delete a rent agreement
export const deleteRentAgreement = async (id) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_URL}/rent-agreement/${id}`, {
      withCredentials: true,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting rent agreement:', error);
    throw error.response?.data || { message: 'Failed to delete rent agreement' };
  }
};