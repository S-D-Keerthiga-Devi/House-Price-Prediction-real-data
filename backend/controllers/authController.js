import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const verifyPhone = async (req, res) => {
  const { phone, otp, countryCode } = req.body; // get countryCode from frontend

  if (!phone || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    let user = await userModel.findOne({ phone });

    // 🔹 Case 1: New user → create with OTP and countryCode
    if (!user) {
      if (otp !== "1234") {
        return res.json({ success: false, message: "Invalid OTP" });
      }

      user = new userModel({
        phone,
        countryCode: countryCode || "+91"
      });
      await user.save();

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
        message: "Sign up successful",
        user: { id: user._id, phone: user.phone, countryCode: user.countryCode },
        token,
      });
    }

    // 🔹 Case 2: Existing user → verify OTP
    if (otp !== "1234") {
      return res.json({ success: false, message: "Invalid OTP" });
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
      message: "Login successful",
      user: { id: user._id, phone: user.phone, countryCode: user.countryCode },
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