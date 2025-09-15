import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/auth";
import { login as authLogin } from "../store/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState("mobile"); // "mobile" or "otp"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  // Step 1: Simulate sending OTP
  const handleSendOtp = () => {
    if (!mobile || mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    toast.success("OTP sent successfully (use 1234)");
    setStep("otp");
  };

  // Step 2: Verify OTP with backend
  const handleVerifyOtp = async () => {
    try {
      const res = await loginUser({ phone: mobile, otp });
      if (res.success) {
        dispatch(authLogin({ userData: res.user }));
        localStorage.setItem("token", res.token);
        toast.success(res.message || "Login Successful");
        navigate("/dashboard");
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6 mt-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo + Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-blue-600 text-white font-bold text-2xl shadow">
            H
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mt-3">
            Login to HousePredict
          </h2>
          <p className="text-sm text-gray-500">
            Smart way to explore properties
          </p>
        </div>

        {step === "mobile" ? (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP (1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition"
            >
              Verify & Login
            </button>

            <p className="text-sm text-gray-600 text-center">
              Didn’t get the OTP?{" "}
              <button
                onClick={handleSendOtp}
                className="text-blue-700 font-medium hover:underline"
              >
                Resend
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
