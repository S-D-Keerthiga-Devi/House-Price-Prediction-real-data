import React, { useEffect, useState, useMemo, useRef } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";
import Location from "./Location";
import SubLocalitySearch from "./SubLocalitySearch";
import { TrendingUp, ChevronLeft, ChevronRight, MapPin, FileText, Building, Target, ShoppingCart, Building2, Calculator, BookOpen, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { FormControl, Select, MenuItem } from "@mui/material";
import { useLocation } from "react-router-dom";


export default function PropertyTrends() {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedType, setSelectedType] = useState("Apartment");
  const [timePeriod, setTimePeriod] = useState("Monthly");
  const [searchType, setSearchType] = useState("");
  const [activeTab, setActiveTab] = useState("price-trends");
  const [tabScrollPosition, setTabScrollPosition] = useState(0);
  const tabContainerRef = useRef(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cityFromURL = params.get("city"); // ✅ get ?city=Delhi

  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (cityFromURL) {
      setSelectedCity(cityFromURL);
    }
  }, [cityFromURL]);

  const tabs = [
    { id: "price-trends", label: "Price Trends", icon: TrendingUp },
    { id: "neighbourhoods", label: "Neighbourhoods Insights", icon: MapPin },
    { id: "registry", label: "Registry Records", icon: FileText },
    { id: "popular-projects", label: "Popular Projects", icon: Building },
    { id: "projects-focus", label: "Projects in Focus", icon: Target },
    { id: "buy-properties", label: "Buy Properties", icon: ShoppingCart },
    { id: "commercial-sale", label: "Commercial Sale Properties", icon: Building2 },
    { id: "commercial-rent", label: "Commercial Rent Properties", icon: Building },
    { id: "calculators", label: "Calculators", icon: Calculator },
    { id: "buying-guide", label: "Buying Guide", icon: BookOpen },
    { id: "property-types", label: "Property Types", icon: Home },
  ];

  // Get current tab info for dynamic heading
  const currentTab = tabs.find(tab => tab.id === activeTab);
  const currentTabIcon = currentTab?.icon || TrendingUp;
  const currentTabLabel = currentTab?.label || "Property Dashboard";

  // Scroll tabs function
  const scrollTabs = (direction) => {
    const container = tabContainerRef.current;
    if (!container) return;

    const scrollAmount = 200; // pixels to scroll
    const currentScroll = container.scrollLeft;

    if (direction === 'left') {
      container.scrollTo({
        left: Math.max(0, currentScroll - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }

    // Update scroll position state
    setTimeout(() => {
      setTabScrollPosition(container.scrollLeft);
    }, 300);
  };

  useEffect(() => {
    fetch("/data/price_timeseries.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const result = Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });
        const filteredData = result.data.filter(d => d.city && d.rate_sqft);
        filteredData.forEach(d => {
          d.city = d.city.trim();
          d.property_category = d.property_category?.trim();
        });

        setTimeSeriesData(filteredData);

        const uniqueCities = [...new Set(filteredData.map(d => d.city))];
        setCities(uniqueCities);
        setSelectedCity("");

        const uniqueCategories = [...new Set(
          filteredData.map(d => d.property_category).filter(Boolean)
        )];
        setCategories(uniqueCategories);
        setSelectedType(uniqueCategories.includes("Apartment") ? "Apartment" : uniqueCategories[0] || "All");

        // ✅ Set selectedCity AFTER CSV loaded, INSIDE the then()
        if (cityFromURL && uniqueCities.includes(cityFromURL.trim())) {
          setSelectedCity(cityFromURL.trim());
        } else if (!cityFromURL && uniqueCities.length > 0) {
          setSelectedCity(uniqueCities[0]); // default first city
        }
      })
      .catch((err) => console.error("CSV load failed:", err));
  }, []);

  // Last 12 months
  const last12Months = useMemo(() => {
    const months = [];
    let current = dayjs().subtract(1, "month");
    for (let i = 0; i < 12; i++) {
      months.unshift(current.format("MMM-YY"));
      current = current.subtract(1, "month");
    }
    return months;
  }, []);

  // Quarter labels
  const getQuarterMonths = (quarterStr) => {
    // quarterStr example: "2024Q3"
    const year = quarterStr.slice(0, 4);
    const q = parseInt(quarterStr.slice(5), 10);

    const quarterMap = {
      1: "Jan-Mar",
      2: "Apr-Jun",
      3: "Jul-Sep",
      4: "Oct-Dec",
    };

    return `${quarterMap[q]} ${year}`;
  };

  // Helper: convert monthly data to quarterly averages
  const groupToQuarters = (data) => {
    if (!data || !data.length) return [];

    const quarterMap = {
      1: "Jan-Mar",
      2: "Apr-Jun",
      3: "Jul-Sep",
      4: "Oct-Dec",
    };

    // Group by year and quarter
    const quartersObj = {};

    data.forEach(d => {
      if (!d.month || !d.year || !d.rate_sqft) return;

      const monthNum = dayjs(`${d.month}-${d.year}`, "MMM-YYYY").month() + 1; // 1-12
      const quarter = Math.floor((monthNum - 1) / 3) + 1;
      const key = `${d.year}-Q${quarter}`;

      if (!quartersObj[key]) quartersObj[key] = [];
      quartersObj[key].push(d.rate_sqft);
    });

    // Convert to array with average
    const quartersArray = Object.keys(quartersObj)
      .sort()
      .map(key => {
        const [year, qStr] = key.split("-");
        const qNum = parseInt(qStr.slice(1), 10);
        const avgRate =
          quartersObj[key].reduce((sum, r) => sum + r, 0) / quartersObj[key].length;

        return {
          period: `${quarterMap[qNum]} ${year}`,
          rate_sqft: Math.round(avgRate),
        };
      });

    return quartersArray;
  };

  // Chart data
  const chartData = useMemo(() => {
    if (!selectedCity) return [];

    const filtered = timeSeriesData.filter(d => {
      const matchCity = d.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedType === "All" || d.property_category === selectedType;
      return matchCity && matchCategory;
    });
    if (!filtered.length) return [];

    if (timePeriod === "Monthly") {
      return last12Months.map(monthStr => {
        const [m, y] = monthStr.split("-");
        const monthData = filtered.filter(d =>
          dayjs(`${d.month}-${d.year}`, "MMM-YYYY").format("MMM-YY") === monthStr
        );
        const avgRate = monthData.length
          ? Math.round(monthData.reduce((sum, d) => sum + d.rate_sqft, 0) / monthData.length)
          : null;
        const fullDate = dayjs(`${m}-20${y}`, "MMM-YYYY");
        return { period: fullDate.format("MMM YYYY"), rate_sqft: avgRate, sortKey: monthStr };
      }).filter(d => d.rate_sqft !== null);
    }

    if (timePeriod === "Quarterly") {
      const filtered = timeSeriesData.filter(d => {
        const matchCity = d.city.toLowerCase() === selectedCity.toLowerCase();
        const matchCategory = selectedType === "All" || d.property_category === selectedType;
        return matchCity && matchCategory;
      });

      return groupToQuarters(filtered);
    }



    if (timePeriod === "Yearly") {
      const years = {};
      filtered.forEach(d => {
        if (!years[d.year]) years[d.year] = [];
        years[d.year].push(d.rate_sqft);
      });
      return Object.keys(years).sort().map(y => ({
        period: y.toString(),
        rate_sqft: Math.round(years[y].reduce((a, b) => a + b, 0) / years[y].length)
      }));
    }

    return [];
  }, [selectedCity, selectedType, timePeriod, timeSeriesData, last12Months]);

  const highest = chartData.length ? Math.max(...chartData.map(d => d.rate_sqft)) : 0;
  const lowest = chartData.length ? Math.min(...chartData.map(d => d.rate_sqft)) : 0;
  const average = chartData.length
    ? Math.round(chartData.reduce((s, d) => s + d.rate_sqft, 0) / chartData.length)
    : 0;

  const renderTabContent = () => {
    switch (activeTab) {
      case "price-trends":
        return (
          <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4 mt-10">
            <div className="max-w-7xl mx-auto">

              {/* Chart */}
              <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
                {selectedCity && chartData.length > 0 ? (
                  <>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedCity} Price Trends</h2>

                      {/* Time period + property type */}
                      <div className="flex gap-4 items-center">
                        {/* Sub-Locality Selector */}
                        <SubLocalitySearch city={selectedCity} />

                        <FormControl
                          size="small"
                          sx={{
                            minWidth: 140,
                            bgcolor: "white",
                            borderRadius: 2,
                            boxShadow: 1,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e5e7eb", // gray-200
                              borderWidth: 2,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8", // blue-700 on hover
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8",
                            },
                          }}
                        >
                          <Select
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Quarterly">Quarterly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl
                          size="small"
                          sx={{
                            minWidth: 160,
                            bgcolor: "white",
                            borderRadius: 2,
                            boxShadow: 1,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#e5e7eb", // gray-200
                              borderWidth: 2,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8", // blue-700
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8", // blue-700
                            },
                          }}
                        >
                          <Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            displayEmpty
                          >
                            {categories.map((ptype, i) => (
                              <MenuItem key={i} value={ptype}>
                                {ptype}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                      </div>
                    </div>

                    <div className="p-8">
                      <ResponsiveContainer width="100%" height={450}>
                        {timePeriod === "Yearly" ? (
                          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.8} />

                            <XAxis dataKey="period">
                              <Label value="Year" offset={0} position="insideBottom" fontSize={14} fill="#1e3a8a" />
                            </XAxis>

                            <YAxis stroke="#1e3a8a" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}>
                              <Label
                                value="Price per sqft"
                                angle={-90}
                                position="insideLeft"
                                offset={0}
                                style={{ textAnchor: "middle", fill: "#1e3a8a", fontSize: 14 }}
                              />
                            </YAxis>

                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Price per sqft"]} />

                            <Area
                              type="monotone"
                              dataKey="rate_sqft"
                              stroke="#1e3a8a"
                              fill="rgba(30,58,138,0.3)"
                              strokeWidth={3}
                            />
                          </AreaChart>
                        ) : (
                          <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: timePeriod === "Quarterly" ? 80 : 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" opacity={0.8} />

                            <XAxis
                              dataKey="period"
                              interval={0} // show all labels
                              tick={({ x, y, payload }) => {
                                const words = payload.value.split(" "); // "Jan 2025"
                                if (timePeriod === "Monthly") {
                                  return (
                                    <text
                                      x={x}
                                      y={y + 15} // move labels slightly below axis
                                      textAnchor="end" // align right for rotation
                                      fontSize={12}
                                      transform={`rotate(-30, ${x}, ${y + 15})`} // rotate to avoid overlap
                                      fill="#64748b"
                                    >
                                      {words.map((word, i) => (
                                        <tspan key={i} x={x} dy={i === 0 ? 0 : 15}>
                                          {word}
                                        </tspan>
                                      ))}
                                    </text>
                                  );
                                } else {
                                  // Quarterly / Yearly
                                  return (
                                    <text x={x} y={y + 10} textAnchor="middle" fontSize={12} fill="#64748b">
                                      {words.map((word, i) => (
                                        <tspan key={i} x={x} dy={i === 0 ? 0 : 15}>
                                          {word}
                                        </tspan>
                                      ))}
                                    </text>
                                  );
                                }
                              }}
                            >
                              <Label
                                value="Period"
                                offset={timePeriod === "Monthly" ? -35 : -30} // adjust label below rotated ticks
                                position="insideBottom"
                                fontSize={14}
                                fill="#64748b"
                              />
                            </XAxis>



                            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}>
                              <Label
                                value="Price per sqft"
                                angle={-90}
                                position="insideLeft"
                                offset={0}
                                style={{ textAnchor: "middle", fill: "#64748b", fontSize: 14 }}
                              />
                            </YAxis>

                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Price per sqft"]} labelFormatter={(label) => `Period: ${label}`} />

                            <Line
                              type="monotone"
                              dataKey="rate_sqft"
                              stroke="#1e3a8a"
                              strokeWidth={3}
                              dot={{ fill: "#1e3a8a", strokeWidth: 2, r: 5 }}
                              activeDot={{ r: 7, stroke: "#1e3a8a", strokeWidth: 2, fill: "white" }}
                            />
                          </LineChart>
                        )}
                      </ResponsiveContainer>

                    </div>
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <TrendingUp className="w-16 h-16 mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-500 text-lg">Select a city to view price trends</p>
                      <p className="text-gray-400 text-sm">Choose from the dropdown above</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary stats */}
              {selectedCity && chartData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-blue-600">₹{highest.toLocaleString()}</div>
                      <p className="text-sm text-blue-700 font-medium">Highest Price/sqft</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-green-600">₹{average.toLocaleString()}</div>
                      <p className="text-sm text-green-700 font-medium">Average Price/sqft</p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold text-orange-600">₹{lowest.toLocaleString()}</div>
                      <p className="text-sm text-orange-700 font-medium">Lowest Price/sqft</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </section>
        );
      default:
        return (
          <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                {(() => {
                  const tab = tabs.find(t => t.id === activeTab);
                  const IconComponent = tab ? tab.icon : Building;
                  return <IconComponent className="w-16 h-16 mx-auto opacity-50" />;
                })()}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-500">Coming Soon</p>
              <p className="text-gray-400 text-sm mt-2">This feature is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Header - Changes based on active tab */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-2xl mb-6 mt-10 shadow-lg">
            {React.createElement(currentTabIcon, { className: "w-8 h-8 text-white" })}
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">{currentTabLabel}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {activeTab === "price-trends"
              ? "Track property prices across cities, categories, and time periods"
              : "Comprehensive property insights and market analysis"
            }
          </p>
        </div>

        {/* Tab Navigation Carousel */}
        <div className="relative mb-8">
          <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Left scroll button */}
            <button
              onClick={() => scrollTabs('left')}
              className="flex-shrink-0 p-3 hover:bg-gray-50 transition-colors duration-200 border-r border-gray-100"
              disabled={tabScrollPosition === 0}
            >
              <ChevronLeft className={`w-5 h-5 ${tabScrollPosition === 0 ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>

            {/* Scrollable tabs container */}
            <div
              ref={tabContainerRef}
              className="flex overflow-x-auto scrollbar-hide flex-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-4 whitespace-nowrap font-medium transition-all duration-300 border-b-3 ${isActive
                        ? 'text-blue-700 border-blue-700 bg-blue-50'
                        : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-blue-50/50'
                        }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => scrollTabs('right')}
              className="flex-shrink-0 p-3 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tab indicator dots */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: Math.ceil(tabs.length / 4) }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${Math.floor(tabs.findIndex(t => t.id === activeTab) / 4) === index
                  ? 'bg-blue-700'
                  : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
}