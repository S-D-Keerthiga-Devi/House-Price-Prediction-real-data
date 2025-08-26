import React, { useState } from "react";
import { Search, Mic, MapPin } from "lucide-react";

const PropertySearchBar = () => {
  const [selectedType, setSelectedType] = useState("buy");

  // Row 1 categories
  const categories = [
    "Buy",
    "Rent",
    "PG Coliving",
    "Post Property Free",
    "Plots Lands",
    "New Projects",
    "Property In Auction",
    "Invest",
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-2xl p-4">
      {/* Row 1: Categories */}
      <div className="flex flex-wrap gap-3 border-b pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedType(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedType === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Row 2: Search Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Property Type Dropdown */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Property Type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="luxury">Luxury</option>
        </select>

        {/* City Dropdown */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Select City</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi</option>
          <option value="bangalore">Bangalore</option>
          <option value="chennai">Chennai</option>
        </select>

        {/* Location Search (with icon) */}
        <div className="flex items-center border rounded-lg px-3 py-2 flex-1">
          <MapPin size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Enter location"
            className="flex-1 focus:outline-none"
          />
        </div>

        {/* Budget */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Budget</option>
          <option value="10-20L">₹10L - ₹20L</option>
          <option value="20-50L">₹20L - ₹50L</option>
          <option value="50L-1Cr">₹50L - ₹1Cr</option>
          <option value="1Cr+">₹1Cr+</option>
        </select>

        {/* Mic */}
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <Mic size={18} />
        </button>

        {/* Search Button */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Search size={18} />
          Search
        </button>
      </div>
    </div>
  );
};

export default PropertySearchBar;
