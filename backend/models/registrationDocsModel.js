import mongoose from "mongoose";

const registrationDocsSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    documentType: { type: String, required: true },
    propertyDetails: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RegistrationDocs", registrationDocsSchema);
