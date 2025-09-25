import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, MapPin, TrendingUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { houseRates } from "../../api/house.js";
import { useCity } from "../../context/CityContext";

// -------------------------
// Utility: Convert records into quarterly growth with better labels
// -------------------------
const computeQuarterlyGrowth = (records) => {
  if (!records || records.length === 0) return [];

  // Group records into quarters
  const grouped = {};
  records.forEach((rec) => {
    // Use the quarter and year directly from the database if available
    // Otherwise calculate it from month and year
    let q;
    let quarterLabel;
    
    if (rec.month && rec.year) {
      const monthNum = typeof rec.month === 'string' 
        ? getMonthNumber(rec.month) 
        : rec.month;
      const quarterNum = Math.ceil(monthNum / 3);
      
      // Create quarter label with month range
      const startMonth = getMonthName((quarterNum - 1) * 3 + 1);
      const endMonth = getMonthName(quarterNum * 3);
      quarterLabel = `${startMonth}-${endMonth} ${rec.year}`;
      q = `Q${quarterNum}-${rec.year}`; // For grouping purposes
    } else if (rec.quarter && rec.year) {
      const quarterNum = parseInt(rec.quarter.replace('Q', ''));
      const startMonth = getMonthName((quarterNum - 1) * 3 + 1);
      const endMonth = getMonthName(quarterNum * 3);
      quarterLabel = `${startMonth}-${endMonth} ${rec.year}`;
      q = `${rec.quarter}-${rec.year}`;
    } else {
      // Skip records with missing data
      return;
    }
    
    if (!grouped[q]) {
      grouped[q] = {
        values: [],
        label: quarterLabel
      };
    }
    
    // Use rate_sqft as the price metric
    if (rec.rate_sqft) {
      grouped[q].values.push(rec.rate_sqft);
    }
  });

  // Filter out quarters with no data
  const quartersWithData = Object.keys(grouped).filter(q => grouped[q].values.length > 0);

  // Average price per quarter
  const quarters = quartersWithData
    .sort((a, b) => {
      const [qa, ya] = a.split("-");
      const [qb, yb] = b.split("-");
      if (ya !== yb) return parseInt(ya) - parseInt(yb);
      return qa.localeCompare(qb);
    })
    .map((q) => {
      const avgPrice =
        grouped[q].values.reduce((sum, val) => sum + val, 0) / grouped[q].values.length;
      return { 
        quarter: grouped[q].label, // Use the formatted label
        quarterKey: q, // Keep the original key for sorting
        avgPrice 
      };
    });

  // Calculate growth
  const withGrowth = quarters.map((d, i) => {
    if (i === 0) return { ...d, growth: 0 };
    const prev = quarters[i - 1].avgPrice;
    const growth = ((d.avgPrice - prev) / prev) * 100;
    return { ...d, growth: parseFloat(growth.toFixed(2)) };
  });

  console.log("Quarters with data:", quartersWithData);
  console.log("Processed quarterly data:", withGrowth);
  
  return withGrowth;
};

// Helper function to convert month names to numbers
const getMonthNumber = (monthName) => {
  const months = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };
  return months[monthName] || 1; // Default to 1 if not found
};

// Helper function to convert month numbers to names
const getMonthName = (monthNum) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthNum - 1] || 'Jan'; // Default to Jan if not found
};

// -------------------------
// Main Component
// -------------------------
export default function PriceIncomeIndex() {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  
  // Get city from URL or localStorage, with fallback to default
  const [selectedCity, setSelectedCity] = useState(() => {
    const cityFromURL = params.get("city");
    if (cityFromURL) {
      // Save to localStorage when coming from URL
      localStorage.setItem("selectedCity", cityFromURL);
      return cityFromURL;
    }
    // Try to get from localStorage, fallback to default
    return localStorage.getItem("selectedCity") || "Gurgaon";
  });

  // Fetch data when city changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await houseRates(selectedCity);
        console.log("API Response:", response); // Debug log
        
        // Check if response is an array (successful data) or an object (error)
        if (Array.isArray(response)) {
          // Process the data
          const processed = computeQuarterlyGrowth(response);
          console.log("Processed data:", processed); // Debug log
          setTimeSeriesData(processed);
        } else if (response && response.data && Array.isArray(response.data)) {
          // If response is wrapped in a data property
          const processed = computeQuarterlyGrowth(response.data);
          console.log("Processed data from response.data:", processed); // Debug log
          setTimeSeriesData(processed);
        } else {
          console.error("Invalid data format:", response);
          setTimeSeriesData([]);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setTimeSeriesData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedCity]);

  // Stats
  const stats = useMemo(() => {
    if (!timeSeriesData.length) return { avg: 0, max: 0, min: 0, trend: 0 };

    const growthValues = timeSeriesData.map((d) => d.growth);
    const avg =
      growthValues.reduce((sum, val) => sum + val, 0) / growthValues.length;
    const max = Math.max(...growthValues);
    const min = Math.min(...growthValues);
    const recent =
      growthValues.slice(-2).reduce((s, v) => s + v, 0) /
      Math.min(2, growthValues.length);
    const earlier =
      growthValues.slice(0, 2).reduce((s, v) => s + v, 0) /
      Math.min(2, growthValues.length);
    const trend = recent - earlier;
    return { avg, max, min, trend };
  }, [timeSeriesData]);

  // Bar colors
  const getBarColor = (growth) => {
    if (growth > 5) return "#1e3a8a";
    if (growth > 3) return "#1e40af";
    if (growth > 1) return "#3b82f6";
    return "#60a5fa";
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-blue-900 text-white p-4 rounded-lg shadow-xl">
          <p className="font-semibold">{label}</p>
          <p>
            Growth: <span className="font-bold">{data.value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6 pt-20">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MapPin className="h-8 w-8 text-blue-700" />
            <h1 className="text-4xl font-bold text-navy-900">{selectedCity}</h1>
          </div>
          <h2 className="text-2xl font-semibold text-navy-700">
            House Price Index - Quarterly Growth
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.avg.toFixed(1)}%</div>
              <div className="text-sm">Average Growth</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {stats.max.toFixed(1)}%
              </div>
              <div className="text-sm">Highest Quarter</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.min.toFixed(1)}%
              </div>
              <div className="text-sm">Lowest Quarter</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div
                className={`text-2xl font-bold ${
                  stats.trend > 0 ? "text-green-700" : "text-red-600"
                }`}
              >
                {stats.trend > 0 ? "+" : ""}
                {stats.trend.toFixed(1)}%
              </div>
              <div className="text-sm">Recent Trend</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <TrendingUp className="h-6 w-6" />
              Quarterly Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <p>Loading {selectedCity} data...</p>
              </div>
            ) : timeSeriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="growth" radius={[6, 6, 0, 0]} barSize={40}>
                    {timeSeriesData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={getBarColor(entry.growth)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p>No data available for {selectedCity}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}