import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, TrendingUp, TrendingDown, Building, Star, BarChart3, Zap, X, Award, Plus, ArrowLeft, Shield, Car, Dumbbell, Coffee, Leaf } from "lucide-react";
import { getAllPropertiesForComparison } from '../api/house';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useLocation } from "react-router-dom";

const Comparator = ({ initialProperties = [] }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // State for amenities
  const [showAmenities, setShowAmenities] = useState(false);
  const [selectedPropertyForAmenities, setSelectedPropertyForAmenities] = useState(null);
  const [expandedAmenitiesCards, setExpandedAmenitiesCards] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  // New state to track if properties exist for the selected city
  const [noPropertiesFound, setNoPropertiesFound] = useState(false);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cityFromURL = params.get("city");

  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (cityFromURL) {
      setSelectedCity(cityFromURL);
    }
  }, [cityFromURL]);

  // Reset states when city changes
  useEffect(() => {
    if (selectedCity) {
      setSelectedProperties([]);
      setShowComparisonTable(false);
      setExpandedAmenitiesCards({});
      setShowAmenities(false);
      setSelectedPropertyForAmenities(null);
      setCurrentPage(1);
      setNoPropertiesFound(false);
    }
  }, [selectedCity]);

  // Memoized metrics definition - now includes overall score
  const metrics = useMemo(() => [
    { key: 'overallScore', label: 'Overall Score', higher: true, icon: Star },
    { key: 'builderReputation', label: 'Builder Reputation', higher: true, icon: Building },
    { key: 'locationScore', label: 'Location Score', higher: true, icon: MapPin },
    { key: 'investmentPotential', label: 'Investment Potential', higher: true, icon: BarChart3 },
    { key: 'fiveYearGrowth', label: '5-Year Growth', higher: true, icon: TrendingUp },
    { key: 'lifestyleIndex', label: 'Lifestyle Index', higher: true, icon: Zap },
    { key: 'valuation', label: 'Valuation Score', higher: true, icon: Star }
  ], []);

  // Generate property amenities score data using real data from MongoDB
  const generateAmenitiesData = useCallback((property) => {
    // Use actual property data from MongoDB
    return [
      { name: 'Security', score: property.security_score || parseFloat((Math.min(10, Math.max(1, property.amenities_count * 0.5 || 5))).toFixed(1)) },
      { name: 'Parking', score: property.parking_count ? Math.min(10, Math.max(1, property.parking_count * 2)) : parseFloat((Math.min(10, Math.max(1, property.amenities_count * 0.4 || 5))).toFixed(1)) },
      { name: 'Recreation', score: property.recreation_score || parseFloat((Math.min(10, Math.max(1, property.amenities_count * 0.3 || 5))).toFixed(1)) },
      { name: 'Convenience', score: property.convenience_score || parseFloat((Math.min(10, Math.max(1, property.lifestyle_quality_index || 5))).toFixed(1)) },
      { name: 'Green Space', score: property.green_cover ? Math.min(10, Math.max(1, property.green_cover / 5)) : parseFloat((Math.min(10, Math.max(1, property.amenities_count * 0.2 || 4))).toFixed(1)) }
    ];
  }, []);

  // Memoized helper functions
  const getBestValueIndex = useCallback((metric, propertiesData) => {
    if (!propertiesData || propertiesData.length === 0) return 0;

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
  }, []);

  const formatValue = useCallback((value, type) => {
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
  }, []);

  const getScoreColor = useCallback((score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }, []);

  const getTrendIcon = useCallback((trend) => {
    switch (trend) {
      case 'Rising':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  }, []);

  // Calculate overall score for a property
  const calculateOverallScore = useCallback((property) => {
    const scores = [
      property.builderReputation || 0,
      property.locationScore || 0,
      property.investmentPotential || 0,
      (property.fiveYearGrowth || 0) / 10
    ];

    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(averageScore * 10) / 10;
  }, []);

  // Process properties to ensure unique locations
  const processUniqueProperties = useCallback((propertyList) => {
    if (!propertyList || propertyList.length === 0) return [];

    // Create a map to store unique properties by location
    const uniquePropertiesMap = new Map();

    // Process each property
    propertyList.forEach(property => {
      const locationKey = property.location;

      // If this location is not in our map or the current property has better overall score
      if (!uniquePropertiesMap.has(locationKey) ||
        calculateOverallScore(property) > calculateOverallScore(uniquePropertiesMap.get(locationKey))) {
        uniquePropertiesMap.set(locationKey, property);
      }
    });

    // Convert map values back to array
    return Array.from(uniquePropertiesMap.values());
  }, [calculateOverallScore]);

  // Get amenity icon based on category name
  const getAmenityIcon = useCallback((categoryName) => {
    switch (categoryName) {
      case 'Security':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'Parking':
        return <Car className="w-4 h-4 text-green-600" />;
      case 'Recreation':
        return <Dumbbell className="w-4 h-4 text-purple-600" />;
      case 'Convenience':
        return <Coffee className="w-4 h-4 text-orange-600" />;
      case 'Green Space':
        return <Leaf className="w-4 h-4 text-green-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-600" />;
    }
  }, []);

  // Handle download comparison table data
  const handleDownloadComparisonTable = useCallback(() => {
    if (selectedProperties.length === 0) return;

    // Create CSV content with headers
    const headers = ['Property Name', 'Location', 'Price', 'Area', 'Price per sqft', 'Overall Score', 'Builder Reputation', 'Location Score', 'Investment Potential', '5-Year Growth'];

    const csvContent = [
      headers,
      ...selectedProperties.map(property => [
        property.name,
        property.location,
        property.price_value ? `₹${property.price_value.toLocaleString()}` : 'N/A',
        property.area || 'N/A',
        property.rate_sqft ? `₹${property.rate_sqft.toLocaleString()}` : 'N/A',
        calculateOverallScore(property),
        property.builderReputation || 'N/A',
        property.locationScore || 'N/A',
        property.investmentPotential || 'N/A',
        property.fiveYearGrowth ? `${property.fiveYearGrowth}%` : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'property_comparison.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedProperties, calculateOverallScore]);

  // Handle compare button click
  const handleCompare = useCallback(() => {
    setShowComparisonTable(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Add property to comparison
  const handleAddToCompare = useCallback((property) => {
    setSelectedProperties(prevSelected => {
      if (prevSelected.some(p => p.id === property.id)) {
        return prevSelected.filter(p => p.id !== property.id);
      } else if (prevSelected.length < 4) {
        return [...prevSelected, property];
      }
      return prevSelected;
    });
  }, []);

  // Remove property from comparison
  const handleRemoveFromCompare = useCallback((propertyId) => {
    setSelectedProperties(prevSelected => prevSelected.filter(p => p.id !== propertyId));
  }, []);

  // Handle showing amenities
  const handleShowAmenities = useCallback((property) => {
    setSelectedPropertyForAmenities(property);
    setShowAmenities(true);
  }, []);

  // Toggle amenities card
  const toggleAmenitiesCard = useCallback((propertyId) => {
    setExpandedAmenitiesCards(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  }, []);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      if (!selectedCity) {
        setLoading(false);
        return;
      }

      if (isInitialLoad) {
        setLoading(true);
        setError(null);
        setNoPropertiesFound(false);
      }

      try {
        // If initialProperties are provided, use them, otherwise fetch from API
        if (initialProperties.length > 0) {
          setProperties(initialProperties);
          setIsInitialLoad(false);
          setLoading(false);
        } else {
          // Add timeout to prevent infinite loading (increased to 30 seconds)
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 30000)
          );

          // Fetch properties from API with pagination and city filter
          const response = await Promise.race([
            getAllPropertiesForComparison({
              page: currentPage,
              limit: 50,
              city: selectedCity // Pass the selected city to the API
            }),
            timeoutPromise
          ]);

          if (response && response.success && response.properties && response.properties.length > 0) {
            // Transform the data to match our component structure
            const transformedProperties = response.properties.map((property, index) => ({
              id: property._id,
              name: property.developer_name && property.developer_name !== 'Unknown'
                ? `${property.developer_name} - ${property.location}`
                : `${property.location} Property`,
              price: `₹${(property.price_value || 0).toLocaleString()}`,
              location: property.location || 'Location Not Available',
              city: property.city || 'City Not Available',
              builderReputation: property.builder_grade || 0,
              locationScore: property.lifestyle_quality_index || 0,
              lifestyleIndex: property.lifestyle_quality_index || 0,
              valuation: property.investment_potential || 0,
              neighbourhoodClass: property.neighbourhood_avg_income > 100000 ? 'Premium' :
                property.neighbourhood_avg_income > 50000 ? 'Upper Middle' : 'Middle',
              schoolsNearby: property.schools_nearby || property.amenities_count || 0,
              hospitalsNearby: property.hospitals_nearby || Math.ceil(property.amenities_count * 0.3) || 0,
              collegesNearby: property.colleges_nearby || Math.ceil(property.amenities_count * 0.2) || 0,
              metroDistance: property.metro_distance || property.public_transport_score || 0,
              aqi: property.aqi || property.environmental_quality || 0,
              greenCover: property.green_cover || property.environmental_quality || 0,
              noiseLevel: property.noise_level || (100 - property.environmental_quality) || 0,
              trafficScore: property.traffic_score || property.public_transport_score || 0,
              fiveYearGrowth: property.future_growth_prediction || 0,
              investmentPotential: property.investment_potential || 0,
              internationalRanking: property.international_ranking || property.lifestyle_quality_index * 10 || 0,
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

            // Set properties and update states in one go to prevent blinking
            setProperties(transformedProperties);
            setTotalPages(response.totalPages || 1);
            setTotalCount(response.totalCount || 0);
            setIsInitialLoad(false);
            setLoading(false);
            setNoPropertiesFound(false);
          } else {
            // No properties found for this city
            setProperties([]);
            setTotalPages(1);
            setTotalCount(0);
            setIsInitialLoad(false);
            setLoading(false);
            setNoPropertiesFound(true);
          }
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to connect to API: " + err.message);
        setIsInitialLoad(false);
        setLoading(false);
        setNoPropertiesFound(false);
      }
    };

    fetchProperties();
  }, [initialProperties, isInitialLoad, currentPage, selectedCity]);

  // Function to normalize city names for case-insensitive comparison
  const normalizeCity = useCallback((city) => {
    if (!city) return '';
    // Convert to lowercase for case-insensitive comparison
    const normalized = city.toLowerCase().trim();
    // Special case for Gurgaon/Gurugram which are the same city
    if (normalized === 'gurgaon' || normalized === 'gurugram') {
      return 'gurgaon/gurugram';
    }
    return normalized;
  }, []);

  // Filter properties by selected city
  const filterPropertiesByCity = useCallback((propertyList) => {
    if (!selectedCity || selectedCity === '') return propertyList;

    return propertyList.filter(property => {
      const propertyCity = property.city || '';
      return normalizeCity(propertyCity) === normalizeCity(selectedCity);
    });
  }, [selectedCity, normalizeCity]);

  // Memoized processed properties data
  const processedProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    // Filter properties by city first
    const cityFilteredProperties = filterPropertiesByCity(properties);

    // Get unique properties next
    const uniqueProperties = processUniqueProperties(cityFilteredProperties);
    const uniqueSelectedProperties = processUniqueProperties(selectedProperties);

    const propertiesData = showComparisonTable ? uniqueSelectedProperties : uniqueProperties;

    return propertiesData.map((property, propertyIndex) => {
      // Round scores to one decimal place for simplicity
      const overallScore = Math.round(calculateOverallScore(property) * 10) / 10;
      const winCount = metrics.filter(
        (metric) => getBestValueIndex(metric, propertiesData) === propertyIndex
      ).length;
      const winPercentage = Math.round((winCount / metrics.length) * 100);

      return {
        ...property,
        overallScore,
        winCount,
        winPercentage,
        // Round all metric values to one decimal place
        builderReputation: Math.round(property.builderReputation * 10) / 10,
        locationScore: Math.round(property.locationScore * 10) / 10,
        investmentPotential: Math.round(property.investmentPotential * 10) / 10,
        fiveYearGrowth: Math.round(property.fiveYearGrowth * 10) / 10,
        lifestyleIndex: Math.round(property.lifestyleIndex * 10) / 10,
        valuation: Math.round(property.valuation * 10) / 10
      };
    });
  }, [properties, selectedProperties, showComparisonTable, calculateOverallScore, metrics, getBestValueIndex, processUniqueProperties]);

  // Create table data with overall score for comparison table
  const tableData = useMemo(() => {
    if (!showComparisonTable || selectedProperties.length === 0) return [];

    return selectedProperties.map(property => ({
      ...property,
      overallScore: calculateOverallScore(property)
    }));
  }, [selectedProperties, showComparisonTable, calculateOverallScore]);

  // Use tableData for comparison table, processedProperties for cards
  const propertiesData = showComparisonTable ? tableData : processedProperties;

  const handleServiceClick = (service) => {
    if (service.isComparator) {
      // Dispatch custom event to trigger message box in header for Comparators
      const event = new CustomEvent('showComparatorMessage');
      window.dispatchEvent(event);
      return;
    }

    // Handle navigation for all services that have a link
    if (service.link) {
      navigate(service.link);
    }
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Header */}
      <div className="bg-[#0A2463] shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Property Comparator</h1>
              <p className="text-gray-200 mt-1">
                {selectedCity ? `Comparing properties in ${selectedCity}` : 'Select a city to compare properties'}
              </p>
            </div>
            {selectedProperties.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-white">
                  {selectedProperties.length} properties selected
                </span>
                <button
                  onClick={() => setSelectedProperties([])}
                  className="text-sm text-white hover:text-red-200 font-medium flex items-center"
                >
                  <X className="w-4 h-4 mr-1" /> Clear
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

      {!loading && noPropertiesFound && selectedCity && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-500 text-6xl mb-4">🏘️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find any properties in {selectedCity}. Try searching for a different city.</p>
            <button
              onClick={() => handleServiceClick({ isComparator: true })}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Select City
            </button>
          </div>
        </div>
      )}

      {/* No Properties Found State */}
      {!loading && noPropertiesFound && selectedCity && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-500 text-6xl mb-4">🏘️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find any properties in {selectedCity}. Try searching for a different city.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Search Another City
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && !noPropertiesFound && (
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
      {!loading && !error && !noPropertiesFound && !isInitialLoad && properties.length > 0 && selectedCity && (
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
          {/* Comparison Table View (Full Screen) */}
          {showComparisonTable ? (
            <div className="min-h-screen bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0A2463] text-white">
                <div>
                  <h2 className="text-2xl font-bold">Property Comparison</h2>
                  <p className="text-gray-200">Detailed comparison of selected properties in {selectedCity}</p>
                </div>
                <button
                  onClick={() => setShowComparisonTable(false)}
                  className="bg-white hover:bg-gray-100 text-[#0A2463] px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r">Property</th>
                      {tableData.map((property) => (
                        <th key={property.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900 border-r min-w-[200px]">
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold text-sm">{property.name}</h3>
                              <p className="text-green-600 font-bold text-sm">₹{(property.rate_sqft || 0).toLocaleString()}/sqft</p>
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
                        {tableData.map((property) => {
                          const value = property[metric.key];
                          const isBest = getBestValueIndex(metric, tableData) === tableData.indexOf(property);

                          return (
                            <td key={`${property.id}-${metric.key}`} className="px-6 py-4 text-center text-sm border-r">
                              <div className={`${isBest ? 'bg-green-100 text-green-800 font-semibold px-2 py-1 rounded' : ''}`}>
                                {formatValue(value, metric.key === 'overallScore' ? 'score' : 'score')}
                                {isBest && <span className="ml-1"><Award className="w-4 h-4 inline text-green-800" /></span>}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Award className="w-4 h-4 inline text-green-800" /> indicates the best value for each metric
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowComparisonTable(false)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add More Properties
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {processedProperties.map((property) => {
                  const isSelected = selectedProperties.some(p => p.id === property.id);
                  const propertyIndex = processedProperties.indexOf(property);

                  return (
                    <div key={property.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                      {/* Property Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                          <div className="bg-[#0A2463] text-white px-3 py-1 rounded-full text-sm font-medium">
                            #{propertyIndex + 1}
                          </div>
                          <div className="bg-[#0A2463] bg-opacity-10 text-[#0A2463] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {property.overallScore}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-[#0A2463]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-[#0A2463]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleAddToCompare(property)}
                            className={`p-2 rounded-lg transition-colors ${isSelected
                                ? 'bg-[#0A2463] bg-opacity-20 text-[#0A2463]'
                                : 'hover:bg-gray-100 text-gray-600'
                              }`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-[#0A2463] flex-shrink-0" />
                          <span className="text-sm text-gray-600">{property.location}, {property.city}</span>
                        </div>

                        {/* Property Type and Potential */}
                        <div className="flex gap-2 mb-4">
                          <div className="bg-[#0A2463] text-white px-3 py-1 rounded-full text-sm font-medium">
                            {property.bedrooms ? `${property.bedrooms}BHK` : 'Apartment'}
                          </div>

                        </div>

                        {/* Price and Area */}
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Price</div>
                            <div className="text-lg font-bold text-gray-900">₹{(property.rate_sqft || 0).toLocaleString()}/sqft</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Sq Ft</div>
                            <div className="text-lg font-bold text-gray-900">{property.area || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Growth and Status */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              {Math.round((property.fiveYearGrowth || 0) * 10) / 10}% growth (5yr)
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.bedrooms ? `${property.bedrooms}BHK` : 'Apartment'} Fresh
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleAddToCompare(property)}
                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isSelected
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-[#0A2463] hover:bg-[#0A2463]/90 text-white'
                              }`}
                            disabled={!isSelected && selectedProperties.length >= 4}
                          >
                            {isSelected ? <><X className="w-4 h-4 mr-1" /> Remove from Compare</> :
                              selectedProperties.length >= 4 ? 'Maximum 4 properties' : <><Plus className="w-4 h-4 mr-1" /> Add to Compare</>}
                          </button>

                          <div className="space-y-2">
                            <button
                              onClick={() => handleShowAmenities(property)}
                              className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <BarChart3 className="w-4 h-4" />
                              Show Amenities
                            </button>

                            {expandedAmenitiesCards[property.id || `property-${propertyIndex}`] && (
                              <div className="bg-white rounded-lg border border-gray-200 p-4 mt-2">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities Score</h4>
                                <div className="h-40 w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={generateAmenitiesData(property)}
                                      margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
                                      layout="vertical"
                                      barGap={0}
                                      barCategoryGap={8}
                                    >
                                      <XAxis
                                        type="number"
                                        domain={[0, 10]}
                                        tickCount={6}
                                        axisLine={{ stroke: '#333', strokeWidth: 1 }}
                                        tickLine={{ stroke: '#333', strokeWidth: 1 }}
                                        tick={{ fill: '#333', fontSize: 10 }}
                                      />
                                      <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={90}
                                        axisLine={{ stroke: '#333', strokeWidth: 1 }}
                                        tickLine={{ stroke: '#333', strokeWidth: 1 }}
                                        tick={{ fill: '#333', fontSize: 10 }}
                                      />
                                      <Tooltip
                                        content={({ active, payload, label }) => {
                                          if (active && payload && payload.length) {
                                            return (
                                              <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
                                                <p className="text-xs font-medium text-gray-900">{payload[0].payload.name}</p>
                                                <p className="text-xs text-[#0A2463] font-bold">
                                                  Score: {payload[0].value}/10
                                                </p>
                                              </div>
                                            );
                                          }
                                          return null;
                                        }}
                                      />
                                      <Bar dataKey="score" barSize={16} radius={[0, 4, 4, 0]} animationDuration={300}>
                                        {generateAmenitiesData(property).map((entry, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={entry.score >= 8 ? '#0A2463' : entry.score >= 6 ? '#0A2463' : '#0A2463'}
                                            stroke="none"
                                          />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls - Only show if we have properties */}
              {processedProperties.length > 0 && (
                <div className="flex justify-center items-center gap-4 mb-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({totalCount.toLocaleString()} total properties)
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              {processedProperties.length === 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center my-12">
                  <div className="text-gray-400 text-6xl mb-4">🏙️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Properties Found</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedCity ? `No properties available in ${selectedCity}` : "No properties match your criteria"}
                  </p>
                  <button
                    onClick={() => handleServiceClick({ isComparator: true })}
                    className="bg-[#0A2463] hover:bg-[#0A2463]/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Select City
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Fixed Compare Button */}
      {!showComparisonTable && selectedProperties.length >= 2 && (
        <div className="fixed bottom-6 right-6 z-50 shadow-lg">
          <button
            onClick={handleCompare}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 bg-[#0A2463] hover:bg-[#0A2463]/90 text-white"
          >
            <BarChart3 className="w-5 h-5" />
            Compare ({selectedProperties.length})
          </button>
        </div>
      )}

      {/* Amenities Modal */}
      {showAmenities && selectedPropertyForAmenities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Amenities: {selectedPropertyForAmenities.name || `Property ${selectedPropertyForAmenities.id}`}
                </h3>
                <button
                  onClick={() => setShowAmenities(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={generateAmenitiesData(selectedPropertyForAmenities)}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                      layout="vertical"
                      barGap={0}
                      barCategoryGap={12}
                    >
                      <XAxis
                        type="number"
                        domain={[0, 10]}
                        tickCount={6}
                        axisLine={{ stroke: '#333', strokeWidth: 1 }}
                        tickLine={{ stroke: '#333', strokeWidth: 1 }}
                        tick={{ fill: '#333', fontSize: 12 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={110}
                        axisLine={{ stroke: '#333', strokeWidth: 1 }}
                        tickLine={{ stroke: '#333', strokeWidth: 1 }}
                        tick={{ fill: '#333', fontSize: 12 }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="text-sm font-medium text-gray-900">{payload[0].payload.name}</p>
                                <p className="text-sm text-[#0A2463] font-bold">
                                  Score: {payload[0].value}/10
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="score" barSize={24} radius={[0, 4, 4, 0]} animationDuration={300}>
                        {generateAmenitiesData(selectedPropertyForAmenities).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.score >= 8 ? '#0A2463' : entry.score >= 6 ? '#0A2463' : '#0A2463'}
                            stroke="none"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">Amenities Details</h4>
                  <div className="space-y-3">
                    {generateAmenitiesData(selectedPropertyForAmenities).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
                          {getAmenityIcon(amenity.name)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{amenity.name}</p>
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${amenity.score * 10}%`,
                                  backgroundColor: amenity.score >= 8 ? '#0A2463' : amenity.score >= 6 ? '#3B82F6' : '#94A3B8'
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{amenity.score}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAmenities(false)}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparator;