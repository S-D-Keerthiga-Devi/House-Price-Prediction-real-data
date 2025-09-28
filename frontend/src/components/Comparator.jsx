import React, { useState, useEffect } from "react";
import { MapPin, TrendingUp, TrendingDown, Building, Star, BarChart3, Zap, TreePine, Award, X, Download, Plus, ArrowLeft } from "lucide-react";
import { getAllPropertiesForComparison } from '../api/house';
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const Comparator = ({ initialProperties = [] }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Handle compare button click
  const handleCompare = () => {
    setShowComparisonTable(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add property to comparison
  const handleAddToCompare = (property) => {
    if (selectedProperties.some(p => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter(p => p.id !== property.id));
    } else if (selectedProperties.length < 4) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  // Remove property from comparison
  const handleRemoveFromCompare = (propertyId) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId));
  };

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        // If initialProperties are provided, use them, otherwise fetch from API
        if (initialProperties.length > 0) {
          setProperties(initialProperties);
        } else {
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          );

          // Fetch all properties from API
          const response = await Promise.race([
            getAllPropertiesForComparison(),
            timeoutPromise
          ]);
          console.log('API Response:', response);

          if (response && response.success && response.properties && response.properties.length > 0) {
            // Transform the data to match our component structure
            const transformedProperties = response.properties.map((property, index) => ({
              id: property._id,
              name: property.developer_name && property.developer_name !== 'Unknown'
                ? `${property.developer_name} - ${property.location}`
                : `${property.location} Property`,
              image: `https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop&auto=format&q=80&seed=${index}`,
              price: `₹${(property.price_value || 0).toLocaleString()}`,
              location: property.location || 'Location Not Available',
              city: property.city || 'City Not Available',
              builderReputation: property.builder_grade || 0,
              locationScore: property.lifestyle_quality_index || 0,
              lifestyleIndex: property.lifestyle_quality_index || 0,
              valuation: property.investment_potential || 0,
              neighbourhoodClass: property.neighbourhood_avg_income > 100000 ? 'Premium' :
                property.neighbourhood_avg_income > 50000 ? 'Upper Middle' : 'Middle',
              schoolsNearby: Math.floor(Math.random() * 10) + 1, // Mock data
              hospitalsNearby: Math.floor(Math.random() * 8) + 1, // Mock data
              collegesNearby: Math.floor(Math.random() * 15) + 1, // Mock data
              metroDistance: Math.floor(Math.random() * 5) + 0.5, // Mock data
              aqi: Math.floor(Math.random() * 100) + 20, // Mock data
              greenCover: Math.floor(Math.random() * 50) + 20, // Mock data
              noiseLevel: Math.floor(Math.random() * 40) + 40, // Mock data
              trafficScore: Math.floor(Math.random() * 3) + 6, // Mock data
              fiveYearGrowth: property.future_growth_prediction || 0,
              investmentPotential: property.investment_potential || 0,
              internationalRanking: Math.floor(Math.random() * 300) + 1, // Mock data
              marketTrend: property.future_growth_prediction > 80 ? 'Rising' :
                property.future_growth_prediction > 60 ? 'Stable' : 'Declining',
              // Additional fields from database
              area: property.area,
              bedrooms: property.bedrooms,
              bathroom: property.bathroom,
              balconies: property.balconies,
              developer_name: property.developer_name,
              furnishing_status: property.furnishing_status,
              construction_status: property.construction_status,
              price_value: property.price_value,
              rate_sqft: property.rate_sqft,
              property_age_years: property.property_age_years,
              parking_count: property.parking_count,
              days_on_market: property.days_on_market,
              amenities_count: property.amenities_count,
              facing_score: property.facing_score,
              rental_yield: property.rental_yield,
              neighbourhood_avg_income: property.neighbourhood_avg_income,
              affordability_index: property.affordability_index
            }));
            setProperties(transformedProperties);
            setIsInitialLoad(false);
          } else {
            setError("No properties available from API");
          }
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to connect to API: " + err.message);
        setIsInitialLoad(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [initialProperties]);

  // Helper functions
  const getBestValueIndex = (metric, propertiesData) => {
    let bestIndex = 0;
    let bestValue = propertiesData[0][metric.key];

    for (let i = 1; i < propertiesData.length; i++) {
      const currentValue = propertiesData[i][metric.key];
      if (metric.higher ? currentValue > bestValue : currentValue < bestValue) {
        bestValue = currentValue;
        bestIndex = i;
      }
    }

    return bestIndex;
  };

  const getProgressBarColor = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressBarWidth = (value, maxValue) => {
    return `${Math.min((value / maxValue) * 100, 100)}%`;
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return 'N/A';

    switch (type) {
      case 'currency':
        return `₹${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'score':
        return `${value}/10`;
      case 'distance':
        return `${value} km`;
      case 'count':
        return value;
      default:
        return value;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'Rising':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const calculateOverallScore = (property) => {
    const scores = [
      property.builderReputation || 0,
      property.locationScore || 0,
      property.investmentPotential || 0,
      (property.fiveYearGrowth || 0) / 10
    ];

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(averageScore * 10) / 10;
  };

  // Define metrics for comparison
  const metrics = [
    { key: 'builderReputation', label: 'Builder Reputation', higher: true, icon: Building },
    { key: 'locationScore', label: 'Location Score', higher: true, icon: MapPin },
    { key: 'investmentPotential', label: 'Investment Potential', higher: true, icon: BarChart3 },
    { key: 'fiveYearGrowth', label: '5-Year Growth', higher: true, icon: TrendingUp },
    { key: 'lifestyleIndex', label: 'Lifestyle Index', higher: true, icon: Zap },
    { key: 'valuation', label: 'Valuation Score', higher: true, icon: Star }
  ];

  // Process properties to ensure unique locations
  const processProperties = (props) => {
    const uniqueLocations = new Set();
    return props.map(property => {
      // Ensure property has a valid location
      if (!property.location) {
        property.location = 'Unknown Location';
      }

      // Round all score values to single decimal point
      metrics.forEach(metric => {
        if (property[metric.key]) {
          property[metric.key] = Math.round(property[metric.key] * 10) / 10;
        }
      });

      return property;
    }).filter(property => {
      // Filter out duplicate locations
      if (uniqueLocations.has(property.location)) {
        return false;
      }
      uniqueLocations.add(property.location);
      return true;
    });
  };

  // Apply processing to properties
  const processedProperties = processProperties(properties);
  const processedSelectedProperties = processProperties(selectedProperties);

  const propertiesData = showComparisonTable ? processedSelectedProperties : processedProperties;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy-blue text-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Property Comparator</h1>
              <p className="text-gray-200 mt-1">Compare properties and make informed decisions</p>
            </div>
            {selectedProperties.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-200">
                  {selectedProperties.length} properties selected
                </span>
                <button
                  onClick={() => setSelectedProperties([])}
                  className="text-sm text-red-300 hover:text-red-100 font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && isInitialLoad && (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Properties</h2>
            <p className="text-gray-600 mb-6">Fetching the latest property data from our database...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Properties</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && properties.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
          {/* Comparison Table View (Full Screen) */}
          {showComparisonTable ? (
            <div className="min-h-screen bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Property Comparison</h2>
                  <p className="text-gray-600">Detailed comparison of selected properties</p>
                </div>
                <button
                  onClick={() => setShowComparisonTable(false)}
                  className="bg-navy-blue hover:bg-navy-blue/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Properties
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r">Property</th>
                      {selectedProperties.map((property) => (
                        <th key={property.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900 border-r min-w-[200px]">
                          <div className="space-y-2">
                            <img
                              src={property.image}
                              alt={property.name}
                              className="w-full h-24 object-cover rounded-lg mx-auto"
                            />
                            <div>
                              <h3 className="font-semibold text-sm">{property.name}</h3>
                              <p className="text-green-600 font-bold text-sm">{property.price}</p>
                              <p className="text-xs text-gray-600">{property.location}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCompare(property.id)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {metrics.map((metric, index) => (
                      <tr key={metric.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r">
                          <div className="flex items-center gap-2">
                            <metric.icon className="w-4 h-4 text-gray-600" />
                            {metric.label}
                          </div>
                        </td>
                        {selectedProperties.map((property) => {
                          const value = property[metric.key];
                          const isBest = getBestValueIndex(metric, selectedProperties) === selectedProperties.indexOf(property);

                          return (
                            <td key={`${property.id}-${metric.key}`} className="px-6 py-4 text-center text-sm border-r">
                              <div className={`${isBest ? 'bg-navy-blue/10 text-navy-blue font-semibold px-2 py-1 rounded' : ''}`}>
                                {value ? value.toFixed(1) : 'N/A'}
                                {isBest && <Award className="w-4 h-4 inline-block ml-1 text-navy-blue" />}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-navy-blue/5 border-t flex justify-between items-center">
                <div className="text-sm text-navy-blue flex items-center gap-1">
                  <Award className="w-4 h-4 text-navy-blue" /> {/* same icon as table */}
                  <span>Indicates the best value for each metric</span>
                </div>
                <div className="flex gap-3">
                  <button className="bg-navy-blue hover:bg-navy-blue/80 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                    <Download className="w-4 h-4" /> Download Report
                  </button>
                  <button
                    onClick={() => setShowComparisonTable(false)}
                    className="bg-white border border-navy-blue text-navy-blue hover:bg-navy-blue/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add More Properties
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {propertiesData.map((property, propertyIndex) => {
                  const overallScore = calculateOverallScore(property);
                  const winCount = metrics.filter(
                    (metric) => getBestValueIndex(metric, propertiesData) === propertyIndex
                  ).length;

                  return (
                    <div key={property.id} className="bg-white border border-navy-blue/20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                      {/* Property Header */}
                      <div className="relative overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f3f4f6'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='0.3em' fill='%236b7280' font-size='48'%3E🏠%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 rounded-full text-sm font-medium bg-navy-blue text-white backdrop-blur-sm flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {overallScore.toFixed(1)}
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                            {property.construction_status || 'Ready'}
                          </div>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="p-5">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{property.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">{property.location}, {property.city}</span>
                          </div>
                          <div className="text-2xl font-bold text-green-600 mb-2">{property.price}</div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {property.bedrooms || 'N/A'} Beds
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {property.bathroom || 'N/A'} Bath
                            </span>
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {property.area || 'N/A'} sq ft
                            </span>
                          </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {/* Builder Reputation */}
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Building className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-medium text-blue-700">Builder</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-semibold">{property.builderReputation || 'N/A'}</span>
                            </div>
                          </div>

                          {/* Investment Potential */}
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-3 h-3 text-green-600" />
                              <span className="text-xs font-medium text-green-700">Investment</span>
                            </div>
                            <span className="text-xs font-semibold">{property.investmentPotential || 'N/A'}/10</span>
                          </div>

                          {/* Location Score */}
                          <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-purple-600" />
                              <span className="text-xs font-medium text-purple-700">Location</span>
                            </div>
                            <span className="text-xs font-semibold">{property.locationScore || 'N/A'}/10</span>
                          </div>

                          {/* 5-Year Growth */}
                          <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-orange-600" />
                              <span className="text-xs font-medium text-orange-700">Growth</span>
                            </div>
                            <span className="text-xs font-semibold text-orange-900">+{property.fiveYearGrowth || 'N/A'}%</span>
                          </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600 font-medium">Overall Score</span>
                            <span className="text-sm font-bold text-gray-900">
                              {Math.round((winCount / metrics.length) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-700"
                              style={{
                                width: `${(winCount / metrics.length) * 100}%`,
                              }}
                            ></div>
                          </div>

                          {/* Add to Compare Button */}
                          <button
                            onClick={() => handleAddToCompare(property)}
                            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${selectedProperties.some(p => p.id === property.id)
                                ? 'bg-navy-blue hover:bg-navy-blue/90 text-white shadow-lg'
                                : 'bg-white border border-navy-blue text-navy-blue hover:bg-navy-blue/10 shadow-md hover:shadow-lg'
                              }`}
                            disabled={selectedProperties.some(p => p.id === property.id)}
                          >
                            {selectedProperties.some(p => p.id === property.id)
                              ? <><Star className="w-4 h-4 fill-current" /> Added to Compare</>
                              : <><Plus className="w-4 h-4" /> Add to Compare</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compare Button */}
              <div className="text-center mb-8">
                <button
                  onClick={handleCompare}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${selectedProperties.length >= 2
                      ? 'bg-navy-blue hover:bg-navy-blue/90 text-white hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={selectedProperties.length < 2}
                >
                  {selectedProperties.length >= 2
                    ? <><BarChart3 className="w-5 h-5" /> Compare {selectedProperties.length} Properties</>
                    : `Select ${2 - selectedProperties.length} more to compare`
                  }
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Comparator;