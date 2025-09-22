import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function Location({ onCitySelect, priceMode = false }) {
  const [query, setQuery] = useState("");
  const [detectedCity, setDetectedCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isPriceTrendsMode, setIsPriceTrendsMode] = useState(false);
  const [isEmergingLocalitiesMode, setIsEmergingLocalitiesMode] = useState(false);
  const [isHeatmapsMode, setIsHeatmapsMode] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch Indian cities once
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: "India" }),
          }
        );
        const data = await res.json();
        if (data.data) {
          setSuggestions(data.data.sort());
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // ✅ Auto-detect current city
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state_district ||
            "";
          if (city) {
            setQuery(city);
            setDetectedCity(city);
            if (onCitySelect) onCitySelect(city);
          }
        } catch (err) {
          console.error("Error detecting location:", err);
        }
      });
    }
  }, []);

  // ✅ Listen for price trends mode activation
  useEffect(() => {
    const handlePriceTrendsActivation = () => {
      setIsPriceTrendsMode(true);
      setIsEmergingLocalitiesMode(false); // Reset other mode
      setIsHeatmapsMode(false);
      // Focus on the input when price trends is activated
      const input = wrapperRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    window.addEventListener('showPriceTrendsMessage', handlePriceTrendsActivation);
    return () => window.removeEventListener('showPriceTrendsMessage', handlePriceTrendsActivation);
  }, []);

  // ✅ Listen for emerging localities mode activation
  useEffect(() => {
    const handleEmergingLocalitiesActivation = () => {
      setIsEmergingLocalitiesMode(true);
      setIsPriceTrendsMode(false); // Reset other mode
      setIsHeatmapsMode(false);
      // Focus on the input when emerging localities is activated
      const input = wrapperRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    window.addEventListener('showEmergingLocalitiesMessage', handleEmergingLocalitiesActivation);
    return () => window.removeEventListener('showEmergingLocalitiesMessage', handleEmergingLocalitiesActivation);
  }, []);


  // ✅ Listen for heatmaps mode activation
  useEffect(() => {
    const handleHeatmapsActivation = () => {
      setIsHeatmapsMode(true);
      setIsPriceTrendsMode(false); // Reset other mode
      setIsEmergingLocalitiesMode(false);
      // Focus on the input when emerging localities is activated
      const input = wrapperRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    window.addEventListener('showHeatmapsMessage', handleHeatmapsActivation);
    return () => window.removeEventListener('showHeatmapsMessage', handleHeatmapsActivation);
  }, []);

  const handleSelect = (city) => {
    setQuery(city);
    setOpen(false);
    if (onCitySelect) onCitySelect(city);
    
    // Redirect based on active mode
    if (priceMode || isPriceTrendsMode) {
      navigate(`/price-trends?city=${encodeURIComponent(city)}`);
      setIsPriceTrendsMode(false); // Reset the mode
    } else if (isEmergingLocalitiesMode) {
      navigate(`/emerging-localities?city=${encodeURIComponent(city)}`);
      setIsEmergingLocalitiesMode(false); // Reset the mode
    } else if (isHeatmapsMode) {
      navigate(`/heatmaps?city=${encodeURIComponent(city)}`);
      setIsEmergingLocalitiesMode(false); // Reset the mode
    }
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      if (onCitySelect) onCitySelect(query);
      
      // Redirect based on active mode
      if (priceMode || isPriceTrendsMode) {
        navigate(`/price-trends?city=${encodeURIComponent(query)}`);
        setIsPriceTrendsMode(false); // Reset the mode
      } else if (isEmergingLocalitiesMode) {
        navigate(`/emerging-localities?city=${encodeURIComponent(query)}`);
        setIsEmergingLocalitiesMode(false); // Reset the mode
      } else if (isHeatmapsMode) {
        navigate(`/heatmaps?city=${encodeURIComponent(query)}`);
        setIsHeatmapsMode(false); // Reset the mode
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full flex items-center border rounded-lg px-2 py-1 bg-white shadow-sm"
    >
      <LocationOnIcon
        sx={{
          color: "#2563eb",
          mr: 1,
          fontSize: 24,
          backgroundColor: "#eff6ff",
          borderRadius: "50%",
          padding: "4px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#dbeafe",
            transform: "scale(1.1)",
          },
        }}
      />

      {/* Input box */}
      <input
        id="location-input"
        type="text"
        value={query}
        onClick={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (query.trim() === "" && detectedCity) {
            setQuery(detectedCity);
            if (onCitySelect) onCitySelect(detectedCity);
          }
        }}
        placeholder="Search city..."
        className="h-7 w-20 px-2 border-0 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
      />

      {/* Search button - show when user types and any special mode is active */}
      {(priceMode || isPriceTrendsMode || isEmergingLocalitiesMode || isHeatmapsMode) && query.trim() !== "" && (
        <button
          onClick={handleSearch}
          className="p-1 text-gray-500 hover:text-blue-600"
        >
          <SearchIcon fontSize="small" />
        </button>
      )}

      {/* Dropdown toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 text-gray-500 hover:text-blue-600"
      >
        <ArrowDropDownIcon fontSize="small" />
      </button>

      {open && suggestions.length > 0 && (
        <ul className="absolute top-9 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions
            .filter((city) =>
              city.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 20)
            .map((city, i) => (
              <li
                key={i}
                onClick={() => handleSelect(city)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {city}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}