import axios from 'axios';

const API_URL = 'http://localhost:4000/api/developer';

export const submitAdvertise = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/advertise`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitVentureInvestment = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/venture-investment`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
