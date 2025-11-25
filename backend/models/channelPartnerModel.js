import mongoose from "mongoose";

const channelPartnerSchema = new mongoose.Schema({
    partnerName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    experience: { type: String },
    reraNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ChannelPartner", channelPartnerSchema);
