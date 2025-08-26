// PropertySwipe.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import ComparisonTable from "./property/ComparisonTable";

// ✅ PropertyCard (smaller version)
const PropertyCard = ({ property, onSwipe }) => {
  const tags = {
    Platinum: "bg-gray-800 text-yellow-300",
    Gold: "bg-yellow-500 text-white",
    Silver: "bg-gray-300 text-gray-800",
  };

  return (
    <motion.div
      key={property.id}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-40">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 left-3 px-2 py-0.5 text-xs font-semibold rounded-full ${
            tags[property.tag]
          }`}
        >
          {property.tag}
        </span>
      </div>

      {/* Details */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold truncate">{property.title}</h2>
        <p className="text-sm text-gray-600">{property.location}</p>
        <p className="text-sm font-semibold text-blue-600">
          ₹{property.price.toLocaleString()}
        </p>

        <div className="flex space-x-4 text-xs text-gray-700">
          <span>{property.beds} Beds</span>
          <span>{property.baths} Baths</span>
          <span>{property.area} sqft</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-3">
          {/* Dislike / Remove */}
          <button
            onClick={() => onSwipe("dislike", property)}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
          >
            <X size={18} />
          </button>

          {/* Like / Add to Compare */}
          <button
            onClick={() => onSwipe("like", property)}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ Main Component
const PropertySwipe = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Luxury Villa with Pool",
      location: "Beverly Hills, CA",
      price: 45000000,
      beds: 5,
      baths: 4,
      area: 4500,
      builder: "Platinum",
      property_type: "Villa",
      image: "https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg",
      tag: "Platinum",
      nearby_schools: ["Sunrise High", "St. Mary’s"],
      nearby_hospitals: ["City Hospital"],
      metro_proximity: "2 km",
      fresh_resale: "Fresh",
      authenticated_parking: true,
      luxury_segment: true,
      lifestyle_score: 9,
      nature_score: 8,
      aqi: 45,
      traffic_situation: "Moderate",
      green_cover_percent: 30,
      growth_2_year: 12,
      growth_5_year: 40,
      ai_score: 9,
    },
    {
      id: 2,
      title: "Modern Apartment Downtown",
      location: "New York, NY",
      price: 12000000,
      beds: 3,
      baths: 2,
      area: 1600,
      builder: "Gold",
      property_type: "Apartment",
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
      tag: "Gold",
      nearby_schools: ["Downtown Primary"],
      nearby_hospitals: ["Metro Health Center"],
      metro_proximity: "0.5 km",
      fresh_resale: "Resale",
      authenticated_parking: true,
      luxury_segment: false,
      lifestyle_score: 7,
      nature_score: 5,
      aqi: 70,
      traffic_situation: "Heavy",
      green_cover_percent: 15,
      growth_2_year: 8,
      growth_5_year: 25,
      ai_score: 7,
    },
    {
      id: 3,
      title: "Cozy Cottage",
      location: "Aspen, CO",
      price: 8500000,
      beds: 2,
      baths: 2,
      area: 1200,
      builder: "Silver",
      property_type: "Cottage",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
      tag: "Silver",
      nearby_schools: ["Aspen Elementary"],
      nearby_hospitals: ["Aspen General"],
      metro_proximity: "No metro",
      fresh_resale: "Fresh",
      authenticated_parking: false,
      luxury_segment: true,
      lifestyle_score: 8,
      nature_score: 9,
      aqi: 25,
      traffic_situation: "Light",
      green_cover_percent: 55,
      growth_2_year: 10,
      growth_5_year: 35,
      ai_score: 8,
    },
  ]);

  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleSwipe = (action, property) => {
    if (action === "like") {
      if (!compareList.find((p) => p.id === property.id)) {
        setCompareList([...compareList, property]);
      }
    }
    setProperties((prev) => prev.filter((p) => p.id !== property.id));
  };

  const handleRemoveFromCompare = (id) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-center">Property Listings</h1>

      {/* Property List Section */}
      <div className="space-y-6">
        <AnimatePresence>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSwipe={handleSwipe}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Compare Section */}
      {compareList.length > 0 && (
        <div className="mt-10 p-4 bg-gray-100 rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-4">Compare List</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {compareList.map((property) => (
              <div
                key={property.id}
                className="p-3 bg-white rounded-lg shadow flex items-center space-x-3"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-sm">{property.title}</h3>
                  <p className="text-xs text-gray-600">{property.location}</p>
                  <p className="text-xs font-semibold text-blue-600">
                    ₹{property.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Show Comparison Button */}
          <div className="text-center mt-4">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition"
            >
              {showComparison ? "Hide Comparison Table" : "View Comparison Table"}
            </button>
          </div>

          {/* Comparison Table */}
          {showComparison && (
            <ComparisonTable
              properties={compareList}
              onRemoveProperty={handleRemoveFromCompare}
              onClose={() => setShowComparison(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySwipe;
