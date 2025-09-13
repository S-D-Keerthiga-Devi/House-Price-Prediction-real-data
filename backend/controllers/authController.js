import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async(req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'})
    }

    try {

        const existingUser = await userModel.findOne({email})

        if(existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({name, email, password: hashedPassword});

        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending welcome email
        const mailOptions = {
            from: `"House Price Prediction Team" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "🏡 Welcome to House Price Prediction!",
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #2563eb;">Welcome to House Price Prediction 📊</h2>
                <p>Hi <b>${name}</b>,</p>
                <p>We’re thrilled to have you onboard! Your account has been successfully created. Now you can explore insights and predictions on housing prices with ease.</p>
                
                <div style="margin: 20px 0;">
                  <a href="https://your-frontend-url.com/login" 
                     style="background-color: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Login to Your Dashboard
                  </a>
                </div>
                
                <p>If you didn’t sign up for this account, please ignore this email.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} House Price Prediction Project. All rights reserved.</p>
              </div>
            `
          };
          
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "User registered successfully", user:{id: user._id, name: user.name, email: user.email}, token});

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required'})
    }

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: 'Invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: 'Invalid password'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, message: "Login successful", user:{id: user._id, name: user.name, email: user.email}, token});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
};

export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// send veification OTP to the User's Email
export const sendVerifyOtp = async(req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account Already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: `"House Price Prediction Team" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "🔑 House Price Prediction - Account Verification OTP",
            text: `Your OTP is ${otp}. Please use this OTP to verify your account.`, // fallback for non-HTML clients
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
                <h2 style="color: #2563eb;">Account Verification Required</h2>
                <p>Hello <b>${user.name}</b>,</p>
                <p>Use the following One-Time Password (OTP) to verify your House Price Prediction account:</p>
                
                <div style="text-align: center; margin: 20px 0;">
                  <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #222; background: #e0e0e0; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                    ${otp}
                  </span>
                </div>
                
                <p style="color: #d9534f; font-size: 14px;">
                  <b>Note:</b> This OTP will expire in 10 minutes. Do not share it with anyone.
                </p>
                
                <hr style="margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} House Price Prediction Project. All rights reserved.</p>
              </div>
            `
          };          
          
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Verification OTP Sent on Email"})

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async(req, res) => {
    const userId = req.user.id;
    const {otp} = req.body;
    if(!userId || !otp){
        return res.json({success: false, message: "Missing Details"});
    }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: "Email verified successfully"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export const isAuthenticated = async(req, res) => {
    try {
        return res.json({success: true})
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Send password Reset OTP
export const sendResetOtp = async(req, res) =>{
    const {email} = req.body;
    if(!email){
        return res.json({success: false, message: "Email is required"});
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            if(!email){
                return res.json({success: false, message: "User not found"});
            }
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: `"House Price Prediction Team" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "🔑 House Price Prediction - Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. This OTP will expire in 10 minutes. Use this OTP to proceed with resetting your password.`, // fallback for non-HTML clients
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
                <h2 style="color: #2563eb;">Password Reset Request</h2>
                <p>Hello <b>${user.name}</b>,</p>
                <p>We received a request to reset your House Price Prediction account password. Use the following One-Time Password (OTP) to proceed:</p>
                
                <div style="text-align: center; margin: 20px 0;">
                  <span style="font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #222; background: #e0e0e0; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                    ${otp}
                  </span>
                </div>
                
                <p style="color: #d9534f; font-size: 14px;">
                  <b>Note:</b> This OTP will expire in 10 minutes. Do not share it with anyone.
                </p>
                
                <hr style="margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">If you did not request a password reset, please ignore this email.</p>
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} House Price Prediction Project. All rights reserved.</p>
              </div>
            `
          };               
          
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "OTP sent to your email"});

    }
    catch (error) {
        return res.json({success: false, message: error.message});
    }
}

// Reset User Password
export const resetPassword = async(req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "Email, OTP and new Password is required"});
    }

    try {
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        user.resetOtp = ""
        user.resetOtpExpireAt = 0

        await user.save()

        return res.json({success: true, message: "Password has been reset successfully"});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}