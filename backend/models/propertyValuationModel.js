import mongoose from "mongoose";

const propertyValuationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    propertyType: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    location: { type: String },
    bedrooms: { type: Number },
    areaUnit: { type: String },
    buildUpType: { type: String },
    possessionStatus: { type: String },
    coveredParking: { type: Number },
    openParking: { type: Number },
    age: { type: Number },
    furnishingStatus: { type: String },
    tower: { type: String },
    totalTowers: { type: String },
    floor: { type: Number },
    totalFloors: { type: Number },
    view: { type: String },
    facing: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PropertyValuation", propertyValuationSchema);
