import axiosInstance from "../utlis/axiosInstance.js";

export const houseDetails = async (city) => {
  try {
    const res = await axiosInstance.get(`/api/house/localities/${city}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching house details:", error);
    return { success: false, message: error.message };
  }
};
