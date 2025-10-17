import React, { useState, useRef, useEffect } from "react";
import { Heart, Search, ChevronDown, Filter, Bell } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { logout, updateUser } from "../store/authSlice.js";
import { userDetails } from "../api/user.js";
import { logoutUser } from "../api/auth.js";
import { useLocation } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { getLocalitiesByCity } from "../api/house";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Location from "./Location.jsx";
import { X } from "lucide-react";
import { Box, Paper } from "@mui/material";

const Header = () => {
  const menuRef = useRef(null);
  const { status, userData, selectedCity: reduxSelectedCity } = useSelector((state) => state.auth);
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
  const [countryCode, setCountryCode] = useState("+91");
  const [selectedCity, setSelectedCity] = useState("");
  // Keep local selectedCity in sync with Redux so center suggestions load
  useEffect(() => {
    if (reduxSelectedCity && reduxSelectedCity !== selectedCity) {
      setSelectedCity(reduxSelectedCity);
    }
  }, [reduxSelectedCity]);
  const [centerQuery, setCenterQuery] = useState("");
  const [centerOpen, setCenterOpen] = useState(false);
  const [centerLocalities, setCenterLocalities] = useState([]);
  const [showPriceTrendsMessage, setShowPriceTrendsMessage] = useState(false);
  const [showEmergingLocalitiesMessage, setShowEmergingLocalitiesMessage] = useState(false);
  const [showHeatmapsMessage, setShowHeatmapsMessage] = useState(false);
  const [showPriceToIncomeMessage, setShowPriceToIncomeMessage] = useState(false);
  const [showComparatorMessage, setShowComparatorMessage] = useState(false);


  const filtersRef = useRef(null);
  const advFiltersRef = useRef(null);
  const profileRef = useRef(null);

  const propertyTypes = ["Buy", "Rent", "Auction"];
  const residentialOptions = ["Apartment", "Villa", "Plot", "Studio", "Independent House", "Builder Floor", "Penthouse"];
  const commercialOptions = ["Office", "Shop", "Warehouse", "Office Space", "Industrial Land/Plot", "Showroom", "Co-working Space"];

  const [budget, setBudget] = useState([10, 10100]);
  const formatBudget = (value) => {
    if (value >= 10100) {
      return "100Cr+";
    } else if (value >= 100) {
      return `${(value / 100).toFixed(0)} Cr`;
    }
    return `${value} L`;
  };

  const handleChange = (event, newValue) => {
    setBudget(newValue);
  };

  // Handle city selection and navigate if a Smart Insights prompt is active
  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchQuery(city);

    // Determine which feature requested a city
    const shouldGoToPriceTrends = showPriceTrendsMessage;
    const shouldGoToEmergingLocalities = showEmergingLocalitiesMessage;
    const shouldGoToHeatmaps = showHeatmapsMessage;
    const shouldGoToPriceToIncome = showPriceToIncomeMessage;

    // Navigate to the appropriate Page route with city in query
    if (shouldGoToHeatmaps) {
      navigate(`/heatmaps-page?city=${encodeURIComponent(city)}`);
    } else if (shouldGoToPriceToIncome) {
      navigate(`/price-income-index-page?city=${encodeURIComponent(city)}`);
    } else if (shouldGoToEmergingLocalities) {
      navigate(`/emerging-localities-page?city=${encodeURIComponent(city)}`);
    } else if (shouldGoToPriceTrends) {
      navigate(`/price-trends?city=${encodeURIComponent(city)}`);
    }

    // Then clear prompts
    setShowPriceTrendsMessage(false);
    setShowEmergingLocalitiesMessage(false);
    setShowHeatmapsMessage(false);
    setShowPriceToIncomeMessage(false);
    setShowComparatorMessage(false);
  };

  // Helper to clear all prompts
  const clearAllPrompts = () => {
    setShowPriceTrendsMessage(false);
    setShowEmergingLocalitiesMessage(false);
    setShowHeatmapsMessage(false);
    setShowPriceToIncomeMessage(false);
    setShowComparatorMessage(false);
  };

  // Clear prompts on route change
  useEffect(() => {
    clearAllPrompts();
  }, [location.pathname]);

  // Listen for the Price Trends event
  useEffect(() => {
    const handlePriceTrendsClick = () => {
      clearAllPrompts();
      setShowPriceTrendsMessage(true);

      // Optional: scroll/focus on some element
      const locationInput = document.getElementById("location-input");
      if (locationInput) {
        locationInput.focus();
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('showPriceTrendsMessage', handlePriceTrendsClick);

    return () => {
      window.removeEventListener('showPriceTrendsMessage', handlePriceTrendsClick);
    };
  }, []);

  // Listen for the Emerging Localities event
  useEffect(() => {
    const handleEmergingLocalitiesClick = () => {
      clearAllPrompts();
      setShowEmergingLocalitiesMessage(true);

      // Optional: scroll/focus on some element
      const locationInput = document.getElementById("location-input");
      if (locationInput) {
        locationInput.focus();
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('showEmergingLocalitiesMessage', handleEmergingLocalitiesClick);

    return () => {
      window.removeEventListener('showEmergingLocalitiesMessage', handleEmergingLocalitiesClick);
    };
  }, []);

  // Listen for the Heatmaps event
  useEffect(() => {
    const handleHeatmapsClick = () => {
      clearAllPrompts();
      setShowHeatmapsMessage(true);
      
      // Optional: scroll/focus on some element
      const locationInput = document.getElementById("location-input");
      if (locationInput) {
        locationInput.focus();
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('showHeatmapsMessage', handleHeatmapsClick);

    return () => {
      window.removeEventListener('showHeatmapsMessage', handleHeatmapsClick);
    };
  }, []);


  // Listen for the PriceToIncome event
  useEffect(() => {
    const handlePriceToIncomeClick = () => {
      clearAllPrompts();
      setShowPriceToIncomeMessage(true);
      
      // Optional: scroll/focus on some element
      const locationInput = document.getElementById("location-input");
      if (locationInput) {
        locationInput.focus();
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('showPriceToIncomeMessage', handlePriceToIncomeClick);

    return () => {
      window.removeEventListener('showPriceToIncomeMessage', handlePriceToIncomeClick);
    };
  }, []);

  // Listen for the Comparator event
  useEffect(() => {
    const handleComparatorClick = () => {
      clearAllPrompts();
      setShowComparatorMessage(true);
      
      // Optional: scroll/focus on some element
      const locationInput = document.getElementById("location-input");
      if (locationInput) {
        locationInput.focus();
        locationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    window.addEventListener('showComparatorMessage', handleComparatorClick);

    return () => {
      window.removeEventListener('showComparatorMessage', handleComparatorClick);
    };
  }, []);

  // Auto-hide after 10 seconds for Price Trends
  useEffect(() => {
    if (showPriceTrendsMessage) {
      const timer = setTimeout(() => {
        setShowPriceTrendsMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPriceTrendsMessage]);

  // Auto-hide after 10 seconds for Emerging Localities
  useEffect(() => {
    if (showEmergingLocalitiesMessage) {
      const timer = setTimeout(() => {
        setShowEmergingLocalitiesMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showEmergingLocalitiesMessage]);

  // Auto-hide after 10 seconds for Heatmaps
  useEffect(() => {
    if (showHeatmapsMessage) {
      const timer = setTimeout(() => {
        setShowHeatmapsMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showHeatmapsMessage]);

  // Auto-hide after 10 seconds for Price to Index
  useEffect(() => {
    if (showPriceToIncomeMessage) {
      const timer = setTimeout(() => {
        setShowPriceToIncomeMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPriceToIncomeMessage]);

  // Auto-hide after 10 seconds for Comparator
  useEffect(() => {
    if (showComparatorMessage) {
      const timer = setTimeout(() => {
        setShowComparatorMessage(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showComparatorMessage]);


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

  // 🔹 Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  // 🔹 Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("status");
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Load localities for center search when city changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!selectedCity) return;
      try {
        const res = await getLocalitiesByCity(selectedCity);
        if (!cancelled && res?.success && Array.isArray(res.localities)) {
          const list = res.localities
            .filter(Boolean)
            .map((loc) => `${loc} — ${res.city}`)
            .sort((a, b) => a.localeCompare(b));
          setCenterLocalities(list);
        }
      } catch (e) {
        console.error("Failed to load localities:", e);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedCity]);
  
  // Handle dropdown closing
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close center dropdown when clicking outside
      if (centerOpen && !event.target.closest('.center-search-container')) {
        setCenterOpen(false);
      }
    };
    
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setCenterOpen(false);
      }
    };
    
    // Add event listeners with capture phase to ensure they run before other handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [centerOpen]);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-6">
        {/* LEFT: Logo + Location */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-shrink-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-blue-900 rounded-md flex items-center justify-center text-white font-bold text-lg shadow">
              H
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-800 text-lg">HousePredict</div>
              <div className="text-xs text-blue-700 font-medium -mt-0.5">
                Smart Property Search
              </div>
            </div>
          </Link>


          {/* Location Component - priceMode=false for header */}
          <div className="flex items-center gap-2 w-full relative min-w-0">
            <Location onCitySelect={handleCitySelect} priceMode={false} />

            {/* Message box for Price Trends */}
            {showPriceTrendsMessage && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 whitespace-nowrap max-w-xs">
                <div className="flex items-center gap-2">
                  <span>Enter your city to see price trends!</span>
                  <button
                    onClick={() => setShowPriceTrendsMessage(false)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Arrow pointing to location input */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-blue-600"></div>
              </div>
            )}

            {/* Message box for Emerging Localities */}
            {showEmergingLocalitiesMessage && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 
              bg-green-600 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 
              whitespace-nowrap max-w-lg">
                <div className="flex items-center gap-2">
                  <span>Choose a city to explore emerging localities!</span>
                  <button
                    onClick={() => setShowEmergingLocalitiesMessage(false)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Arrow pointing to location input */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-green-600"></div>
              </div>
            )}


            {/* Message box for Heatmaps */}
            {showHeatmapsMessage && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 whitespace-nowrap max-w-xs">
                <div className="flex items-center gap-2">
                  <span>Choose a city to explore Heatmaps!</span>
                  <button
                    onClick={() => setShowHeatmapsMessage(false)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Arrow pointing to location input */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-red-600"></div>
              </div>
            )}

            {/* Message box for Price To Income */}
            {showPriceToIncomeMessage && (
              <div className="absolute left-full ml-2 mr-2 top-1/2 transform -translate-y-1/2 
              bg-purple-600 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 
              whitespace-nowrap max-w-md">
            
                <div className="flex items-center gap-2">
                  <span>Choose a city to explore Price To Income Index!</span>
                  <button
                    onClick={() => setShowPriceToIncomeMessage(false)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Arrow pointing to location input */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-purple-600"></div>
              </div>
            )}

            {/* Message box for Comparator */}
            {showComparatorMessage && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white text-sm px-4 py-3 rounded-lg shadow-lg z-50 whitespace-nowrap max-w-xs">
                <div className="flex items-center gap-2">
                  <span>Choose a city to explore Comparator!</span>
                  <button
                    onClick={() => setShowComparatorMessage(false)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Arrow pointing to location input */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-teal-600"></div>
              </div>
            )}
          </div>
        </div>


        {/* CENTER: Search bar (keep your existing code here) */}
        <div className="flex-1 basis-full md:basis-auto order-3 md:order-none min-w-0 max-w-full md:max-w-3xl relative mt-2 md:mt-0" ref={advFiltersRef}>
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

            {/* Input Box */}
            <div className="relative flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                placeholder={selectedCity ? `Search localities in ${selectedCity}` : "Search properties..."}
                className="w-full px-3 py-2 text-sm outline-none"
                value={centerQuery}
                onChange={(e) => { setCenterQuery(e.target.value); setCenterOpen(true); }}
                onFocus={() => setCenterOpen(true)}
              />
              {centerQuery && (
                <button
                  aria-label="Clear location"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => { setCenterQuery(""); setCenterOpen(false); }}
                >
                  ×
                </button>
              )}
              {centerOpen && (
                <ul className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-xl shadow-2xl max-h-96 overflow-y-auto z-[70]">
                  {(centerQuery.trim() === "" ? centerLocalities : centerLocalities.filter((l) => l.toLowerCase().includes(centerQuery.toLowerCase())))
                    .slice(0, 200)
                    .map((l) => (
                      <li key={l} className="px-4 py-3 text-sm flex items-center justify-between cursor-pointer hover:bg-blue-50"
                        onClick={() => { setCenterQuery(l); setCenterOpen(false); }}>
                        <span className="text-gray-800">{l.split(" — ")[0]}</span>
                        <span className="text-xs text-gray-500">{l.split(" — ")[1]}</span>
                      </li>
                    ))}
                  {(centerQuery.trim() !== "" && (centerLocalities.filter((l) => l.toLowerCase().includes(centerQuery.toLowerCase())).length === 0)) && (
                    <li className="px-4 py-3 text-sm text-gray-500">No matches</li>
                  )}
                </ul>
              )}
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
            <div className="absolute top-[110%] left-0 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-[50] p-6 text-sm">
              {/* ✅ text-sm applied globally here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <Slider
                    value={budget}
                    onChange={handleChange}
                    valueLabelDisplay="auto"       // ✅ shows label only on hover/drag
                    valueLabelFormat={formatBudget}
                    min={10}                        // 10L
                    max={10100}                     // 100Cr+
                    step={10}                       // stepping in 10L increments
                    sx={{
                      color: "#1d4ed8",
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#1d4ed8",
                        border: "2px solid white",
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "#1d4ed8",
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#dbeafe",
                      },
                      "& .MuiSlider-markLabel": {
                        fontSize: "0.8rem", // consistent font size
                      },
                    }}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {formatBudget(budget[0])} - {formatBudget(budget[1])}
                  </p>
                </div>


                {/* Category & Subtypes */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="flex gap-4 mb-3">
                    {["Residential", "Commercial"].map((cat) => (
                      <button
                        key={cat}
                        className={`px-4 py-1 rounded-md border ${propertyCategory === cat
                          ? "bg-blue-100 border-blue-500 text-blue-700"
                          : "bg-white border-gray-300"
                          } text-sm`} // ✅ consistent font size
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
                      <label key={option} className="flex items-center gap-2">
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
                  <InputLabel
                    id="postedby-label"
                    className="text-sm"
                    sx={{
                      fontSize: "0.875rem", // ✅ same as text-sm
                      "&.MuiInputLabel-shrink": {
                        fontSize: "0.875rem", // ✅ keeps size consistent when floating
                      },
                    }}
                  >
                    Posted By
                  </InputLabel>
                  <Select
                    labelId="postedby-label"
                    value={postedBy}
                    onChange={(e) => setPostedBy(e.target.value)}
                    label="Posted By"
                    className="text-sm"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                      "& .MuiSelect-select": {
                        fontSize: "0.875rem", // ✅ keeps selected text same size as menu
                      },
                    }}
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: {
                        sx: {
                          bgcolor: "white",
                          "& .MuiMenuItem-root": {
                            fontSize: "0.875rem", // ✅ text-sm
                          },
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#f3f4f6",
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
                  <InputLabel
                    id="construction-label"
                    className="text-sm"
                    sx={{
                      fontSize: "0.875rem",
                      "&.MuiInputLabel-shrink": {
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    Construction Status
                  </InputLabel>
                  <Select
                    labelId="construction-label"
                    value={constructionStatus}
                    onChange={(e) => setConstructionStatus(e.target.value)}
                    label="Construction Status"
                    className="text-sm"
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                      "& .MuiSelect-select": {
                        fontSize: "0.875rem", // ✅ keeps selected text same size as menu
                      },
                    }}
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: {
                        sx: {
                          bgcolor: "white",
                          "& .MuiMenuItem-root": {
                            fontSize: "0.875rem", // ✅ text-sm
                          },
                          "& .MuiMenuItem-root:hover": {
                            backgroundColor: "#f3f4f6",
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
                    setBudget([10, 10000]);
                    setPropertyCategory("Residential");
                    setSelectedSubTypes([]);
                    setPossession("");
                    setPostedBy("");
                    setConstructionStatus("");
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 text-sm"
                >
                  Reset
                </button>

                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

        </div>


        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 md:gap-3 order-2 md:order-none ml-auto flex-shrink-0">
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

          <Link
            to="/post-property"
            className="bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow hover:bg-blue-800"
          >
            + Post Property
          </Link>

          {/* Conditionally render Login or Profile */}
          {status ? (
            <div className="relative profile-menu">
              <FaUserCircle
                size={32}
                className="cursor-pointer text-gray-700"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10">

                  {/* User phone with country code */}
                  <p className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                      📞
                    </span>
                    {userData?.countryCode} {userData?.phone || "No number"}
                  </p>

                  {/* Profile */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Profile
                  </button>

                  {/* My Properties */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/my-properties");
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-md"
                  >
                    My Properties
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/wishlist");
                    }}
                    className="flex items-center w-full px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Wishlist
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-1"></div>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-red-600 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="border border-blue-700 text-blue-700 px-4 py-2 text-xs font-semibold rounded-md hover:bg-blue-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
