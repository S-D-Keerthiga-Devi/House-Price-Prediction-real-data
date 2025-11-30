import axiosInstance from '../utlis/axiosInstance';

export const submitDealerConnect = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/dealer/dealer-connect', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitContactDeveloper = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/dealer/contact-developer', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitChannelPartner = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/dealer/channel-partner', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitRegistrationDocs = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/dealer/registration-docs', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
