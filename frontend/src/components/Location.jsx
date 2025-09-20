import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // ✅ Dropdown icon
import LocationOnIcon from "@mui/icons-material/LocationOn"; // ✅ Replace Lucide MapPin

export default function Location({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [detectedCity, setDetectedCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSelect = (city) => {
    setQuery(city);
    setOpen(false);
    if (onCitySelect) onCitySelect(city);
    navigate(`/price-trends?city=${encodeURIComponent(city)}`); // ✅ redirect on select
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      if (onCitySelect) onCitySelect(query);
      navigate(`/price-trends?city=${encodeURIComponent(query)}`);
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
          color: "#2563eb",           // blue icon
          mr: 1,                      // margin-right
          fontSize: 24,               // override size (px)
          backgroundColor: "#eff6ff", // light blue background
          borderRadius: "50%",        // circle background
          padding: "4px",             // spacing inside circle
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // subtle shadow
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#dbeafe", // darker blue background on hover
            transform: "scale(1.1)",   // zoom effect
          },
        }}
      />


      {/* Input box (smaller size) */}
      <input
        id="location-input"
        type="text"
        value={query}
        onClick={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        onBlur={() => {
          if (query.trim() === "" && detectedCity) {
            setQuery(detectedCity);
            if (onCitySelect) onCitySelect(detectedCity);
          }
        }}
        placeholder="Search city..."
        className="h-7 w-20 px-2 border-0 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
      />

      {/* Search button (only show when user types a city, not just detected one) */}
      {query.trim() !== "" && query !== detectedCity && (
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
