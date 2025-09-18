import { createSlice } from "@reduxjs/toolkit";

// Initialize from localStorage
const storedUser = JSON.parse(localStorage.getItem("userData"));
const storedStatus = localStorage.getItem("status") === "true";

const initialState = {
    status: storedStatus || false,
    userData: storedUser || { phone: null, countryCode: "+91" } // default country code
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = { ...state.userData, ...action.payload.userData };
            // Persist to localStorage
            localStorage.setItem("status", JSON.stringify(true));
            localStorage.setItem("userData", JSON.stringify(state.userData));
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            // Remove from localStorage
            localStorage.removeItem("status");
            localStorage.removeItem("userData");
            localStorage.removeItem("token"); // optional if you store token
        },
        updateUser: (state, action) => {
            state.userData = { ...state.userData, ...action.payload };
            // Update localStorage
            localStorage.setItem("userData", JSON.stringify(state.userData));
        }
    }
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;