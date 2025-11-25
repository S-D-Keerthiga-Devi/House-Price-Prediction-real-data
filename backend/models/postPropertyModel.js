import mongoose from "mongoose";

const postPropertySchema = new mongoose.Schema({
    ownerName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    propertyType: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    price: { type: String },
    area: { type: String },
    bedrooms: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PostProperty", postPropertySchema);
