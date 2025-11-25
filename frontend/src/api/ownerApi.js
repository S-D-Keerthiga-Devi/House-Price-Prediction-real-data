import axios from 'axios';

const API_URL = 'http://localhost:4000/api/owner';

export const submitPostProperty = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/post-property`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitHomeInterior = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/home-interior`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitLegalServices = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/legal-services`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
