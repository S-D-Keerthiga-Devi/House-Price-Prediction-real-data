import React, { useState, useEffect } from 'react'
import { getLocalitiesByCity } from '../../api/house.js'
import axiosInstance from '../../utlis/axiosInstance.js'
import { submitPropertyValuation } from '../../api/buyerApi.js'

// API function to get valuation from backend
const estimateValuation = async (form) => {
  try {
    const response = await axiosInstance.post('/api/valuation/estimate', form);
    return response.data;
  } catch (error) {
    console.error('Error estimating valuation:', error);
    throw error;
  }
}

function PropertyValuation() {
  const [form, setForm] = useState({
    propertyType: 'Apartment',
    bedrooms: 3,
    area: 1000,
    areaUnit: 'Sq. Ft.',
    buildUpType: 'Built-up',
    city: 'Gurgaon',
    location: 'Sector-27',
    possessionStatus: 'Ready To Move',
    coveredParking: 1,
    openParking: 0,
    age: 1,
    furnishingStatus: 'Furnished',
    tower: '1',
    totalTowers: '12',
    floor: 1,
    totalFloors: 12,
    view: 'Garden View',
    facing: 'East',
    name: '',
    mobile: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [localities, setLocalities] = useState([])
  const [loadingLocalities, setLoadingLocalities] = useState(false)
  const [isLocationInputFocused, setIsLocationInputFocused] = useState(false)

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  // Fetch localities data from the database
  const fetchLocalities = async (city) => {
    if (!city) return;

    setLoadingLocalities(true);
    try {
      const response = await getLocalitiesByCity(city);
      if (response.success && Array.isArray(response.localities)) {
        // Use localities directly from database
        setLocalities(response.localities);
      } else {
        setLocalities([]);
      }
    } catch (error) {
      console.error('Error fetching localities from database:', error);
      setLocalities([]);
    } finally {
      setLoadingLocalities(false);
    }
  }

  // Load localities when city changes
  useEffect(() => {
    fetchLocalities(form.city);
  }, [form.city])

  // Handle search query change - only use database localities
  useEffect(() => {
    if (!isLocationInputFocused) {
      return; // Don't show suggestions if input is not focused
    }

    if (searchQuery.length >= 1) {
      // Filter database localities only
      const filteredDatabaseLocations = localities.filter(location =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Create suggestions from database localities only
      const databaseSuggestions = filteredDatabaseLocations.map(location => ({
        display_name: location,
        location: location,
        isLocal: true,
        source: 'database'
      }));

      // Set only database suggestions
      setLocationSuggestions(databaseSuggestions);
    } else {
      // Show all localities when input is clicked but no search query
      const allSuggestions = localities.map(location => ({
        display_name: location,
        location: location,
        isLocal: true,
        source: 'database'
      }));
      setLocationSuggestions(allSuggestions);
    }
  }, [searchQuery, localities, isLocationInputFocused])

  // Handle location selection - only from database
  const handleLocationSelect = (suggestion) => {
    // Only handle database suggestions
    if (suggestion.isLocal && suggestion.source === 'database') {
      setSearchQuery(suggestion.display_name);
      setField('location', suggestion.location);
    }

    // Close suggestions dropdown and remove focus
    setLocationSuggestions([]);
    setIsLocationInputFocused(false);
  }

  // Handle next step with validation
  const handleNextStep = () => {
    // Validate required fields for step 1
    if (currentStep === 1) {
      const step1RequiredFields = ['propertyType', 'area', 'city', 'location', 'bedrooms'];
      const missingFields = step1RequiredFields.filter(field => !form[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()

    // Validate required fields based on step
    if (currentStep === 3) {
      // Validate contact info
      const contactFields = ['name', 'mobile', 'email'];
      const missingFields = contactFields.filter(field => !form[field] || !form[field].trim());

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Validate mobile number
      if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit mobile number');
        return;
      }
    } else {
      // Validate property fields
      const requiredFields = ['propertyType', 'area', 'city', 'location', 'bedrooms'];
      const missingFields = requiredFields.filter(field => !form[field]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    if (currentStep === 3) {
      // Final submission
      setLoading(true)
      try {
        // Ensure we're sending the correct location value and map to model requirements
        const formData = {
          name: form.name.trim(),
          mobile: form.mobile.replace(/\D/g, ''), // Remove non-digits
          email: form.email.trim(),
          propertyType: form.propertyType,
          city: form.city,
          area: String(form.area), // Model expects String
          location: form.location || searchQuery,
          bedrooms: form.bedrooms,
          areaUnit: form.areaUnit,
          buildUpType: form.buildUpType,
          possessionStatus: form.possessionStatus,
          coveredParking: form.coveredParking,
          openParking: form.openParking,
          age: form.age,
          furnishingStatus: form.furnishingStatus,
          tower: form.tower,
          totalTowers: form.totalTowers,
          floor: form.floor,
          totalFloors: form.totalFloors,
          view: form.view,
          facing: form.facing
        };

        // Save the lead data to MongoDB
        await submitPropertyValuation(formData);

        // Get valuation estimate
        const valuationData = {
          ...form,
          location: form.location || searchQuery
        };
        const res = await estimateValuation(valuationData)

        if (res && res.success) {
          setResult(res)
          setCurrentStep(4) // Move to result step
        } else {
          throw new Error(res?.message || 'Failed to get property valuation');
        }
      } catch (error) {
        console.error('Error during valuation:', error);

        // Enhanced error handling with more specific messages
        let errorMessage = 'Failed to get property valuation. Please try again.';

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 404) {
            errorMessage = 'The valuation service is currently unavailable. Please try again later.';
          } else if (error.response.status === 400) {
            errorMessage = error.response.data?.message || 'Please check your input data and try again.';
          } else if (error.response.status === 500) {
            errorMessage = error.response.data?.message || 'Our servers are experiencing issues. Please try again later.';
          }
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = 'Unable to connect to the valuation service. Please check your internet connection.';
        }

        alert(errorMessage);
      } finally {
        setLoading(false)
      }
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mt-20 mb-10">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="text-center p-6 border-b border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#1e3a8a' }}>
            Property Valuation
          </h1>
          <p className="text-gray-600 text-sm">Get an accurate estimate of your property's market value</p>

          {/* Progress indicator */}
          <div className="flex justify-center items-center mt-4 px-4">
            <div className="flex items-center w-full max-w-xs">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1 Card */}
          {currentStep === 1 && (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
                  Basic Details
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Property Type<span className="text-red-500"> *</span>
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={e => setField('propertyType', e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    {['Apartment', 'Independent Floor', 'Independent House', 'Villa', 'Studio', 'Penthouse', 'Plot'].map(pt =>
                      <option key={pt}>{pt}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Project/Locality<span className="text-red-500"> *</span>
                  </label>
                  <div className="relative">
                    <input
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsLocationInputFocused(true);
                      }}
                      onFocus={() => {
                        setIsLocationInputFocused(true);
                        // Show all localities when focused
                        if (searchQuery.length === 0) {
                          const allSuggestions = localities.map(location => ({
                            display_name: location,
                            location: location,
                            isLocal: true,
                            source: 'database'
                          }));
                          setLocationSuggestions(allSuggestions);
                        }
                      }}
                      onBlur={() => {
                        // Delay to allow click event to fire first
                        setTimeout(() => {
                          setIsLocationInputFocused(false);
                          // If location is selected, keep the searchQuery, otherwise clear suggestions
                          if (form.location && form.location === searchQuery) {
                            // Location is selected, keep it
                          } else if (form.location) {
                            // Update searchQuery to match selected location
                            setSearchQuery(form.location);
                          }
                        }, 200);
                      }}
                      placeholder="Click or type to search localities from database"
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                    {isLocationInputFocused && locationSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {locationSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent blur before click
                              handleLocationSelect(suggestion);
                            }}
                          >
                            {suggestion.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                    {isLocationInputFocused && searchQuery.length >= 1 && locationSuggestions.length === 0 && !loadingLocalities && form.location !== searchQuery && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
                        <p className="text-sm text-gray-500">No localities found in database for "{searchQuery}". Please check the spelling or try a different search term.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: '#1e3a8a' }}>
                    Select Unit Type<span className="text-red-500"> *</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                    {[1, '1.5', 2, '2.5', 3, '3.5', 4, 5].map(b => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setField('bedrooms', parseFloat(b))}
                        className="px-3 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all hover:shadow-md"
                        style={String(form.bedrooms) === String(b) ?
                          { backgroundColor: '#1e3a8a', color: 'white', borderColor: '#1e3a8a' } :
                          { backgroundColor: 'white', color: '#1e3a8a', borderColor: '#e5e7eb' }
                        }
                      >
                        {b} BHK
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Area<span className="text-red-500"> *</span>
                    </label>
                    <input
                      type="number"
                      value={form.area}
                      onChange={e => setField('area', Number(e.target.value))}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>Unit</label>
                    <select
                      value={form.areaUnit}
                      onChange={e => setField('areaUnit', e.target.value)}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {['Sq. Ft.', 'Sq. M.', 'Sq. Yd.'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>Type</label>
                    <select
                      value={form.buildUpType}
                      onChange={e => setField('buildUpType', e.target.value)}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {['Built-up', 'Super Built-up', 'Carpet'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      City<span className="text-red-500"> *</span>
                    </label>
                    <input
                      value={form.city}
                      readOnly
                      className="w-full border-2 rounded-lg px-4 py-2.5 bg-gray-50"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Location<span className="text-red-500"> *</span>
                    </label>
                    <input
                      value={form.location}
                      readOnly
                      className="w-full border-2 rounded-lg px-4 py-2.5 bg-gray-50"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg w-full"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 Card */}
          {currentStep === 2 && (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
                  Additional Details
                </h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Possession Status
                    </label>
                    <select
                      value={form.possessionStatus}
                      onChange={e => setField('possessionStatus', e.target.value)}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {['Ready To Move', 'Under Construction'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Covered Parking
                    </label>
                    <input
                      type="number"
                      value={form.coveredParking}
                      onChange={e => setField('coveredParking', Number(e.target.value))}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Age of Property
                    </label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={e => setField('age', Number(e.target.value))}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Furnishing Status
                    </label>
                    <select
                      value={form.furnishingStatus}
                      onChange={e => setField('furnishingStatus', e.target.value)}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {['Unfurnished', 'Semi Furnished', 'Fully Furnished', 'Furnished'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Tower or Block / Unit No
                  </label>
                  <div className="flex items-center w-full border-2 rounded-lg px-4 py-2.5" style={{ borderColor: '#e5e7eb' }}>
                    <input
                      type="text"
                      value={form.tower}
                      onChange={e => setField('tower', e.target.value)}
                      className="w-1/2 focus:outline-none"
                      placeholder="1"
                    />
                    <span className="mx-2 text-gray-500">/</span>
                    <input
                      type="text"
                      value={form.totalTowers}
                      onChange={e => setField('totalTowers', e.target.value)}
                      className="w-1/2 focus:outline-none"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Floor Number / Total Floors in the Building
                  </label>
                  <div className="flex items-center w-full border-2 rounded-lg px-4 py-2.5" style={{ borderColor: '#e5e7eb' }}>
                    <input
                      type="number"
                      value={form.floor}
                      onChange={e => setField('floor', Number(e.target.value))}
                      className="w-1/2 focus:outline-none"
                      placeholder="1"
                    />
                    <span className="mx-2 text-gray-500">/</span>
                    <input
                      type="number"
                      value={form.totalFloors}
                      onChange={e => setField('totalFloors', Number(e.target.value))}
                      className="w-1/2 focus:outline-none"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      View of Property
                    </label>
                    <select
                      value={form.view}
                      onChange={e => setField('view', e.target.value)}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {['Standard', 'Garden View', 'Park View', 'Club View', 'Pool View'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                      Facing
                    </label>
                    <select
                      value={form.facing}
                      onChange={e => setField('facing', e.target.value)}
                      className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {['East', 'West', 'North', 'South', 'North-East', 'South-East'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between gap-4 pt-6">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-lg border-2 font-semibold transition-all hover:shadow-md w-1/3"
                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg w-2/3"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="w-full">
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#1e3a8a' }}>
                  Contact Information
                </h2>
                <p className="text-gray-600 text-sm mt-1">We need your details to send you the valuation report</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Full Name<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setField('name', e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Mobile Number<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={e => setField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                    Email Address<span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="flex justify-between gap-4 pt-6">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-lg border-2 font-semibold transition-all hover:shadow-md w-1/3"
                    style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-70 w-2/3"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    {loading ? 'Calculating...' : 'Get Valuation'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Card */}
          {currentStep === 4 && result && (
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 w-full" style={{ borderColor: '#1e3a8a' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold" style={{ color: '#1e3a8a' }}>
                  Estimated Property Value
                </h3>
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                  Step 4/4
                </span>
              </div>

              {/* Estimated Price - Large Display */}
              <div className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                ₹ {result.estimatedPrice?.toLocaleString('en-IN') || '0'}
              </div>

              {/* Property Details */}
              <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                <div>
                  <span className="text-sm font-medium">Rate per sq.ft:</span>
                  <span className="ml-2 font-semibold" style={{ color: '#1e3a8a' }}>
                    ₹ {result.ratePerSqft?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Total Area:</span>
                  <span className="ml-2 font-semibold" style={{ color: '#1e3a8a' }}>
                    {result.breakdown?.areaSqft || form.area || '0'} sq.ft
                  </span>
                </div>
              </div>

              {/* Property Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Property Type:</span>
                    <span className="ml-2 font-semibold text-gray-800">{form.propertyType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-semibold text-gray-800">{form.location || form.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="ml-2 font-semibold text-gray-800">{form.bedrooms} BHK</span>
                  </div>
                  <div>
                    <span className="text-gray-600">City:</span>
                    <span className="ml-2 font-semibold text-gray-800">{form.city}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setResult(null);
                    setForm({
                      ...form,
                      name: '',
                      mobile: '',
                      email: ''
                    });
                  }}
                  className="w-full px-6 py-3 rounded-lg border-2 font-semibold transition-all hover:shadow-md"
                  style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
                >
                  Start New Valuation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PropertyValuation