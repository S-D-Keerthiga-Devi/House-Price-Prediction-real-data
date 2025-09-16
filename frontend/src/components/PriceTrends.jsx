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
  Label,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Home,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart as PieChartIcon,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import CitySearch from "./CitySearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { FormControl, Select, MenuItem } from "@mui/material";

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

    const quartersObj = {};

    data.forEach(d => {
      if (!d.month || !d.year || !d.rate_sqft) return;

      const key = `${d.year}-${d.quarter}`;

      if (!quartersObj[key]) quartersObj[key] = [];
      const rate = Number(d.rate_sqft);
      if (!isNaN(rate)) quartersObj[key].push(rate);
    });

    const quartersArray = Object.keys(quartersObj)
      .sort((a, b) => dayjs(a, "YYYY-[Q]Q").diff(dayjs(b, "YYYY-[Q]Q")))
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

  // Advanced Analytics
  const analytics = useMemo(() => {
    if (!chartData.length || chartData.length < 2) return null;

    const prices = chartData.map(d => d.rate_sqft);
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);
    const average = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);

    // Price change calculations
    const latestPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2];
    const priceChange = latestPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(1);

    // Year over year change (if applicable)
    const yearOverYear = prices.length >= 12 ?
      ((latestPrice - prices[prices.length - 12]) / prices[prices.length - 12] * 100).toFixed(1) : null;

    // Volatility (standard deviation)
    const mean = average;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);
    const volatilityPercent = ((volatility / mean) * 100).toFixed(1);

    // Growth trend
    const firstPrice = prices[0];
    const totalGrowth = ((latestPrice - firstPrice) / firstPrice * 100).toFixed(1);

    // Market sentiment
    let sentiment = "Stable";
    let sentimentColor = "text-blue-600";
    let sentimentIcon = Activity;

    if (Math.abs(parseFloat(priceChangePercent)) > 5) {
      sentiment = parseFloat(priceChangePercent) > 0 ? "Bullish" : "Bearish";
      sentimentColor = parseFloat(priceChangePercent) > 0 ? "text-green-600" : "text-red-600";
      sentimentIcon = parseFloat(priceChangePercent) > 0 ? TrendingUp : TrendingDown;
    }

    return {
      highest,
      lowest,
      average,
      latestPrice,
      priceChange,
      priceChangePercent,
      yearOverYear,
      volatility: volatilityPercent,
      totalGrowth,
      sentiment,
      sentimentColor,
      sentimentIcon
    };
  }, [chartData]);

  // Category breakdown for selected city
  const categoryData = useMemo(() => {
    if (!selectedCity || !timeSeriesData.length) return [];

    const cityData = timeSeriesData.filter(d => d.city.toLowerCase() === selectedCity.toLowerCase());
    const categoryAvgs = {};

    cityData.forEach(d => {
      const category = d.property_category || "Unknown";
      if (!categoryAvgs[category]) categoryAvgs[category] = [];
      categoryAvgs[category].push(d.rate_sqft);
    });

    return Object.entries(categoryAvgs).map(([category, prices]) => ({
      category,
      avgPrice: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
      count: prices.length
    })).sort((a, b) => b.avgPrice - a.avgPrice);
  }, [selectedCity, timeSeriesData]);

  // Market comparison with other cities
  const marketComparison = useMemo(() => {
    if (!timeSeriesData.length) return [];

    const cityAvgs = {};
    timeSeriesData.forEach(d => {
      if (!cityAvgs[d.city]) cityAvgs[d.city] = [];
      cityAvgs[d.city].push(d.rate_sqft);
    });

    return Object.entries(cityAvgs)
      .map(([city, prices]) => ({
        city,
        avgPrice: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
        isSelected: city.toLowerCase() === selectedCity.toLowerCase()
      }))
      .sort((a, b) => b.avgPrice - a.avgPrice)
      .slice(0, 10);
  }, [timeSeriesData, selectedCity]);

  const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f1f5f9'];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, category }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // push text outside
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        fontSize={12}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${category.length > 10 ? category.slice(0, 10) + "…" : category} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };



  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-2xl mb-6 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Property Market Analytics</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive property market insights with advanced analytics and trend forecasting
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 mb-12 hover:shadow-xl transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800">Market Analysis</label>
                <p className="text-sm text-gray-500">Select a city to unlock detailed market insights</p>
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
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-green-700 font-medium">Analyzing: {selectedCity}</span>
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

        {selectedCity && analytics && (
          <>
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-blue-600" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">₹{analytics.latestPrice.toLocaleString()}</div>
                      <p className="text-sm text-blue-700">Current Avg Price/sqft</p>
                    </div>
                  </div>
                  <div className={`flex items-center ${parseFloat(analytics.priceChangePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(analytics.priceChangePercent) >= 0 ?
                      <ArrowUpRight className="w-4 h-4 mr-1" /> :
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    }
                    <span className="text-sm font-medium">{analytics.priceChangePercent}% vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-8 h-8 text-green-600" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{analytics.totalGrowth}%</div>
                      <p className="text-sm text-green-700">Total Growth</p>
                    </div>
                  </div>
                  {analytics.yearOverYear && (
                    <p className="text-sm text-green-600">YoY: {analytics.yearOverYear}%</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{analytics.volatility}%</div>
                      <p className="text-sm text-purple-700">Market Volatility</p>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600">Price stability index</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <analytics.sentimentIcon className={`w-8 h-8 ${analytics.sentimentColor}`} />
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${analytics.sentimentColor}`}>{analytics.sentiment}</div>
                      <p className="text-sm text-orange-700">Market Sentiment</p>
                    </div>
                  </div>
                  <p className="text-sm text-orange-600">Based on recent trends</p>
                </CardContent>
              </Card>
            </div>

            {/* Price Range Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">₹{analytics.highest.toLocaleString()}</div>
                  <p className="text-sm text-red-700 font-medium mb-1">Peak Price</p>
                  <p className="text-xs text-red-600">Highest recorded</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">₹{analytics.average.toLocaleString()}</div>
                  <p className="text-sm text-blue-700 font-medium mb-1">Average Price</p>
                  <p className="text-xs text-blue-600">Market average</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹{analytics.lowest.toLocaleString()}</div>
                  <p className="text-sm text-green-700 font-medium mb-1">Floor Price</p>
                  <p className="text-xs text-green-600">Lowest recorded</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Price Trend Chart */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200 shadow-xl">
              {selectedCity && chartData.length > 0 ? (
                <>
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-2xl text-gray-900">{selectedCity} Price Trends</CardTitle>
                      <div className="flex gap-4 items-center">
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
                              borderColor: "#2563eb", // blue-800 on hover
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2563eb",
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
                            <MenuItem value="All">All Categories</MenuItem>
                            {categories.map((ptype, i) => (
                              <MenuItem key={i} value={ptype}>
                                {ptype}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                      {timePeriod === "Yearly" ? (
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="period">
                            <Label value="Year" offset={0} position="insideBottom" fontSize={14} fill="#64748b" />
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
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
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
                              offset={-35}
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
                          <Tooltip
                            formatter={(value) => [`₹${value.toLocaleString()}`, "Price per sqft"]}
                            labelFormatter={(label) => `Period: ${label}`}
                          />
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
                  </CardContent>
                </>
              ) : (
                <CardContent className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">Select a city to view analytics</p>
                    <p className="text-gray-400 text-sm">Choose from the search above to unlock insights</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Property Category Breakdown */}
          <div>
            <Card className="border-2 border-gray-200 shadow-xl h-full">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="flex items-center">
                  <PieChartIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedCity && categoryData.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="avgPrice"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label={renderLabel}
                          labelLine
                        >


                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>

                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Avg Price"]} />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2">
                      {categoryData.slice(0, 4).map((item, index) => (
                        <div key={item.category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{item.category}</span>
                          </div>
                          <span className="text-sm text-gray-600">₹{item.avgPrice.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Price Movement Analysis */}
        {selectedCity && chartData.length > 3 && (
          <Card className="border-2 border-gray-200 shadow-xl mb-8">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center">
                <Activity className="w-6 h-6 mr-2 text-blue-600" />
                Price Movement Analysis - {selectedCity}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Growth Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Period-over-Period Growth</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData.slice(1).map((item, index) => {
                      const prevPrice = chartData[index].rate_sqft;
                      const currentPrice = item.rate_sqft;
                      const growth = ((currentPrice - prevPrice) / prevPrice * 100);
                      return {
                        period: item.period,
                        growth: parseFloat(growth.toFixed(2)),
                        isPositive: growth >= 0
                      };
                    })}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="period" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={11}
                        fill="#64748b"
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip formatter={(value) => [`${value}%`, "Growth Rate"]} />
                      <Bar 
                        dataKey="growth" 
                        radius={[2, 2, 0, 0]}
                      >
                        {chartData.slice(1).map((item, index) => {
                          const prevPrice = chartData[index].rate_sqft;
                          const currentPrice = item.rate_sqft;
                          const growth = ((currentPrice - prevPrice) / prevPrice * 100);
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={growth >= 0 ? "#10b981" : "#ef4444"} 
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Price Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Distribution</h3>
                  <div className="space-y-4">
                    {/* Price Ranges */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600">
                          {chartData.filter(d => d.rate_sqft < analytics.average * 0.8).length}
                        </div>
                        <div className="text-xs text-red-700">Below Market</div>
                        <div className="text-xs text-red-600">{'<'} ₹{Math.round(analytics.average * 0.8).toLocaleString()}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">
                          {chartData.filter(d => d.rate_sqft >= analytics.average * 0.8 && d.rate_sqft <= analytics.average * 1.2).length}
                        </div>
                        <div className="text-xs text-blue-700">Market Range</div>
                        <div className="text-xs text-blue-600">₹{Math.round(analytics.average * 0.8).toLocaleString()} - ₹{Math.round(analytics.average * 1.2).toLocaleString()}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">
                          {chartData.filter(d => d.rate_sqft > analytics.average * 1.2).length}
                        </div>
                        <div className="text-xs text-green-700">Premium</div>
                        <div className="text-xs text-green-600">{'>'} ₹{Math.round(analytics.average * 1.2).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Moving Averages */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Moving Averages</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">3-Period MA</span>
                          <span className="font-medium">
                            ₹{chartData.length >= 3 ? 
                              Math.round(chartData.slice(-3).reduce((s, d) => s + d.rate_sqft, 0) / 3).toLocaleString() 
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">6-Period MA</span>
                          <span className="font-medium">
                            ₹{chartData.length >= 6 ? 
                              Math.round(chartData.slice(-6).reduce((s, d) => s + d.rate_sqft, 0) / 6).toLocaleString() 
                              : 'N/A'
                            }
                          </span>
                        </div>
                        {chartData.length >= 12 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">12-Period MA</span>
                            <span className="font-medium">
                              ₹{Math.round(chartData.slice(-12).reduce((s, d) => s + d.rate_sqft, 0) / 12).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Investment Insights */}
        {selectedCity && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Investment Score Card */}
            <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <Target className="w-6 h-6 mr-2" />
                  Investment Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Calculate investment score based on growth, volatility, and sentiment */}
                  {(() => {
                    let score = 50; // base score
                    const growth = parseFloat(analytics.totalGrowth);
                    const volatility = parseFloat(analytics.volatility);

                    // Growth contribution (max ±30 points)
                    if (growth > 20) score += 30;
                    else if (growth > 10) score += 20;
                    else if (growth > 0) score += 10;
                    else if (growth > -10) score -= 10;
                    else score -= 30;

                    // Volatility penalty (max -20 points for high volatility)
                    if (volatility > 30) score -= 20;
                    else if (volatility > 20) score -= 10;
                    else if (volatility < 10) score += 10;

                    // Sentiment bonus/penalty
                    if (analytics.sentiment === "Bullish") score += 10;
                    else if (analytics.sentiment === "Bearish") score -= 10;

                    score = Math.max(0, Math.min(100, score)); // clamp between 0-100

                    let scoreColor = "text-red-600";
                    let scoreBg = "bg-red-100";
                    let scoreText = "High Risk";

                    if (score >= 70) {
                      scoreColor = "text-green-600";
                      scoreBg = "bg-green-100";
                      scoreText = "Good Investment";
                    } else if (score >= 50) {
                      scoreColor = "text-yellow-600";
                      scoreBg = "bg-yellow-100";
                      scoreText = "Moderate Risk";
                    }

                    return (
                      <>
                        <div className="text-center">
                          <div className={`text-6xl font-bold ${scoreColor} mb-2`}>{score}</div>
                          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${scoreColor} ${scoreBg}`}>
                            {scoreText}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Growth Potential</span>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${growth > 10 ? 'bg-green-500' : growth > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              <span className="text-sm font-medium">{growth > 10 ? 'High' : growth > 0 ? 'Moderate' : 'Low'}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Market Stability</span>
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${volatility < 15 ? 'bg-green-500' : volatility < 25 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                              <span className="text-sm font-medium">{volatility < 15 ? 'Stable' : volatility < 25 ? 'Moderate' : 'Volatile'}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Market Sentiment</span>
                            <div className="flex items-center">
                              <analytics.sentimentIcon className={`w-4 h-4 mr-2 ${analytics.sentimentColor}`} />
                              <span className={`text-sm font-medium ${analytics.sentimentColor}`}>{analytics.sentiment}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights Card */}
            <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Activity className="w-6 h-6 mr-2" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Price Trend Analysis</p>
                      <p className="text-xs text-gray-600">
                        {parseFloat(analytics.totalGrowth) > 0
                          ? `Prices have grown ${analytics.totalGrowth}% over the analyzed period, indicating positive market momentum.`
                          : `Prices have declined ${Math.abs(parseFloat(analytics.totalGrowth))}% over the analyzed period, suggesting market correction.`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Volatility Assessment</p>
                      <p className="text-xs text-gray-600">
                        Market volatility is {parseFloat(analytics.volatility) > 25 ? 'high' : parseFloat(analytics.volatility) > 15 ? 'moderate' : 'low'} at {analytics.volatility}%,
                        {parseFloat(analytics.volatility) > 25
                          ? ' indicating significant price fluctuations and higher investment risk.'
                          : parseFloat(analytics.volatility) > 15
                            ? ' showing normal market fluctuations with moderate risk.'
                            : ' suggesting a stable market with predictable price movements.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Investment Timing</p>
                      <p className="text-xs text-gray-600">
                        {analytics.sentiment === "Bullish"
                          ? "Current market sentiment is positive with recent price increases. Consider if this aligns with your investment strategy."
                          : analytics.sentiment === "Bearish"
                            ? "Market is experiencing downward pressure. This could present buying opportunities for long-term investors."
                            : "Market is relatively stable with minimal recent changes. Good for conservative investment approaches."
                        }
                      </p>
                    </div>
                  </div>

                  {analytics.yearOverYear && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Annual Performance</p>
                        <p className="text-xs text-gray-600">
                          Year-over-year growth of {analytics.yearOverYear}%
                          {parseFloat(analytics.yearOverYear) > 5
                            ? ' shows strong annual appreciation exceeding typical inflation rates.'
                            : parseFloat(analytics.yearOverYear) > 0
                              ? ' indicates modest growth, keeping pace with market expectations.'
                              : ' reflects market challenges with negative annual returns.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Market Alerts */}
        {selectedCity && analytics && (
          <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700">
                <AlertCircle className="w-6 h-6 mr-2" />
                Market Alerts & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Price Alert */}
                <div className={`p-4 rounded-lg border-l-4 ${Math.abs(parseFloat(analytics.priceChangePercent)) > 10
                  ? 'border-red-500 bg-red-50'
                  : Math.abs(parseFloat(analytics.priceChangePercent)) > 5
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                  }`}>
                  <h4 className="font-semibold text-sm mb-2">Price Movement Alert</h4>
                  <p className="text-xs text-gray-700">
                    {Math.abs(parseFloat(analytics.priceChangePercent)) > 10
                      ? `⚠️ Significant price change of ${analytics.priceChangePercent}% detected. Monitor closely.`
                      : Math.abs(parseFloat(analytics.priceChangePercent)) > 5
                        ? `📈 Notable price movement of ${analytics.priceChangePercent}%. Normal market activity.`
                        : `✅ Stable price movement of ${analytics.priceChangePercent}%. Market is steady.`
                    }
                  </p>
                </div>

                {/* Volatility Alert */}
                <div className={`p-4 rounded-lg border-l-4 ${parseFloat(analytics.volatility) > 30
                  ? 'border-red-500 bg-red-50'
                  : parseFloat(analytics.volatility) > 20
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                  }`}>
                  <h4 className="font-semibold text-sm mb-2">Risk Assessment</h4>
                  <p className="text-xs text-gray-700">
                    {parseFloat(analytics.volatility) > 30
                      ? `🔴 High volatility at ${analytics.volatility}%. Consider risk tolerance.`
                      : parseFloat(analytics.volatility) > 20
                        ? `🟡 Moderate volatility at ${analytics.volatility}%. Standard market risk.`
                        : `🟢 Low volatility at ${analytics.volatility}%. Stable investment environment.`
                    }
                  </p>
                </div>

                {/* Investment Recommendation */}
                <div className={`p-4 rounded-lg border-l-4 ${analytics.sentiment === "Bullish"
                  ? 'border-green-500 bg-green-50'
                  : analytics.sentiment === "Bearish"
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                  }`}>
                  <h4 className="font-semibold text-sm mb-2">Investment Signal</h4>
                  <p className="text-xs text-gray-700">
                    {analytics.sentiment === "Bullish"
                      ? `📈 Market showing positive momentum. Good for growth-focused investors.`
                      : analytics.sentiment === "Bearish"
                        ? `📉 Market correction phase. Consider long-term value opportunities.`
                        : `📊 Balanced market conditions. Suitable for diversified strategies.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}