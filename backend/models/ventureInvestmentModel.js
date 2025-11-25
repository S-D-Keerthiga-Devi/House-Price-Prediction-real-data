import mongoose from "mongoose";

const ventureInvestmentSchema = new mongoose.Schema({
    investorName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    investmentAmount: { type: String, required: true },
    industryPreference: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("VentureInvestment", ventureInvestmentSchema);
