import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:4000/api' || 'https://house-price-prediction-real-data.onrender.com';

// Create a new rent agreement
export const createRentAgreement = async (agreementData) => {
  try {
    const response = await axios.post(`${API_URL}/rent-agreement`, agreementData, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create rent agreement' };
  }
};

// Get all rent agreements for the logged-in user
export const getUserRentAgreements = async () => {
  try {
    const response = await axios.get(`${API_URL}/rent-agreement`, {
      withCredentials: true
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch rent agreements' };
  }
};

// Get a specific rent agreement by ID
export const getRentAgreementById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/rent-agreement/${id}`, {
      withCredentials: true
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
    const response = await axios.put(`${API_URL}/rent-agreement/${id}`, agreementData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update rent agreement' };
  }
};

// Delete a rent agreement
export const deleteRentAgreement = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/rent-agreement/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete rent agreement' };
  }
};