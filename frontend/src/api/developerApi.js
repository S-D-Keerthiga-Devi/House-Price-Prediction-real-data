import axiosInstance from '../utlis/axiosInstance';

export const submitAdvertise = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/developer/advertise', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const submitVentureInvestment = async (formData) => {
    try {
        const response = await axiosInstance.post('/api/developer/venture-investment', formData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
