import axiosInstance from '../utlis/axiosInstance';

export const submitPostProperty = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/owner/post-property', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitHomeInterior = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/owner/home-interior', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitLegalServices = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/owner/legal-services', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
