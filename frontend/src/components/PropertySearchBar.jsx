import React, { useState } from "react";
import { Search, Mic } from "lucide-react";

const PropertySearchBar = () => {
  const [selectedType, setSelectedType] = useState("buy");

  const categories = [
    "buy",
    "rent",
    "pg/coliving",
    "post property (free)",
    "residential",
    "commercial",
    "plots/lands",
    "new projects",
    "luxury",
    "property in auction",
    "invest",
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
        {/* City */}
        <input
          type="text"
          placeholder="Enter city"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Budget */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Budget</option>
          <option value="10-20L">₹10L - ₹20L</option>
          <option value="20-50L">₹20L - ₹50L</option>
          <option value="50L-1Cr">₹50L - ₹1Cr</option>
          <option value="1Cr+">₹1Cr+</option>
        </select>

        {/* Nearby */}
        <input
          type="text"
          placeholder="Nearby location"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

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
