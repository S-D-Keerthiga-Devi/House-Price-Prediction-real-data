import mongoose from "mongoose";

const contactDeveloperSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    developerName: { type: String, required: true },
    projectInterest: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ContactDeveloper", contactDeveloperSchema);
