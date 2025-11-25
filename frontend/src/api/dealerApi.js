import axios from 'axios';

const API_URL = 'http://localhost:4000/api/dealer';

export const submitDealerConnect = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/dealer-connect`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitContactDeveloper = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/contact-developer`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitChannelPartner = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/channel-partner`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitRegistrationDocs = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/registration-docs`, formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
