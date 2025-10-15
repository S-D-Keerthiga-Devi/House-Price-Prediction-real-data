import mongoose from 'mongoose';

const interiorDesignSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roomType: { type: String, required: true },
    designStyle: { type: String, required: true },
    additionalRequirements: { type: String },
    inputImageUrl: { type: String, required: true },
    resultImageUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    provider: { type: String, default: 'replicate' },
    providerResponse: { type: Object },
  },
  { timestamps: true }
);

const InteriorDesign = mongoose.model('InteriorDesign', interiorDesignSchema);

export default InteriorDesign;
