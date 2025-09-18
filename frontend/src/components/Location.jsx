import React, { useState, useEffect, useRef } from "react";

export default function Location({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [detectedCity, setDetectedCity] = useState(""); // ✅ store detected city
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // ✅ Fetch Indian cities once
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        });
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

  // ✅ Auto-detect current city (reverse geocoding with OpenStreetMap)
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
            setDetectedCity(city); // ✅ store separately
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
  };

  // Close dropdown when clicking outside
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
        id="location-input"
        type="text"
        value={query}
        onClick={() => setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          // ✅ if blank on blur, reset to detected city
          if (query.trim() === "" && detectedCity) {
            setQuery(detectedCity);
            if (onCitySelect) onCitySelect(detectedCity);
          }
        }}
        placeholder="Search city..."
        className="w-full border-0 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
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
