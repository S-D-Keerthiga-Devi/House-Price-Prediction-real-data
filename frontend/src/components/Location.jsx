import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useSelector, useDispatch } from "react-redux";
import { setCity } from "../store/authSlice";

export default function Location({ onCitySelect, priceMode = false }) {
  const { selectedCity } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // Initialize query from localStorage first, then Redux, then empty
  const storedCity = localStorage.getItem("selectedCity");
  const initialQuery = storedCity || selectedCity || localStorage.getItem("detectedCity") || "";
  const [query, setQuery] = useState(initialQuery);
  const [detectedCity, setDetectedCity] = useState(localStorage.getItem("detectedCity") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isPriceTrendsMode, setIsPriceTrendsMode] = useState(false);
  const [isEmergingLocalitiesMode, setIsEmergingLocalitiesMode] = useState(false);
  const [isHeatmapsMode, setIsHeatmapsMode] = useState(false);
  const [isPriceToIncomeMode, setIsPriceToIncomeMode] = useState(false);
  const [isComparatorMode, setIsComparatorMode] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch Indian cities using OpenStreetMap API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        // First try to load from localStorage for immediate display
        const cachedCities = localStorage.getItem("allCities");
        if (cachedCities) {
          setSuggestions(JSON.parse(cachedCities));
        }
        
        // Fetch major Indian cities using OpenStreetMap Nominatim API
        const osmResponse = await fetch(
          "https://nominatim.openstreetmap.org/search?country=India&format=json&addressdetails=1&limit=500&featuretype=city"
        );
        const osmData = await osmResponse.json();
        
        // Extract city names, remove duplicates and filter out special characters
        const cityNames = new Set();
        osmData.forEach(item => {
          if (item.address && (item.address.city || item.address.town || item.address.village)) {
            const cityName = item.address.city || item.address.town || item.address.village;
            // Only add cities with standard alphanumeric characters and spaces
            if (/^[a-zA-Z0-9\s-]+$/.test(cityName)) {
              cityNames.add(cityName);
            }
          }
        });
        
        // Convert to array and sort alphabetically
        const cities = Array.from(cityNames).sort((a, b) => a.localeCompare(b));
        
        // Then fetch localities from our backend
        const localitiesRes = await getLocalitiesByCity(selectedCity || "Gurgaon");
        
        // Combine both datasets
        let allSuggestions = [...cities];
        
        if (localitiesRes?.success && Array.isArray(localitiesRes.localities)) {
          const localities = localitiesRes.localities
            .filter(Boolean)
            .map(loc => `${loc} — ${localitiesRes.city}`);
          allSuggestions = [...allSuggestions, ...localities];
        }
        
        // Sort and set suggestions
        const sortedSuggestions = allSuggestions.sort((a, b) => a.localeCompare(b));
        setSuggestions(sortedSuggestions);
        
        // Store cities in localStorage for quick access
        localStorage.setItem("allCities", JSON.stringify(sortedSuggestions));
      } catch (err) {
        console.error("Error fetching locations:", err);
        
        // If fetch fails, try to use cached data
        const cachedCities = localStorage.getItem("allCities");
        if (cachedCities) {
          setSuggestions(JSON.parse(cachedCities));
        } else {
          // If OpenStreetMap API fails, fallback to another API
          try {
            const fallbackRes = await fetch(
              "https://countriesnow.space/api/v0.1/countries/cities",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: "India" }),
              }
            );
            const fallbackData = await fallbackRes.json();
            
            if (fallbackData.data && Array.isArray(fallbackData.data)) {
              const sortedFallback = fallbackData.data.sort((a, b) => a.localeCompare(b));
              setSuggestions(sortedFallback);
              localStorage.setItem("allCities", JSON.stringify(sortedFallback));
            }
          } catch (fallbackErr) {
            console.error("Fallback API also failed:", fallbackErr);
          }
        }
      }
    };
    
    fetchCities();
  }, []);

  // ✅ Auto-detect current city - only on initial load
  useEffect(() => {
    // Create a flag to track if this is the initial load
    const isInitialLoad = !localStorage.getItem("userInteractedWithLocation");
    const alreadySelected = selectedCity || localStorage.getItem("selectedCity");
    
    // If user has already selected a city, use that instead
    if (alreadySelected) {
      const cityToUse = localStorage.getItem("selectedCity") || selectedCity;
      setQuery(cityToUse);
      setDetectedCity(cityToUse);
      dispatch(setCity(cityToUse));
      if (onCitySelect) onCitySelect(cityToUse);
      return;
    }
    
    // Try to use cached detected city first for immediate display
    const cachedDetectedCity = localStorage.getItem("detectedCity");
    if (cachedDetectedCity) {
      setQuery(cachedDetectedCity);
      setDetectedCity(cachedDetectedCity);
      dispatch(setCity(cachedDetectedCity));
      if (onCitySelect) onCitySelect(cachedDetectedCity);
    }
    
    // Always attempt to detect location, but only use it if no user selection exists
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
            // Only update if user hasn't made a selection
            if (!localStorage.getItem("userInteractedWithLocation")) {
              setQuery(city);
              setDetectedCity(city);
              dispatch(setCity(city)); // Update Redux store
              if (onCitySelect) onCitySelect(city);
            }
            
            // Always store the detected city
            localStorage.setItem("detectedCity", city);
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
      setIsPriceToIncomeMode(false)
      setIsComparatorMode(false);
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
      setIsPriceToIncomeMode(false)
      setIsComparatorMode(false);
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
      setIsPriceToIncomeMode(false)
      setIsComparatorMode(false);
      // Focus on the input when emerging localities is activated
      const input = wrapperRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    window.addEventListener('showHeatmapsMessage', handleHeatmapsActivation);
    return () => window.removeEventListener('showHeatmapsMessage', handleHeatmapsActivation);
  }, []);

  // ✅ Listen for Price To Income mode activation
  useEffect(() => {
    const handlePriceToIncomeActivation = () => {
      setIsHeatmapsMode(false);
      setIsPriceTrendsMode(false); // Reset other mode
      setIsEmergingLocalitiesMode(false);
      setIsComparatorMode(false);
      setIsPriceToIncomeMode(true)
      
      // Focus on the input when emerging localities is activated
      const input = wrapperRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    window.addEventListener('showPriceToIncomeMessage', handlePriceToIncomeActivation);
    return () => window.removeEventListener('showPriceToIncomeMessage', handlePriceToIncomeActivation);
  }, []);

  // ✅ Listen for Comparator mode activation
  useEffect(() => {
    const handleComparatorActivation = () => {
      setIsHeatmapsMode(false);
      setIsPriceTrendsMode(false); // Reset other mode
      setIsEmergingLocalitiesMode(false);
      setIsPriceToIncomeMode(false);
      setIsComparatorMode(true);
      
      // Focus on the input when emerging localities is activated
      const input = wrapperRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    };

    window.addEventListener('showComparatorMessage', handleComparatorActivation);
    return () => window.removeEventListener('showComparatorMessage', handleComparatorActivation);
  }, []);

  const handleSelect = (city) => {
    // Special case for Gurgaon/Gurugram
    let cityToUse = city;
    const normalizedCity = city.toLowerCase();
    if (normalizedCity === "gurgaon" || normalizedCity === "gurugram") {
      // Always use "Gurgaon" for consistency with the rest of the application
      cityToUse = "Gurgaon";
    }
    
    // Mark that user has interacted with location selection
    localStorage.setItem("userInteractedWithLocation", "true");
    localStorage.setItem("selectedCity", cityToUse);
    
    dispatch(setCity(cityToUse)); // Update Redux store
    setQuery(cityToUse);
    setOpen(false);
    if (onCitySelect) onCitySelect(cityToUse);
    
    // Redirect based on active mode
    if (priceMode || isPriceTrendsMode) {
      navigate(`/price-trends?city=${encodeURIComponent(cityToUse)}`);
      setIsPriceTrendsMode(false); // Reset the mode
    } else if (isEmergingLocalitiesMode) {
      navigate(`/emerging-localities-page?city=${encodeURIComponent(cityToUse)}`);
      setIsEmergingLocalitiesMode(false); // Reset the mode
    } else if (isHeatmapsMode) {
      navigate(`/heatmaps-page?city=${encodeURIComponent(cityToUse)}`);
      setIsHeatmapsMode(false); // Reset the mode
    } else if (isPriceToIncomeMode) {
      navigate(`/price-income-index-page?city=${encodeURIComponent(cityToUse)}`);
      setIsPriceToIncomeMode(false); // Reset the mode
    } else if (isComparatorMode) {
      navigate(`/comparator?city=${encodeURIComponent(cityToUse)}`);
      setIsComparatorMode(false); // Reset the mode
    }
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      // Special case for Gurgaon/Gurugram
      let cityToUse = query;
      const normalizedQuery = query.toLowerCase();
      if (normalizedQuery === "gurgaon" || normalizedQuery === "gurugram") {
        // Always use "Gurgaon" for consistency with the rest of the application
        cityToUse = "Gurgaon";
      }
      
      // Mark that user has interacted with location selection
      localStorage.setItem("userInteractedWithLocation", "true");
      localStorage.setItem("selectedCity", cityToUse);
      
      dispatch(setCity(cityToUse)); // Update Redux store
      if (onCitySelect) onCitySelect(cityToUse);
      
      // Redirect based on active mode
      if (priceMode || isPriceTrendsMode) {
        navigate(`/price-trends?city=${encodeURIComponent(cityToUse)}`);
        setIsPriceTrendsMode(false); // Reset the mode
      } else if (isEmergingLocalitiesMode) {
        navigate(`/emerging-localities?city=${encodeURIComponent(cityToUse)}`);
        setIsEmergingLocalitiesMode(false); // Reset the mode
      } else if (isHeatmapsMode) {
        navigate(`/heatmaps?city=${encodeURIComponent(cityToUse)}`);
        setIsHeatmapsMode(false); // Reset the mode
      } else if (isPriceToIncomeMode) {
        navigate(`/price-income-index?city=${encodeURIComponent(cityToUse)}`);
        setIsPriceToIncomeMode(false); // Reset the mode
      } else if (isComparatorMode) {
        navigate(`/comparator?city=${encodeURIComponent(cityToUse)}`);
        setIsComparatorMode(false); // Reset the mode
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Special case for Gurgaon/Gurugram
      const normalizedQuery = query.toLowerCase();
      if (normalizedQuery === "gurgaon" || normalizedQuery === "gurugram") {
        // Always use "Gurgaon" for consistency with the rest of the application
        handleSelect("Gurgaon");
        return;
      }
      
      // If there's a filtered suggestion that matches the query exactly, use that
      const exactMatch = suggestions.find(city => 
        city.toLowerCase() === normalizedQuery
      );
      
      if (exactMatch) {
        handleSelect(exactMatch);
      } else if (suggestions.length > 0 && query.trim() !== "") {
        // If no exact match but we have suggestions, use the first filtered suggestion
        const filteredSuggestions = suggestions.filter(city => 
          city.toLowerCase().includes(normalizedQuery)
        );
        
        if (filteredSuggestions.length > 0) {
          handleSelect(filteredSuggestions[0]);
        } else {
          // If no suggestions match, just use the query as is
          handleSearch();
        }
      } else {
        // Fallback to regular search
        handleSearch();
      }
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    // Add event listener with capture phase to ensure it runs before other handlers
    document.addEventListener("mousedown", handleClickOutside, true);
    
    // Also close on escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);
  
  // Force load suggestions when component mounts
  useEffect(() => {
    // Try to load from localStorage first
    const cachedCities = localStorage.getItem("allCities");
    if (cachedCities) {
      setSuggestions(JSON.parse(cachedCities));
    } else {
      // Set default cities if no cached data
      setSuggestions(["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Gurgaon", "Noida"]);
    }
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
        onClick={() => {
          setOpen(true);
          // Force dropdown to show all cities when clicked
          const cachedCities = localStorage.getItem("allCities");
          if (cachedCities) {
            setSuggestions(JSON.parse(cachedCities));
          } else {
            // Fallback to default cities
            setSuggestions(["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Gurgaon", "Noida"]);
          }
          localStorage.setItem("userInteractedWithLocation", "true");
        }}
        onFocus={() => {
          setOpen(true);
          // Force dropdown to show all cities when focused
          const cachedCities = localStorage.getItem("allCities");
          if (cachedCities) {
            setSuggestions(JSON.parse(cachedCities));
          }
          localStorage.setItem("userInteractedWithLocation", "true");
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          // Mark that user has interacted with location
          localStorage.setItem("userInteractedWithLocation", "true");
        }}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          // Don't close dropdown immediately to allow for selection
          if (!wrapperRef.current.contains(e.relatedTarget)) {
            setTimeout(() => {
              setOpen(false);
              if (query.trim() === "" && detectedCity) {
                setQuery(detectedCity);
                if (onCitySelect) onCitySelect(detectedCity);
              }
            }, 200);
          }
        }}
        placeholder="Search city..."
        className="h-7 w-20 px-2 border-0 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
      />

      {/* Search button - show when user types and any special mode is active */}
      {(priceMode || isPriceTrendsMode || isEmergingLocalitiesMode || isHeatmapsMode || isPriceToIncomeMode || isComparatorMode) && query.trim() !== "" && (
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

      {open && (
        <ul className="absolute top-9 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          <li className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">Cities</li>
          {suggestions.length > 0 ? (
            suggestions
              .filter((city) =>
                query.trim() === "" ? true : city.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 200)
              .map((city, i) => {
                // Check if this is the first city starting with a new letter
                const currentFirstLetter = city.charAt(0).toUpperCase();
                const prevCity = i > 0 ? suggestions[i - 1] : null;
                const prevFirstLetter = prevCity ? prevCity.charAt(0).toUpperCase() : null;
                const isNewLetterSection = currentFirstLetter !== prevFirstLetter;
                
                return (
                  <React.Fragment key={i}>
                    {isNewLetterSection && (
                      <li className="sticky top-0 px-4 py-1 text-xs font-semibold text-blue-600 bg-blue-50">
                        {currentFirstLetter}
                      </li>
                    )}
                    <li
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(city);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
                    >
                      <LocationOnIcon fontSize="small" className="mr-2 text-gray-400" />
                      {city}
                    </li>
                  </React.Fragment>
                );
              })
          ) : (
            <li className="px-4 py-2 text-sm text-gray-500">Loading cities...</li>
          )}
        </ul>
      )}
    </div>
  );
}