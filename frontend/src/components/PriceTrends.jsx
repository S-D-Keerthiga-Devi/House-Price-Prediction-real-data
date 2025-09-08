import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Home, BarChart3 } from "lucide-react";

export default function PropertyTrends() {
  const [dataByType, setDataByType] = useState({});
  const [granularity, setGranularity] = useState("monthly");
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Papa.parse(`/data/${granularity}_trend.csv`, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const grouped = result.data.reduce((acc, row) => {
          if (!row.property_category || !row.posted_on || !row.price_value) return acc;

          if (!acc[row.property_category]) acc[row.property_category] = [];
          acc[row.property_category].push({
            posted_on: new Date(row.posted_on).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            }),
            price_value: row.price_value,
          });
          return acc;
        }, {});

        // Sort by date
        for (let key in grouped) {
          grouped[key].sort((a, b) => new Date(a.posted_on) - new Date(b.posted_on));
        }

        setDataByType(grouped);

        // Default select first property type
        if (!selectedType && Object.keys(grouped).length > 0) {
          setSelectedType(Object.keys(grouped)[0]);
        }
        setLoading(false);
      },
    });
  }, [granularity]);

  const formatPrice = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}\u00A0Cr`; // Crores
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}\u00A0L`; // Lakhs
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(0)}\u00A0K`; // Thousands
    }
    return `₹${value}`;
  };
  

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100">
          <p className="font-semibold text-gray-800 mb-1">{label}</p>
          <p className="text-2xl font-bold text-orange-500">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl mb-6 shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
            Property Price Trends
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover market insights and track property price movements across different categories and time periods
          </p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Property Type Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                <Home className="w-4 h-4" />
                Property Type
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 pr-12 text-gray-800 font-medium focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                >
                  {Object.keys(dataByType).map((ptype) => (
                    <option key={ptype} value={ptype} className="py-2">
                      {ptype}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                Time Period
              </label>
              <div className="relative">
                <select
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 pr-12 text-gray-800 font-medium focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                >
                  <option value="weekly">Weekly Analysis</option>
                  <option value="monthly">Monthly Overview</option>
                  <option value="yearly">Yearly Summary</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="text-gray-600 font-medium">Loading data...</span>
              </div>
            </div>
          ) : selectedType && dataByType[selectedType] ? (
            <>
              {/* Chart Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {selectedType} Price Analysis
                    </h2>
                    <p className="text-gray-600 capitalize font-medium">
                      {granularity} trend overview
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {dataByType[selectedType]?.length || 0} Data Points
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="p-8">
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart 
                    data={dataByType[selectedType]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeWidth={1} />
                    <XAxis 
                      dataKey="posted_on" 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="500"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      fontWeight="500"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatPrice}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price_value"
                      stroke="#f97316"
                      strokeWidth={4}
                      dot={{ r: 6, fill: "#f97316", strokeWidth: 3, stroke: "#fff" }}
                      activeDot={{ r: 8, fill: "#ea580c", strokeWidth: 3, stroke: "#fff" }}
                      fill="url(#colorGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
              <p className="text-gray-500">Please select a different property type or time period</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}