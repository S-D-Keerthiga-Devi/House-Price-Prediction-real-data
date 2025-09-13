import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { emailVerify, getEmailVerifyOtp } from "../api/auth.js";
import { updateUser } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";

export default function EmailVerify() {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSentOtp = async () => {
    try {
      const res = await getEmailVerifyOtp({ userData });

      if (res?.success) {
        toast.success(res.message || "OTP sent to your email");
        setOtpSent(true);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleVerifyEmail = async (otpValue) => {
    try {
      const res = await emailVerify({ ...userData, otp: otpValue });

      if (res?.success) {
        dispatch(updateUser(res.user));
        toast.success(res.message || "Email verified successfully");
        navigate("/dashboard");
      } else {
        toast.error(res.message || "Invalid OTP, try again");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-blue-200">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow">
            H
          </div>
          <h1 className="text-2xl font-bold text-blue-800 mt-3">
            HousePredict
          </h1>
          <p className="text-gray-500 text-sm -mt-1">
            Smart Property Search
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Email Verification
        </h2>

        {/* Step 1: Send OTP */}
        {!otpSent ? (
          <div className="text-center">
            <Mail className="mx-auto mb-4 text-blue-700" size={40} />
            <p className="text-gray-600 mb-4">
              Click below to send an OTP to your registered email:{" "}
              <span className="font-semibold text-gray-800">
                {userData?.email}
              </span>
            </p>
            <button
              onClick={handleSentOtp}
              className="w-full py-2 px-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <>
            {/* Step 2: Enter OTP */}
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit OTP"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Step 3: Verify */}
            <button
              onClick={() => handleVerifyEmail(otp)}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Verify Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
