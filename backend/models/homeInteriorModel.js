import mongoose from "mongoose";

const homeInteriorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    propertyType: { type: String, required: true },
    city: { type: String, required: true },
    budget: { type: String },
    requirements: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("HomeInterior", homeInteriorSchema);
