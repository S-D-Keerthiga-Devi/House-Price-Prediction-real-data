import React, { useEffect, useRef, useState } from "react";
import { getCities, getLocalitiesByCity } from "../api/house";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BarChart3,
  Building2,
  PieChart,
  Lightbulb,
  Briefcase,
  X,
} from "lucide-react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function Banner({ onScrollToForm }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("buy");
  const [cities, setCities] = useState([]);
  const [localityOptions, setLocalityOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { selectedCity } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  const handleServiceClick = (service) => {
    if (service.isComparator) {
      // Dispatch custom event to trigger message box in header for Comparators
      const event = new CustomEvent('showComparatorMessage');
      window.dispatchEvent(event);
      return;
    }

    if (service.isPriceTrends) {
      // Dispatch custom event to trigger message box in header for Comparators
      const event = new CustomEvent('showPriceTrendsMessage');
      window.dispatchEvent(event);
      return;
    }

    // Handle navigation for all services that have a link
    if (service.link) {
      navigate(service.link);
    }
  };
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getCities();
      if (!cancelled && res?.success && Array.isArray(res.cities)) {
        setCities(res.cities);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCity) return;
    let cancelled = false;
    (async () => {
      const res = await getLocalitiesByCity(selectedCity);
      if (!cancelled && res?.success && Array.isArray(res.localities)) {
        const locs = res.localities
          .filter(Boolean)
          .map((location) => `${location} — ${res.city}`)
          .sort((a, b) => a.localeCompare(b));
        setLocalityOptions(locs);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCity]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden mt-16">
      {/* Background Image with Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(to bottom right, rgba(0,28,64,0.65), rgba(0,48,96,0.65)),
              url('https://images.pexels.com/photos/3646913/pexels-photo-3646913.jpeg')
            `,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden px-8 py-12 md:px-12 md:py-16 transition-all hover:shadow-2xl">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Quote + Search */}
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-snug">
                Explore properties,
                <br />
                gain insights, and unlock
                <br />
                new investment opportunities
              </h1>

              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-visible hover:shadow-lg transition-all max-w-2xl">
                <div className="flex items-center relative" ref={wrapperRef}>
                  {/* Buy/Rent Select */}
                  <div className="relative border-r border-gray-100 flex-shrink-0 pl-2">
                    <FormControl
                      size="small"
                      variant="outlined"
                      sx={{
                        minWidth: 100,
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                          paddingY: "8px",
                          "& fieldset": { border: "none" },
                          "&:hover fieldset": { border: "none" },
                        },
                      }}
                    >
                      <Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        sx={{
                          fontSize: "0.875rem",
                          color: "#001c40",
                          fontWeight: "600",
                          "& .MuiSelect-select": {
                            paddingY: "8px",
                            paddingX: "12px",
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              borderRadius: "10px",
                              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                            },
                          },
                        }}
                      >
                        <MenuItem value="buy" sx={{ fontSize: "0.875rem", color: "#001c40", fontWeight: "500" }}>
                          Buy
                        </MenuItem>
                        <MenuItem value="rent" sx={{ fontSize: "0.875rem", color: "#001c40", fontWeight: "500" }}>
                          Rent
                        </MenuItem>
                        <MenuItem value="auction" sx={{ fontSize: "0.875rem", color: "#001c40", fontWeight: "500" }}>
                          Auction
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder={selectedCity ? `Search localities in ${selectedCity}` : "Search location or property"}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="flex-1 px-6 py-4 text-gray-800 placeholder-gray-400 focus:outline-none text-base bg-white min-w-0"
                  />

                  {/* Search Button */}
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-4 flex items-center justify-center transition-colors rounded-r-xl"
                  >
                    <Search className="w-5 h-5.6" />
                  </button>


                  {/* Clear Icon */}
                  {searchQuery && (
                    <button
                      aria-label="Clear location"
                      className="absolute right-16 text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setSearchQuery("");
                        setOpen(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Dropdown Options */}
                  {open && (
                    <ul className="absolute left-2 right-2 top-full mt-2 bg-white border rounded-2xl shadow-2xl max-h-[35rem] overflow-y-auto z-50">
                      {(searchQuery.trim() === ""
                        ? localityOptions
                        : localityOptions.filter((l) =>
                          l.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      )
                        .slice(0, 200)
                        .map((l) => (
                          <li
                            key={l}
                            className="px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors hover:bg-blue-50"
                            onClick={() => {
                              setSearchQuery(l);
                              setOpen(false);
                            }}
                          >
                            <span className="text-gray-800">
                              {l.split(" — ")[0]}
                            </span>
                            <span className="text-xs text-gray-500">
                              {l.split(" — ")[1]}
                            </span>
                          </li>
                        ))}

                      {searchQuery.trim() !== "" &&
                        localityOptions.filter((l) =>
                          l.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                          <li className="px-4 py-3 text-sm text-gray-500">
                            No matches
                          </li>
                        )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Services */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Services</h2>
              <div className="space-y-3">
                <button onClick={() => navigate('/property-valuation')} className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Property Valuation Report
                  </span>
                </button>
                <button
                  onClick={() => handleServiceClick({ isComparator: true })}
                  className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">Property Comparator</span>
                </button>
                <button onClick={() => handleServiceClick({ isPriceTrends: true })} className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Lightbulb className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Smart Insights
                  </span>
                </button>
              </div>
              <button className="text-blue-800 hover:text-blue-900 font-medium flex items-center gap-2">
                More Services →
              </button>
            </div>

            {/* Right Column - Investments */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Investments</h2>
              <div className="space-y-3">
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <PieChart className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Fractional Investment
                  </span>
                </button>
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    REIT / SM REIT
                  </span>
                </button>
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Venture Invest
                  </span>
                </button>
              </div>
              <button className="text-blue-800 hover:text-blue-900 font-medium flex items-center gap-2">
                More Investments →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}