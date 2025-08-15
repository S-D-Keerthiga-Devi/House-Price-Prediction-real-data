import React, { useState } from 'react';

const Comparator = ({ properties = [] }) => {
  const [selectedProperties, setSelectedProperties] = useState(properties);

  // Default sample data if no properties provided
  const defaultProperties = [
    {
      id: 1,
      name: "Skyline Towers",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop",
      price: "₹1.2 Cr",
      builderReputation: 4.5,
      location: "Banjara Hills",
      locationScore: 9.2,
      lifestyleIndex: 8.7,
      valuation: 95,
      neighbourhoodClass: "Premium",
      schoolsNearby: 8,
      hospitalsNearby: 6,
      collegesNearby: 12,
      metroDistance: 0.8,
      aqi: 45,
      greenCover: 35,
      noiseLevel: 55,
      trafficScore: 7.2,
      fiveYearGrowth: 85,
      investmentPotential: 9.1,
      internationalRanking: 142,
      marketTrend: "Rising"
    },
    {
      id: 2,
      name: "Green Valley Residency",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop",
      price: "₹85 Lac",
      builderReputation: 4.2,
      location: "Gachibowli",
      locationScore: 8.8,
      lifestyleIndex: 8.2,
      valuation: 88,
      neighbourhoodClass: "Upper Middle",
      schoolsNearby: 6,
      hospitalsNearby: 4,
      collegesNearby: 8,
      metroDistance: 1.2,
      aqi: 38,
      greenCover: 42,
      noiseLevel: 48,
      trafficScore: 8.1,
      fiveYearGrowth: 92,
      investmentPotential: 8.8,
      internationalRanking: 98,
      marketTrend: "Stable"
    },
    {
      id: 3,
      name: "Urban Heights",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&h=200&fit=crop",
      price: "₹75 Lac",
      builderReputation: 3.8,
      location: "Kondapur",
      locationScore: 8.1,
      lifestyleIndex: 7.9,
      valuation: 82,
      neighbourhoodClass: "Middle",
      schoolsNearby: 5,
      hospitalsNearby: 3,
      collegesNearby: 6,
      metroDistance: 2.1,
      aqi: 52,
      greenCover: 28,
      noiseLevel: 62,
      trafficScore: 6.8,
      fiveYearGrowth: 78,
      investmentPotential: 7.6,
      internationalRanking: 201,
      marketTrend: "Declining"
    }
  ];

  const propertiesData = selectedProperties.length > 0 ? selectedProperties : defaultProperties;

  const metrics = [
    {
      key: 'builderReputation',
      label: 'Builder Reputation',
      icon: '🏗️',
      type: 'rating',
      unit: '/5',
      higher: true
    },
    {
      key: 'locationScore',
      label: 'Location Score',
      icon: '📍',
      type: 'score',
      unit: '/10',
      higher: true
    },
    {
      key: 'lifestyleIndex',
      label: 'Lifestyle Index',
      icon: '🏖️',
      type: 'score',
      unit: '/10',
      higher: true
    },
    {
      key: 'valuation',
      label: 'Valuation Score',
      icon: '💰',
      type: 'percentage',
      unit: '%',
      higher: true
    },
    {
      key: 'neighbourhoodClass',
      label: 'Neighbourhood Class',
      icon: '🏘️',
      type: 'text',
      unit: '',
      higher: true
    },
    {
      key: 'schoolsNearby',
      label: 'Schools Nearby',
      icon: '🏫',
      type: 'count',
      unit: '',
      higher: true
    },
    {
      key: 'hospitalsNearby',
      label: 'Hospitals Nearby',
      icon: '🏥',
      type: 'count',
      unit: '',
      higher: true
    },
    {
      key: 'collegesNearby',
      label: 'Colleges Nearby',
      icon: '📚',
      type: 'count',
      unit: '',
      higher: true
    },
    {
      key: 'metroDistance',
      label: 'Metro Distance',
      icon: '🚇',
      type: 'distance',
      unit: ' km',
      higher: false
    },
    {
      key: 'aqi',
      label: 'Air Quality Index',
      icon: '🌬️',
      type: 'aqi',
      unit: '',
      higher: false
    },
    {
      key: 'greenCover',
      label: 'Green Cover',
      icon: '🌳',
      type: 'percentage',
      unit: '%',
      higher: true
    },
    {
      key: 'noiseLevel',
      label: 'Noise Level',
      icon: '🔊',
      type: 'noise',
      unit: ' dB',
      higher: false
    },
    {
      key: 'trafficScore',
      label: 'Traffic Score',
      icon: '🚦',
      type: 'score',
      unit: '/10',
      higher: true
    },
    {
      key: 'fiveYearGrowth',
      label: '5-Year Growth',
      icon: '📈',
      type: 'percentage',
      unit: '%',
      higher: true
    },
    {
      key: 'investmentPotential',
      label: 'Investment Potential',
      icon: '💎',
      type: 'score',
      unit: '/10',
      higher: true
    },
    {
      key: 'internationalRanking',
      label: 'International Ranking',
      icon: '🌍',
      type: 'ranking',
      unit: '',
      higher: false
    },
    {
      key: 'marketTrend',
      label: 'Market Trend',
      icon: '📊',
      type: 'trend',
      unit: '',
      higher: true
    }
  ];

  const getBestValueIndex = (metric, properties) => {
    const values = properties.map(p => p[metric.key]);
    
    if (metric.type === 'text' || metric.type === 'trend') {
      const priority = {
        'Premium': 3, 'Upper Middle': 2, 'Middle': 1,
        'Rising': 3, 'Stable': 2, 'Declining': 1
      };
      const maxValue = Math.max(...values.map(v => priority[v] || 0));
      return values.findIndex(v => priority[v] === maxValue);
    }
    
    if (metric.higher) {
      const maxValue = Math.max(...values);
      return values.indexOf(maxValue);
    } else {
      const minValue = Math.min(...values);
      return values.indexOf(minValue);
    }
  };

  const getProgressBarColor = (value, metric) => {
    if (metric.type === 'aqi') {
      if (value <= 50) return 'bg-green-500';
      if (value <= 100) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    if (metric.type === 'noise') {
      if (value <= 50) return 'bg-green-500';
      if (value <= 65) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    return 'bg-[#27AE60]';
  };

  const getProgressBarWidth = (value, metric, allValues) => {
    if (metric.type === 'percentage' || metric.type === 'rating') {
      return `${Math.min(value * (metric.type === 'rating' ? 20 : 1), 100)}%`;
    }
    if (metric.type === 'score') {
      return `${(value / 10) * 100}%`;
    }
    if (metric.type === 'distance') {
      const maxDistance = Math.max(...allValues);
      return `${(value / maxDistance) * 100}%`;
    }
    if (metric.type === 'aqi' || metric.type === 'noise') {
      return `${Math.min((value / 150) * 100, 100)}%`;
    }
    if (metric.type === 'count') {
      const maxCount = Math.max(...allValues);
      return `${(value / maxCount) * 100}%`;
    }
    if (metric.type === 'ranking') {
      const maxRank = Math.max(...allValues);
      return `${((maxRank - value) / maxRank) * 100}%`;
    }
    return '0%';
  };

  const formatValue = (value, metric) => {
    if (metric.type === 'rating') {
      return `${value}${metric.unit}`;
    }
    if (metric.type === 'trend') {
      const trendEmojis = { 'Rising': '📈', 'Stable': '➡️', 'Declining': '📉' };
      return `${trendEmojis[value] || '➡️'} ${value}`;
    }
    return `${value}${metric.unit}`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
            Property Comparator
          </h1>
          <p className="text-[#34495E] text-lg">
            Compare properties side-by-side across multiple metrics
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Property Headers */}
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
            <div className="p-4 bg-[#2C3E50] text-white font-medium">
              <span className="hidden md:block">Metrics</span>
              <span className="md:hidden">Properties</span>
            </div>
            {propertiesData.map((property, index) => (
              <div key={property.id} className="p-4 border-l border-gray-200">
                <div className="text-center">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-16 h-16 rounded-lg mx-auto mb-2 object-cover"
                  />
                  <h3 className="font-semibold text-[#2C3E50] text-sm">
                    {property.name}
                  </h3>
                  <p className="text-[#27AE60] font-bold text-lg">
                    {property.price}
                  </p>
                  <p className="text-[#34495E] text-xs">
                    {property.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Metrics Rows */}
          <div className="divide-y divide-gray-200">
            {metrics.map((metric) => {
              const bestIndex = getBestValueIndex(metric, propertiesData);
              const allValues = propertiesData.map(p => p[metric.key]);
              
              return (
                <div key={metric.key} className="grid grid-cols-1 md:grid-cols-4">
                  {/* Metric Label */}
                  <div className="p-4 bg-gray-50 font-medium text-[#2C3E50] flex items-center">
                    <span className="text-lg mr-2">{metric.icon}</span>
                    <span className="text-sm">{metric.label}</span>
                  </div>
                  
                  {/* Property Values */}
                  {propertiesData.map((property, index) => {
                    const value = property[metric.key];
                    const isBest = index === bestIndex;
                    
                    return (
                      <div
                        key={`${property.id}-${metric.key}`}
                        className={`p-4 border-l border-gray-200 ${
                          isBest ? 'bg-[#DFF6DD] border-l-[#27AE60] border-l-4' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#34495E] font-medium text-sm">
                            {formatValue(value, metric)}
                          </span>
                          {isBest && <span className="text-lg">⭐️</span>}
                        </div>
                        
                        {/* Progress Bar for numeric values */}
                        {metric.type !== 'text' && metric.type !== 'trend' && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(value, metric)}`}
                              style={{ 
                                width: getProgressBarWidth(value, metric, allValues)
                              }}
                            ></div>
                          </div>
                        )}
                        
                        {/* Special indicators */}
                        {metric.type === 'aqi' && (
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              value <= 50 ? 'bg-green-100 text-green-800' :
                              value <= 100 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {value <= 50 ? 'Good' :
                               value <= 100 ? 'Moderate' : 'Unhealthy'}
                            </span>
                          </div>
                        )}
                        
                        {metric.type === 'noise' && (
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              value <= 50 ? 'bg-green-100 text-green-800' :
                              value <= 65 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {value <= 50 ? 'Quiet' :
                               value <= 65 ? 'Moderate' : 'Noisy'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {propertiesData.map((property, index) => {
            const winCount = metrics.filter(metric => 
              getBestValueIndex(metric, propertiesData) === index
            ).length;
            
            return (
              <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-4">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-20 h-20 rounded-lg mx-auto mb-3 object-cover"
                  />
                  <h3 className="font-bold text-[#2C3E50] text-lg">
                    {property.name}
                  </h3>
                  <p className="text-[#27AE60] font-bold text-xl">
                    {property.price}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-[#F9FAFB] rounded-lg p-4">
                    <div className="text-2xl font-bold text-[#27AE60] mb-1">
                      {winCount}
                    </div>
                    <div className="text-[#34495E] text-sm">
                      Best in {winCount} metrics
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className={`w-full bg-gray-200 rounded-full h-3`}>
                      <div
                        className="bg-[#27AE60] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(winCount / metrics.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-[#34495E] mt-1">
                      Overall Score: {Math.round((winCount / metrics.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <button className="bg-[#27AE60] hover:bg-[#2ECC71] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Download Comparison Report
          </button>
          <button className="bg-[#2980B9] hover:bg-[#3498DB] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Add More Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comparator;