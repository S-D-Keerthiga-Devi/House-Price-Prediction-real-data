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

// New function for fetching properties for comparison
export const getPropertiesForComparison = async (data) => {
  if (!data) {
    return { success: false, message: "Property data is required" };
  }

  try {
    // If data is an array, it's location/city data
    // If data is an object with propertyIds, it's property IDs
    const body = Array.isArray(data) ? { properties: data } : data;
    
    const res = await axiosInstance.post(`/api/house/comparator`, body);
    return res.data;
  } catch (error) {
    console.error("Error fetching properties for comparison:", error);
    return { success: false, message: error.message };
  }
};

// Function to get localities by city
export const getLocalitiesByCity = async (city) => {
  if (!city) {
    return { success: false, message: "City is required" };
  }

  try {
    const res = await axiosInstance.get(`/api/house/localities/${city}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching localities by city:", error);
    return { success: false, message: error.message };
  }
};

// Function to get all available cities
export const getCities = async () => {
  try {
    const res = await axiosInstance.get(`/api/house/cities`);
    return res.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return { success: false, message: error.message };
  }
};