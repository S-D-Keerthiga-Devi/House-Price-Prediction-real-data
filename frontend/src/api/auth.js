import axios from "../utlis/axiosInstance.js"

export const loginUser = async(data) => {
    try {
        const res = await axios.post('/api/auth/verify-phone', data)
        return res.data
    } catch (error) {
        console.error('Login error:', error.message);
        // Return a structured error response
        return {
            success: false,
            message: error.response?.data?.message || 'Network error. Please check your connection and try again.'
        }
    }
}

export const logoutUser = async() => {
    try {
        const res = await axios.post('/api/auth/logout')
        return res.data
    } catch (error) {
        console.error('Logout error:', error.message);
        return {
            success: false,
            message: 'Failed to logout. Please try again.'
        }
    }
}