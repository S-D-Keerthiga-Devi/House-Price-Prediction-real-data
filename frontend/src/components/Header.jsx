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
import Slider from "@mui/material/Slider";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Location from "./Location.jsx";

const Header = () => {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Buy");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState("Residential");
  const [selectedSubTypes, setSelectedSubTypes] = useState([]);
  const [possession, setPossession] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [constructionStatus, setConstructionStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");



  const filtersRef = useRef(null);
  const advFiltersRef = useRef(null);

  const propertyTypes = ["Buy", "Rent", "Auction"];
  const residentialOptions = ["Apartment", "Villa", "Plot", "Studio", "Independent House", "Builder Floor", "Penthouse"];
  const commercialOptions = ["Office", "Shop", "Warehouse", "Office Space", "Industrial Land/Plot", "Showroom", "Co-working Space"];

  const [budget, setBudget] = useState([10, 100]);
  const formatLabel = (value) => `${value}L`;

  const handleChange = (event, newValue) => {
    setBudget(newValue);
  };


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
                  setShowFilters((prev) => {
                    if (!prev) {
                      setShowAdvancedFilters(false); // close filters if opening Buy/Rent
                    }
                    return !prev;
                  });
                }}
                className="flex items-center gap-1 text-sm font-medium text-blue-700 focus:outline-none"
              >
                {selectedType}
                <ChevronDown size={14} className="text-blue-600" />
              </button>

              {/* Buy / Rent / Auction Dropdown */}
              {showFilters && (
                <div
                  ref={filtersRef}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-[60] w-32"
                >
                  {propertyTypes
                    .filter((type) => type !== selectedType)
                    .map((type) => (
                      <button
                        key={type}
                        onClick={(e) => {
                          setSelectedType(type);
                          setShowFilters(false);
                          e.stopPropagation();
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
            <div
              className="flex-1 flex items-center px-3 bg-white relative"
              onClick={(e) => e.stopPropagation()} // ⛔ stop bubbling up
            >
              <MapPin
                size={18}
                className="text-blue-600 mr-2 cursor-pointer"
                onClick={() => document.getElementById("location-input")?.focus()}
              />

              {/* City Search Component */}
              <Location onCitySelect={(city) => setSearchQuery(city)} />
            </div>


            {/* Search Button */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-blue-700 text-white rounded-md shadow hover:bg-blue-700 flex items-center justify-center">
              <Search size={18} />
            </button>

            {/* Filter Button (Icon only) */}
            <div className="ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ don’t clash with Location
                  setShowAdvancedFilters((prev) => !prev); // strictly controls filter
                }}
                className="p-2 bg-blue-700 text-white rounded-md shadow hover:bg-blue-700 flex items-center justify-center"
              >
                <Filter size={18} />
              </button>
            </div>


          </div>

          {/* Advanced Filter Panel */}
          {showAdvancedFilters && (
            <div className="absolute top-[110%] left-0 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-[50] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (₹)
                  </label>
                  <Slider
                    value={budget}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatLabel}
                    min={10}
                    max={100}
                    step={5}
                    sx={{
                      color: "#1d4ed8", // Tailwind `blue-700`
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#1d4ed8",
                        border: "2px solid white",
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "#1d4ed8",
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#dbeafe", // Tailwind `blue-100`
                      },
                    }}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {budget[0]}L - {budget[1]}L
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
                        className={`px-4 py-1 rounded-md text-sm border ${propertyCategory === cat
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


                {/* Posted By */}
                <FormControl fullWidth>
                  <InputLabel id="postedby-label">Posted By</InputLabel>
                  <Select
                    labelId="postedby-label"
                    value={postedBy}
                    onChange={(e) => setPostedBy(e.target.value)}
                    label="Posted By"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                    }}
                    MenuProps={{
                      disablePortal: true, // ✅ Keeps dropdown inside the same container
                      PaperProps: {
                        sx: {
                          bgcolor: "white",
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#f3f4f6", // Tailwind gray-100 hover effect
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="Builder">Builder</MenuItem>
                    <MenuItem value="Agent">Agent</MenuItem>
                    <MenuItem value="Owner">Owner</MenuItem>
                  </Select>
                </FormControl>

                {/* Construction Status */}
                <FormControl fullWidth>
                  <InputLabel id="construction-label">Construction Status</InputLabel>
                  <Select
                    labelId="construction-label"
                    value={constructionStatus}
                    onChange={(e) => setConstructionStatus(e.target.value)}
                    label="Construction Status"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                    }}
                    MenuProps={{
                      disablePortal: true, // ✅ Keeps dropdown inside the same container
                      PaperProps: {
                        sx: {
                          bgcolor: "white",
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#f3f4f6", // Tailwind gray-100 hover effect
                          },
                        },
                      },
                    }}
                  >
                    <MenuItem value="New Launch">New Launch</MenuItem>
                    <MenuItem value="Under Renovation">Under Construction</MenuItem>
                    <MenuItem value="Ready to Move">Ready to Move</MenuItem>
                  </Select>
                </FormControl>
              </div>

              {/* Buttons: Reset & Apply */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setBudget([10, 100]);
                    setPropertyCategory("Residential");
                    setSelectedSubTypes([]);
                    setPossession("");
                    setPostedBy("");
                    setConstructionStatus("");
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Reset
                </button>

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
                  <p className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                      📞
                    </span>
                    {userData?.phone || "No number"}
                  </p>

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
