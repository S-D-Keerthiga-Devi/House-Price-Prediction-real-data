import React, { useState, useEffect, useRef } from "react";
import { Search, X, MapPin } from "lucide-react";
import { getLocalitiesByCity } from "../api/house";

const PropertySearch = ({ selectedCity, availableLocalities = [], onLocalitySelect, onClear }) => {
  const [query, setQuery] = useState("");
  const [localities, setLocalities] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const searchRef = useRef(null);

  // Use available localities from property cards when provided
  useEffect(() => {
    if (!selectedCity) {
      setLocalities([]);
      setFilteredLocalities([]);
      setNoData(false);
      return;
    }
    
    setLoading(true);
    
    // If we have available localities from property cards, use those
    if (availableLocalities && availableLocalities.length > 0) {
      const sortedLocalities = [...availableLocalities].sort((a, b) => a.localeCompare(b));
      setLocalities(sortedLocalities);
      setFilteredLocalities(sortedLocalities);
      setNoData(false); // Ensure noData is false when we have localities
      setLoading(false);
      return;
    } else if (Array.isArray(availableLocalities) && availableLocalities.length === 0) {
      // If we have an empty array, it means there are no localities for this city
      setLocalities([]);
      setFilteredLocalities([]);
      setNoData(true); // Only set noData to true when we have no localities
      setLoading(false);
      return;
    }
    
    // Otherwise fetch localities from API
    const fetchLocalities = async () => {
      try {
        const response = await getLocalitiesByCity(selectedCity);
        if (response.success && Array.isArray(response.localities) && response.localities.length > 0) {
          // Sort localities alphabetically
          const sortedLocalities = response.localities.sort((a, b) => a.localeCompare(b));
          setLocalities(sortedLocalities);
          setFilteredLocalities(sortedLocalities);
          setNoData(false);
        } else {
          setLocalities([]);
          setFilteredLocalities([]);
          setNoData(true);
        }
      } catch (error) {
        console.error("Error fetching localities:", error);
        setLocalities([]);
        setFilteredLocalities([]);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalities();
  }, [selectedCity]);

  // Filter localities based on search query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredLocalities(localities);
      return;
    }

    const filtered = localities.filter(locality => 
      locality.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLocalities(filtered);
  }, [query, localities]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle locality selection
  const handleLocalitySelect = (locality) => {
    setQuery(locality);
    setIsOpen(false);
    if (onLocalitySelect) {
      onLocalitySelect(locality);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery("");
    if (onClear) {
      onClear();
    }
  };

  // Function to handle city selection
  const handleSelectAnotherCity = () => {
    // Navigate to header city selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Find the city selection element in the header and focus it
    const citySelectionElement = document.querySelector('.location-selector');
    if (citySelectionElement) {
      citySelectionElement.click();
    }
  };

  const handleServiceClick = (service) => {
    if (service.isComparator) {
      // Dispatch custom event to trigger message box in header for Comparators
      const event = new CustomEvent('showComparatorMessage');
      window.dispatchEvent(event);
      return;
    }

    // Handle navigation for all services that have a link
    if (service.link) {
      navigate(service.link);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => setIsOpen(true)}
          placeholder={selectedCity ? `Search localities in ${selectedCity}` : "Select a city first"}
          className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!selectedCity || loading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown for localities */}
      {isOpen && selectedCity && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">Loading localities...</div>
          ) : filteredLocalities.length > 0 ? (
            <ul className="py-1">
              {filteredLocalities.map((locality, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleLocalitySelect(locality)}
                >
                  {locality}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 flex flex-col">
              {noData || (availableLocalities && availableLocalities.length === 0) ? (
                <>
                  <span className="mb-2">No property data available for {selectedCity}</span>
                  <button 
                    onClick={() => handleServiceClick({ isComparator: true })}
                    className="text-blue-600 hover:text-blue-800 text-left flex items-center"
                  >
                    <MapPin className="w-4 h-4 mr-1" /> Select another city
                  </button>
                </>
              ) : (
                query.trim() ? "No matching localities found" : "No localities available"
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Only show no data message when there's truly no data */}
      {selectedCity && !loading && noData && availableLocalities && availableLocalities.length === 0 && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 flex flex-col">
          <span className="mb-2 font-medium">No property data available for {selectedCity}</span>
          <button 
            onClick={() => handleServiceClick({ isComparator: true })}
            className="text-blue-600 hover:text-blue-800 text-left flex items-center font-medium"
          >
            <MapPin className="w-4 h-4 mr-1" /> Select another city
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertySearch;