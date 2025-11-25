import mongoose from "mongoose";

const legalServicesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    serviceType: { type: String, required: true },
    propertyDetails: { type: String },
    urgency: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("LegalServices", legalServicesSchema);
