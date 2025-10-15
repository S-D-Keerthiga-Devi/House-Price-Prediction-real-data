import api from '../utlis/axiosInstance';

export const generateInteriorDesign = async ({ imageBase64, roomType, designStyle, additionalRequirements }) => {
    const res = await api.post('/api/interior/generate', { imageBase64, roomType, designStyle, additionalRequirements });
    return res.data;
};

export const listInteriorDesigns = async () => {
    const res = await api.get('/api/interior');
    return res.data;
};


