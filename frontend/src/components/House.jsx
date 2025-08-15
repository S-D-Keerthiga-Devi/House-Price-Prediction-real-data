import React, { useState } from 'react';

const House = () => {
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    budget: '',
    area: '',
    landmark: ''
  });

  const handleRequirementToggle = (requirement) => {
    setSelectedRequirements(prev => 
      prev.includes(requirement) 
        ? prev.filter(r => r !== requirement)
        : [...prev, requirement]
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const requirements = [
    { id: '2bhk', label: '2 BHK Flat', icon: '🏠' },
    { id: '3bhk', label: '3 BHK Flat', icon: '🏡' },
    { id: 'independent', label: 'Independent House', icon: '🏘️' },
    { id: 'villa', label: 'Villa', icon: '🏰' },
    { id: 'farmhouse', label: 'Farmhouse', icon: '🏞️' },
    { id: 'plot', label: 'Plot', icon: '📐' },
    { id: 'office', label: 'Commercial Office Space', icon: '🏢' },
    { id: 'shops', label: 'Shops', icon: '🏪' },
    { id: 'agricultural', label: 'Agricultural Land', icon: '🌾' }
  ];

  const dummyProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      name: 'Modern Villa in Banjara Hills',
      price: '₹1.2 Cr',
      location: 'Banjara Hills, Hyderabad',
      area: '2500 sq ft',
      type: '3 BHK Villa',
      features: ['Swimming Pool', 'Garden', 'Parking']
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
      name: 'Luxury Apartment in Jubilee Hills',
      price: '₹85 Lac',
      location: 'Jubilee Hills, Hyderabad',
      area: '1800 sq ft',
      type: '2 BHK Flat',
      features: ['Gym', 'Club House', 'Security']
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
      name: 'Independent House in Gachibowli',
      price: '₹95 Lac',
      location: 'Gachibowli, Hyderabad',
      area: '2200 sq ft',
      type: 'Independent House',
      features: ['Terrace', 'Parking', 'Modern Kitchen']
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      name: 'Commercial Office Space',
      price: '₹50 Lac',
      location: 'HITEC City, Hyderabad',
      area: '1200 sq ft',
      type: 'Office Space',
      features: ['AC', 'Elevator', 'Parking']
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop',
      name: 'Farmhouse with Large Plot',
      price: '₹75 Lac',
      location: 'Shamirpet, Hyderabad',
      area: '5000 sq ft',
      type: 'Farmhouse',
      features: ['Bore Well', 'Fruit Trees', 'Boundary Wall']
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
      name: 'Retail Shop in Commercial Complex',
      price: '₹35 Lac',
      location: 'Ameerpet, Hyderabad',
      area: '800 sq ft',
      type: 'Shop',
      features: ['Main Road', 'High Footfall', 'Parking']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
            House Price Prediction
          </h1>
          <p className="text-[#34495E] text-lg">
            Find your perfect property with smart price predictions
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">Search Filters</h2>
          
          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#34495E] mb-2">
                Location
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-transparent"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                aria-label="Select location"
              >
                <option value="">Select Location</option>
                <option value="banjara-hills">Banjara Hills</option>
                <option value="jubilee-hills">Jubilee Hills</option>
                <option value="gachibowli">Gachibowli</option>
                <option value="hitec-city">HITEC City</option>
                <option value="kondapur">Kondapur</option>
                <option value="kukatpally">Kukatpally</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#34495E] mb-2">
                Budget Range
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-transparent"
                value={filters.budget}
                onChange={(e) => handleFilterChange('budget', e.target.value)}
                aria-label="Select budget range"
              >
                <option value="">Select Budget</option>
                <option value="20-40">₹20L - ₹40L</option>
                <option value="40-60">₹40L - ₹60L</option>
                <option value="60-80">₹60L - ₹80L</option>
                <option value="80-100">₹80L - ₹1Cr</option>
                <option value="100-150">₹1Cr - ₹1.5Cr</option>
                <option value="150+">₹1.5Cr+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#34495E] mb-2">
                Area (sq ft)
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-transparent"
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                aria-label="Select area range"
              >
                <option value="">Select Area</option>
                <option value="500-1000">500 - 1000 sq ft</option>
                <option value="1000-1500">1000 - 1500 sq ft</option>
                <option value="1500-2000">1500 - 2000 sq ft</option>
                <option value="2000-2500">2000 - 2500 sq ft</option>
                <option value="2500+">2500+ sq ft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#34495E] mb-2">
                Nearby Landmark
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-transparent"
                value={filters.landmark}
                onChange={(e) => handleFilterChange('landmark', e.target.value)}
                aria-label="Select nearby landmark"
              >
                <option value="">Select Landmark</option>
                <option value="metro-station">Metro Station</option>
                <option value="hospital">Hospital</option>
                <option value="school">School/College</option>
                <option value="mall">Shopping Mall</option>
                <option value="airport">Airport</option>
                <option value="it-park">IT Park</option>
              </select>
            </div>
          </div>

          {/* Property Type Requirements */}
          <div>
            <h3 className="text-lg font-medium text-[#2C3E50] mb-4">Property Type Requirements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  onClick={() => handleRequirementToggle(req.id)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedRequirements.includes(req.id)
                      ? 'border-[#27AE60] bg-[#27AE60] text-white'
                      : 'border-gray-200 bg-white text-[#34495E] hover:border-[#27AE60]'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedRequirements.includes(req.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRequirementToggle(req.id);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{req.icon}</div>
                    <div className="text-sm font-medium">{req.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 text-center">
            <button className="bg-[#2980B9] hover:bg-[#3498DB] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2980B9] focus:ring-offset-2">
              Search Properties
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-2xl font-semibold text-[#2C3E50] mb-2 sm:mb-0">
              Available Properties
            </h2>
            <div className="text-[#34495E]">
              Showing {dummyProperties.length} results
            </div>
          </div>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#27AE60] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {property.price}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                  {property.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-[#34495E] text-sm">
                    <span className="w-2 h-2 bg-[#27AE60] rounded-full mr-2"></span>
                    {property.location}
                  </div>
                  <div className="flex items-center text-[#34495E] text-sm">
                    <span className="w-2 h-2 bg-[#2980B9] rounded-full mr-2"></span>
                    {property.area} • {property.type}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#F9FAFB] text-[#34495E] text-xs rounded-md border"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-[#27AE60] hover:bg-[#2ECC71] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:ring-offset-2">
                  Compare Property
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="bg-white hover:bg-gray-50 text-[#2980B9] border-2 border-[#2980B9] px-8 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2980B9] focus:ring-offset-2">
            Load More Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default House;