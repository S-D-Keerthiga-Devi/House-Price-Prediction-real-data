import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { SlidersHorizontal } from "lucide-react"; // comparator replacement

export default function Header() {
  const [city, setCity] = useState(localStorage.getItem("selectedCity") || "");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    localStorage.setItem("selectedCity", e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-3 max-w-[1300px] mx-auto">
        {/* Logo + City Selector */}
        <div className="flex items-center gap-4">
          {/* Logo (click → home) */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 tracking-wide hover:scale-105 transition"
          >
            🏠 <span className="hidden sm:inline">HousePredict</span>
          </Link>

          {/* City Selector */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md transition">
            <select
              className="outline-none bg-transparent text-gray-700 font-medium"
              onChange={handleCityChange}
              value={city}
            >
              <option value="">Select City</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {/* Prime */}
          <Link
            to="/prime"
            className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
          >
            Prime <span className="text-yellow-500 text-lg">👑</span>
          </Link>

          {/* Dealers / Builders */}
          <Link
            to="/dealer-login"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition"
          >
            Dealers / Builders
          </Link>

          {/* Post Property */}
          <Link
            to="/post-property"
            target="_blank"
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm hover:shadow-md transition"
          >
            Post Property
          </Link>

          {/* Wishlist + Compare */}
<div className="flex items-center gap-4 relative">
  {/* Wishlist */}
  <Link
    to="/wishlist"
    className="text-red-500 text-xl hover:scale-125 transition"
  >
    <FaHeart />
  </Link>

  {/* Compare with hover preview */}
  <div className="relative group">
    {/* Compare Icon */}
    <Link
      to="/compare"
      className="text-blue-600 text-xl hover:scale-125 transition"
    >
      <SlidersHorizontal size={22} />
    </Link>

    {/* Hover + Keep Open when inside preview */}
    <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-100 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    hover:opacity-100 hover:visible transition-all duration-200 z-50">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">
        Compare Preview
      </h4>
      <p className="text-xs text-gray-500 mb-2">
        Recently added properties to compare:
      </p>
      <ul className="text-sm text-gray-700 list-disc list-inside">
        <li>Property A</li>
        <li>Property B</li>
      </ul>
      <Link
        to="/compare"
        className="mt-3 block text-center bg-blue-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-700 transition"
      >
        View Full Compare
      </Link>
    </div>
  </div>
</div>


          {/* Login/Register Dropdown */}
          <div className="relative z-50">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 hover:text-blue-600 transition"
            >
              <FaUserCircle className="text-3xl text-gray-600 hover:text-blue-600 transition" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-lg py-2 border border-gray-100 z-50">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="block px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="px-5 py-2 font-semibold text-gray-700">
                      {user.name}
                    </p>
                    <button
                      onClick={() => setUser(null)}
                      className="w-full text-left px-5 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
