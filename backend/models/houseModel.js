import mongoose from "mongoose";

const houseSchema = new mongoose.Schema({
  city: { type: String, required: true },
  location: { type: String, required: true },
  year: Number,
  month: String,
  quarter: String,
  property_category: String,
  rate_sqft: Number
});

// ✅ Avoid model overwrite error in dev
const houseModel = mongoose.models.House || mongoose.model("House", houseSchema);

export default houseModel;
