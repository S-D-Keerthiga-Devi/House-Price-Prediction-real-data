import React, { useState, useEffect, useRef } from "react";
import { Search, X, MapPin } from "lucide-react";

const PropertySearch = ({ selectedCity, availableLocalities = [], onLocalitySelect, onClear }) => {
  const [query, setQuery] = useState("");
  const [localities, setLocalities] = useState([]);
  const [filteredLocalities, setFilteredLocalities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
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
    
    // Only use availableLocalities from props - no API call
    if (availableLocalities && availableLocalities.length > 0) {
      const sortedLocalities = [...availableLocalities].sort((a, b) => a.localeCompare(b));
      setLocalities(sortedLocalities);
      setFilteredLocalities(sortedLocalities);
      setNoData(false);
    } else {
      // No localities available for this city
      setLocalities([]);
      setFilteredLocalities([]);
      setNoData(true);
    }
  }, [selectedCity, availableLocalities]); // Only depend on selectedCity and availableLocalities

  // Filter localities based on search query
  useEffect(() => {
    if (!query) {
      setFilteredLocalities(localities);
      return;
    }
    
    const filtered = localities.filter(locality => 
      locality.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredLocalities(filtered);
  }, [query, localities]);

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle locality selection
  const handleLocalitySelect = (locality) => {
    setQuery(locality);
    setIsOpen(false);
    
    // Call parent's onLocalitySelect handler
    if (onLocalitySelect) {
      onLocalitySelect(locality);
    }
  };

  // Handle clear search
  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    
    // Call parent's onClear handler
    if (onClear) {
      onClear();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          placeholder="Search for a locality..."
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredLocalities.length > 0 ? (
            <ul>
              {filteredLocalities.map((locality, index) => (
                <li
                  key={index}
                  onClick={() => handleLocalitySelect(locality)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{locality}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 mb-2">No localities found</p>
              <p className="text-sm text-gray-400">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySearch;