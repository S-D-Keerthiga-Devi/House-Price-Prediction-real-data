import PostProperty from "../models/postPropertyModel.js";
import HomeInterior from "../models/homeInteriorModel.js";
import LegalServices from "../models/legalServicesModel.js";

// Submit Post Property
export const submitPostProperty = async (req, res) => {
    try {
        // Map form data to model schema
        const propertyData = {
            ownerName: req.body.ownerName || req.body.name || 'Not provided',
            mobile: req.body.mobile || req.body.mobileNumber || '',
            email: req.body.email || '',
            propertyType: req.body.propertyType || 'Not specified',
            city: req.body.city || 'Not specified',
            locality: req.body.locality || req.body.location || 'Not specified',
            price: req.body.price || '',
            area: req.body.area || '',
            bedrooms: req.body.bedrooms || req.body.rooms || '',
            description: req.body.description || req.body.propertyDescription || ''
        };
        const property = new PostProperty(propertyData);
        await property.save();
        res.status(201).json({ success: true, message: "Property posted successfully", data: property });
    } catch (error) {
        console.error('Error in submitPostProperty:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Home Interior
export const submitHomeInterior = async (req, res) => {
    try {
        // Map form data to model schema
        const interiorData = {
            name: req.body.fullName || req.body.name,
            mobile: req.body.mobileNumber || req.body.mobile,
            email: req.body.email,
            propertyType: req.body.propertyType || 'Not specified',
            city: req.body.city || 'Not provided',
            budget: req.body.budget || '',
            requirements: req.body.serviceNeed || req.body.requirements || req.body.interiorType || ''
        };
        const interior = new HomeInterior(interiorData);
        await interior.save();
        res.status(201).json({ success: true, message: "Home Interior request submitted successfully", data: interior });
    } catch (error) {
        console.error('Error in submitHomeInterior:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Legal Services
export const submitLegalServices = async (req, res) => {
    try {
        // Map form data to model schema
        const legalData = {
            name: req.body.fullName || req.body.name,
            mobile: req.body.mobileNumber || req.body.mobile,
            email: req.body.email,
            serviceType: req.body.serviceType,
            propertyDetails: req.body.propertyLocation || req.body.propertyDetails || req.body.propertyType || '',
            urgency: req.body.urgency || ''
        };
        const legal = new LegalServices(legalData);
        await legal.save();
        res.status(201).json({ success: true, message: "Legal Services request submitted successfully", data: legal });
    } catch (error) {
        console.error('Error in submitLegalServices:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
