import React, { useState } from "react";
import { Heart, User, Search, MapPin, ChevronDown, Filter, Star, Bell } from "lucide-react";

const Header = () => {
  const [selectedType, setSelectedType] = useState("Buy");
  const [showFilters, setShowFilters] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const propertyTypes = ["Buy", "Rent", "Services", "New Projects", "Invest"];
  
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white border-b-2 border-orange-100">
      <div className="px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Brand + Property Type Pills */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-sm">H</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-gray-800 text-sm leading-tight">HousePredict</div>
                <div className="text-xs text-orange-600 font-medium -mt-0.5">Smart Property Search</div>
              </div>
            </a>

            {/* Property Type Pills */}
            <div className="hidden md:flex items-center gap-1">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`relative px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedType === type
                      ? "bg-orange-500 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-orange-600"
                  }`}
                >
                  {type}
                  {selectedType === type && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-300 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Integrated Search */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="flex items-center bg-gray-50 border-2 border-transparent rounded-xl px-3 py-2 focus-within:border-orange-300 focus-within:bg-white focus-within:shadow-lg transition-all">
                <MapPin size={16} className="text-orange-500 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search location, project, builder..." 
                  className="flex-1 text-sm bg-transparent focus:outline-none placeholder-gray-500" 
                />
                <div className="flex items-center gap-1 ml-2">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      showFilters ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Filter size={14} />
                  </button>
                  <button className="bg-orange-500 text-white p-1.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                    <Search size={14} />
                  </button>
                </div>
              </div>
              
              {/* Quick Filters Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50">
                  <div className="grid grid-cols-2 gap-2">
                    <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:border-orange-400 outline-none">
                      <option>Budget</option>
                      <option>₹10L-30L</option>
                      <option>₹30L-70L</option>
                      <option>₹70L-1Cr</option>
                      <option>₹1Cr+</option>
                    </select>
                    <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:border-orange-400 outline-none">
                      <option>BHK</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4+ BHK</option>
                    </select>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {["Ready to Move", "Plots", "Commercial", "Resale"].map((tag) => (
                      <button key={tag} className="px-2 py-1 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-md text-xs transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={16} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">3</span>
            </button>

            {/* Wishlist */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={16} className="text-gray-600 hover:text-red-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center font-bold">5</span>
            </button>

            {/* Premium Badge */}
            <a href="/premium" className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-1.5 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all">
              <Star size={12} fill="currentColor" />
              GO PREMIUM
            </a>

            {/* Post Property */}
            <a
              href="/post-property"
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-semibold text-xs shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              + List Property
            </a>

            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <ChevronDown size={12} className="text-gray-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">JD</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">John Doe</div>
                        <div className="text-xs text-gray-500">Premium Member</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={14} />
                      My Profile
                    </a>
                    <a href="/properties" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Heart size={14} />
                      Saved Properties
                    </a>
                    <a href="/searches" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Search size={14} />
                      Saved Searches
                    </a>
                    <hr className="my-1" />
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                      Settings
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Property Types */}
        <div className="md:hidden mt-2 flex gap-1 overflow-x-auto pb-1">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;