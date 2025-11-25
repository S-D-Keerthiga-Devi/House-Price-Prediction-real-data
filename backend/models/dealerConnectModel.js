import mongoose from "mongoose";

const dealerConnectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    dealershipType: { type: String, required: true },
    city: { type: String, required: true },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DealerConnect", dealerConnectSchema);
