import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { MdCompareArrows } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [city, setCity] = useState("");
  const [user, setUser] = useState(null); // null if not logged in
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    localStorage.setItem("selectedCity", e.target.value); // store city for future searches
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        🏠 HousePredict
      </Link>

      {/* City Selector */}
      <div className="flex items-center border rounded-lg px-2 py-1">
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city..."
          className="outline-none p-1"
        />
        <select
          className="ml-2 outline-none"
          onChange={handleCityChange}
          value={city}
        >
          <option value="">Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bangalore">Bangalore</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Prime Login */}
        <Link to="/prime" className="text-sm font-semibold text-gray-700">
          Prime Login
        </Link>

        {/* Dealer/Builder Login */}
        <Link to="/dealer-login" className="text-sm font-semibold text-gray-700">
          Dealer/Builder Login
        </Link>

        {/* Post Property */}
        <Link
          to="/post-property"
          target="_blank"
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
        >
          Post Property
        </Link>

        {/* Wishlist + Compare */}
        <Link to="/wishlist" className="text-red-500 text-xl">
          <FaHeart />
        </Link>
        <Link to="/compare" className="text-blue-500 text-xl">
          <MdCompareArrows />
        </Link>

        {/* Login/Register Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1"
          >
            <FaUserCircle className="text-2xl" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <p className="px-4 py-2 font-semibold">{user.name}</p>
                  <button
                    onClick={() => setUser(null)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
