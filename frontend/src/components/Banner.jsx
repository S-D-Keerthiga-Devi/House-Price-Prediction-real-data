import React, { useState } from "react";

// Example city data with landmarks + banner + listings
const cityData = {
  delhi: {
    banner: "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg",
    listings: [
      { id: 1, title: "Luxury Flat in Connaught Place" },
      { id: 2, title: "3BHK Apartment near India Gate" },
    ],
  },
  mumbai: {
    banner: "https://images.pexels.com/photos/12460245/pexels-photo-12460245.jpeg",
    listings: [
      { id: 3, title: "Sea-facing Apartment in Marine Drive" },
      { id: 4, title: "Luxury 3BHK in Bandra West" },
    ],
  },
  bangalore: {
    banner: "https://images.pexels.com/photos/14702566/pexels-photo-14702566.jpeg",
    listings: [
      { id: 5, title: "Tech Park Office in Whitefield" },
      { id: 6, title: "Modern Villa in Electronic City" },
    ],
  },
};

const Banner = () => {
  const [selectedCity, setSelectedCity] = useState("delhi");
  const [showListings, setShowListings] = useState(false);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setShowListings(false); // reset listings when changing city
  };

  return (
    <div className="relative w-full">
      {/* Banner Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={cityData[selectedCity].banner}
          alt={`${selectedCity} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold capitalize">{selectedCity}</h1>

          {/* Dropdown to switch city */}
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="mt-4 p-2 rounded text-black"
          >
            {Object.keys(cityData).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Button to load listings */}
          <button
            onClick={() => setShowListings(true)}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            View Listings
          </button>
        </div>
      </div>

      {/* Premium Listings (only visible after button click) */}
      {showListings && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4">
          {cityData[selectedCity].listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="font-semibold">{listing.title}</h2>
              <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;
