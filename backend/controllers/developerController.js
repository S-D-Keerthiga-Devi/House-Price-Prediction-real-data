import Advertise from "../models/advertiseModel.js";
import VentureInvestment from "../models/ventureInvestmentModel.js";

// Submit Advertise With Us
export const submitAdvertise = async (req, res) => {
    try {
        // Map form data to model schema
        const advertiseData = {
            companyName: req.body.companyName || req.body.name || 'Not provided',
            contactPerson: req.body.name || req.body.contactPerson,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber || req.body.mobile || (req.body.countryCode ? `${req.body.countryCode}${req.body.mobile}` : req.body.mobile),
            adType: req.body.lookingTo || req.body.adType || 'General',
            budget: req.body.budget || 'Not specified',
            message: req.body.message || `User Type: ${req.body.userType}, Property Type: ${req.body.propertyType}, City: ${req.body.city || 'Not specified'}`
        };
        const advertise = new Advertise(advertiseData);
        await advertise.save();
        res.status(201).json({ success: true, message: "Advertising request submitted successfully", data: advertise });
    } catch (error) {
        console.error('Error in submitAdvertise:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Venture Investment
export const submitVentureInvestment = async (req, res) => {
    try {
        // Map form data to model schema
        const investmentData = {
            investorName: req.body.firstName || req.body.investorName || req.body.name,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber || req.body.mobile,
            investmentAmount: req.body.investmentAmount || 'Not specified',
            industryPreference: req.body.industryPreference || 'Not specified',
            message: req.body.message || `Risk Tolerance: ${req.body.riskTolerance || 'Not specified'}`
        };
        const investment = new VentureInvestment(investmentData);
        await investment.save();
        res.status(201).json({ success: true, message: "Venture Investment request submitted successfully", data: investment });
    } catch (error) {
        console.error('Error in submitVentureInvestment:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
