import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    phone: { type: String, required: true, unique: true },
    countryCode: { type: String, default: "+91" },  // added
    phoneOtp: { type: String, default: '' }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;