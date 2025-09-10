import React, { useState, useEffect, useRef } from "react";

export default function CitySearch({ onCitySelect }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    const username = "keerthiga"; // 🔑 your GeoNames username

    // Fetch city suggestions
    const fetchCities = async (search = "a") => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://secure.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(
                    search
                )}&country=IN&featureClass=P&maxRows=15&username=${username}`
            );
            const data = await res.json();
            const cityNames = data.geonames.map((item) => item.name);
            setSuggestions([...new Set(cityNames)]);
        } catch (err) {
            console.error("Error fetching cities:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handle typing
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 0) {
            fetchCities(value);
        } else {
            fetchCities("a"); // fallback list when empty
        }
    };

    // Handle focus → show suggestions immediately
    const handleFocus = () => {
        if (suggestions.length === 0) {
            fetchCities("a");
        }
    };

    // Handle selection
    const handleSelect = (city) => {
        setQuery(city);
        setSuggestions([]);
        if (onCitySelect) onCitySelect(city);
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSuggestions([]); // hide dropdown
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="Search city in India..."
                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 text-lg text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 shadow-sm transition-all duration-300"
            />

            {/* Loading Spinner */}
            {loading && (
                <div className="absolute right-3 top-3 text-gray-400 text-sm">⏳</div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                    {suggestions.map((city, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect(city)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
