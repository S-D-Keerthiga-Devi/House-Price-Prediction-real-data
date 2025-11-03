import React, { useState } from 'react'

function AdvertiseWithUs() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    designation: '',
    countryCode: '+91',
    mobile: '',
    email: '',
    website: '',
    advertisementType: '',
    budget: '',
    duration: '',
    targetAudience: '',
    preferredPlacement: [],
    message: '',
    agreeTerms: false
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

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

  const advertisementTypes = [
    'Banner Ads',
    'Featured Listings',
    'Sponsored Content',
    'Email Marketing',
    'Social Media Campaign',
    'Video Advertising',
    'Mobile App Ads',
    'Newsletter Sponsorship'
  ]

  const budgetRanges = [
    'Under ₹50,000',
    '₹50,000 - ₹1,00,000',
    '₹1,00,000 - ₹2,50,000',
    '₹2,50,000 - ₹5,00,000',
    '₹5,00,000 - ₹10,00,000',
    'Above ₹10,00,000'
  ]

  const durationOptions = [
    '1 Week',
    '2 Weeks',
    '1 Month',
    '3 Months',
    '6 Months',
    '1 Year',
    'Custom Duration'
  ]

  const placementOptions = [
    'Homepage',
    'Search Results',
    'Property Listings',
    'Mobile App',
    'Newsletter',
    'Social Media'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name === 'preferredPlacement') {
      const currentPlacements = [...formData.preferredPlacement]
      if (checked) {
        currentPlacements.push(value)
      } else {
        const index = currentPlacements.indexOf(value)
        if (index > -1) {
          currentPlacements.splice(index, 1)
        }
      }
      setFormData({
        ...formData,
        preferredPlacement: currentPlacements
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required'
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
    
    if (!formData.advertisementType) {
      newErrors.advertisementType = 'Please select an advertisement type'
    }
    
    if (!formData.budget) {
      newErrors.budget = 'Please select a budget range'
    }
    
    if (!formData.duration) {
      newErrors.duration = 'Please select campaign duration'
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
        message: 'Thank you for your interest! Your advertising request has been submitted successfully. Our advertising team will review your requirements and contact you within 24-48 hours with a customized proposal and pricing details.'
      })
      
      setFormData({
        companyName: '',
        contactPerson: '',
        designation: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        website: '',
        advertisementType: '',
        budget: '',
        duration: '',
        targetAudience: '',
        preferredPlacement: [],
        message: '',
        agreeTerms: false
      })
      
      setTimeout(() => {
        setSubmitStatus(null)
      }, 10000)
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us directly at advertising@housepredict.com or call +91 98765 43210.'
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-2 tracking-tight">
            Advertise With Us
          </h1>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            Reach millions of property seekers and <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded font-bold">Grow Your Business</span>
          </p>
          <div className="mt-2 h-1 w-16 bg-blue-900 mx-auto rounded-full"></div>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-blue-900 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center">
              Partner With HousePredict
            </h2>
            <p className="text-blue-100 text-center mt-1 text-sm">
              Connect with your target audience through our platform
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
              {/* Company Information Section */}
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200">
                  Company Information
                </h3>
                
                {/* Company Name */}
                <div className="mb-4">
                  <label htmlFor="companyName" className="block text-sm font-semibold text-blue-900 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.companyName ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="Enter Company Name"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Contact Person */}
                <div className="mb-4">
                  <label htmlFor="contactPerson" className="block text-sm font-semibold text-blue-900 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.contactPerson ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="Enter Contact Person Name"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div className="mb-4">
                  <label htmlFor="designation" className="block text-sm font-semibold text-blue-900 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="e.g., Marketing Manager"
                  />
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

                {/* Website */}
                <div className="mb-4">
                  <label htmlFor="website" className="block text-sm font-semibold text-blue-900 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              {/* Advertisement Details Section */}
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-200">
                  Advertisement Details
                </h3>

                {/* Advertisement Type */}
                <div className="mb-4">
                  <label htmlFor="advertisementType" className="block text-sm font-semibold text-blue-900 mb-1">
                    Advertisement Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="advertisementType"
                    name="advertisementType"
                    value={formData.advertisementType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.advertisementType ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                  >
                    <option value="">Select Advertisement Type</option>
                    {advertisementTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.advertisementType && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.advertisementType}
                    </p>
                  )}
                </div>

                {/* Budget Range */}
                <div className="mb-4">
                  <label htmlFor="budget" className="block text-sm font-semibold text-blue-900 mb-1">
                    Budget Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.budget ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                  >
                    <option value="">Select Budget Range</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.budget}
                    </p>
                  )}
                </div>

                {/* Campaign Duration */}
                <div className="mb-4">
                  <label htmlFor="duration" className="block text-sm font-semibold text-blue-900 mb-1">
                    Campaign Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.duration ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                  >
                    <option value="">Select Duration</option>
                    {durationOptions.map((duration) => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                  {errors.duration && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.duration}
                    </p>
                  )}
                </div>

                {/* Target Audience */}
                <div className="mb-4">
                  <label htmlFor="targetAudience" className="block text-sm font-semibold text-blue-900 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="e.g., First-time home buyers, Investors, Renters"
                  />
                </div>

                {/* Preferred Placement */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">
                    Preferred Placement (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {placementOptions.map((placement) => (
                      <label
                        key={placement}
                        className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-700 transition-all"
                      >
                        <input
                          type="checkbox"
                          name="preferredPlacement"
                          value={placement}
                          checked={formData.preferredPlacement.includes(placement)}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-900 border-2 border-blue-900 rounded mr-2 focus:ring-2 focus:ring-blue-900"
                        />
                        <span className="text-sm font-medium text-gray-700">{placement}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Message */}
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-semibold text-blue-900 mb-1">
                    Additional Message / Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all resize-none"
                    placeholder="Tell us about your advertising goals and any specific requirements..."
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label className="flex items-start cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-900 border-2 border-blue-900 rounded mt-0.5 mr-2 focus:ring-2 focus:ring-blue-900 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-900 transition-colors">
                    I agree to HousePredict Advertising T&C, Privacy Policy, & Cookie Policy <span className="text-red-500">*</span>
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
                      Submit Advertising Request
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
                  <strong>Note:</strong> By submitting this form, you agree to our advertising terms and conditions. Our team will review your requirements and get back to you with a customized proposal within 24-48 hours. All information provided will be kept confidential and used only for preparing your advertising package.
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              High Visibility
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Targeted Reach
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cost-Effective
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Have questions about advertising? Contact our team at{' '}
            <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              +91 98765 43210
            </a>
            {' '}or email{' '}
            <a href="mailto:advertising@housepredict.com" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              advertising@housepredict.com
            </a>
          </p>
          <p className="text-xs text-gray-600">
            Our advertising team is available Monday to Friday, 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdvertiseWithUs