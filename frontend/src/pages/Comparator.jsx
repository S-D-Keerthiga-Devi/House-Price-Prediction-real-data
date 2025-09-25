// Comparator.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Crown, Car, Leaf, TrendingUp, MapPin, Home, DollarSign, Star, Building, Users, TreePine, Calendar, Clock, Plus, ArrowLeft, BarChart3 } from "lucide-react";
import { getPropertiesForComparison } from "../api/house.js";

export default function Comparator({ items = [], onRemoveItem, onClose, onAddMore }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      if (items.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching properties for items:", items);
        const response = await getPropertiesForComparison(items);
        
        console.log("API Response:", response);
        
        if (Array.isArray(response)) {
          setProperties(response);
        } else if (response && response.properties && Array.isArray(response.properties)) {
          setProperties(response.properties);
        } else if (response && response.data && Array.isArray(response.data)) {
          setProperties(response.data);
        } else {
          setError("Invalid response format from API");
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Error fetching properties for comparison");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [items]);

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    return `₹${price.toLocaleString()}`;
  };

  const getBuilderGradeColor = (grade) => {
    if (grade >= 0.8) return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
    if (grade >= 0.6) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    if (grade >= 0.4) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getBuilderGradeLabel = (grade) => {
    if (grade >= 0.8) return 'Platinum';
    if (grade >= 0.6) return 'Gold';
    if (grade >= 0.4) return 'Silver';
    return 'Standard';
  };

  const getFacingLabel = (score) => {
    if (score >= 1.0) return 'South';
    if (score >= 0.9) return 'West';
    if (score >= 0.8) return 'East';
    if (score >= 0.7) return 'North';
    return 'Other';
  };

  const getProgressColor = (value, max, type = 'normal') => {
    const percentage = (value / max) * 100;
    if (type === 'inverse') {
      if (percentage <= 20) return 'bg-green-500';
      if (percentage <= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ProgressBar = ({ value, max, type = 'normal', className = '' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const colorClass = getProgressColor(value, max, type);
    
    return (
      <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  // Enhanced features array with better organization
  const featureCategories = [
    {
      title: "Financial Metrics",
      icon: <DollarSign className="w-4 h-4" />,
      features: [
        { 
          key: 'price_value', 
          label: 'Total Price', 
          icon: <DollarSign className="w-4 h-4" />,
          type: 'currency',
          max: 100000000,
          priority: 'high'
        },
        { 
          key: 'rate_sqft', 
          label: 'Price per Sq.Ft', 
          icon: <BarChart3 className="w-4 h-4" />,
          type: 'currency',
          max: 100000,
          priority: 'high'
        },
        { 
          key: 'rental_yield', 
          label: 'Rental Yield', 
          icon: <TrendingUp className="w-4 h-4" />,
          type: 'percentage',
          priority: 'high'
        },
        { 
          key: 'affordability_index', 
          label: 'Affordability Score', 
          icon: <Star className="w-4 h-4" />,
          type: 'score',
          max: 1,
          priority: 'medium'
        }
      ]
    },
    {
      title: "Investment & Growth",
      icon: <TrendingUp className="w-4 h-4" />,
      features: [
        { 
          key: 'investment_potential', 
          label: 'Investment Score', 
          icon: <Star className="w-4 h-4" />,
          type: 'score',
          max: 1,
          priority: 'high'
        },
        { 
          key: 'future_growth_prediction', 
          label: 'Growth Potential', 
          icon: <TrendingUp className="w-4 h-4" />,
          type: 'score',
          max: 10,
          priority: 'high'
        },
        { 
          key: 'neighbourhood_avg_income', 
          label: 'Area Income Level', 
          icon: <Users className="w-4 h-4" />,
          type: 'currency',
          max: 50000000,
          priority: 'medium'
        }
      ]
    },
    {
      title: "Property Details",
      icon: <Home className="w-4 h-4" />,
      features: [
        { key: 'area', label: 'Area (Sq.Ft)', icon: <Building className="w-4 h-4" />, type: 'number', priority: 'high' },
        { key: 'bedrooms', label: 'Bedrooms', icon: <Home className="w-4 h-4" />, type: 'number', priority: 'high' },
        { key: 'bathroom', label: 'Bathrooms', icon: <Home className="w-4 h-4" />, type: 'number', priority: 'medium' },
        { key: 'balconies', label: 'Balconies', icon: <TreePine className="w-4 h-4" />, type: 'number', priority: 'low' },
        { key: 'parking_count', label: 'Parking Spaces', icon: <Car className="w-4 h-4" />, type: 'number', priority: 'medium' }
      ]
    },
    {
      title: "Quality & Features", 
      icon: <Star className="w-4 h-4" />,
      features: [
        { 
          key: 'builder_grade', 
          label: 'Builder Grade', 
          icon: <Crown className="w-4 h-4" />,
          type: 'grade',
          max: 1,
          priority: 'high'
        },
        { 
          key: 'lifestyle_quality_index', 
          label: 'Lifestyle Quality', 
          icon: <Leaf className="w-4 h-4" />,
          type: 'score',
          max: 10,
          priority: 'medium'
        },
        { key: 'amenities_count', label: 'Amenities Count', icon: <Star className="w-4 h-4" />, type: 'number', priority: 'medium' },
        { key: 'facing_score', label: 'Facing Direction', icon: <MapPin className="w-4 h-4" />, type: 'facing', priority: 'low' }
      ]
    },
    {
      title: "Status & Timeline",
      icon: <Calendar className="w-4 h-4" />,
      features: [
        { key: 'property_age_years', label: 'Property Age (Years)', icon: <Calendar className="w-4 h-4" />, type: 'age', priority: 'medium' },
        { key: 'days_on_market', label: 'Days on Market', icon: <Clock className="w-4 h-4" />, type: 'days', priority: 'low' },
        { key: 'construction_status', label: 'Construction Status', icon: <Building className="w-4 h-4" />, type: 'text', priority: 'medium' },
        { key: 'furnishing_status', label: 'Furnishing', icon: <Home className="w-4 h-4" />, type: 'text', priority: 'low' }
      ]
    }
  ];

  const renderFeatureValue = (property, feature) => {
    let value = property[feature.key];
    
    if (value === undefined || value === null) {
      return <span className="text-gray-400 text-sm font-medium">N/A</span>;
    }

    switch (feature.type) {
      case 'currency':
        const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return (
          <div className="space-y-2">
            <div className="font-semibold text-gray-800">{formatPrice(numericValue)}</div>
            <ProgressBar value={numericValue} max={feature.max} />
          </div>
        );
        
      case 'percentage':
        const percentValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return (
          <div className="space-y-2">
            <div className="font-semibold text-gray-800">{(percentValue * 100).toFixed(2)}%</div>
            <ProgressBar value={percentValue * 100} max={100} />
          </div>
        );
        
      case 'score':
        const scoreValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return (
          <div className="space-y-2">
            <div className="font-semibold text-gray-800">{scoreValue.toFixed(1)}</div>
            <ProgressBar value={scoreValue} max={feature.max} />
          </div>
        );
        
      case 'grade':
        return (
          <div className="space-y-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBuilderGradeColor(value)}`}>
              <Crown className="w-3 h-3 mr-1" />
              {getBuilderGradeLabel(value)}
            </div>
            <ProgressBar value={value} max={1} />
          </div>
        );
        
      case 'facing':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-gray-800">{getFacingLabel(value)}</div>
            <ProgressBar value={value} max={1} />
          </div>
        );
        
      case 'age':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-gray-800">{value} years</div>
            <ProgressBar value={value} max={20} type="inverse" />
          </div>
        );
        
      case 'days':
        return (
          <div className="space-y-2">
            <div className="font-semibold text-gray-800">{value} days</div>
            <ProgressBar value={value} max={365} type="inverse" />
          </div>
        );
        
      case 'text':
        return (
          <div className="font-semibold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg text-sm">
            {value}
          </div>
        );
        
      case 'number':
        const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return (
          <div className="font-semibold text-gray-800 text-lg">
            {numValue.toLocaleString()}
          </div>
        );
        
      default:
        return <div className="font-medium text-gray-700">{value}</div>;
    }
  };

  const getBestValueBadge = (properties, feature) => {
    if (properties.length < 2) return null;
    
    let bestIndex = 0;
    let bestValue = properties[0][feature.key];
    
    properties.forEach((property, index) => {
      const currentValue = property[feature.key];
      if (currentValue === undefined || currentValue === null) return;
      
      // For certain features, lower is better
      const lowerIsBetter = ['price_value', 'rate_sqft', 'property_age_years', 'days_on_market'].includes(feature.key);
      
      if (lowerIsBetter ? currentValue < bestValue : currentValue > bestValue) {
        bestValue = currentValue;
        bestIndex = index;
      }
    });
    
    return bestIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-yellow-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Comparison Data Limited</h3>
          <p className="text-gray-600 mb-6">Some detailed information may not be available for comparison.</p>
          <div className="flex justify-center space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button 
              onClick={onAddMore}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Add More Localities
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Properties Selected</h3>
          <p className="text-gray-600 mb-6">Add properties to compare their features and make an informed decision.</p>
          <button 
            onClick={onAddMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Property Comparison</h1>
                <p className="text-gray-600 text-sm">Comparing {properties.length} properties</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={onAddMore}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More
              </button>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Headers */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid gap-6" style={{ gridTemplateColumns: `300px repeat(${properties.length}, 1fr)` }}>
            <div></div>
            {properties.map((property, index) => (
              <div key={property._id || index} className="text-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-4 relative">
                  <button
                    onClick={() => onRemoveItem && onRemoveItem(property._id || property.location)}
                    className="absolute top-2 right-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="font-bold text-xl mb-2">{property.location || 'Property'}</h3>
                  <p className="text-blue-100 mb-4">{property.city || 'Location'}</p>
                  <div className="text-3xl font-bold mb-2">{formatPrice(property.price_value)}</div>
                  <div className="text-blue-100 text-sm">Total Value</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-gray-800">{property.bedrooms || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Bedrooms</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-gray-800">{property.area || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Sq.Ft</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-sm font-semibold text-gray-800">{property.parking_count || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Parking</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {featureCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <h2 className="text-lg font-semibold text-gray-800">{category.title}</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {category.features.map((feature, featureIndex) => {
                  const bestIndex = getBestValueBadge(properties, feature);
                  
                  return (
                    <div key={feature.key} className="p-6">
                      <div className="grid gap-6" style={{ gridTemplateColumns: `300px repeat(${properties.length}, 1fr)` }}>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">{feature.label}</h3>
                            {feature.priority && (
                              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                                feature.priority === 'high' ? 'bg-red-100 text-red-700' :
                                feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {feature.priority} priority
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {properties.map((property, propertyIndex) => (
                          <div key={propertyIndex} className="relative">
                            {bestIndex === propertyIndex && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  BEST
                                </div>
                              </div>
                            )}
                            <div className={`p-4 rounded-lg ${bestIndex === propertyIndex ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                              {renderFeatureValue(property, feature)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}