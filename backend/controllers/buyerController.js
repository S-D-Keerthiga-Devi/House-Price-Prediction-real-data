import PropertyValuation from "../models/propertyValuationModel.js";
import HomeLoan from "../models/homeLoanModel.js";
import FacilityManagement from "../models/facilityManagementModel.js";

// Submit Property Valuation
export const submitPropertyValuation = async (req, res) => {
    try {
        // Map form data to model schema - ensure required fields are present
        const valuationData = {
            name: req.body.name || 'Not provided',
            mobile: req.body.mobile || req.body.mobileNumber || '',
            email: req.body.email || '',
            propertyType: req.body.propertyType || 'Not specified',
            city: req.body.city || 'Not specified',
            area: String(req.body.area || req.body.areaSqft || '0'),
            location: req.body.location,
            bedrooms: req.body.bedrooms,
            areaUnit: req.body.areaUnit,
            buildUpType: req.body.buildUpType,
            possessionStatus: req.body.possessionStatus,
            coveredParking: req.body.coveredParking,
            openParking: req.body.openParking,
            age: req.body.age,
            furnishingStatus: req.body.furnishingStatus,
            tower: req.body.tower,
            totalTowers: req.body.totalTowers,
            floor: req.body.floor,
            totalFloors: req.body.totalFloors,
            view: req.body.view,
            facing: req.body.facing
        };
        const valuation = new PropertyValuation(valuationData);
        await valuation.save();
        res.status(201).json({ success: true, message: "Property Valuation request submitted successfully", data: valuation });
    } catch (error) {
        console.error('Error in submitPropertyValuation:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: "Validation Error", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Home Loan
export const submitHomeLoan = async (req, res) => {
    try {
        const loan = new HomeLoan(req.body);
        await loan.save();
        res.status(201).json({ success: true, message: "Home Loan request submitted successfully", data: loan });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Submit Facility Management
export const submitFacilityManagement = async (req, res) => {
    try {
        const facility = new FacilityManagement(req.body);
        await facility.save();
        res.status(201).json({ success: true, message: "Facility Management request submitted successfully", data: facility });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
