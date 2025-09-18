import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        phone: user.phone,
        countryCode: user.countryCode || "+91" // ensure fallback
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
