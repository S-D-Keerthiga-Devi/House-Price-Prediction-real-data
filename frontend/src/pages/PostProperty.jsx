import React, { useState, useEffect, useRef } from 'react'
import { Home, FileText, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Upload, Plus } from 'lucide-react'
import { getCities, getLocalitiesByCity } from '../api/house'
import { submitPostProperty } from '../api/ownerApi'

function PostProperty() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    transactionType: '',
    buildingType: '',
    propertyType: '',
    city: '',
    projectName: '',
    locality: '',
    rooms: '',
    area: '',
    price: '',
    possessionStatus: '',
    furnishingStatus: '',
    bathrooms: '',
    coveredParking: '',
    openParking: '',
    floorNumber: '',
    totalFloors: '',
    amenities: [],
    propertyKeywords: [],
    propertyDescription: '',
    agreeTerms: false,
    ownerName: '',
    mobile: '',
    email: '',
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false)
  const [cities, setCities] = useState([])
  const [localities, setLocalities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingLocalities, setLoadingLocalities] = useState(false)
  const [allowCustomLocality, setAllowCustomLocality] = useState(false)
  const cityInputRef = useRef(null)
  const localityInputRef = useRef(null)

  const propertyTypes = {
    residential: ['Apartment', 'Villa', 'Plot', 'Builder Floor', 'Penthouse'],
    commercial: ['Office Space', 'IT Park/SEZ', 'Shop', 'Warehouse']
  }

  const allAmenities = [
    'Gymnasium', 'Swimming Pool', 'Badminton Court', 'Tennis Court',
    'Kids Play Area', 'Power Backup', 'Central AC', 'Central Wi-Fi',
    '24x7 Security', 'Clubhouse', 'Parking', 'Lift'
  ]

  const propertyKeywords = ['Reputed Builder', 'Well Ventilated', 'Fully Renovated', 'Vastu Compliant', 'Spacious', 'Prime Location']

  // Fetch all cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true)
      try {
        const response = await getCities()
        if (response.success && response.cities) {
          setCities(response.cities)
        } else {
          // Fallback to external API if backend fails
          try {
            const fallbackRes = await fetch(
              'https://countriesnow.space/api/v0.1/countries/cities',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: 'India' }),
              }
            )
            const fallbackData = await fallbackRes.json()
            if (fallbackData.data && Array.isArray(fallbackData.data)) {
              setCities(fallbackData.data.sort())
            }
          } catch (fallbackErr) {
            console.error('Error fetching cities from fallback API:', fallbackErr)
            // Set default cities as last resort
            setCities(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Gurgaon', 'Noida'])
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        // Set default cities as fallback
        setCities(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Gurgaon', 'Noida'])
      } finally {
        setLoadingCities(false)
      }
    }
    fetchCities()
  }, [])

  // Fetch localities when city changes
  useEffect(() => {
    const fetchLocalities = async () => {
      if (!formData.city) {
        setLocalities([])
        return
      }
      
      setLoadingLocalities(true)
      setLocalities([])
      try {
        const response = await getLocalitiesByCity(formData.city)
        if (response.success && response.localities) {
          setLocalities(response.localities)
        } else {
          setLocalities([])
        }
      } catch (error) {
        console.error('Error fetching localities:', error)
        setLocalities([])
      } finally {
        setLoadingLocalities(false)
      }
    }
    fetchLocalities()
  }, [formData.city])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
        setCityDropdownOpen(false)
      }
      if (localityInputRef.current && !localityInputRef.current.contains(event.target)) {
        setLocalityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'city') {
      setFormData({ ...formData, city: value, locality: '' })
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleCitySelect = (city) => {
    setFormData({ ...formData, city: city, locality: '' })
    setCityDropdownOpen(false)
    setAllowCustomLocality(false)
    if (errors.city) setErrors({ ...errors, city: '' })
  }

  const handleLocalitySelect = (locality) => {
    setFormData({ ...formData, locality: locality })
    setLocalityDropdownOpen(false)
    setAllowCustomLocality(false)
    if (errors.locality) setErrors({ ...errors, locality: '' })
  }

  const handleLocalityInputChange = (e) => {
    const value = e.target.value
    setFormData({ ...formData, locality: value })
    setLocalityDropdownOpen(true)
    if (errors.locality) setErrors({ ...errors, locality: '' })
    // Check if the entered value matches any locality in the list
    const isInList = localities.some(loc => loc.toLowerCase() === value.toLowerCase())
    setAllowCustomLocality(value.trim() !== '' && !isInList)
  }

  const handleCustomLocalityConfirm = () => {
    if (formData.locality.trim()) {
      setLocalityDropdownOpen(false)
      // Keep allowCustomLocality true so user knows it's a custom entry
    }
  }

  const handleLocalityKeyDown = (e) => {
    // Allow Enter key to confirm custom locality
    if (e.key === 'Enter' && formData.locality.trim()) {
      setLocalityDropdownOpen(false)
      e.preventDefault()
    }
  }

  const toggleArrayItem = (array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item]
  }

  const handleKeywordToggle = (category, keyword) => {
    setFormData({ ...formData, [category]: toggleArrayItem(formData[category], keyword) })
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.transactionType) newErrors.transactionType = 'Required'
    if (!formData.buildingType) newErrors.buildingType = 'Required'
    if (!formData.propertyType) newErrors.propertyType = 'Required'
    if (!formData.city.trim()) newErrors.city = 'Required'
    if (!formData.locality.trim()) newErrors.locality = 'Required'
    if (!formData.rooms) newErrors.rooms = 'Required'
    if (!formData.area.trim()) newErrors.area = 'Required'
    if (!formData.price.trim()) newErrors.price = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.possessionStatus) newErrors.possessionStatus = 'Required'
    if (!formData.furnishingStatus) newErrors.furnishingStatus = 'Required'
    if (!formData.bathrooms) newErrors.bathrooms = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to continue'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAndContinue = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
      window.scrollTo(0, 0)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return
    
    setIsSubmitting(true)
    
    try {
      // Map form data to match the model requirements
      const submissionData = {
        ownerName: formData.ownerName.trim(),
        mobile: formData.mobile.replace(/\D/g, ''), // Remove non-digits
        email: formData.email.trim(),
        propertyType: formData.propertyType,
        city: formData.city,
        locality: formData.locality,
        price: formData.price,
        area: formData.area,
        bedrooms: formData.rooms,
        description: formData.propertyDescription || `${formData.transactionType} ${formData.propertyType} in ${formData.locality}, ${formData.city}`
      }

      await submitPostProperty(submissionData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting property:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostAnother = () => {
    setIsSubmitted(false)
    setCurrentStep(1)
      setFormData({
        transactionType: '',
        buildingType: '',
        propertyType: '',
        city: '',
        projectName: '',
        locality: '',
        rooms: '',
        area: '',
        price: '',
        possessionStatus: '',
        furnishingStatus: '',
        bathrooms: '',
        coveredParking: '',
        openParking: '',
        floorNumber: '',
        totalFloors: '',
        amenities: [],
        propertyKeywords: [],
        propertyDescription: '',
        agreeTerms: false,
        ownerName: '',
        mobile: '',
        email: '',
      })
    setErrors({})
    window.scrollTo(0, 0)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: '#1e3a8a' }}>Success!</h1>
            <p className="text-gray-600 mb-6">Your property has been submitted successfully. Our team will review it within 24 hours.</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold" style={{ color: '#1e3a8a' }}>What's next?</span>
                <br />
                You'll receive a confirmation email shortly with your listing details.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePostAnother}
                className="w-full py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                style={{ backgroundColor: '#1e3a8a' }}
              >
                Post Another Property
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 mt-20">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-1" style={{ color: '#1e3a8a' }}>Post Your Property</h1>
          <p className="text-sm text-gray-600">Fill in the details to list your property</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-md mb-4 p-4">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Property Details', Icon: Home },
              { num: 2, label: 'Additional Info', Icon: FileText },
              { num: 3, label: 'Amenities', Icon: Sparkles }
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                    currentStep >= step.num 
                      ? 'bg-navy-900 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`} style={currentStep >= step.num ? { backgroundColor: '#1e3a8a' } : {}}>
                    <step.Icon size={18} />
                  </div>
                  <span className={`text-xs font-medium ${
                    currentStep >= step.num ? 'text-navy-900' : 'text-gray-500'
                  }`} style={currentStep >= step.num ? { color: '#1e3a8a' } : {}}>
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-3 rounded transition-all ${
                    currentStep > step.num ? 'bg-navy-900' : 'bg-gray-200'
                  }`} style={currentStep > step.num ? { backgroundColor: '#1e3a8a' } : {}}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* Step 1: Property Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>Property Details</h2>
                
                {/* Listing Type & Building Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Listing For</label>
                    <div className="flex gap-2">
                      {['Sale', 'Rent'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, transactionType: type })}
                          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${
                            formData.transactionType === type
                              ? 'text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={formData.transactionType === type ? { backgroundColor: '#1e3a8a' } : {}}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.transactionType && <p className="mt-1 text-xs text-red-600">{errors.transactionType}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Building Type</label>
                    <div className="flex gap-2">
                      {['Residential', 'Commercial'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, buildingType: type, propertyType: '' })}
                          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${
                            formData.buildingType === type
                              ? 'text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={formData.buildingType === type ? { backgroundColor: '#1e3a8a' } : {}}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.buildingType && <p className="mt-1 text-xs text-red-600">{errors.buildingType}</p>}
                  </div>
                </div>

                {/* Property Type */}
                {formData.buildingType && (
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Property Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {propertyTypes[formData.buildingType.toLowerCase()]?.map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, propertyType: type })}
                          className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                            formData.propertyType === type
                              ? 'text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={formData.propertyType === type ? { backgroundColor: '#1e3a8a' } : {}}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {errors.propertyType && <p className="mt-1 text-xs text-red-600">{errors.propertyType}</p>}
                  </div>
                )}

                {/* City & Locality */}
                <div className="grid grid-cols-2 gap-3">
                  <div ref={cityInputRef}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>City</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => {
                          handleChange(e)
                          setCityDropdownOpen(true)
                        }}
                        onFocus={() => setCityDropdownOpen(true)}
                        name="city"
                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                          errors.city ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                        }`}
                        placeholder={loadingCities ? "Loading cities..." : "Search or select city"}
                      />
                      {cityDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{ borderColor: '#1e3a8a' }}>
                          {loadingCities ? (
                            <div className="px-3 py-2 text-sm text-gray-500">Loading cities...</div>
                          ) : cities.length > 0 ? (
                            cities
                              .filter(city => 
                                !formData.city || 
                                city.toLowerCase().includes(formData.city.toLowerCase())
                              )
                              .slice(0, 100)
                              .map((city) => (
                                <div
                                  key={city}
                                  onClick={() => handleCitySelect(city)}
                                  className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                                >
                                  {city}
                                </div>
                              ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No cities found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>

                  <div ref={localityInputRef}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>
                      Locality
                      {allowCustomLocality && (
                        <span className="ml-1 text-xs text-blue-600 font-normal">(Custom entry)</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={handleLocalityInputChange}
                        onKeyDown={handleLocalityKeyDown}
                        onFocus={() => {
                          if (formData.city) {
                            setLocalityDropdownOpen(true)
                          }
                        }}
                        onBlur={() => {
                          // Delay closing to allow for selection
                          setTimeout(() => {
                            setLocalityDropdownOpen(false)
                          }, 200)
                        }}
                        name="locality"
                        disabled={!formData.city}
                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                          errors.locality ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                        } ${!formData.city ? 'bg-gray-100' : ''} ${
                          allowCustomLocality ? 'border-blue-400' : ''
                        }`}
                        placeholder={
                          !formData.city 
                            ? "Select city first" 
                            : loadingLocalities 
                            ? "Loading localities..." 
                            : "Search locality or type custom"
                        }
                      />
                      {localityDropdownOpen && formData.city && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{ borderColor: '#1e3a8a' }}>
                          {loadingLocalities ? (
                            <div className="px-3 py-2 text-sm text-gray-500">Loading localities...</div>
                          ) : (
                            <>
                              {localities.length > 0 ? (
                                localities
                                  .filter(locality => 
                                    !formData.locality || 
                                    locality.toLowerCase().includes(formData.locality.toLowerCase())
                                  )
                                  .map((locality) => (
                                    <div
                                      key={locality}
                                      onClick={() => handleLocalitySelect(locality)}
                                      className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors"
                                    >
                                      {locality}
                                    </div>
                                  ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                  No localities found for this city
                                </div>
                              )}
                              {/* Option to use custom locality if not found */}
                              {formData.locality && 
                               !localities.some(loc => 
                                 loc.toLowerCase() === formData.locality.toLowerCase()
                               ) && (
                                <div 
                                  onClick={handleCustomLocalityConfirm}
                                  onMouseDown={(e) => e.preventDefault()} // Prevent blur event
                                  className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors border-t border-gray-200 font-medium"
                                  style={{ color: '#1e3a8a' }}
                                >
                                  ✓ Use "{formData.locality}" (Press Enter or click to confirm)
                                </div>
                              )}
                              {/* Message when no localities available but user can still type */}
                              {!loadingLocalities && localities.length === 0 && formData.city && (
                                <div className="px-3 py-2 text-sm text-gray-600 border-t border-gray-200">
                                  No localities found. You can type a custom locality name.
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.locality && <p className="mt-1 text-xs text-red-600">{errors.locality}</p>}
                    {allowCustomLocality && formData.locality && (
                      <p className="mt-1 text-xs text-blue-600">
                        ✓ Custom locality will be saved: "{formData.locality}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Bedrooms</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['Studio', '1', '2', '3', '4', '5+'].map((room) => (
                      <button
                        key={room}
                        onClick={() => setFormData({ ...formData, rooms: room })}
                        className={`py-2 text-sm rounded-lg font-medium transition-all ${
                          formData.rooms === room
                            ? 'text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={formData.rooms === room ? { backgroundColor: '#1e3a8a' } : {}}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                  {errors.rooms && <p className="mt-1 text-xs text-red-600">{errors.rooms}</p>}
                </div>

                {/* Area & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Area (sq ft)</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                        errors.area ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                      }`}
                      placeholder="e.g., 1200"
                    />
                    {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Price (₹)</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                        errors.price ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                      }`}
                      placeholder="e.g., 5000000"
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                  </div>
                </div>

                <button
                  onClick={handleSaveAndContinue}
                  className="w-full py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1e3a8a' }}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Additional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>Additional Information</h2>
                
                {/* Possession & Furnishing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Possession</label>
                    <div className="space-y-2">
                      {['Ready To Move', 'Under Construction'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFormData({ ...formData, possessionStatus: status })}
                          className={`w-full py-2 text-sm rounded-lg font-medium transition-all ${
                            formData.possessionStatus === status
                              ? 'text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={formData.possessionStatus === status ? { backgroundColor: '#1e3a8a' } : {}}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    {errors.possessionStatus && <p className="mt-1 text-xs text-red-600">{errors.possessionStatus}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Furnishing</label>
                    <div className="space-y-2">
                      {['Unfurnished', 'Semi-Furnished', 'Furnished'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFormData({ ...formData, furnishingStatus: status })}
                          className={`w-full py-2 text-xs rounded-lg font-medium transition-all ${
                            formData.furnishingStatus === status
                              ? 'text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={formData.furnishingStatus === status ? { backgroundColor: '#1e3a8a' } : {}}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    {errors.furnishingStatus && <p className="mt-1 text-xs text-red-600">{errors.furnishingStatus}</p>}
                  </div>
                </div>

                {/* Bathrooms & Parking */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Bathrooms</label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none ${
                        errors.bathrooms ? 'border-red-400' : 'border-gray-200'
                      }`}
                      style={{ color: '#1e3a8a' }}
                    >
                      <option value="">Select</option>
                      {['1', '2', '3', '4', '5+'].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                    {errors.bathrooms && <p className="mt-1 text-xs text-red-600">{errors.bathrooms}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Covered Parking</label>
                    <select
                      name="coveredParking"
                      value={formData.coveredParking}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none"
                      style={{ color: '#1e3a8a' }}
                    >
                      <option value="">Select</option>
                      {['0', '1', '2', '3', '4+'].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Open Parking</label>
                    <select
                      name="openParking"
                      value={formData.openParking}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none"
                      style={{ color: '#1e3a8a' }}
                    >
                      <option value="">Select</option>
                      {['0', '1', '2', '3', '4+'].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                  </div>
                </div>

                {/* Floor Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Floor Number</label>
                    <input
                      type="text"
                      name="floorNumber"
                      value={formData.floorNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none"
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Total Floors</label>
                    <input
                      type="text"
                      name="totalFloors"
                      value={formData.totalFloors}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none"
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    onClick={handleSaveAndContinue}
                    className="flex-1 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Amenities & Contact */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>Amenities & Contact Information</h2>
                
                {/* Amenities */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Select Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {allAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-all">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => setFormData({
                            ...formData,
                            amenities: toggleArrayItem(formData.amenities, amenity)
                          })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Keywords */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Property Features</label>
                  <div className="flex flex-wrap gap-2">
                    {propertyKeywords.map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => handleKeywordToggle('propertyKeywords', keyword)}
                        className={`px-3 py-1 text-xs rounded-full transition-all ${
                          formData.propertyKeywords.includes(keyword)
                            ? 'text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={formData.propertyKeywords.includes(keyword) ? { backgroundColor: '#1e3a8a' } : {}}
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Description */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Property Description</label>
                  <textarea
                    name="propertyDescription"
                    value={formData.propertyDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-navy-900 transition-all"
                    placeholder="Describe your property..."
                  ></textarea>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#1e3a8a' }}>Owner Contact Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                          errors.ownerName ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                        }`}
                        placeholder="Enter owner name"
                      />
                      {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          maxLength="10"
                          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                            errors.mobile ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                          }`}
                          placeholder="10-digit number"
                        />
                        {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${
                            errors.email ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className={`w-4 h-4 mt-0.5 text-blue-600 rounded focus:ring-blue-500 ${
                      errors.agreeTerms ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-700">
                    I agree to the Terms and Conditions and Privacy Policy
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeTerms}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ backgroundColor: '#1e3a8a' }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Property'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostProperty