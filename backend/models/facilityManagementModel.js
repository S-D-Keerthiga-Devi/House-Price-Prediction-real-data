import mongoose from "mongoose";

const facilityManagementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    propertyType: { type: String, required: true },
    serviceType: { type: String, required: true },
    additionalDetails: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("FacilityManagement", facilityManagementSchema);
