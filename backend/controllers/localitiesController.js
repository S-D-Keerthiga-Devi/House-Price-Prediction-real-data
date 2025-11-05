import mongoose from "mongoose";
import houseModel from "../models/houseModel.js";
import comparatorPropertyModel from "../models/comparatorModel.js";

// ✅ Get all major Indian cities
export const getCities = async (req, res) => {
  try {
    // Complete list of major Indian cities A-Z (including NCR cities and more comprehensive coverage)
    const allIndianCities = [
      'Agartala', 'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad', 'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Asansol', 'Aurangabad',
      'Bangalore', 'Bareilly', 'Bathinda', 'Belgaum', 'Bellary', 'Bhagalpur', 'Bharatpur', 'Bhavnagar', 'Bhilai', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro', 'Brahmapur',
      'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack',
      'Darbhanga', 'Dehradun', 'Delhi', 'Dhanbad', 'Dibrugarh', 'Dimapur', 'Durgapur',
      'Erode', 'Faridabad', 'Firozabad', 'Gandhinagar', 'Gangtok', 'Gaya', 'Ghaziabad', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Gurugram', 'Guwahati', 'Gwalior',
      'Haldwani', 'Haridwar', 'Hisar', 'Howrah', 'Hubballi-Dharwad', 'Hyderabad',
      'Imphal', 'Indore', 'Itanagar', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur', 'Jorhat',
      'Kadapa', 'Kakinada', 'Kalyan-Dombivli', 'Kanpur', 'Karnal', 'Kavaratti', 'Kochi', 'Kohima', 'Kolhapur', 'Kolkata', 'Kollam', 'Kota', 'Kozhikode',
      'Kurnool', 'Kurukshetra',
      'Latur', 'Lucknow', 'Ludhiana',
      'Madurai', 'Mangalore', 'Mathura', 'Meerut', 'Mirzapur', 'Moradabad', 'Mumbai', 'Muzaffarnagar', 'Muzaffarpur', 'Mysore',
      'Nagpur', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore', 'New Delhi',
      'Noida', 'Greater Noida', 'Noida Extension', 'Greater Noida West', // Added NCR cities
      'Panaji', 'Panchkula', 'Panipat', 'Parbhani', 'Patna', 'Pimpri-Chinchwad', 'Pondicherry', 'Pune',
      'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Rourkela',
      'Saharanpur', 'Salem', 'Sangli', 'Satara', 'Shillong', 'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat',
      'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tirupati', 'Tumkur',
      'Udaipur', 'Ujjain', 'Ulhasnagar',
      'Vadodara', 'Varanasi', 'Vasai-Virar', 'Vellore', 'Vijayawada', 'Visakhapatnam',
      'Warangal',
      'Yamunanagar'
    ];

    // Also get cities from database to include any additional cities we have data for
    const dbCities = await houseModel.distinct("city");
    
    // Combine both lists and remove duplicates
    const combinedCities = [...allIndianCities, ...dbCities];
    const uniqueCities = [...new Set(combinedCities)].sort((a, b) => a.localeCompare(b));

    return res.json({
      success: true,
      count: uniqueCities.length,
      cities: uniqueCities,
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
      .find({ city: { $regex: new RegExp(`^${city}$`, "i") } })
      .select("city location year month quarter property_category rate_sqft lat lng")
      .sort({ year: 1, month: 1 });

    if (!records.length) {
      return res.json({ success: true, city, count: 0, data: [] });
    }

    // compute bounds
    const lats = records.map(r => Number(r.lat || r.location?.coordinates?.[1]));
    const lngs = records.map(r => Number(r.lng || r.location?.coordinates?.[0]));
    const bounds = {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };

    return res.json({
      success: true,
      city,
      count: records.length,
      bounds,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Add this function to your existing controller
export const getPropertiesForComparison = async (req, res) => {
  try {
    const { propertyIds, properties } = req.body;
    
    if (!propertyIds && !properties) {
      return res.status(400).json({ success: false, message: "Property IDs or properties data is required" });
    }

    let foundProperties = [];
    
    if (propertyIds && Array.isArray(propertyIds) && propertyIds.length > 0) {
      // Query by property IDs
      foundProperties = await comparatorPropertyModel.find({ 
        '_id': { $in: propertyIds } 
      });
    } else if (properties && Array.isArray(properties) && properties.length > 0) {
      // Query by location and city
      const query = {
        $or: properties.map(prop => ({
          location: prop.location,
          city: prop.city
        }))
      };
      foundProperties = await comparatorPropertyModel.find(query);
    } else {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    return res.json({
      success: true,
      properties: foundProperties
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get all properties for comparison
export const getAllPropertiesForComparison = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Default to 50 properties per page
    const skip = (page - 1) * limit;
    
    const properties = await comparatorPropertyModel.find({}).skip(skip).limit(limit);
    const totalCount = await comparatorPropertyModel.countDocuments({});
    
    return res.json({
      success: true,
      count: properties.length,
      totalCount: totalCount,
      page: page,
      totalPages: Math.ceil(totalCount / limit),
      properties: properties
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to get property details by ID
export const getPropertyDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ success: false, message: "Property ID is required" });
    }

    // Check if ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID format" });
    }

    const property = await comparatorPropertyModel.findById(id);
    
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    return res.json({
      success: true,
      property: property
    });
  } catch (error) {
    console.error("Error fetching property details:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};