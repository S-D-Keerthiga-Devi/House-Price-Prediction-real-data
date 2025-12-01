import mongoose from "mongoose";

const priceToIncomeSchema = new mongoose.Schema({
    city: { type: String, required: true },
    year: { type: String, required: true },
    propertyCost: { type: Number, required: true },
    affordability: { type: Number, required: true },
    annualIncome: { type: Number, required: true },
    sortDate: { type: Date, required: true }
}, { timestamps: true });

const PriceToIncome = mongoose.models.PriceToIncome || mongoose.model("PriceToIncome", priceToIncomeSchema);

export default PriceToIncome;
