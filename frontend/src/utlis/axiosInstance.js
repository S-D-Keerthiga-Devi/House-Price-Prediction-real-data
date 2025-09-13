import axios from "axios"
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // This now correctly adds the header to the outgoing request
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
  
export default instance;