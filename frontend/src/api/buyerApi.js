import axios from 'axios';

const API_URL = 'http://localhost:4000/api/buyer';
const ESCROW_API_URL = 'http://localhost:4000/api/escrow';

export const submitPropertyValuation = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/property-valuation`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitHomeLoan = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/home-loan`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitFacilityManagement = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/facility-management`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitEscrowService = async (formData) => {
    try {
        const response = await axios.post(`${ESCROW_API_URL}`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
