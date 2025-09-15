import React, { useState, useEffect, useRef } from "react";

export default function Location({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const username = "keerthiga"; // 🔑 GeoNames username

  // ✅ Clean city names (remove suffixes + non-letters)
  const cleanCityName = (name) => {
    if (!name) return "";
    let cleaned = name
      .trim();
  
    // Capitalize each word
    return cleaned
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };
  

  // Fetch city list
  const fetchCities = async (search = "a") => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
          search
        )}&country=IN&featureClass=P&maxRows=20&username=${username}`
      );
      const data = await res.json();
      const cityNames = data.geonames.map((item) =>
        cleanCityName(item.toponymName || item.name)
      );
      // Remove empty + duplicates
      const filtered = [...new Set(cityNames.filter((c) => c.length > 0))];
      setSuggestions(filtered);
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📍 Detect current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://secure.geonames.org/findNearbyPlaceNameJSON?lat=${latitude}&lng=${longitude}&username=${username}`
          );
          const data = await res.json();
          if (data.geonames && data.geonames.length > 0) {
            const rawCity = data.geonames[0].toponymName || data.geonames[0].name;
            const city = cleanCityName(rawCity);
            setQuery(city);
            if (onCitySelect) onCitySelect(city);
          }
        } catch (err) {
          console.error("Error getting city:", err);
        }
      });
    }
  }, []);

  const handleClick = () => {
    setOpen(true);
    if (suggestions.length === 0) fetchCities("a");
  };

  const handleSelect = (city) => {
    setQuery(city);
    setOpen(false);
    if (onCitySelect) onCitySelect(city);
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onClick={handleClick}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchCities(e.target.value);
        }}
        placeholder="Search city in India..."
        className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
      />

      {loading && <div className="absolute right-3 top-2 text-gray-400">⏳</div>}

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
          {suggestions.map((city, i) => (
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
