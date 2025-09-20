import houseModel from "../models/houseModel.js";

export const getLocalitiesByCity = async (req, res) => {
  const { city } = req.params;

  if (!city) {
    return res.json({ success: false, message: "City is required" });
  }

  try {
    const localities = await houseModel.distinct("location", { city });

    return res.json({
      success: true,
      city,
      count: localities.length,
      localities: localities.sort(),
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getRatesByLocality = async (req, res) => {
  const { city, location } = req.query;

  if (!city || !location) {
    return res.json({ success: false, message: "City and location are required" });
  }

  try {
    const records = await houseModel
      .find({ city, location })
      .select("-__v -_id"); // hide Mongo's extra fields

    return res.json({
      success: true,
      city,
      location,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getCities = async (req, res) => {
  try {
    const cities = await houseModel.distinct("city");

    return res.json({
      success: true,
      count: cities.length,
      cities: cities.sort(),
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
