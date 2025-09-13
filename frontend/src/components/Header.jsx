import React, { useState, useRef, useEffect } from "react";
import { Heart, Search, MapPin, ChevronDown, Filter, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { logout, updateUser } from "../store/authSlice.js";
import { userDetails } from "../api/user.js";
import { logoutUser } from "../api/auth.js";
import { useLocation } from "react-router-dom";

const Header = () => {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Buy");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [budget, setBudget] = useState(5000000);
  const [propertyCategory, setPropertyCategory] = useState("Residential");
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);
  const [possession, setPossession] = useState("");
  const [postedBy, setPostedBy] = useState("");

  const filtersRef = useRef(null);
  const advFiltersRef = useRef(null);

  const propertyTypes = ["Buy", "Rent", "Auction"];
  const residentialOptions = ["Apartment", "Villa", "Plot", "Studio"];
  const commercialOptions = ["Office", "Shop", "Warehouse"];

  // Fetch fresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userDetails();
        if (res?.success) {
          dispatch(updateUser(res.userData));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [dispatch, location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-menu")) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const toggleSelection = (value) => {
    setSelectedSubTypes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        advFiltersRef.current &&
        !advFiltersRef.current.contains(e.target)
      ) {
        setShowAdvancedFilters(false);
      }
      if (filtersRef.current && !filtersRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res?.success) {
        dispatch(logout());
        localStorage.removeItem("token");
        toast.success(res.message || "Logout successful");
        navigate("/");
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">
        {/* LEFT: Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-blue-900 rounded-md flex items-center justify-center text-white font-bold text-lg shadow">
            H
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-gray-800 text-lg">HousePredict</div>
            <div className="text-xs text-blue-700 font-medium -mt-0.5">
              Smart Property Search
            </div>
          </div>
        </a>

        {/* CENTER: Search bar (keep your existing code here) */}
        <div className="flex-1 max-w-3xl relative" ref={advFiltersRef}>
  <div
    className="flex items-center border border-blue-200 px-2 py-1 rounded-md shadow-sm w-full cursor-pointer"
    onClick={() => setShowAdvancedFilters(true)}
  >
    {/* Type Selector */}
    <div className="relative flex items-center border-r border-blue-200 pr-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowFilters(!showFilters);
        }}
        className="flex items-center gap-1 text-sm font-medium text-blue-700 focus:outline-none"
      >
        {selectedType}
        <ChevronDown size={14} className="text-blue-600" />
      </button>
      {showFilters && (
        <div
          ref={filtersRef}
          className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md z-50 w-32"
        >
          {propertyTypes
            .filter((type) => type !== selectedType)
            .map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setShowFilters(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
              >
                {type}
              </button>
            ))}
        </div>
      )}
    </div>

    {/* Search Input (white center) */}
    <div className="flex-1 flex items-center px-3 bg-white">
      <MapPin size={18} className="text-blue-600 mr-2" />
      <input
        type="text"
        placeholder={`Search ${selectedType.toLowerCase()} properties, location, project...`}
        className="flex-1 text-sm bg-transparent outline-none placeholder-gray-500 cursor-pointer"
        readOnly
      />
    </div>

    {/* Search Button */}
    <button className="bg-blue-700 text-white px-4 py-2 hover:bg-blue-800 transition-colors flex items-center justify-center">
      <Search size={16} />
    </button>

    {/* Filter Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowAdvancedFilters(!showAdvancedFilters);
      }}
      className="ml-2 p-2 bg-white border border-blue-300 rounded-md hover:bg-blue-50"
    >
      <Filter size={16} className="text-blue-600" />
    </button>
  </div>

  {/* Advanced Filter Panel */}
  {showAdvancedFilters && (
    <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (₹)
          </label>
          <input
            type="range"
            min="500000"
            max="20000000"
            step="500000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <p className="text-sm text-gray-600 mt-1">
            Up to ₹{budget.toLocaleString()}
          </p>
        </div>

        {/* Category & Subtypes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type
          </label>
          <div className="flex gap-4 mb-3">
            {["Residential", "Commercial"].map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1 rounded-md text-sm border ${
                  propertyCategory === cat
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300"
                }`}
                onClick={() => {
                  setPropertyCategory(cat);
                  setSelectedSubTypes([]);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(propertyCategory === "Residential"
              ? residentialOptions
              : commercialOptions
            ).map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={selectedSubTypes.includes(option)}
                  onChange={() => toggleSelection(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Possession */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Possession Status
          </label>
          <select
            className="w-40 border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            value={possession}
            onChange={(e) => setPossession(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Ready to Move">Ready to Move</option>
          </select>
        </div>

        {/* Posted By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posted By
          </label>
          <select
            className="w-40 border-gray-300 rounded-md text-sm px-2 py-1 focus:ring-blue-500 focus:border-blue-500"
            value={postedBy}
            onChange={(e) => setPostedBy(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Builder">Builder</option>
            <option value="Agent">Agent</option>
            <option value="Owner">Owner</option>
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowAdvancedFilters(false)}
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )}
</div>


        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </button>

          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <Heart size={18} className="text-gray-600 hover:text-red-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-700 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              5
            </span>
          </button>

          <a
            href="/post-property"
            className="bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow hover:bg-blue-800"
          >
            + Post Property
          </a>

          {/* Conditionally render Login or Profile */}
          {userData ? (
            <div className="relative profile-menu">
              <FaUserCircle
                size={32}
                className="cursor-pointer text-gray-700"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  {userData?.isAccountVerified ? (
                    <p className="block w-full text-left px-4 py-2 text-green-600">
                      ✅ Email Verified
                    </p>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/email-verify");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Verify Email
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="border border-blue-700 text-blue-700 px-4 py-2 text-xs font-semibold rounded-md hover:bg-blue-50"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
