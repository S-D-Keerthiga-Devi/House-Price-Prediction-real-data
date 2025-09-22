import houseModel from "../models/houseModel.js";

// ✅ Get distinct cities
export const getCities = async (req, res) => {
  try {
    const cities = await houseModel.distinct("city");
    return res.json({
      success: true,
      count: cities.length,
      cities: cities.sort(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get distinct localities by city
export const getLocalitiesByCity = async (req, res) => {
  let { city } = req.params;

  if (!city) {
    return res.status(400).json({ success: false, message: "City is required" });
  }

  try {
    const localities = await houseModel.distinct("location", {
      city: { $regex: new RegExp(`^${city}$`, "i") }, // case-insensitive match
    });

    return res.json({
      success: true,
      city,
      count: localities.length,
      localities: localities.sort(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get rate trends for a locality
export const getRatesByLocality = async (req, res) => {
  const { city, location } = req.query;

  if (!city || !location) {
    return res.status(400).json({ success: false, message: "City and location are required" });
  }

  try {
    const records = await houseModel
      .find({ city, location })
      .select("-__v -_id")
      .sort({ year: 1, month: 1 }); // optional: sorted by time

    return res.json({
      success: true,
      city,
      location,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRatesByCity = async (req, res) => {
  let { city } = req.params;

  if (!city) {
    return res.status(400).json({ success: false, message: "City is required" });
  }

  try {
    const records = await houseModel
      .find({ city: { $regex: new RegExp(`^${city}$`, "i") } }) // case-insensitive match
      .select("-__v -_id")
      .sort({ year: 1, month: 1 });

    return res.json({
      success: true,
      city,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoordinatesByCity = async (req, res) => {
  let { city } = req.params;

  if (!city) {
    return res.status(400).json({ success: false, message: "City is required" });
  }

  try {
    const records = await houseModel
      .find({ city: { $regex: new RegExp(`^${city}$`, "i") } }) // case-insensitive match
      .select("city location year month quarter property_category rate_sqft lat lng") // Explicitly include lat/lng
      .sort({ year: 1, month: 1 });

    return res.json({
      success: true,
      city,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};