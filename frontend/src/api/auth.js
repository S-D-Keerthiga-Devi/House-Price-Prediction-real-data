import axios from "../utlis/axiosInstance.js"

export const loginUser = async(data) => {
    const res = await axios.post('/api/auth/verify-phone', data)
    return res.data
}

export const logoutUser = async(data) => {
    const res = await axios.post('/api/auth/logout', data)
    return res.data
}