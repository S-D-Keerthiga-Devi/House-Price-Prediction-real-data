import RentAgreement from '../models/rentAgreementModel.js';

// Create a new rent agreement or save as draft
export const createRentAgreement = async (req, res) => {
  try {
    const userId = req.user.id; // Changed from req.user._id to req.user.id
    const agreementData = { ...req.body, userId };
    
    const rentAgreement = new RentAgreement(agreementData);
    await rentAgreement.save();
    
    res.json({
      success: true,
      message: 'Rent agreement created successfully',
      rentAgreement
    });
  } catch (error) {
    console.error('Error creating rent agreement:', error);
    res.json({
      success: false,
      message: 'Failed to create rent agreement',
      error: error.message
    });
  }
};

// Get all rent agreements for a user
export const getUserRentAgreements = async (req, res) => {
  try {
    const userId = req.user.id;
    const agreements = await RentAgreement.find({ userId });
    
    res.json({
      success: true,
      count: agreements.length,
      agreements
    });
  } catch (error) {
    console.error('Error fetching rent agreements:', error);
    res.json({
      success: false,
      message: 'Failed to fetch rent agreements',
      error: error.message
    });
  }
};

// Get a specific rent agreement by ID
export const getRentAgreementById = async (req, res) => {
  try {
    const rentAgreement = await RentAgreement.findById(req.params.id);
    
    if (!rentAgreement) {
      return res.status(404).json({
        success: false,
        message: 'Rent agreement not found'
      });
    }
    
    // Check if the user owns this agreement
    if (rentAgreement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this agreement'
      });
    }
    
    res.status(200).json({
      success: true,
      rentAgreement
    });
  } catch (error) {
    console.error('Error fetching rent agreement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rent agreement',
      error: error.message
    });
  }
};

// Update a rent agreement
export const updateRentAgreement = async (req, res) => {
  try {
    const rentAgreement = await RentAgreement.findById(req.params.id);
    
    if (!rentAgreement) {
      return res.status(404).json({
        success: false,
        message: 'Rent agreement not found'
      });
    }
    
    // Check if the user owns this agreement
    if (rentAgreement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this agreement'
      });
    }
    
    // Update the agreement
    const updatedAgreement = await RentAgreement.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Rent agreement updated successfully',
      rentAgreement: updatedAgreement
    });
  } catch (error) {
    console.error('Error updating rent agreement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rent agreement',
      error: error.message
    });
  }
};

// Delete a rent agreement
export const deleteRentAgreement = async (req, res) => {
  try {
    const rentAgreement = await RentAgreement.findById(req.params.id);
    
    if (!rentAgreement) {
      return res.status(404).json({
        success: false,
        message: 'Rent agreement not found'
      });
    }
    
    // Check if the user owns this agreement
    if (rentAgreement.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this agreement'
      });
    }
    
    await RentAgreement.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Rent agreement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rent agreement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rent agreement',
      error: error.message
    });
  }
};