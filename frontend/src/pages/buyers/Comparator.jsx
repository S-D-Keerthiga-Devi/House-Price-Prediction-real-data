import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, TrendingUp, TrendingDown, Building, Star, BarChart3, Zap, X, Award, Plus, ArrowLeft, Shield, Car, Dumbbell, Coffee, Leaf, Search, Filter, RefreshCw } from "lucide-react";
import { getAllPropertiesForComparison } from '../../api/house';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useLocation, useNavigate } from "react-router-dom";
import PropertySearch from "../../components/PropertySearch";

const Comparator = ({ initialProperties = [] }) => {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]); // New state for all properties
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
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  // State for notification message
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cityFromURL = params.get("city");
  const navigate = useNavigate(); // Added useNavigate hook

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
      setSearchQuery(""); // Reset search query
      setAllProperties([]); // Clear all properties
    }
  }, [selectedCity]);

  // Show notification function
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  }, []);

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
    if (value === null || value === undefined || value === 'NaN') return 'N/A';

    switch (type) {
      case 'currency':
        return `₹${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'score':
        // Format score to have at most 1 decimal place
        if (typeof value === 'number') {
          return `${value.toFixed(1)}/10`;
        } else if (value === "N/A") {
          return value;
        } else {
          // Try to parse and format if it's a string number
          const numValue = parseFloat(value);
          return isNaN(numValue) ? value : `${numValue.toFixed(1)}/10`;
        }
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
    // If we have a direct score from the property card, use it
    if (property.overall_score !== undefined && property.overall_score !== null) {
      // Make sure it's a number and format it to 1 decimal place
      const score = parseFloat(property.overall_score);
      return isNaN(score) ? "N/A" : score.toFixed(1);
    }
    
    // Fallback calculation if overall_score is not available
    const scores = [
      property.builderReputation || 0,
      property.locationScore || 0,
      property.investmentPotential || 0,
      (property.fiveYearGrowth || 0) / 10
    ];

    // Filter out any NaN values
    const validScores = scores.filter(score => !isNaN(score));
    
    // If no valid scores, return "N/A"
    if (validScores.length === 0) return "N/A";
    
    // Calculate average of valid scores
    const sum = validScores.reduce((a, b) => a + b, 0);
    const avg = sum / validScores.length;
    
    // Return formatted score with one decimal place as a string
    return avg.toFixed(1);
  }, []);

  // Process properties to ensure unique locations and IDs
  const processUniqueProperties = useCallback((propertyList) => {
    if (!propertyList || propertyList.length === 0) return [];

    // First, remove duplicates by ID
    const uniqueByIdMap = new Map();
    propertyList.forEach(property => {
      if (!uniqueByIdMap.has(property.id)) {
        uniqueByIdMap.set(property.id, property);
      }
    });

    // Then, from the unique by ID, select the best by location
    const uniqueByLocationMap = new Map();
    uniqueByIdMap.forEach(property => {
      const locationKey = property.location;
      if (!uniqueByLocationMap.has(locationKey) ||
        calculateOverallScore(property) > calculateOverallScore(uniqueByLocationMap.get(locationKey))) {
        uniqueByLocationMap.set(locationKey, property);
      }
    });

    return Array.from(uniqueByLocationMap.values());
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
    // No need to scroll to top as we're keeping the same view
  }, []);

  // Add property to comparison
  const handleAddToCompare = useCallback((property) => {
    setSelectedProperties(prevSelected => {
      if (prevSelected.some(p => p.id === property.id)) {
        return prevSelected.filter(p => p.id !== property.id);
      } else if (prevSelected.length < 3) {
        // Calculate overall score if not already present
        const propertyWithScore = {
          ...property,
          overallScore: calculateOverallScore(property)
        };
        return [...prevSelected, propertyWithScore];
      } else {
        // Show proper message instead of alert
        setNotification({
          show: true,
          message: "Maximum 3 properties can be selected for comparison",
          type: "warning"
        });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
        return prevSelected;
      }
    });
    // Don't change the view to comparison table automatically
  }, [calculateOverallScore]);

  // Remove property from comparison
  const handleRemoveFromCompare = useCallback((propertyId) => {
    setSelectedProperties(prevSelected => prevSelected.filter(p => p.id !== propertyId));
    // Reset to original property list if all properties are removed
    if (selectedProperties.length <= 1) {
      setShowComparisonTable(false);
    }
  }, [selectedProperties.length]);

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

  // Find full property details by ID
  const findFullPropertyDetails = useCallback((propertyId) => {
    // First check in the current properties list
    const fullProperty = properties.find(p => p.id === propertyId);
    if (fullProperty) return fullProperty;
    
    // If not found, check in all properties
    const searchProperty = allProperties.find(p => p.id === propertyId);
    if (searchProperty) {
      // Find the corresponding full property from the paginated list
      const locationMatch = properties.find(p => p.location === searchProperty.location);
      if (locationMatch) return locationMatch;
    }
    
    return null;
  }, [properties, allProperties]);

  // Fetch all properties for search (without pagination)
  useEffect(() => {
    const fetchAllProperties = async () => {
      if (!selectedCity) {
        setAllProperties([]);
        return;
      }

      try {
        // Fetch all properties for the selected city without pagination
        const response = await getAllPropertiesForComparison({
          city: selectedCity,
          limit: 1000, // Large number to get all properties
          page: 1
        });

        if (response && response.success && response.properties) {
          // Transform the data (same transformation as in the other fetch)
          const transformedProperties = response.properties.map((property) => {
            // Calculate overall score
            const builderReputation = property.builder_grade || 0;
            const locationScore = property.lifestyle_quality_index || 0;
            const investmentPotential = property.investment_potential || 0;
            const fiveYearGrowth = property.future_growth_prediction || 0;
            
            const scores = [
              builderReputation,
              locationScore,
              investmentPotential,
              fiveYearGrowth / 10
            ];
            
            const validScores = scores.filter(score => !isNaN(score));
            const overallScore = validScores.length > 0 
              ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
              : "N/A";
              
            return {
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
              fiveYearGrowth: property.future_growth_prediction || 0,
              investmentPotential: property.investment_potential || 0,
              marketTrend: property.future_growth_prediction > 80 ? 'Rising' :
                property.future_growth_prediction > 60 ? 'Stable' : 'Declining',
              // Add overall score
              overall_score: overallScore,
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
            };
          });

          // Remove duplicates
          const uniqueProperties = processUniqueProperties(transformedProperties);
          setAllProperties(uniqueProperties);
        } else {
          setAllProperties([]);
        }
      } catch (err) {
        console.error("Error fetching all properties:", err);
        setAllProperties([]);
      }
    };

    fetchAllProperties();
  }, [selectedCity, processUniqueProperties]);

  // Fetch properties from API (with pagination)
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

          if (response && response.success && response.properties) {
            if (response.properties.length === 0) {
              // No properties found for this city
              setNoPropertiesFound(true);
              setProperties([]);
              setAllProperties([]);
              setLoading(false);
              setIsInitialLoad(false);
              return;
            }
            
            // Transform the data to match our component structure
            const transformedProperties = response.properties.map((property, index) => {
              // Calculate overall score
              const builderReputation = property.builder_grade || 0;
              const locationScore = property.lifestyle_quality_index || 0;
              const investmentPotential = property.investment_potential || 0;
              const fiveYearGrowth = property.future_growth_prediction || 0;
              
              const scores = [
                builderReputation,
                locationScore,
                investmentPotential,
                fiveYearGrowth / 10
              ];
              
              const validScores = scores.filter(score => !isNaN(score));
              const overallScore = validScores.length > 0 
                ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
                : "N/A";
                
              return {
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
                // Add overall score
                overall_score: overallScore,
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
              };
            });

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
            setAllProperties([]);
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

  // Filter properties by search query
  const filterPropertiesBySearch = useCallback((propertyList) => {
    if (!searchQuery.trim()) return propertyList;
    
    const query = searchQuery.toLowerCase().trim();
    return propertyList.filter(property => {
      return (
        (property.name && property.name.toLowerCase().includes(query)) ||
        (property.location && property.location.toLowerCase().includes(query)) ||
        (property.developer_name && property.developer_name.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);
  
  // Handle show all properties
  const handleShowAllProperties = useCallback(() => {
    setSearchQuery('');
    setShowComparisonTable(false);
  }, []);

  // Memoized processed properties data
  const processedProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    
    // Filter properties by city first
    const cityFilteredProperties = filterPropertiesByCity(properties);
    
    // Then filter by search query
    const searchFilteredProperties = filterPropertiesBySearch(cityFilteredProperties);
    
    // Get unique properties next
    const uniqueProperties = processUniqueProperties(searchFilteredProperties);
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

  // Create a combined list of properties for display - includes current page properties and any selected properties
  const propertiesForDisplay = useMemo(() => {
    // Start with the processed properties (current page)
    let displayProperties = [...processedProperties];
    
    // Add any selected properties that are not already in the list
    selectedProperties.forEach(selectedProp => {
      if (!displayProperties.some(p => p.id === selectedProp.id)) {
        // Calculate overall score for the selected property
        const overallScore = calculateOverallScore(selectedProp);
        
        displayProperties.push({
          ...selectedProp,
          overallScore,
          // Round all metric values to one decimal place
          builderReputation: Math.round(selectedProp.builderReputation * 10) / 10,
          locationScore: Math.round(selectedProp.locationScore * 10) / 10,
          investmentPotential: Math.round(selectedProp.investmentPotential * 10) / 10,
          fiveYearGrowth: Math.round(selectedProp.fiveYearGrowth * 10) / 10,
          lifestyleIndex: Math.round(selectedProp.lifestyleIndex * 10) / 10,
          valuation: Math.round(selectedProp.valuation * 10) / 10
        });
      }
    });
    
    return displayProperties;
  }, [processedProperties, selectedProperties, calculateOverallScore]);

  // Create table data with overall score for comparison table
  const tableData = useMemo(() => {
    if (!showComparisonTable || selectedProperties.length === 0) return [];

    return selectedProperties.map(property => ({
      ...property,
      overallScore: calculateOverallScore(property)
    }));
  }, [selectedProperties, showComparisonTable, calculateOverallScore]);

  // Use tableData for comparison table, propertiesForDisplay for cards
  const propertiesData = showComparisonTable ? tableData : propertiesForDisplay;

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

  // Handle property selection from search
  const handlePropertySelect = useCallback((property) => {
    if (!property) return;
    
    // Find the full property details
    const fullProperty = findFullPropertyDetails(property.id);
    
    if (fullProperty) {
      // If property is already selected, remove it
      if (selectedProperties.some(p => p.id === fullProperty.id)) {
        handleRemoveFromCompare(fullProperty.id);
      } 
      // Otherwise add it if we have less than 3 properties
      else if (selectedProperties.length < 3) {
        handleAddToCompare(fullProperty);
      } else {
        showNotification("Maximum 3 properties can be selected for comparison", "warning");
      }
    } else {
      // If we can't find the full property details, try to use the property from allProperties
      const searchProperty = allProperties.find(p => p.id === property.id);
      if (searchProperty) {
        if (selectedProperties.some(p => p.id === searchProperty.id)) {
          handleRemoveFromCompare(searchProperty.id);
        } else if (selectedProperties.length < 3) {
          handleAddToCompare(searchProperty);
        } else {
          showNotification("Maximum 3 properties can be selected for comparison", "warning");
        }
      }
    }
  }, [selectedProperties, findFullPropertyDetails, allProperties, handleRemoveFromCompare, handleAddToCompare, showNotification]);

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

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'warning' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="ml-4 text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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

      {/* No Properties Found State */}
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
              Select a Different City
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
          {/* Always show the two-column layout */}
            <>
              {/* Two-column layout */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left column - Property listings */}
                <div className="w-full lg:w-1/3">
                  {/* Search bar - now using PropertySearch component */}
                  <div className="mb-6">
                    <PropertySearch 
                      key={selectedCity} // Force re-render when city changes
                      selectedCity={selectedCity}
                      // Only pass locations from available property cards for the selected city
                      availableLocalities={allProperties
                        .filter(prop => prop.city && prop.city.toLowerCase() === selectedCity.toLowerCase())
                        .map(prop => prop.location)
                        .filter(Boolean)
                        .filter((loc, index, self) => self.indexOf(loc) === index)
                        .sort()
                      }
                      onLocalitySelect={(locality) => {
                        setSearchQuery(locality);
                        // Find properties matching this locality
                        const matchingProperties = allProperties.filter(
                          prop => prop.location && prop.location.toLowerCase() === locality.toLowerCase() && 
                          prop.city && prop.city.toLowerCase() === selectedCity.toLowerCase()
                        );
                        
                        // Check if we have any properties for this city
                        const cityProperties = allProperties.filter(
                          prop => prop.city && prop.city.toLowerCase() === selectedCity.toLowerCase()
                        );
                        
                        if (cityProperties.length === 0) {
                          // No properties for this city at all
                          setNoPropertiesFound(true);
                          return;
                        }
                        
                        if (matchingProperties.length > 0) {
                          // Add the first matching property to comparison
                          handleAddToCompare(matchingProperties[0]);
                          
                          // Scroll to property cards section
                          setTimeout(() => {
                            const propertyCardsSection = document.getElementById('property-cards-section');
                            if (propertyCardsSection) {
                              propertyCardsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }
                      }}
                      onClear={() => {
                        setSearchQuery("");
                      }}
                    />
                    <button
                      onClick={handleShowAllProperties}
                      className="mt-1 w-full bg-blue-900 hover:bg-[#0A2463]/90 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Show All Properties
                    </button>
                  </div>
                  
                  {/* Property Cards Grid */}
                  <div id="property-cards-section" className="grid grid-cols-1 gap-4 mb-8">
                    {propertiesForDisplay.map((property) => {
                      const isSelected = selectedProperties.some(p => p.id === property.id);
                      const propertyIndex = propertiesForDisplay.indexOf(property);

                      return (
                        <div key={property.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4">
                          {/* Property Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{property.name}</h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{property.location}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddToCompare(property)}
                              disabled={selectedProperties.length >= 3 && !isSelected}
                              className={`p-2 rounded-lg transition-colors ${
                                isSelected
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : selectedProperties.length >= 3
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              }`}
                            >
                              {isSelected ? (
                                <X className="w-5 h-5" />
                              ) : (
                                <Plus className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Property Details */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-xs text-gray-500">Price</div>
                              <div className="font-semibold">{property.price}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-xs text-gray-500">Area</div>
                              <div className="font-semibold">{property.area || "N/A"}</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-xs text-gray-500">Overall Score</div>
                              <div className="font-semibold">{property.overallScore}/10</div>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <div className="text-xs text-gray-500">Investment</div>
                              <div className="font-semibold flex items-center">
                                {typeof property.investmentPotential === 'number' 
                                  ? parseFloat(property.investmentPotential).toFixed(1) 
                                  : "N/A"}/10
                                {property.marketTrend === "Rising" && <TrendingUp className="w-3 h-3 ml-1 text-green-600" />}
                                {property.marketTrend === "Declining" && <TrendingDown className="w-3 h-3 ml-1 text-red-600" />}
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
                </div>
                
                {/* Right column - Comparison area */}
                <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-xl p-4 h-fit">
                  <h2 className="text-xl font-bold mb-4">Property Comparison</h2>
                  
                  {selectedProperties.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Properties Selected</h3>
                      <p className="text-gray-500 mb-6">Select up to 3 properties from the list to compare them side by side.</p>
                    </div>
                  ) : showComparisonTable && selectedProperties.length >= 2 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r">Property</th>
                            {selectedProperties.map((property) => (
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
                              {selectedProperties.map((property) => {
                                const value = property[metric.key];
                                const isBest = getBestValueIndex(metric, selectedProperties) === selectedProperties.indexOf(property);

                                return (
                                  <td key={`${property.id}-${metric.key}`} className="px-6 py-4 text-center text-sm border-r">
                                    <div className={`${isBest ? 'bg-green-100 text-green-800 font-semibold px-2 py-1 rounded' : ''}`}>
                                      {metric.key === 'investmentPotential' && typeof value === 'number' 
                                        ? parseFloat(value).toFixed(1) + '/10'
                                        : formatValue(value, metric.key === 'overallScore' ? 'score' : 'score')}
                                      {isBest && <span className="ml-1"><Award className="w-4 h-4 inline text-green-800" /></span>}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Award className="w-4 h-4 inline text-green-800" /> indicates the best value for each metric
                        </div>
                        <button
                          onClick={() => setShowComparisonTable(false)}
                          className="bg-blue-900 hover:bg-[#0A2463]/90 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Back to Summary
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 gap-4">
                        {selectedProperties.map(property => (
                          <div key={property.id} className="border border-gray-200 rounded-lg p-3 relative">
                            <button 
                              onClick={() => handleRemoveFromCompare(property.id)}
                              className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            
                            <h3 className="font-medium mb-2">{property.name}</h3>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Price:</span> {property.price}
                              </div>
                              <div>
                                <span className="text-gray-500">Area:</span> {property.area || "N/A"}
                              </div>
                              <div>
                                <span className="text-gray-500">Score:</span> {property.overallScore}/10
                              </div>
                              <div>
                                <span className="text-gray-500">Investment:</span> {typeof property.investmentPotential === 'number' ? parseFloat(property.investmentPotential).toFixed(1) : "N/A"}/10
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {selectedProperties.length >= 2 && (
                        <button
                          onClick={handleCompare}
                          className="w-full mt-4 bg-[#0A2463] hover:bg-[#0A2463]/90 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <BarChart3 className="w-5 h-5" />
                          Compare Properties
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
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