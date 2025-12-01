// priceTrends.jsx
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
import Location from "../../components/Location";
import SubLocalitySearch from "../../components/SubLocalitySearch";
import CityInfoCard from "../../components/CityInfoCard";
import Heatmaps from "./Heatmaps"; // Import the Heatmaps component
import PriceIncomeIndex from "./PriceIncomeIndex";
import { TrendingUp, ChevronLeft, ChevronRight, MapPin, FileText, Building, Target, ShoppingCart, Building2, Calculator, BookOpen, Home, Flame, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { FormControl, Select, MenuItem, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { houseDetails } from "../../api/house.js";
import EmergingLocalities from "./EmergingLocalities";

export default function PriceIncomeIndexPage() {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedType, setSelectedType] = useState("Apartment");
  const [timePeriod, setTimePeriod] = useState("Monthly");
  const [searchType, setSearchType] = useState("");
  const [activeTab, setActiveTab] = useState("price-income-index");
  const [tabScrollPosition, setTabScrollPosition] = useState(0);
  const [selectedSubLocality, setSelectedSubLocality] = useState("");
  const tabContainerRef = useRef(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cityFromURL = params.get("city");

  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (cityFromURL) {
      setSelectedCity(cityFromURL);
    }
  }, [cityFromURL]);

  const tabs = [
    { id: "price-trends", label: "Price Trends", icon: TrendingUp },
    { id: "heatmaps", label: "Heatmaps", icon: Flame },
    { id: "price-income-index", label: "Price to Income Index", icon: BarChart3 },
    { id: "emerging-localities", label: "Emerging Localities", icon: Users },
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

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const currentTabIcon = currentTab?.icon || TrendingUp;
  const currentTabLabel = currentTab?.label || "Property Dashboard";

  const scrollTabs = (direction) => {
    const container = tabContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
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

    setTimeout(() => {
      setTabScrollPosition(container.scrollLeft);
    }, 300);
  };

  useEffect(() => {
    setSelectedSubLocality("");
  }, [selectedCity]);

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
          d.sub_locality = d.location?.trim();
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

        if (cityFromURL && uniqueCities.includes(cityFromURL.trim())) {
          setSelectedCity(cityFromURL.trim());
        } else if (!cityFromURL && uniqueCities.length > 0) {
          setSelectedCity(uniqueCities[0]);
        }
      })
      .catch((err) => console.error("CSV load failed:", err));
  }, []);

  const last12Months = useMemo(() => {
    const months = [];
    let current = dayjs().subtract(1, "month");
    for (let i = 0; i < 12; i++) {
      months.unshift(current.format("MMM-YY"));
      current = current.subtract(1, "month");
    }
    return months;
  }, []);

  const getQuarterMonths = (quarterStr) => {
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

  const groupToQuarters = (data) => {
    if (!data || !data.length) return [];

    const quarterMap = {
      1: "Jan-Mar",
      2: "Apr-Jun",
      3: "Jul-Sep",
      4: "Oct-Dec",
    };

    const quartersObj = {};

    data.forEach(d => {
      if (!d.month || !d.year || !d.rate_sqft) return;

      const monthNum = dayjs(`${d.month}-${d.year}`, "MMM-YYYY").month() + 1;
      const quarter = Math.floor((monthNum - 1) / 3) + 1;
      const key = `${d.year}-Q${quarter}`;

      if (!quartersObj[key]) quartersObj[key] = [];
      quartersObj[key].push(d.rate_sqft);
    });

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

  // Interpolate missing values to fill gaps
  const interpolateData = (data) => {
    if (!data || data.length === 0) return data;

    // Find first and last non-null values
    let firstNonNull = -1;
    let lastNonNull = -1;

    for (let i = 0; i < data.length; i++) {
      if (data[i] !== null) {
        if (firstNonNull === -1) firstNonNull = i;
        lastNonNull = i;
      }
    }

    // If no data or only one point, return as is
    if (firstNonNull === -1 || firstNonNull === lastNonNull) return data;

    // Forward fill from first non-null
    for (let i = 0; i < firstNonNull; i++) {
      data[i] = data[firstNonNull];
    }

    // Backward fill from last non-null
    for (let i = lastNonNull + 1; i < data.length; i++) {
      data[i] = data[lastNonNull];
    }

    // Interpolate between non-null values
    let prevNonNull = firstNonNull;
    for (let i = firstNonNull + 1; i < lastNonNull; i++) {
      if (data[i] === null) {
        // Find next non-null
        let nextNonNull = i + 1;
        while (nextNonNull <= lastNonNull && data[nextNonNull] === null) {
          nextNonNull++;
        }

        if (nextNonNull <= lastNonNull) {
          // Linear interpolation
          const prevValue = data[prevNonNull];
          const nextValue = data[nextNonNull];
          const steps = nextNonNull - prevNonNull;

          for (let j = prevNonNull + 1; j < nextNonNull; j++) {
            const ratio = (j - prevNonNull) / steps;
            data[j] = Math.round(prevValue + ratio * (nextValue - prevValue));
          }

          i = nextNonNull - 1; // Skip the filled values
          prevNonNull = nextNonNull;
        }
      } else {
        prevNonNull = i;
      }
    }

    return data;
  };

  // Get valid localities with at least 2 data points
  const validLocalities = useMemo(() => {
    if (!selectedCity) return [];

    const cityData = timeSeriesData.filter(d => {
      const matchCity = d.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedType === "All" || d.property_category === selectedType;
      return matchCity && matchCategory;
    });

    const localityCounts = {};

    cityData.forEach(d => {
      if (!d.sub_locality) return;

      let key;
      if (timePeriod === "Monthly") {
        key = dayjs(`${d.month}-${d.year}`, "MMM-YYYY").format("MMM-YY");
      } else if (timePeriod === "Quarterly") {
        const monthNum = dayjs(`${d.month}-${d.year}`, "MMM-YYYY").month() + 1;
        const quarter = Math.floor((monthNum - 1) / 3) + 1;
        const quarterMap = { 1: "Jan-Mar", 2: "Apr-Jun", 3: "Jul-Sep", 4: "Oct-Dec" };
        key = `${quarterMap[quarter]} ${d.year}`;
      } else {
        key = d.year.toString();
      }

      if (!localityCounts[d.sub_locality]) {
        localityCounts[d.sub_locality] = new Set();
      }
      localityCounts[d.sub_locality].add(key);
    });

    return Object.keys(localityCounts)
      .filter(locality => localityCounts[locality].size >= 2)
      .sort();
  }, [selectedCity, selectedType, timePeriod, timeSeriesData]);

  // Reset selected sub-locality if it's no longer valid
  useEffect(() => {
    if (selectedSubLocality && !validLocalities.includes(selectedSubLocality)) {
      setSelectedSubLocality("");
    }
  }, [validLocalities, selectedSubLocality]);

  const chartData = useMemo(() => {
    if (!selectedCity) return [];

    const cityData = timeSeriesData.filter(d => {
      const matchCity = d.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedType === "All" || d.property_category === selectedType;
      return matchCity && matchCategory;
    });

    const localityData = selectedSubLocality ? timeSeriesData.filter(d => {
      const matchCity = d.city.toLowerCase() === selectedCity.toLowerCase();
      const matchCategory = selectedType === "All" || d.property_category === selectedType;
      const matchSubLocality = d.sub_locality && d.sub_locality.toLowerCase() === selectedSubLocality.toLowerCase();
      return matchCity && matchCategory && matchSubLocality;
    }) : [];

    if (!cityData.length) return [];

    const processData = (data) => {
      const dataMap = new Map();

      data.forEach(d => {
        let key;
        if (timePeriod === "Monthly") {
          key = dayjs(`${d.month}-${d.year}`, "MMM-YYYY").format("MMM-YY");
        } else if (timePeriod === "Quarterly") {
          const monthNum = dayjs(`${d.month}-${d.year}`, "MMM-YYYY").month() + 1;
          const quarter = Math.floor((monthNum - 1) / 3) + 1;
          const quarterMap = { 1: "Jan-Mar", 2: "Apr-Jun", 3: "Jul-Sep", 4: "Oct-Dec" };
          key = `${quarterMap[quarter]} ${d.year}`;
        } else {
          key = d.year.toString();
        }

        if (!dataMap.has(key)) dataMap.set(key, []);
        dataMap.get(key).push(d.rate_sqft);
      });

      const result = new Map();
      dataMap.forEach((rates, key) => {
        const avgRate = Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
        result.set(key, avgRate);
      });

      return result;
    };

    const cityProcessed = processData(cityData);
    const localityProcessed = selectedSubLocality ? processData(localityData) : new Map();

    if (timePeriod === "Monthly") {
      const result = last12Months.map(monthStr => {
        const [m, y] = monthStr.split("-");
        const fullDate = dayjs(`${m}-20${y}`, "MMM-YYYY");

        return {
          period: fullDate.format("MMM YYYY"),
          city_rate: cityProcessed.get(monthStr) || null,
          locality_rate: selectedSubLocality ? (localityProcessed.get(monthStr) || null) : null,
          sortKey: monthStr
        };
      });

      // Interpolate missing values
      const cityRates = result.map(d => d.city_rate);
      const interpolatedCityRates = [...interpolateData([...cityRates])];
      const localityRates = result.map(d => d.locality_rate);
      const interpolatedLocalityRates = selectedSubLocality ? [...interpolateData([...localityRates])] : null;

      return result.map((d, i) => ({
        ...d,
        city_rate: interpolatedCityRates[i],
        locality_rate: interpolatedLocalityRates ? interpolatedLocalityRates[i] : null
      }));
    }

    if (timePeriod === "Quarterly") {
      const allPeriods = new Set([
        ...Array.from(cityProcessed.keys()),
        ...Array.from(localityProcessed.keys())
      ]);

      const periods = Array.from(allPeriods).sort();
      const result = periods.map(period => ({
        period,
        city_rate: cityProcessed.get(period) || null,
        locality_rate: selectedSubLocality ? (localityProcessed.get(period) || null) : null
      }));

      // Interpolate missing values
      const cityRates = result.map(d => d.city_rate);
      const interpolatedCityRates = [...interpolateData([...cityRates])];
      const localityRates = result.map(d => d.locality_rate);
      const interpolatedLocalityRates = selectedSubLocality ? [...interpolateData([...localityRates])] : null;

      return result.map((d, i) => ({
        ...d,
        city_rate: interpolatedCityRates[i],
        locality_rate: interpolatedLocalityRates ? interpolatedLocalityRates[i] : null
      }));
    }

    if (timePeriod === "Yearly") {
      const allPeriods = new Set([
        ...Array.from(cityProcessed.keys()),
        ...Array.from(localityProcessed.keys())
      ]);

      const periods = Array.from(allPeriods).sort();
      const result = periods.map(period => ({
        period,
        city_rate: cityProcessed.get(period) || null,
        locality_rate: selectedSubLocality ? (localityProcessed.get(period) || null) : null
      }));

      // Interpolate missing values
      const cityRates = result.map(d => d.city_rate);
      const interpolatedCityRates = [...interpolateData([...cityRates])];
      const localityRates = result.map(d => d.locality_rate);
      const interpolatedLocalityRates = selectedSubLocality ? [...interpolateData([...localityRates])] : null;

      return result.map((d, i) => ({
        ...d,
        city_rate: interpolatedCityRates[i],
        locality_rate: interpolatedLocalityRates ? interpolatedLocalityRates[i] : null
      }));
    }

    return [];
  }, [selectedCity, selectedType, timePeriod, timeSeriesData, last12Months, selectedSubLocality]);

  const cityRates = chartData.map(d => d.city_rate).filter(r => r !== null);
  const localityRates = chartData.map(d => d.locality_rate).filter(r => r !== null);
  const allRates = [...cityRates, ...localityRates];

  const highest = allRates.length ? Math.max(...allRates) : 0;
  const lowest = allRates.length ? Math.min(...allRates) : 0;
  const cityAverage = cityRates.length
    ? Math.round(cityRates.reduce((s, d) => s + d, 0) / cityRates.length)
    : 0;
  const localityAverage = localityRates.length
    ? Math.round(localityRates.reduce((s, d) => s + d, 0) / localityRates.length)
    : 0;

  const hasAnyCityData = cityRates.length > 0;
  const hasLocalityData = localityRates.length > 0;

  const yTicks = useMemo(() => {
    if (!allRates.length) return [];
    const min = Math.floor(lowest / 100) * 100; // round down to 100s
    const max = Math.ceil(highest / 100) * 100; // round up to 100s

    // choose 100 (0.1K) step by default; widen if too many ticks
    const tentativeStep = 100;
    const maxTickCount = 25;
    const range = Math.max(0, max - min);
    const step = range / tentativeStep > maxTickCount
      ? (range / 200 > maxTickCount ? 500 : 200) // escalate step to 200 or 500
      : tentativeStep;

    const ticks = [];
    for (let v = min; v <= max; v += step) {
      ticks.push(v);
    }
    return ticks;
  }, [lowest, highest, allRates.length]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "price-trends":
        return (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
              {selectedCity && hasAnyCityData ? (
                <>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Price Trends
                          {selectedSubLocality && (
                            <span className="text-lg font-medium text-blue-600 ml-2">
                              - {selectedSubLocality}
                            </span>
                          )}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Track property prices across cities, categories, and time periods
                        </p>

                        <div className="flex items-center gap-6 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-3 bg-blue-800 bg-opacity-20 border border-blue-800"></div>
                            <span className="text-sm text-gray-600">{selectedCity} {timePeriod}</span>
                          </div>
                          {selectedSubLocality && (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-3 bg-green-600 bg-opacity-20 border border-green-600"></div>
                              <span className="text-sm text-gray-600">{selectedSubLocality} {timePeriod}</span>
                            </div>
                          )}
                        </div>

                        {!selectedSubLocality && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-blue-400 rounded-full flex-shrink-0"></div>
                              <p className="text-sm text-blue-800">
                                Select a sub-locality to view its detailed price trends alongside {selectedCity}.
                                <span className="block mt-1">Only sub-localities with sufficient data are shown.</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4 items-center">
                        <SubLocalitySearch
                          city={selectedCity}
                          onSelect={(loc) => setSelectedSubLocality(loc)}
                          validLocalities={validLocalities}
                        />

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
                              borderColor: "#e5e7eb",
                              borderWidth: 2,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8",
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
                              borderColor: "#e5e7eb",
                              borderWidth: 2,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#1d4ed8",
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
                  </div>

                  <div className="p-8">
                    <ResponsiveContainer width="100%" height={450}>
                      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: timePeriod === "Quarterly" ? 80 : 60 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          opacity={0.6}
                          horizontal={true}
                          vertical={true}
                          strokeWidth={1}
                        />

                        <XAxis
                          dataKey="period"
                          interval={0}
                          tick={({ x, y, payload }) => {
                            const words = payload.value.split(" ");
                            if (timePeriod === "Monthly") {
                              return (
                                <text
                                  x={x}
                                  y={y + 15}
                                  textAnchor="end"
                                  fontSize={12}
                                  transform={`rotate(-30, ${x}, ${y + 15})`}
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
                            offset={timePeriod === "Monthly" ? -35 : -30}
                            position="insideBottom"
                            fontSize={14}
                            fill="#64748b"
                          />
                        </XAxis>

                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(v) => {
                            const step = yTicks.length > 1 ? (yTicks[1] - yTicks[0]) : 100;
                            const decimals = step < 1000 ? 1 : 0;
                            const k = v / 1000;
                            return `₹${k.toFixed(decimals)}K`;
                          }}
                          ticks={yTicks}
                          domain={[Math.max(0, Math.floor(lowest / 100) * 100), Math.ceil(highest / 100) * 100]}
                          scale="linear"
                        >
                          <Label
                            value="Price per sqft"
                            angle={-90}
                            position="insideLeft"
                            offset={0}
                            style={{ textAnchor: "middle", fill: "#64748b", fontSize: 14 }}
                          />
                        </YAxis>

                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'city_rate') {
                              return [`₹${value?.toLocaleString()}`, `${selectedCity} ${timePeriod}`];
                            } else if (name === 'locality_rate') {
                              return [`₹${value?.toLocaleString()}`, `${selectedSubLocality} ${timePeriod}`];
                            }
                            return [`₹${value?.toLocaleString()}`, name];
                          }}
                          labelFormatter={(label) => `Period: ${label}`}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />

                        {/* City-wide area */}
                        <Area
                          type="monotone"
                          dataKey="city_rate"
                          stroke="#1e3a8a"
                          fill="rgba(30,58,138,0.2)"
                          strokeWidth={2}
                          connectNulls={true}
                          name="city_rate"
                          dot={{ r: 4 }}
                        />

                        {/* Sub-locality area */}
                        {selectedSubLocality && hasLocalityData && (
                          <Area
                            type="monotone"
                            dataKey="locality_rate"
                            stroke="#059669"
                            fill="rgba(5,150,105,0.2)"
                            strokeWidth={2}
                            connectNulls={true}
                            name="locality_rate"
                            dot={{ r: 4 }}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">
                      <TrendingUp className="w-16 h-16 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-500 text-lg">
                      {selectedCity
                        ? `No data available for ${selectedCity}`
                        : "Select a city to view price trends"
                      }
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedCity
                        ? "Try selecting a different property type or check back later"
                        : "Choose from the dropdown above"
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedCity && hasAnyCityData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600">₹{highest.toLocaleString()}</div>
                    <p className="text-sm text-blue-700 font-medium">Highest Price/sqft</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">₹{cityAverage.toLocaleString()}</div>
                    <p className="text-sm text-green-700 font-medium">{selectedCity} Average</p>
                    {selectedSubLocality && localityAverage > 0 && (
                      <>
                        <div className="text-2xl font-bold text-emerald-600 mt-2">₹{localityAverage.toLocaleString()}</div>
                        <p className="text-sm text-emerald-700 font-medium">{selectedSubLocality} Average</p>
                      </>
                    )}
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
        );

      case "heatmaps":
        return (
          <div className="max-w-7xl mx-auto">
            <Heatmaps />
          </div>
        );

      case "price-income-index":
        return (
          <div className="max-w-7xl mx-auto">
            <PriceIncomeIndex city={selectedCity} />
          </div>
        );

      case "emerging-localities":
        return (
          <div className="max-w-7xl mx-auto">
            <EmergingLocalities />
          </div>
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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 md:py-16 px-3 md:px-4 mt-16 md:mt-10">
      <div className="max-w-7xl mx-auto">
        {/* City Info Card - now shown for all tabs when a city is selected */}
        {selectedCity && (
          <div className="mb-8">
            <CityInfoCard city={selectedCity} averagePrice={cityAverage} />
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="relative mb-6 md:mb-8">
          <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <button
              onClick={() => scrollTabs('left')}
              className="flex-shrink-0 p-3 hover:bg-gray-50 transition-colors duration-200 border-r border-gray-100"
              disabled={tabScrollPosition === 0}
            >
              <ChevronLeft className={`w-5 h-5 ${tabScrollPosition === 0 ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>

            <div
              ref={tabContainerRef}
              className="flex overflow-x-auto scrollbar-hide flex-1 min-w-0"
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

            <button
              onClick={() => scrollTabs('right')}
              className="flex-shrink-0 p-3 hover:bg-gray-50 transition-colors duration-200 border-l border-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

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
        <div className="mt-6 md:mt-8">
          {renderTabContent()}
        </div>
      </div>
    </section>
  );
}