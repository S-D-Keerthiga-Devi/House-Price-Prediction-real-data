import emiResultModel from "../models/emiResultModel.js";

export const saveEmiResult = async (req, res) => {
  try {
    const { loanAmount, tenure, interest, emi, totalInterest, processingFees, prePayment } = req.body;

    const newEmiResult = new emiResultModel({
      loanAmount,
      tenure,
      interest,
      emi,
      totalInterest,
      processingFees,
      prePayment
    });

    await newEmiResult.save();

    res.status(201).json({
      success: true,
      message: "EMI result saved successfully",
      data: newEmiResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getEmiResults = async (req, res) => {
  try {
    const results = await emiResultModel.find({}).sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};