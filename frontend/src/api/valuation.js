import axiosInstance from "../utlis/axiosInstance.js";

export const estimateValuation = async (payload) => {
  try {
    const res = await axiosInstance.post('/api/valuation/estimate', payload);
    return res.data;
  } catch (e) {
    console.error('Failed to estimate valuation', e);
    return { success: false, message: e.message };
  }
};


