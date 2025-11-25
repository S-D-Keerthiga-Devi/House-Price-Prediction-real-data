import DealerConnect from "../models/dealerConnectModel.js";
import ContactDeveloper from "../models/contactDeveloperModel.js";
import ChannelPartner from "../models/channelPartnerModel.js";
import RegistrationDocs from "../models/registrationDocsModel.js";

// Submit Dealer Connect
export const submitDealerConnect = async (req, res) => {
    try {
        // Map form data to model schema
        const dealerData = {
            name: req.body.firstName || req.body.name || 'Not provided',
            mobile: req.body.mobileNumber || req.body.mobile || '',
            email: req.body.email || '',
            dealershipType: req.body.dealershipType || 'Not specified',
            city: req.body.city || req.body.location || 'Not provided',
            message: req.body.additionalInfo || req.body.message || ''
        };
        const dealer = new DealerConnect(dealerData);
        await dealer.save();
        res.status(201).json({ success: true, message: "Dealer connection request submitted successfully", data: dealer });
    } catch (error) {
        console.error('Error in submitDealerConnect:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Contact Developer
export const submitContactDeveloper = async (req, res) => {
    try {
        // Map form data to model schema
        const contactData = {
            name: req.body.firstName || req.body.name,
            mobile: req.body.mobileNumber || req.body.mobile,
            email: req.body.email,
            developerName: req.body.company || req.body.developerName || 'Not specified',
            projectInterest: req.body.inquiryType || req.body.projectInterest,
            message: req.body.message || req.body.projectDetails || ''
        };
        const contact = new ContactDeveloper(contactData);
        await contact.save();
        res.status(201).json({ success: true, message: "Contact Developer request submitted successfully", data: contact });
    } catch (error) {
        console.error('Error in submitContactDeveloper:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Channel Partner
export const submitChannelPartner = async (req, res) => {
    try {
        // Map form data to model schema
        const partnerData = {
            partnerName: req.body.fullName || req.body.partnerName || req.body.name,
            mobile: req.body.mobileNumber || req.body.mobile,
            email: req.body.email,
            city: req.body.city || 'Not provided',
            experience: req.body.experience || '',
            reraNumber: req.body.reraNumber || ''
        };
        const partner = new ChannelPartner(partnerData);
        await partner.save();
        res.status(201).json({ success: true, message: "Channel Partner request submitted successfully", data: partner });
    } catch (error) {
        console.error('Error in submitChannelPartner:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Registration Docs
export const submitRegistrationDocs = async (req, res) => {
    try {
        // Map form data to model schema
        const docsData = {
            userName: req.body.fullName || req.body.userName || req.body.name,
            mobile: req.body.mobileNumber || req.body.mobile,
            email: req.body.email,
            documentType: req.body.registrationType || req.body.documentType,
            propertyDetails: req.body.entityName || req.body.propertyDetails || req.body.additionalInfo || ''
        };
        const docs = new RegistrationDocs(docsData);
        await docs.save();
        res.status(201).json({ success: true, message: "Registration Docs request submitted successfully", data: docs });
    } catch (error) {
        console.error('Error in submitRegistrationDocs:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
