import Escrow from '../models/escrowModel.js';

// Handle escrow service request submission
export const submitEscrowRequest = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, serviceNeed } = req.body;
    
    // Create new escrow request
    const newEscrowRequest = new Escrow({
      firstName,
      lastName,
      mobileNumber,
      email,
      serviceNeed
    });
    
    // Save to database
    await newEscrowRequest.save();
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: "Form submitted successfully"
    });
    
  } catch (error) {
    console.error('Error submitting escrow request:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};