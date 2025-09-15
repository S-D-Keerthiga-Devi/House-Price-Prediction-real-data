import mongoose from "mongoose";

const userSchema = new mongoose.Schema({    
    phone: {type: String, required: true, unique: true},
    phoneOtp: {type: String, default: ''}
})

const userModel = mongoose.models.user ||  mongoose.model('user', userSchema)

export default userModel;