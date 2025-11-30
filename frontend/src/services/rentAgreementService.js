import axiosInstance from '../utlis/axiosInstance';

// Create a new rent agreement
export const createRentAgreement = async (agreementData) => {
  try {
    const response = await axiosInstance.post('/api/rent-agreement', agreementData);
    return response;
  } catch (error) {
    console.error('Error creating rent agreement:', error);
    throw error.response?.data || { message: 'Failed to create rent agreement' };
  }
};

// Get all rent agreements for the logged-in user
export const getUserRentAgreements = async () => {
  try {
    const response = await axiosInstance.get('/api/rent-agreement');
    return response;
  } catch (error) {
    console.error('Error fetching rent agreements:', error);
    throw error.response?.data || { message: 'Failed to fetch rent agreements' };
  }
};

// Get a specific rent agreement by ID
export const getRentAgreementById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/rent-agreement/${id}`);

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
    const response = await axiosInstance.put(`/api/rent-agreement/${id}`, agreementData);
    return response.data;
  } catch (error) {
    console.error('Error updating rent agreement:', error);
    throw error.response?.data || { message: 'Failed to update rent agreement' };
  }
};

// Delete a rent agreement
export const deleteRentAgreement = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/rent-agreement/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rent agreement:', error);
    throw error.response?.data || { message: 'Failed to delete rent agreement' };
  }
};