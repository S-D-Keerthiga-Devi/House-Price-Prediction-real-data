import { useEffect, useState, useMemo } from "react";
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

import { TrendingUp } from "lucide-react";
import CitySearch from "./CitySearch";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";

export default function PropertyTrends() {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCity, setSelectedCity] = useState("");
  const [timePeriod, setTimePeriod] = useState("Monthly");

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
        setSelectedType("All");
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-2xl mb-6 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Property Price Trends</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track property prices across cities, categories, and time periods
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 mb-12 hover:shadow-xl transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800">Search City</label>
                <p className="text-sm text-gray-500">Find property trends in your area</p>
              </div>
            </div>

            <CitySearch
              cities={cities}
              onCitySelect={setSelectedCity}
              className="w-full [&>div]:bg-white [&>div]:border-2 [&>div]:border-gray-200 [&>div]:rounded-xl [&>div]:shadow-sm hover:[&>div]:border-blue-800 focus-within:[&>div]:border-blue-700 focus-within:[&>div]:ring-4 focus-within:[&>div]:ring-orange-500/10 [&>div]:transition-all [&>div]:duration-200 [&_input]:text-gray-800 [&_input]:placeholder-gray-400 [&_input]:py-3 [&_input]:px-4 [&_input]:text-base"
            />

            {selectedCity && (
              <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-green-700 font-medium">Selected: {selectedCity}</span>
                </div>
                <button
                  onClick={() => setSelectedCity("")}
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
          {selectedCity && chartData.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCity} Price Trends</h2>

                {/* Time period + property type */}
                <div className="flex gap-4 items-center">
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-800 focus:outline-none shadow-sm"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>

                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-700 focus:outline-none shadow-sm"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((ptype, i) => (
                      <option key={i} value={ptype}>{ptype}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-8">
                <ResponsiveContainer width="100%" height={450}>
                  {timePeriod === "Yearly" ? (
                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" opacity={0.8} />

                      <XAxis dataKey="period">
                        <Label value="Year" offset={0} position="insideBottom" fontSize={14} fill= "#1e3a8a" />
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
}
