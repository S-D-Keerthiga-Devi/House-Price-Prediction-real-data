import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  User,
  Search,
  MapPin,
  ChevronDown,
  Filter,
  Star,
  Bell,
  X,
} from "lucide-react";

const Header = () => {
  const [selectedType, setSelectedType] = useState("Buy");
  const [showFilters, setShowFilters] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [premiumMenuOpen, setPremiumMenuOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const filtersRef = useRef(null);
  const userMenuRef = useRef(null);
  const premiumMenuRef = useRef(null);

  const propertyTypes = ["Buy", "Rent", "Auction"];

  const toggleSelection = (value, list, setList) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target)) {
        setShowFilters(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (premiumMenuRef.current && !premiumMenuRef.current.contains(e.target)) {
        setPremiumMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* LEFT: Logo + Property Types */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
              H
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-800 text-lg">HousePredict</div>
              <div className="text-xs text-orange-600 font-medium -mt-0.5">
                Smart Property Search
              </div>
            </div>
          </a>

          {/* Property Type Pills */}
          <div className="hidden md:flex items-center gap-2">
            {propertyTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedType === type
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Search */}
        <div className="flex-1 max-w-xl relative">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-orange-400 focus-within:bg-white shadow-sm transition-all">
            <MapPin size={18} className="text-orange-500 mr-2" />
            <input
              type="text"
              placeholder={`Search ${selectedType.toLowerCase()} properties, location, project...`}
              className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${showFilters
                  ? "bg-orange-100 text-orange-600"
                  : "hover:bg-gray-100 text-gray-500"
                  }`}
              >
                <Filter size={16} />
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2 rounded-lg hover:shadow-md transition">
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* FILTERS DROPDOWN */}
          {showFilters && (
            <div
              ref={filtersRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 z-50 min-w-[700px] max-w-4xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Budget
                  </label>
                  <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400">
                    <option>Select Budget</option>
                    <option>₹10L-30L</option>
                    <option>₹30L-70L</option>
                    <option>₹70L-1Cr</option>
                    <option>₹1Cr-2Cr</option>
                    <option>₹2Cr+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    BHK
                  </label>
                  <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400">
                    <option>Select BHK</option>
                    <option>1 BHK</option>
                    <option>2 BHK</option>
                    <option>3 BHK</option>
                    <option>4+ BHK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1 min-w-[100px]">
                    Property Age
                  </label>

                  <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-orange-400 w-full truncate">
                    <option>Any Age</option>
                    <option>Ready to Move</option>
                    <option>Under Construction</option>
                    <option>New Launch</option>
                  </select>


                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["New Project", "Resale", "Plots", "Commercial"].map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${selectedTypes.includes(type)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-orange-100 hover:text-orange-600"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>


              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Parking", "Gym", "Swimming Pool", "Security", "Power Backup"].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleSelection(amenity, selectedAmenities, setSelectedAmenities)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition ${selectedAmenities.includes(amenity)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-orange-100 hover:text-orange-600"
                        }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>


              {/* Action Buttons */}
              <div className="flex justify-between">
                <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                  Clear All
                </button>
                <button className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm shadow">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </button>

          {/* Wishlist */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Heart size={18} className="text-gray-600 hover:text-red-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              5
            </span>
          </button>

          {/* Premium */}
          <div className="relative" ref={premiumMenuRef}>
            <button
              onClick={() => setPremiumMenuOpen(!premiumMenuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow hover:shadow-md"
            >
              <Star size={14} fill="currentColor" />
              Premium
              <ChevronDown size={14} />
            </button>
            {premiumMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                {[
                  { label: "For Builders", price: "₹999/mo" },
                  { label: "For Dealers", price: "₹699/mo" },
                  { label: "For Buyers", price: "₹299/mo" },
                  { label: "For Owners", price: "₹499/mo" },
                ].map((plan) => (
                  <a
                    key={plan.label}
                    href="#"
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span>{plan.label}</span>
                    <span className="text-orange-600 font-medium">
                      {plan.price}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Post Property */}
          <a
            href="/post-property"
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow hover:shadow-md"
          >
            + Post Property
          </a>

          {/* User */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <ChevronDown size={14} className="text-gray-500" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                <a
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={16} /> My Profile
                </a>
                <a
                  href="/properties"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Heart size={16} /> Saved Properties
                </a>
                <a
                  href="/searches"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Search size={16} /> Saved Searches
                </a>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                  Settings
                </button>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Property Types */}
      <div className="md:hidden px-4 pb-2 flex gap-2 overflow-x-auto">
        {propertyTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${selectedType === type
              ? "bg-orange-500 text-white shadow"
              : "bg-gray-100 text-gray-700"
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
