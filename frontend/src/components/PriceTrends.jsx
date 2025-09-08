import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ---------- Utility: Remove Outliers with IQR ----------
const removeOutliersIQR = (data, key) => {
  if (!data.length) return data;
  const values = data.map((d) => d[key]).filter(val => !isNaN(val)).sort((a, b) => a - b);
  if (values.length === 0) return data;

  const q1 = values[Math.floor(values.length * 0.25)];
  const q3 = values[Math.floor(values.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return data.filter((d) => d[key] >= lower && d[key] <= upper);
};

// ---------- Utility: Format Last 12 Months ----------
const formatLast12Months = () => {
  const months = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    months.unshift(`${monthName} ${year}`);
  }
  return months;
};

// ---------- Group months into quarters ----------
const groupToQuarters = (months, data) => {
  const quarters = [];
  const currentDate = new Date();

  for (let i = 0; i < 4; i++) {
    const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3 + 2), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - (i * 3), 1);

    const startLabel = startMonth.toLocaleString("default", { month: "short" }) + " " + startMonth.getFullYear().toString().slice(-2);
    const endLabel = endMonth.toLocaleString("default", { month: "short" }) + " " + endMonth.getFullYear().toString().slice(-2);

    const quarterLabel = `${startLabel} - ${endLabel}`;
    const quarterData = data.filter((_, idx) => {
      const monthIndex = (11 - i * 3 - 2) + (idx % 3);
      return monthIndex >= (11 - i * 3 - 2) && monthIndex <= (11 - i * 3);
    });

    const avgRate = quarterData.length > 0
      ? quarterData.reduce((sum, d) => sum + (d.rate_sqft || 0), 0) / quarterData.length
      : 0;

    quarters.unshift({
      period: quarterLabel,
      rate_sqft: Math.round(avgRate)
    });
  }
  return quarters;
};

// ---------- Group to years ----------
const groupToYears = (data) => {
  const yearData = {};
  data.forEach(d => {
    if (d.period) {
      const year = d.period.split(' ')[1];
      if (!yearData[year]) {
        yearData[year] = { total: 0, count: 0 };
      }
      yearData[year].total += d.rate_sqft || 0;
      yearData[year].count += 1;
    }
  });

  return Object.keys(yearData).map(year => ({
    period: `20${year}`,
    rate_sqft: Math.round(yearData[year].total / yearData[year].count)
  })).sort((a, b) => a.period.localeCompare(b.period));
};

export default function PropertyAnalytics() {
  const [rawData, setRawData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [city, setCity] = useState("Gurgaon");
  const [searchLocation, setSearchLocation] = useState("");
  const [timePeriod, setTimePeriod] = useState("Monthly");

  const months = formatLast12Months();

  // Load CSV Data
  const loadCSV = (path, setter) => {
    Papa.parse(path, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cleaned = result.data.filter((row) =>
          row["Rate/sqft"] && !isNaN(row["Rate/sqft"]) && row["Rate/sqft"] > 0
        );
        setter(removeOutliersIQR(cleaned, "Rate/sqft"));
      },
      error: (error) => {
        console.log("CSV parsing error:", error);
        const sampleData = [];
        for (let i = 0; i < 12; i++) {
          sampleData.push({
            "Rate/sqft": 8000 + Math.random() * 2000,
            "City": "Gurgaon",
            "Category": i % 2 === 0 ? "Residential" : "Commercial"
          });
        }
        setter(sampleData);
      }
    });
  };

  useEffect(() => {
    // Load main property data
    loadCSV("/data/raw_property.csv", setRawData);

    // Load property categories dynamically
    Papa.parse("/data/property_master.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const uniqueCategories = Array.from(
          new Set(result.data.map(row => row.property_category).filter(Boolean))
        );
        setCategories(uniqueCategories.map(cat => ({ property_category: cat })));
      },
      error: (err) => console.log("Error loading property_master.csv:", err)
    });
  }, []);

  // Filter Data based on selections
  const getFilteredData = () => {
    let filtered = rawData;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(d =>
        d.Category === selectedCategory || d.property_category === selectedCategory
      );
    }

    if (searchLocation.trim()) {
      filtered = filtered.filter(d =>
        (d.Location || d.location || "").toLowerCase().includes(searchLocation.toLowerCase()) ||
        (d.Area || d.area || "").toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    return filtered.slice(0, 12).map((row, idx) => ({
      period: months[idx] || `Month ${idx + 1}`,
      rate_sqft: Math.round(row["Rate/sqft"] || 0),
      city: row.City || city,
      location: row.Location || row.location || "N/A"
    }));
  };

  const displayedData = getFilteredData();

  const getChartData = () => {
    switch (timePeriod) {
      case "Quarterly":
        return groupToQuarters(months, displayedData);
      case "Yearly":
        return groupToYears(displayedData);
      default:
        return displayedData;
    }
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100 p-6 mt-16 mb-20">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-orange-600 bg-clip-text text-transparent">
            Property Analytics Dashboard
          </h1>
          <p className="text-slate-600 text-lg">Track real estate trends and market insights</p>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200/50">
            <CardTitle className="text-slate-700 text-lg flex items-center gap-2">
              <span>⚙️</span>
              Filters & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-6">

              {/* City Selector */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <Select onValueChange={setCity} defaultValue="Gurgaon">
                  <SelectTrigger className="w-full border-slate-300 hover:border-orange-400 focus:border-orange-500 focus:ring-orange-500/20 transition-colors">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Gurgaon", "Delhi", "Noida", "Mumbai", "Bangalore"].map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Period */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-slate-700 mb-2">Time Period</label>
                <Select onValueChange={setTimePeriod} defaultValue="Monthly">
                  <SelectTrigger className="w-full border-slate-300 hover:border-orange-400 focus:border-orange-500 focus:ring-orange-500/20 transition-colors">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monthly", "Quarterly", "Yearly"].map(period => (
                      <SelectItem key={period} value={period}>{period}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Category</label>
                <Select onValueChange={setSelectedCategory} defaultValue="All">
                  <SelectTrigger className="w-full border-slate-300 hover:border-orange-400 focus:border-orange-500 focus:ring-orange-500/20 transition-colors">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((c, idx) => (
                      <SelectItem key={idx} value={c.property_category}>{c.property_category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardContent>
        </Card>


        {/* Price Trends Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <span>📈</span>
            Price Trends
          </h2>

          {/* Chart */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-200/50">
              <CardTitle className="flex items-center gap-3 text-slate-700">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
                {timePeriod} Price Trend - Rate per sqft
                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {city} • {selectedCategory}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    label={{ value: 'Rate per sqft (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Rate/sqft']}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate_sqft"
                    stroke="url(#gradient)"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ea580c', strokeWidth: 2, fill: '#fff' }}
                    name="Rate/sqft"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md border-0 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-700">
                    ₹{chartData.length > 0 ? Math.max(...chartData.map(d => d.rate_sqft)).toLocaleString() : '0'}
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">Highest Rate/sqft</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-700">
                    ₹{chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.rate_sqft, 0) / chartData.length).toLocaleString() : '0'}
                  </div>
                  <p className="text-sm text-orange-600 font-medium">Average Rate/sqft</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    ₹{chartData.length > 0 ? Math.min(...chartData.map(d => d.rate_sqft)).toLocaleString() : '0'}
                  </div>
                  <p className="text-sm text-blue-600 font-medium">Lowest Rate/sqft</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📉</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}