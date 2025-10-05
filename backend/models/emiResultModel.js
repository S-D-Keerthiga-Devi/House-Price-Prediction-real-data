import mongoose from 'mongoose';

const emiResultSchema = new mongoose.Schema({
  loanAmount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  interest: { type: Number, required: true },
  emi: { type: Number, required: true },
  totalInterest: { type: Number, required: true },
  processingFees: { type: Number, required: true },
  prePayment: {
    amount: Number,
    frequency: String,
    startDate: String
  },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const emiResultModel = mongoose.models.emiResult || mongoose.model('emiResult', emiResultSchema);

export default emiResultModel;