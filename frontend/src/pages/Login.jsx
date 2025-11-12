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
  const [mode, setMode] = useState("login"); // login or signup
  const [step, setStep] = useState("mobile"); // "mobile" or "otp"
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [name, setName] = useState("");

  // Step 1: Simulate sending OTP
  const handleSendOtp = () => {
    if (mode === "signup" && !name.trim()) {
      toast.error("Please enter your name to sign up");
      return;
    }
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
      // For testing purposes, if OTP is 1234, proceed with login
      if (otp === "1234") {
        const res = await loginUser({
          phone: mobile,
          otp,
          countryCode,
          mode,
          name: mode === "signup" ? name.trim() : undefined,
        });
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
          const messageText = res.message || "Invalid OTP";
          toast.error(messageText);
          const normalized = messageText.toLowerCase();
          if (normalized.includes("already exists")) {
            handleModeChange("login", { preserveMobile: true });
          } else if (normalized.includes("not found")) {
            handleModeChange("signup", { preserveMobile: true });
          }
        }
      } else {
        toast.error("Invalid OTP. Please use 1234 for testing.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleModeChange = (nextMode, options = {}) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setStep("mobile");
    if (!options.preserveMobile) {
      setMobile("");
    }
    setOtp("");
    if (nextMode === "login") {
      setName("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-6 mt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Logo + Branding */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 to-blue-600 text-white font-bold text-2xl shadow">
            H
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mt-2">
            {mode === "login"
              ? "Login to HousePredict"
              : "Create your HousePredict account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login"
              ? "Welcome back! Continue with your registered mobile number."
              : "Join us to manage your properties and services in one place."}
          </p>
          <div className="mt-4 text-sm text-gray-600">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => handleModeChange("signup")}
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => handleModeChange("login")}
                  className="text-blue-700 font-semibold hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>

        {step === "mobile" ? (
          <div className="space-y-4">
            {/* Instruction */}
            <p className="text-sm text-gray-600">
              {mode === "login"
                ? "Enter your mobile number to receive a one-time password."
                : "Enter your name and mobile number to receive a one-time password."}
            </p>

            {mode === "signup" && (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>
            )}

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
              We have sent an OTP to{" "}
              <span className="font-medium">
                {countryCode} {mobile}
              </span>
              .{" "}
              {mode === "signup"
                ? "Enter the code to complete your sign up."
                : "Enter the code to continue."}
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
              {mode === "signup" ? "Verify & Sign Up" : "Verify & Login"}
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