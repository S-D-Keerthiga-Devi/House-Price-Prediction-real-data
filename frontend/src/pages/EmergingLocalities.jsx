import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, MapPin, Calendar, Building, Filter } from 'lucide-react';
import { houseDetails } from '../api/house.js';

function EmergingLocalities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Gurgaon');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rate_desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState('');

  const cities = ['Gurgaon', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Noida'];
  const propertyCategories = ['all', 'Apartment', 'Other'];

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await houseDetails(selectedCity);
      if (response.success) {
        setData(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch data');
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
      const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase());
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
        const monthOrder = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                           'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12};
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                Emerging Localities
              </h1>
              <p className="text-gray-600 text-lg">
                Property rates and price trends across major cities
              </p>
            </div>
            
            {/* City Selector */}
            <div className="flex flex-wrap gap-2">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCity === city 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search localities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {propertyCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rate_desc">Price: High to Low</option>
              <option value="rate_asc">Price: Low to High</option>
              <option value="trend_desc">Highest Growth</option>
              <option value="trend_asc">Lowest Growth</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {processedData.length} localities in {selectedCity}
          </p>
        </div>

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

        {/* Data Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {processedData.map((locality, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                        {locality.location}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedCity}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {locality.trend > 0 ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : locality.trend < 0 ? (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                      )}
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {formatPrice(locality.currentRate)}/sq ft
                    </div>
                    {locality.trend !== 0 && (
                      <div className={`text-sm ${locality.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {locality.trend > 0 ? '+' : ''}{formatPrice(locality.trend)} ({locality.trendPercentage}%)
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Avg: {formatPrice(locality.avgRate)}/sq ft
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Last Updated
                      </span>
                      <span className="font-medium">{locality.lastUpdated}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        Listings
                      </span>
                      <span className="font-medium">{locality.totalListings}</span>
                    </div>

                    <div className="text-sm">
                      <span className="text-gray-600">Categories: </span>
                      <span className="font-medium">
                        {locality.categories.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Quarter Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {locality.quarter} Data
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && processedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No localities found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or select a different city.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergingLocalities;