import React, { useState, useEffect } from 'react'
import { getCities, getLocalitiesByCity } from '../api/house.js'
import { TextField, MenuItem, ClickAwayListener } from '@mui/material'

function PostProperty() {
  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    countryCode: '+91',
    mobile: '',
    whatsappNumber: '',
    email: '',
    transactionType: '',
    propertyType: '',
    city: '',
    locality: '',
    exclusivePosting: false,
    agreeTerms: false,
    whatsappResponses: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [cities, setCities] = useState([])
  const [localities, setLocalities] = useState([])
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false)

  const countryCodes = [
    { code: '+91', country: 'IND' },
    { code: '+1', country: 'USA' },
    { code: '+971', country: 'ARE' },
    { code: '+44', country: 'GBR' },
    { code: '+65', country: 'SGP' },
    { code: '+966', country: 'SAU' },
    { code: '+61', country: 'AUS' },
    { code: '+49', country: 'DEU' },
    { code: '+974', country: 'QAT' },
    { code: '+33', country: 'FRA' },
    { code: '+968', country: 'OMN' },
    { code: '+852', country: 'HKG' },
    { code: '+86', country: 'CHN' },
    { code: '+81', country: 'JPN' },
    { code: '+82', country: 'KOR' },
    { code: '+92', country: 'PAK' },
    { code: '+880', country: 'BGD' },
    { code: '+94', country: 'LKA' },
    { code: '+977', country: 'NPL' }
  ]

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getCities()
        console.log('Cities response:', response)
        if (response.success && response.cities) {
          setCities(response.cities)
          console.log('Cities loaded:', response.cities.length)
        } else {
          setCities([])
          console.log('No cities found or response not successful')
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        setCities([])
      }
    }
    fetchCities()
  }, [])

  // Fetch localities when city is selected
  useEffect(() => {
    const fetchLocalities = async () => {
      if (formData.city) {
        try {
          const response = await getLocalitiesByCity(formData.city)
          console.log('Localities response for city', formData.city, ':', response)
          if (response.success && response.localities) {
            setLocalities(response.localities)
            console.log('Localities loaded:', response.localities.length)
          } else {
            setLocalities([])
            console.log('No localities found or response not successful')
          }
        } catch (error) {
          console.error('Error fetching localities:', error)
          setLocalities([])
        }
      } else {
        setLocalities([])
        console.log('No city selected, clearing localities')
      }
    }
    fetchLocalities()
  }, [formData.city])

  const propertyTypes = {
    residential: [
      'Flat/ Apartment',
      'Residential House',
      'Villa',
      'Builder Floor Apartment',
      'Residential Land/ Plot',
      'Penthouse',
      'Studio Apartment'
    ],
    commercial: [
      'Commercial Office Space',
      'Office in IT Park/ SEZ',
      'Commercial Shop',
      'Commercial Showroom',
      'Commercial Land',
      'Warehouse/ Godown',
      'Industrial Land',
      'Industrial Building',
      'Industrial Shed'
    ],
    agricultural: [
      'Agricultural Land',
      'Farm House'
    ]
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // If city changes, reset locality
    if (name === 'city') {
      setFormData({
        ...formData,
        city: value,
        locality: '' // Reset locality when city changes
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Handle city selection from dropdown
  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      city: city,
      locality: '' // Reset locality when city changes
    })
    setCityDropdownOpen(false)
    if (errors.city) {
      setErrors({
        ...errors,
        city: ''
      })
    }
  }

  // Handle locality selection from dropdown
  const handleLocalitySelect = (locality) => {
    setFormData({
      ...formData,
      locality: locality
    })
    setLocalityDropdownOpen(false)
    if (errors.locality) {
      setErrors({
        ...errors,
        locality: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.userType) {
      newErrors.userType = 'Please select who you are'
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.transactionType) {
      newErrors.transactionType = 'Please select transaction type'
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select a property type'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!formData.locality.trim()) {
      newErrors.locality = 'Locality is required'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus({
        type: 'success',
        message: 'Congratulations! Your property has been posted successfully. Your listing will be reviewed by our team within 24 hours. Once approved, it will be visible to potential buyers/tenants. You will receive enquiries on your registered mobile number and email.'
      })
      
      setFormData({
        userType: '',
        name: '',
        countryCode: '+91',
        mobile: '',
        whatsappNumber: '',
        email: '',
        transactionType: '',
        propertyType: '',
        city: '',
        locality: '',
        exclusivePosting: false,
        agreeTerms: false,
        whatsappResponses: false
      })
      
      setTimeout(() => {
        setSubmitStatus(null)
      }, 10000)
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us directly at +91 98765 43210.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-900 rounded-full mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-2 tracking-tight">
            Sell or Rent your Property
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            You are posting this property for <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded font-bold">FREE!</span>
          </p>
          <div className="mt-2 h-1 w-16 bg-blue-900 mx-auto rounded-full"></div>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-900 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center">
              List Your Property Today
            </h2>
            <p className="text-blue-100 text-center mt-1 text-sm">
              Get genuine buyer/tenant enquiries instantly
            </p>
          </div>
          
          {/* Form Content */}
          <div className="p-6 sm:p-8 bg-white">
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg border-2 ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border-green-600' 
                  : 'bg-red-50 border-red-600'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {submitStatus.type === 'success' ? (
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium leading-relaxed ${
                      submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Personal Details Section */}
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200">
                  Personal Details
                </h3>
                
                {/* I am */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    I am <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Owner', 'Agent', 'Builder'].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.userType === type
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={type}
                          checked={formData.userType === type}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-900 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.userType && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.userType}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-semibold text-blue-900 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="Enter Your Name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="mb-4">
                  <label htmlFor="mobile" className="block text-sm font-semibold text-blue-900 mb-1">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="px-2 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all text-sm"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.country} {item.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                        errors.mobile ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div className="mb-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                  <label htmlFor="whatsappNumber" className="flex items-center text-sm font-semibold text-gray-700 mb-1">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enter your WhatsApp No. to get enquiries from Buyer/Tenant
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-yellow-500 transition-all bg-white text-sm"
                    placeholder="WhatsApp number"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="Enter Your Email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Details Section */}
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200">
                  Property Details
                </h3>

                {/* For (Transaction Type) */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    For <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Sale', 'Rent/ Lease', 'PG/Hostel'].map((type) => (
                      <label
                        key={type}
                        className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.transactionType === type
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="transactionType"
                          value={type}
                          checked={formData.transactionType === type}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-900 mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                  {errors.transactionType && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.transactionType}
                    </p>
                  )}
                </div>

                {/* Property Type */}
                <div className="mb-4">
                  <label htmlFor="propertyType" className="block text-sm font-semibold text-blue-900 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.propertyType ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                  >
                    <option value="">Select Property Type</option>
                    <optgroup label="Residential">
                      {propertyTypes.residential.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Commercial">
                      {propertyTypes.commercial.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Agricultural">
                      {propertyTypes.agricultural.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </optgroup>
                  </select>
                  {errors.propertyType && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.propertyType}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Location Section */}
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200">
                  Property Location
                </h3>

                {/* City */}
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-semibold text-blue-900 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <ClickAwayListener onClickAway={() => setCityDropdownOpen(false)}>
                    <div className="relative">
                      <TextField
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => {
                          handleChange(e)
                          setCityDropdownOpen(true)
                        }}
                        onClick={() => setCityDropdownOpen(true)}
                        onFocus={() => setCityDropdownOpen(true)}
                        placeholder="Search and select city"
                        className="w-full"
                        size="small"
                        error={!!errors.city}
                        helperText={errors.city}
                        InputProps={{
                          className: errors.city 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-blue-900 hover:border-blue-700 focus:border-blue-900',
                          style: { borderRadius: '0.5rem' }
                        }}
                      />
                      {cityDropdownOpen && cities.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {cities
                            .filter(city => 
                              formData.city.trim() === "" || city.toLowerCase().includes(formData.city.toLowerCase())
                            )
                            .map((city, index) => (
                              <MenuItem
                                key={index}
                                onClick={() => handleCitySelect(city)}
                                className="hover:bg-blue-50 text-sm"
                              >
                                {city}
                              </MenuItem>
                            ))
                          }
                          {cities.filter(city => 
                            formData.city.trim() !== "" && city.toLowerCase().includes(formData.city.toLowerCase())
                          ).length === 0 && formData.city.trim() !== "" && (
                            <MenuItem disabled className="text-gray-500 text-sm">
                              No cities found
                            </MenuItem>
                          )}
                        </div>
                      )}
                    </div>
                  </ClickAwayListener>
                </div>

                {/* Locality */}
                <div className="mb-4">
                  <label htmlFor="locality" className="block text-sm font-semibold text-blue-900 mb-1">
                    Locality <span className="text-red-500">*</span>
                  </label>
                  <ClickAwayListener onClickAway={() => setLocalityDropdownOpen(false)}>
                    <div className="relative">
                      <TextField
                        id="locality"
                        name="locality"
                        value={formData.locality}
                        onChange={(e) => {
                          handleChange(e)
                          setLocalityDropdownOpen(true)
                        }}
                        onClick={() => setLocalityDropdownOpen(true)}
                        onFocus={() => setLocalityDropdownOpen(true)}
                        placeholder={formData.city ? "Search and select locality" : "Select city first"}
                        className="w-full"
                        size="small"
                        error={!!errors.locality}
                        helperText={errors.locality}
                        disabled={!formData.city}
                        InputProps={{
                          className: errors.locality 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-blue-900 hover:border-blue-700 focus:border-blue-900',
                          style: { borderRadius: '0.5rem' }
                        }}
                      />
                      {localityDropdownOpen && localities.length > 0 && formData.city && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-900 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {localities
                            .filter(locality => 
                              formData.locality.trim() === "" || locality.toLowerCase().includes(formData.locality.toLowerCase())
                            )
                            .map((locality, index) => (
                              <MenuItem
                                key={index}
                                onClick={() => handleLocalitySelect(locality)}
                                className="hover:bg-blue-50 text-sm"
                              >
                                {locality}
                              </MenuItem>
                            ))
                          }
                          {localities.filter(locality => 
                            formData.locality.trim() !== "" && locality.toLowerCase().includes(formData.locality.toLowerCase())
                          ).length === 0 && formData.locality.trim() !== "" && (
                            <MenuItem disabled className="text-gray-500 text-sm">
                              No localities found
                            </MenuItem>
                          )}
                        </div>
                      )}
                      {localityDropdownOpen && !formData.city && (
                        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-900 rounded-lg shadow-lg p-3">
                          <p className="text-gray-500 text-sm">Please select a city first</p>
                        </div>
                      )}
                    </div>
                  </ClickAwayListener>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="exclusivePosting"
                    checked={formData.exclusivePosting}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-900 border-2 border-blue-900 rounded mt-0.5 mr-2 focus:ring-2 focus:ring-blue-900 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-900 transition-colors">
                    I am posting this property 'exclusively' on HousePredict
                  </span>
                </label>

                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-900 border-2 border-blue-900 rounded mt-0.5 mr-2 focus:ring-2 focus:ring-blue-900 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-900 transition-colors">
                    I agree to HousePredict T&C, Privacy Policy, & Cookie Policy <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs text-red-600 flex items-center ml-6">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.agreeTerms}
                  </p>
                )}

                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="whatsappResponses"
                    checked={formData.whatsappResponses}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-900 border-2 border-blue-900 rounded mt-0.5 mr-2 focus:ring-2 focus:ring-blue-900 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-900 transition-colors flex items-center">
                    I want to receive responses on 
                    <svg className="w-3 h-3 text-green-600 mx-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Whatsapp
                  </span>
                </label>
              </div>
              
              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-900 text-white text-base font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Login & Post Property
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Note:</strong> By posting your property, you agree to our terms and conditions. We verify all listings before they go live. All property details provided should be accurate and up-to-date. You will receive enquiries via email, phone, and WhatsApp (if opted in).
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center space-x-6 text-sm text-gray-700">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Listings
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Wide Reach
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Need help posting your property? Call us at{' '}
            <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              +91 98765 43210
            </a>
          </p>
          <p className="text-xs text-gray-600">
            Our property listing team is available Monday to Saturday, 9:00 AM - 7:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}

export default PostProperty