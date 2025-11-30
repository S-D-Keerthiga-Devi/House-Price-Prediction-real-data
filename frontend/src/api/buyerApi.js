import axiosInstance from '../utlis/axiosInstance';

export const submitPropertyValuation = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/buyer/property-valuation', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitHomeLoan = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/buyer/home-loan', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitFacilityManagement = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/buyer/facility-management', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitEscrowService = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/escrow', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
