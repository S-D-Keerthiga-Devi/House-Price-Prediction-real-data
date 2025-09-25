import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, MapPin, Calendar, Building, Filter, ChevronDown, BarChart3, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { houseRates } from '../../api/house.js';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useCity } from "../../context/CityContext";

// Price Trend Chart Component
const PriceTrendChart = ({ data, location }) => {
  const chartData = data
    .filter(item => item.location === location)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      const monthOrder = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
      };
      return (monthOrder[a.month] || 0) - (monthOrder[b.month] || 0);
    })
    .map(item => ({
      period: `${item.month} ${item.year}`,
      rate: item.rate_sqft,
      category: item.property_category
    }));

  return (
    <div className="h-32 mt-4">
      <div className="flex items-center mb-2">
        <BarChart3 className="w-4 h-4 text-gray-600 mr-2" />
        <span className="text-sm font-medium text-gray-600">Price Trend</span>
      </div>

      {chartData.length <= 1 ? (
        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">Not enough data</p>
            <p className="text-xs text-gray-400">Need multiple data points for trend</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#6B7280' }}
            />
            <YAxis hide />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-blue-600">
                        ₹{payload[0].value.toLocaleString()}/sq ft
                      </p>
                      <p className="text-xs text-gray-500">{payload[0].payload.category}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorRate)"
              dot={{ r: 3, fill: '#3B82F6' }}
              activeDot={{ r: 4, fill: '#1D4ED8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

function EmergingLocalities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ selectedCity, setSelectedCity ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rate_desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());

  // Get city from URL parameters (similar to Price Trends)
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cityFromURL = params.get("city");

  const propertyCategories = ['all', 'Apartment', 'Plot', 'Penthouse', 'Studio', 'Villa', 'Others'];

  // Set city from URL when component mounts or URL changes
  useEffect(() => {
    if (cityFromURL) {
      setSelectedCity(cityFromURL);
    }
  }, [cityFromURL]);

  // Fetch data when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      fetchData();
    } else {
      setData([]);
    }
  }, [selectedCity]);

  const fetchData = async () => {
    if (!selectedCity.trim()) {
      setData([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await houseRates(selectedCity);
      if (Array.isArray(response)) {
        setData(response);
      } else if (response && response.success === false) {
        setError(response.message || 'Failed to fetch data');
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      setError('Error fetching property data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processData = () => {
    let processed = data.filter(item => {
      const matchesSearch = searchTerm === '' || item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.property_category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Group by location to calculate trends
    const locationGroups = processed.reduce((acc, item) => {
      if (!acc[item.location]) {
        acc[item.location] = [];
      }
      acc[item.location].push(item);
      return acc;
    }, {});

    // Process each location group
    const locationStats = Object.keys(locationGroups).map(location => {
      const items = locationGroups[location].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        const monthOrder = {
          'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
          'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        return (monthOrder[b.month] || 0) - (monthOrder[a.month] || 0);
      });

      const latest = items[0];
      const previous = items.find(item =>
        item.property_category === latest.property_category &&
        (item.year < latest.year || (item.year === latest.year && item.month !== latest.month))
      );

      let trend = 0;
      let trendPercentage = 0;
      if (previous) {
        trend = latest.rate_sqft - previous.rate_sqft;
        trendPercentage = ((trend / previous.rate_sqft) * 100).toFixed(1);
      }

      const avgRate = items.reduce((sum, item) => sum + item.rate_sqft, 0) / items.length;
      const categoryCount = items.reduce((acc, item) => {
        acc[item.property_category] = (acc[item.property_category] || 0) + 1;
        return acc;
      }, {});

      return {
        location: latest.location,
        currentRate: latest.rate_sqft,
        avgRate: Math.round(avgRate),
        trend,
        trendPercentage,
        lastUpdated: `${latest.month} ${latest.year}`,
        quarter: latest.quarter,
        categories: Object.keys(categoryCount),
        totalListings: items.length,
        categoryBreakdown: categoryCount
      };
    });

    // Sort based on selected criteria
    return locationStats.sort((a, b) => {
      switch (sortBy) {
        case 'rate_desc': return b.currentRate - a.currentRate;
        case 'rate_asc': return a.currentRate - b.currentRate;
        case 'trend_desc': return b.trend - a.trend;
        case 'trend_asc': return a.trend - b.trend;
        case 'name_asc': return a.location.localeCompare(b.location);
        default: return 0;
      }
    });
  };

  const formatPrice = (price) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(1)}K`;
    return `₹${price}`;
  };

  const processedData = processData();

  const toggleCardExpansion = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Emerging Localities
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Property rates and price trends across major cities
            </p>
            {selectedCity && (
              <p className="text-blue-600 text-xl font-semibold mt-4">
                Showing data for: {selectedCity}
              </p>
            )}
          </div>

          {/* City Selection Message */}
          {!selectedCity && (
            <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Select a City to Explore
                </h3>
                <p className="text-blue-700 mb-4">
                  Use the location search in the header above to choose a city and explore its emerging localities
                </p>
                <p className="text-sm text-blue-600">
                  The page will automatically load data for the selected city
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Show filters only if we have data */}
        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Search Localities */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search localities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full">
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{ minWidth: 180, '& .MuiSelect-select': { paddingY: 1.5, fontSize: '0.95rem' } }}
                >
                  <InputLabel id="category-label">Property Type</InputLabel>
                  <Select
                    labelId="category-label"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Property Type"
                  >
                    {propertyCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'All Property Types' : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Sort Filter */}
              <div className="w-full">
                <FormControl
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{ minWidth: 180, '& .MuiSelect-select': { paddingY: 1.5, fontSize: '0.95rem' } }}
                >
                  <InputLabel id="sort-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-label"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="rate_desc">Price: High to Low</MenuItem>
                    <MenuItem value="rate_asc">Price: Low to High</MenuItem>
                    <MenuItem value="trend_desc">Highest Growth</MenuItem>
                    <MenuItem value="trend_asc">Lowest Growth</MenuItem>
                    <MenuItem value="name_asc">Name: A to Z</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {data.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {processedData.length} localities in {selectedCity}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Initial State - No city selected */}
        {!selectedCity && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No City Selected</h3>
            <p className="text-gray-600">
              Please select a city using the location search in the header to view emerging localities
            </p>
          </div>
        )}

        {/* No data for selected city */}
        {selectedCity && !loading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Building className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              No property data found for {selectedCity}. Try selecting a different city.
            </p>
          </div>
        )}

        {/* Data Grid */}
        {!loading && !error && data.length > 0 && (
          <div className="space-y-4">
            {processedData.map((locality, index) => (
              <div key={index} className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 group rounded-lg overflow-hidden">
                <div className="flex flex-col">
                  {/* Main content */}
                  <div className="flex items-start p-4 gap-4">
                    {/* Left section - Location icon and details */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {locality.location}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{selectedCity}</p>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          locality.categories.includes('Apartment') ? 'bg-blue-100 text-blue-800' :
                          locality.categories.includes('Plot') ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {locality.categories[0] || 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Right section - Stats */}
                    <div className="flex items-center gap-8">
                      {/* Rate */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600">Latest Rate</span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(locality.currentRate)}/sq.ft
                        </div>
                      </div>
                      
                      {/* Growth */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {locality.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : locality.trend < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <div className="w-4 h-4"></div>
                          )}
                          <span className={`text-sm font-semibold ${
                            locality.trend > 0 ? 'text-green-600' : 
                            locality.trend < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {locality.trendPercentage}% in 5Y
                          </span>
                        </div>
                        <div className="h-8 w-24">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.filter(item => item.location === locality.location).slice(0, 5)}>
                              <defs>
                                <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="rate_sqft"
                                stroke="#10b981"
                                strokeWidth={1.5}
                                fill="url(#miniGradient)"
                                dot={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      {/* Rental Yield */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-600">Rental Yield</span>
                          <Info className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {locality.rentalYield || '1%'}
                        </div>
                      </div>
                      
                      {/* Expand/Collapse button */}
                      <div>
                        <button 
                          onClick={() => toggleCardExpansion(index)}
                          className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600"
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform ${expandedCards.has(index) ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable content */}
                  {expandedCards.has(index) && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                      <PriceTrendChart data={data} location={locality.location} />
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                          <div className="font-medium">{locality.lastUpdated}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Listings</div>
                          <div className="font-medium">{locality.totalListings}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Categories</div>
                          <div className="font-medium text-xs">{locality.categories.join(', ')}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - No results */}
        {!loading && !error && data.length > 0 && processedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No localities found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergingLocalities;