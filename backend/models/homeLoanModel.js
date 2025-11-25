import mongoose from "mongoose";

const homeLoanSchema = new mongoose.Schema({
    loanAmount: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    city: { type: String, required: true },
    propertyFinalized: { type: String, enum: ['yes', 'no'], required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("HomeLoan", homeLoanSchema);
