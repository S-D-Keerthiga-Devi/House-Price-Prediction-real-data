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

export const houseRates = async (city) => {
  try {
    const res = await axiosInstance.get(`/api/house/localities/${city}/rates`);
    return res.data.data; // Return the data array directly
  } catch (error) {
    console.error("Error fetching house details:", error);
    return { success: false, message: error.message };
  }
};

export const coordinates = async (city) => {
  if (!city) {
    return { success: false, message: "City is required" };
  }

  try {
    const res = await axiosInstance.get(`/api/house/coordinates/${city}/rates`);

    // full response from backend
    return {
      success: res.data.success,
      city: res.data.city,
      count: res.data.count,
      data: res.data.data, // array of records
    };
  } catch (error) {
    console.error("Error fetching house details:", error);
    return { success: false, message: error.message };
  }
};