import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/auth";
import { login as authLogin } from "../store/authSlice";
import { toast } from "react-toastify";
import CountryCodeSelect from "@/components/CountryCodeSelect";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [step, setStep] = useState("mobile"); // "mobile" or "otp"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

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
      const res = await loginUser({ phone: mobile, otp, countryCode });
      if (res.success) {
        // Include countryCode in userData
        const userWithCode = { ...res.user, countryCode };
        dispatch(authLogin({ userData: userWithCode }));

        // Save token and userData in localStorage
        localStorage.setItem("token", res.token);
        localStorage.setItem("userData", JSON.stringify(userWithCode));

        toast.success(res.message || "Login Successful");
        
        // Check if there's a redirect path in location state
        const { state } = location;
        if (state && state.from) {
          navigate(state.from);
        } else {
          navigate("/dashboard");
        }
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
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-blue-600 text-white font-bold text-2xl shadow">
            H
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mt-2">
            Login to HousePredict
          </h2>

        </div>

        {step === "mobile" ? (
          <div className="space-y-4">
            {/* Instruction */}
            <p className="text-sm text-gray-600">
              Enter your mobile number to get started
            </p>

            <div className="space-y-2">
              {/* Mobile label */}
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>

              {/* Container for country code + mobile input */}
              <div className="flex">
                <CountryCodeSelect
                  value={countryCode}
                  onChange={setCountryCode}
                  className="border border-gray-300 rounded-l-lg bg-gray-100 text-sm"
                />
                <input
                  type="tel"
                  id="mobile"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 border-l-0 rounded-r-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* OTP sent message */}
            <p className="text-sm text-gray-600">
              We have sent an OTP to <span className="font-medium">{countryCode} {mobile}</span>
            </p>

            <div className="space-y-2">
              {/* OTP input */}
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-800 text-white py-2 rounded-lg font-medium hover:bg-blue-900 transition"
            >
              Verify & Login
            </button>

            <div className="text-center space-y-1">
              <p className="text-sm text-gray-600">
                Didn’t get the OTP?{" "}
                <button
                  onClick={handleSendOtp}
                  className="text-blue-700 font-medium hover:underline"
                >
                  Resend
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => setStep("mobile")}
                  className="text-blue-700 font-medium hover:underline"
                >
                  Change Mobile Number
                </button>
              </p>
            </div>
          </div>
        )}


        {/* ✅ Divider */}
        <div className="mt-6 border-t border-gray-200"></div>

        {/* ✅ Disclaimer at the bottom */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-blue-700 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-700 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;