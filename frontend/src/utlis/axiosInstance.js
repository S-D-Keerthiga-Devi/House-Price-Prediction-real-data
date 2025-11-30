import axios from "axios"
console.log("DEBUG: VITE_BACKEND_URL is:", import.meta.env.VITE_BACKEND_URL);
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://house-price-prediction-real-data.onrender.com",
    withCredentials: true
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // This now correctly adds the header to the outgoing request
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making API request to:', config.baseURL + config.url);
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => {
        console.log('API Response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export default instance;