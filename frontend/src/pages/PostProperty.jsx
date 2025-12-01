import React, { useState, useEffect, useRef } from 'react'
import { Home, FileText, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
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
    // Residential fields
    bhk: '',
    bathrooms: '',
    balconies: '',
    area: '',
    areaType: 'Super Built-up',
    furnishingStatus: '',
    floorNumber: '',
    totalFloors: '',
    ageOfProperty: '',
    ownershipType: '',
    waterSupply: '',
    gatedCommunity: '',
    additionalRooms: [],
    // Plot specific
    plotArea: '',
    plotLength: '',
    plotWidth: '',
    boundaryWall: '',
    cornerPlot: '',
    facing: '',
    openSides: '',
    roadWidth: '',
    zoningType: '',
    // Commercial specific
    washrooms: '',
    pantry: '',
    conferenceRooms: '',
    suitableFor: [],
    flooringType: '',
    // PG specific
    beds: '',
    foodIncluded: '',
    genderPreference: '',
    noticePeriod: '',
    roomType: '',
    attachedBathroom: '',
    preferredTenants: '',
    lockInPeriod: '',
    electricityWater: '',
    // Common
    price: '',
    priceNegotiable: '',
    securityDeposit: '',
    maintenanceCharges: '',
    possessionStatus: '',
    availableFrom: '',
    coveredParking: '',
    openParking: '',
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
    residential: ['Apartment', 'Villa', 'Independent House', 'Plot', 'Builder Floor', 'Penthouse', 'PG'],
    commercial: ['Office Space', 'Shop', 'Warehouse', 'Industrial', 'IT Park/SEZ']
  }

  // Contextual amenities based on property type
  const residentialAmenities = [
    'Gymnasium', 'Swimming Pool', 'Kids Play Area', 'Clubhouse',
    '24x7 Security', 'Visitor Parking', 'Power Backup', 'Lift',
    'Garden', 'Intercom', 'Badminton Court', 'Tennis Court',
    'Jogging Track', 'Party Hall', 'CCTV', 'Fire Safety'
  ]

  const commercialOfficeAmenities = [
    'High-Speed Wi-Fi', 'Conference Rooms', 'Meeting Rooms',
    'Cafeteria', 'Parking', 'Power Backup', '24x7 Security',
    'CCTV', 'Lift', 'Reception/Lobby', 'Central AC',
    'Fire Safety', 'Water Purifier', 'Pantry', 'Server Room',
    'Intercom', 'Visitor Parking'
  ]

  const commercialShopAmenities = [
    'Parking', '24x7 Security', 'CCTV', 'Power Backup',
    'Central AC', 'Fire Safety', 'Water Supply',
    'Waste Disposal', 'Display Windows', 'Storage Space',
    'Loading Area', 'Restrooms', 'Signage Space'
  ]

  const commercialWarehouseAmenities = [
    'Loading Docks', 'High Ceiling', 'Industrial Racking',
    '24x7 Security', 'CCTV', 'Fire Safety', '3-Phase Power',
    'Heavy Vehicle Parking', 'Office Space', 'Restrooms',
    'Storage Equipment', 'Ventilation', 'Drainage', 'Boundary Wall'
  ]

  const plotAmenities = [
    'Gated Community', 'Boundary Wall', 'Corner Plot',
    'Water Connection', 'Electricity Connection', 'Sewage Connection',
    'Road Access', 'Street Lights', 'Park Nearby', 'Security'
  ]

  const pgAmenities = [
    'Wi-Fi', 'Meals Included', 'Laundry', 'TV', 'Fridge',
    'AC', 'Geyser', 'Attached Bathroom', 'Parking', 'CCTV',
    'Power Backup', 'Housekeeping', 'Warden'
  ]

  // Get contextual amenities based on property type
  const getAmenities = () => {
    if (isPGProperty()) return pgAmenities
    if (isPlotProperty()) return plotAmenities
    if (isCommercialProperty()) {
      // Return specific amenities based on commercial sub-type
      if (formData.propertyType === 'Office Space' || formData.propertyType === 'IT Park/SEZ') {
        return commercialOfficeAmenities
      } else if (formData.propertyType === 'Shop') {
        return commercialShopAmenities
      } else if (formData.propertyType === 'Warehouse' || formData.propertyType === 'Industrial') {
        return commercialWarehouseAmenities
      }
      return commercialOfficeAmenities // default to office amenities
    }
    if (isResidentialNonPlot()) return residentialAmenities
    return []
  }

  const propertyKeywords = ['Reputed Builder', 'Well Ventilated', 'Fully Renovated', 'Vastu Compliant', 'Spacious', 'Prime Location', 'Gated Community', 'Corner Property']

  const suitableForOptions = ['IT/Software', 'Retail', 'Manufacturing', 'Warehouse', 'Healthcare', 'Education', 'Restaurant', 'Bank']

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true)
      try {
        const response = await getCities()
        if (response.success && response.cities) {
          setCities(response.cities)
        } else {
          setCities(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Gurgaon', 'Noida'])
        }
      } catch (error) {
        setCities(['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Gurgaon', 'Noida'])
      } finally {
        setLoadingCities(false)
      }
    }
    fetchCities()
  }, [])

  // Fetch localities
  useEffect(() => {
    const fetchLocalities = async () => {
      if (!formData.city) {
        setLocalities([])
        return
      }
      setLoadingLocalities(true)
      try {
        const response = await getLocalitiesByCity(formData.city)
        if (response.success && response.localities) {
          setLocalities(response.localities)
        }
      } catch (error) {
        setLocalities([])
      } finally {
        setLoadingLocalities(false)
      }
    }
    fetchLocalities()
  }, [formData.city])

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
    const isInList = localities.some(loc => loc.toLowerCase() === value.toLowerCase())
    setAllowCustomLocality(value.trim() !== '' && !isInList)
  }

  const toggleArrayItem = (array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item]
  }

  const isPlotProperty = () => formData.propertyType === 'Plot'
  const isPGProperty = () => formData.propertyType === 'PG'
  const isCommercialProperty = () => formData.buildingType === 'Commercial'
  const isResidentialNonPlot = () => formData.buildingType === 'Residential' && !isPlotProperty() && !isPGProperty()

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.transactionType) newErrors.transactionType = 'Required'
    if (!formData.buildingType) newErrors.buildingType = 'Required'
    if (!formData.propertyType) newErrors.propertyType = 'Required'
    if (!formData.city.trim()) newErrors.city = 'Required'
    if (!formData.locality.trim()) newErrors.locality = 'Required'

    if (isPlotProperty()) {
      if (!formData.plotArea.trim()) newErrors.plotArea = 'Required'
    } else if (!isPGProperty()) {
      if (!formData.bhk) newErrors.bhk = 'Required'
      if (!formData.area.trim()) newErrors.area = 'Required'
    } else {
      if (!formData.beds) newErrors.beds = 'Required'
    }

    if (!formData.price.trim()) newErrors.price = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.possessionStatus) newErrors.possessionStatus = 'Required'

    if (isResidentialNonPlot()) {
      if (!formData.furnishingStatus) newErrors.furnishingStatus = 'Required'
      if (!formData.bathrooms) newErrors.bathrooms = 'Required'
      if (!formData.ageOfProperty) newErrors.ageOfProperty = 'Required'
    } else if (isCommercialProperty()) {
      if (!formData.washrooms) newErrors.washrooms = 'Required'
    } else if (isPGProperty()) {
      if (!formData.foodIncluded) newErrors.foodIncluded = 'Required'
      if (!formData.genderPreference) newErrors.genderPreference = 'Required'
    }

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
      const submissionData = {
        ownerName: formData.ownerName.trim(),
        mobile: formData.mobile.replace(/\D/g, ''),
        email: formData.email.trim(),
        propertyType: formData.propertyType,
        city: formData.city,
        locality: formData.locality,
        price: formData.price,
        area: formData.area || formData.plotArea,
        bedrooms: formData.bhk || formData.beds,
        description: formData.propertyDescription || `${formData.transactionType} ${formData.propertyType} in ${formData.locality}, ${formData.city}`
      }
      await submitPostProperty(submissionData)
      setIsSubmitted(true)
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostAnother = () => {
    setIsSubmitted(false)
    setCurrentStep(1)
    setFormData({
      transactionType: '', buildingType: '', propertyType: '', city: '', projectName: '', locality: '',
      bhk: '', bathrooms: '', balconies: '', area: '', areaType: 'Super Built-up', furnishingStatus: '',
      floorNumber: '', totalFloors: '', ageOfProperty: '', plotArea: '', plotLength: '', plotWidth: '',
      boundaryWall: '', cornerPlot: '', facing: '', washrooms: '', pantry: '', conferenceRooms: '',
      suitableFor: [], beds: '', foodIncluded: '', genderPreference: '', noticePeriod: '', roomType: '',
      attachedBathroom: '', price: '', securityDeposit: '', maintenanceCharges: '', possessionStatus: '',
      coveredParking: '', openParking: '', amenities: [], propertyKeywords: [], propertyDescription: '',
      agreeTerms: false, ownerName: '', mobile: '', email: '',
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
            <p className="text-gray-600 mb-6">Your property has been submitted successfully.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handlePostAnother} className="w-full py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105" style={{ backgroundColor: '#1e3a8a' }}>
                Post Another Property
              </button>
              <button onClick={() => window.location.href = '/'} className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all">
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
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all ${currentStep >= step.num ? 'bg-navy-900 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                    }`} style={currentStep >= step.num ? { backgroundColor: '#1e3a8a' } : {}}>
                    <step.Icon size={18} />
                  </div>
                  <span className={`text-xs font-medium ${currentStep >= step.num ? 'text-navy-900' : 'text-gray-500'}`} style={currentStep >= step.num ? { color: '#1e3a8a' } : {}}>
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-3 rounded transition-all ${currentStep > step.num ? 'bg-navy-900' : 'bg-gray-200'}`} style={currentStep > step.num ? { backgroundColor: '#1e3a8a' } : {}}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>Property Details</h2>

                {/* Transaction & Building Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Listing For</label>
                    <div className="flex gap-2">
                      {['Sale', 'Rent'].map((type) => (
                        <button key={type} onClick={() => setFormData({ ...formData, transactionType: type })} className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${formData.transactionType === type ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.transactionType === type ? { backgroundColor: '#1e3a8a' } : {}}>
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
                        <button key={type} onClick={() => setFormData({ ...formData, buildingType: type, propertyType: '' })} className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${formData.buildingType === type ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.buildingType === type ? { backgroundColor: '#1e3a8a' } : {}}>
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
                        <button key={type} onClick={() => setFormData({ ...formData, propertyType: type })} className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${formData.propertyType === type ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.propertyType === type ? { backgroundColor: '#1e3a8a' } : {}}>
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
                      <input type="text" value={formData.city} onChange={(e) => { handleChange(e); setCityDropdownOpen(true) }} onFocus={() => setCityDropdownOpen(true)} name="city" className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-navy-900'}`} placeholder={loadingCities ? "Loading..." : "Search city"} />
                      {cityDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{ borderColor: '#1e3a8a' }}>
                          {cities.filter(city => !formData.city || city.toLowerCase().includes(formData.city.toLowerCase())).slice(0, 100).map((city) => (
                            <div key={city} onClick={() => handleCitySelect(city)} className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer transition-colors">{city}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>

                  <div ref={localityInputRef}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Locality</label>
                    <input type="text" value={formData.locality} onChange={handleLocalityInputChange} onFocus={() => formData.city && setLocalityDropdownOpen(true)} disabled={!formData.city} className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none ${errors.locality ? 'border-red-400' : 'border-gray-200'} ${!formData.city ? 'bg-gray-100' : ''}`} placeholder={!formData.city ? "Select city first" : "Search locality"} />
                    {localityDropdownOpen && formData.city && (
                      <div className="absolute z-50 w-full mt-1 bg-white border-2 rounded-lg shadow-xl max-h-60 overflow-y-auto" style={{ borderColor: '#1e3a8a' }}>
                        {localities.filter(loc => !formData.locality || loc.toLowerCase().includes(formData.locality.toLowerCase())).map((loc) => (
                          <div key={loc} onClick={() => handleLocalitySelect(loc)} className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer">{loc}</div>
                        ))}
                        {formData.locality && !localities.some(loc => loc.toLowerCase() === formData.locality.toLowerCase()) && (
                          <div onClick={() => setLocalityDropdownOpen(false)} className="px-3 py-2 text-sm bg-blue-50 cursor-pointer font-medium" style={{ color: '#1e3a8a' }}>✓ Use "{formData.locality}"</div>
                        )}
                      </div>
                    )}
                    {errors.locality && <p className="mt-1 text-xs text-red-600">{errors.locality}</p>}
                  </div>
                </div>

                {/* BHK for Residential (non-plot, non-PG) */}
                {isResidentialNonPlot() && (
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>BHK</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['Studio', '1', '2', '3', '4', '5+'].map((bhk) => (
                        <button key={bhk} onClick={() => setFormData({ ...formData, bhk })} className={`py-2 text-sm rounded-lg font-medium transition-all ${formData.bhk === bhk ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.bhk === bhk ? { backgroundColor: '#1e3a8a' } : {}}>
                          {bhk}
                        </button>
                      ))}
                    </div>
                    {errors.bhk && <p className="mt-1 text-xs text-red-600">{errors.bhk}</p>}
                  </div>
                )}

                {/* Beds for PG */}
                {isPGProperty() && (
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Number of Beds</label>
                    <div className="grid grid-cols-6 gap-2">
                      {['1', '2', '3', '4', '5', '6+'].map((bed) => (
                        <button key={bed} onClick={() => setFormData({ ...formData, beds: bed })} className={`py-2 text-sm rounded-lg font-medium ${formData.beds === bed ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.beds === bed ? { backgroundColor: '#1e3a8a' } : {}}>
                          {bed}
                        </button>
                      ))}
                    </div>
                    {errors.beds && <p className="mt-1 text-xs text-red-600">{errors.beds}</p>}
                  </div>
                )}

                {/* Area */}
                {!isPlotProperty() && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Area (sq ft)</label>
                      <input type="text" name="area" value={formData.area} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none ${errors.area ? 'border-red-400' : 'border-gray-200'}`} placeholder="e.g., 1200" />
                      {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Area Type</label>
                      <select name="areaType" value={formData.areaType} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                        <option>Super Built-up</option>
                        <option>Built-up</option>
                        <option>Carpet</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Plot Area */}
                {isPlotProperty() && (
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Plot Area (sq ft)</label>
                    <input type="text" name="plotArea" value={formData.plotArea} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.plotArea ? 'border-red-400' : 'border-gray-200'}`} placeholder="e.g., 2400" />
                    {errors.plotArea && <p className="mt-1 text-xs text-red-600">{errors.plotArea}</p>}
                  </div>
                )}

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Price (₹)</label>
                  <input type="text" name="price" value={formData.price} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.price ? 'border-red-400' : 'border-gray-200'}`} placeholder="e.g., 5000000" />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                </div>

                <button onClick={handleSaveAndContinue} className="w-full py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2" style={{ backgroundColor: '#1e3a8a' }}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>Additional Information</h2>

                {/* Possession */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Possession Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Ready To Move', 'Under Construction'].map((status) => (
                      <button key={status} onClick={() => setFormData({ ...formData, possessionStatus: status })} className={`py-2 text-sm rounded-lg font-medium ${formData.possessionStatus === status ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.possessionStatus === status ? { backgroundColor: '#1e3a8a' } : {}}>
                        {status}
                      </button>
                    ))}
                  </div>
                  {errors.possessionStatus && <p className="mt-1 text-xs text-red-600">{errors.possessionStatus}</p>}
                </div>

                {/* Residential Non-Plot Fields */}
                {isResidentialNonPlot() && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Furnishing Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Unfurnished', 'Semi-Furnished', 'Furnished'].map((status) => (
                          <button key={status} onClick={() => setFormData({ ...formData, furnishingStatus: status })} className={`py-2 text-xs rounded-lg font-medium ${formData.furnishingStatus === status ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.furnishingStatus === status ? { backgroundColor: '#1e3a8a' } : {}}>
                            {status}
                          </button>
                        ))}
                      </div>
                      {errors.furnishingStatus && <p className="mt-1 text-xs text-red-600">{errors.furnishingStatus}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Bathrooms</label>
                        <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.bathrooms ? 'border-red-400' : 'border-gray-200'}`} style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          {['1', '2', '3', '4', '5+'].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                        {errors.bathrooms && <p className="mt-1 text-xs text-red-600">{errors.bathrooms}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Balconies</label>
                        <select name="balconies" value={formData.balconies} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          {['0', '1', '2', '3', '4+'].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Covered Parking</label>
                        <select name="coveredParking" value={formData.coveredParking} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          {['0', '1', '2', '3', '4+'].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Floor Number</label>
                        <input type="text" name="floorNumber" value={formData.floorNumber} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" placeholder="e.g., 5" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Total Floors</label>
                        <input type="text" name="totalFloors" value={formData.totalFloors} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" placeholder="e.g., 20" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Age of Property</label>
                      <select name="ageOfProperty" value={formData.ageOfProperty} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.ageOfProperty ? 'border-red-400' : 'border-gray-200'}`} style={{ color: '#1e3a8a' }}>
                        <option value="">Select</option>
                        <option>Under Construction</option>
                        <option>0-1 year</option>
                        <option>1-5 years</option>
                        <option>5-10 years</option>
                        <option>10+ years</option>
                      </select>
                      {errors.ageOfProperty && <p className="mt-1 text-xs text-red-600">{errors.ageOfProperty}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Ownership Type</label>
                        <select name="ownershipType" value={formData.ownershipType} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          <option>Freehold</option>
                          <option>Leasehold</option>
                          <option>Co-operative Society</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Water Supply</label>
                        <select name="waterSupply" value={formData.waterSupply} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          <option>Municipal</option>
                          <option>Borewell</option>
                          <option>Both</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Gated Community</label>
                      <div className="flex gap-2">
                        {['Yes', 'No'].map((opt) => (
                          <button key={opt} onClick={() => setFormData({ ...formData, gatedCommunity: opt })} className={`flex-1 py-2 text-sm rounded-lg ${formData.gatedCommunity === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.gatedCommunity === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Plot Fields */}
                {isPlotProperty() && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Plot Length (ft)</label>
                        <input type="text" name="plotLength" value={formData.plotLength} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" placeholder="e.g., 60" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Plot Width (ft)</label>
                        <input type="text" name="plotWidth" value={formData.plotWidth} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" placeholder="e.g., 40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Boundary Wall</label>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map((opt) => (
                            <button key={opt} onClick={() => setFormData({ ...formData, boundaryWall: opt })} className={`flex-1 py-2 text-sm rounded-lg ${formData.boundaryWall === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.boundaryWall === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Corner Plot</label>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map((opt) => (
                            <button key={opt} onClick={() => setFormData({ ...formData, cornerPlot: opt })} className={`flex-1 py-2 text-sm rounded-lg ${formData.cornerPlot === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.cornerPlot === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Facing</label>
                        <select name="facing" value={formData.facing} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          <option>North</option>
                          <option>South</option>
                          <option>East</option>
                          <option>West</option>
                          <option>North-East</option>
                          <option>North-West</option>
                          <option>South-East</option>
                          <option>South-West</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Open Sides</label>
                        <select name="openSides" value={formData.openSides} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Road Width (ft)</label>
                        <input type="text" name="roadWidth" value={formData.roadWidth} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" placeholder="e.g., 30" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Zoning/Approved For</label>
                        <select name="zoningType" value={formData.zoningType} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          <option>Residential</option>
                          <option>Commercial</option>
                          <option>Industrial</option>
                          <option>Agricultural</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Commercial Fields */}
                {isCommercialProperty() && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Washrooms</label>
                        <select name="washrooms" value={formData.washrooms} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.washrooms ? 'border-red-400' : 'border-gray-200'}`} style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          {['1', '2', '3', '4', '5', '6+'].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                        {errors.washrooms && <p className="mt-1 text-xs text-red-600">{errors.washrooms}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Pantry</label>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map((opt) => (
                            <button key={opt} onClick={() => setFormData({ ...formData, pantry: opt })} className={`flex-1 py-2 text-sm rounded-lg ${formData.pantry === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.pantry === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Conference Rooms</label>
                        <select name="conferenceRooms" value={formData.conferenceRooms} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          {['0', '1', '2', '3', '4+'].map(num => <option key={num} value={num}>{num}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Suitable For</label>
                      <div className="grid grid-cols-3 gap-2">
                        {suitableForOptions.map((opt) => (
                          <label key={opt} className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" checked={formData.suitableFor.includes(opt)} onChange={() => setFormData({ ...formData, suitableFor: toggleArrayItem(formData.suitableFor, opt) })} className="w-4 h-4 text-blue-600 rounded" />
                            <span className="ml-2 text-xs text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* PG Fields */}
                {isPGProperty() && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Food Included</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Yes', 'No', 'Optional'].map((opt) => (
                            <button key={opt} onClick={() => setFormData({ ...formData, foodIncluded: opt })} className={`py-2 text-xs rounded-lg ${formData.foodIncluded === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.foodIncluded === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                              {opt}
                            </button>
                          ))}
                        </div>
                        {errors.foodIncluded && <p className="mt-1 text-xs text-red-600">{errors.foodIncluded}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Gender Preference</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Male', 'Female', 'Any'].map((opt) => (
                            <button key={opt} onClick={() => setFormData({ ...formData, genderPreference: opt })} className={`py-2 text-xs rounded-lg ${formData.genderPreference === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.genderPreference === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                              {opt}
                            </button>
                          ))}
                        </div>
                        {errors.genderPreference && <p className="mt-1 text-xs text-red-600">{errors.genderPreference}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Room Type</label>
                        <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg" style={{ color: '#1e3a8a' }}>
                          <option value="">Select</option>
                          <option>Single</option>
                          <option>Double</option>
                          <option>Triple</option>
                          <option>Dormitory</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Attached Bathroom</label>
                        <div className="flex gap-2">
                          {['Yes', 'No'].map((opt) => (
                            <button key={opt} onClick={() => setFormData({ ...formData, attachedBathroom: opt })} className={`flex-1 py-2 text-sm rounded-lg ${formData.attachedBathroom === opt ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700'}`} style={formData.attachedBathroom === opt ? { backgroundColor: '#1e3a8a' } : {}}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button onClick={handleSaveAndContinue} className="flex-1 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2" style={{ backgroundColor: '#1e3a8a' }}>
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>Amenities & Contact</h2>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {getAmenities().map((amenity) => (
                      <label key={amenity} className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50">
                        <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => setFormData({ ...formData, amenities: toggleArrayItem(formData.amenities, amenity) })} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="ml-2 text-xs text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#1e3a8a' }}>Property Features</label>
                  <div className="flex flex-wrap gap-2">
                    {propertyKeywords.map((keyword) => (
                      <button key={keyword} type="button" onClick={() => setFormData({ ...formData, propertyKeywords: toggleArrayItem(formData.propertyKeywords, keyword) })} className={`px-3 py-1 text-xs rounded-full ${formData.propertyKeywords.includes(keyword) ? 'text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} style={formData.propertyKeywords.includes(keyword) ? { backgroundColor: '#1e3a8a' } : {}}>
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Property Description</label>
                  <textarea name="propertyDescription" value={formData.propertyDescription} onChange={handleChange} rows={3} className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none" placeholder="Describe your property..."></textarea>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: '#1e3a8a' }}>Owner Contact Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Owner Name <span className="text-red-500">*</span></label>
                      <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.ownerName ? 'border-red-400' : 'border-gray-200'}`} placeholder="Enter owner name" />
                      {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Mobile <span className="text-red-500">*</span></label>
                        <input type="tel" name="mobile" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} maxLength="10" className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.mobile ? 'border-red-400' : 'border-gray-200'}`} placeholder="10-digit number" />
                        {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#1e3a8a' }}>Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 text-sm border-2 rounded-lg ${errors.email ? 'border-red-400' : 'border-gray-200'}`} placeholder="your.email@example.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className={`w-4 h-4 mt-0.5 text-blue-600 rounded ${errors.agreeTerms ? 'border-red-400' : 'border-gray-300'}`} />
                  <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-700">I agree to the Terms and Conditions</label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-red-600">{errors.agreeTerms}</p>}

                <div className="flex gap-3 pt-2">
                  <button onClick={handleBack} className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#1e3a8a' }}>
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