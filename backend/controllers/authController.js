import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const verifyPhone = async (req, res) => {
  const {
    phone,
    otp,
    countryCode,
    name,
    mode = "login"
  } = req.body; // get countryCode from frontend

  if (!phone || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  if (!["login", "signup"].includes(mode)) {
    return res.json({ success: false, message: "Invalid auth mode" });
  }

  try {
    let user = await userModel.findOne({ phone });

    if (mode === "signup") {
      if (!name || !name.trim()) {
        return res.json({
          success: false,
          message: "Name is required to sign up",
        });
      }

      if (user) {
        return res.json({
          success: false,
          message: "An account with this number already exists. Please login.",
        });
      }

      if (otp !== "1234") {
        return res.json({ success: false, message: "Invalid OTP" });
      }

      user = new userModel({
        name: name.trim(),
        phone,
        countryCode: countryCode || "+91",
      });
      await user.save();
    } else {
      if (!user) {
        return res.json({
          success: false,
          message: "Account not found. Please sign up first.",
        });
      }

      if (otp !== "1234") {
        return res.json({ success: false, message: "Invalid OTP" });
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message:
        mode === "signup" ? "Sign up successful" : "Login successful",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        countryCode: user.countryCode,
      },
      token,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}