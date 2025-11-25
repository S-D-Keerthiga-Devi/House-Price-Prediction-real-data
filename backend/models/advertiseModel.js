import mongoose from "mongoose";

const advertiseSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    adType: { type: String, required: true },
    budget: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Advertise", advertiseSchema);
