import React, { useState } from 'react'

function AdvertiseWithUs() {
  const [formData, setFormData] = useState({
    userType: '',
    lookingTo: '',
    propertyType: '',
    name: '',
    countryCode: '+91',
    mobile: '',
    email: '',
    city: '',
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.userType) {
      newErrors.userType = 'Please select user type'
    }
    
    if (!formData.lookingTo) {
      newErrors.lookingTo = 'Please select what you are looking to do'
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select property type'
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
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
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
        message: 'Thank you! Your request has been submitted successfully. Our team will contact you within 24-48 hours.'
      })
      
      setFormData({
        userType: '',
        lookingTo: '',
        propertyType: '',
        name: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        city: '',
        agreeTerms: false
      })
      
      setTimeout(() => {
        setSubmitStatus(null)
      }, 10000)
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us at advertising@housepredict.com'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 mt-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-blue-900 mb-1">
            Advertise With Us
          </h1>
          <p className="text-xs text-gray-600">
            Connect with millions of property seekers
          </p>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="p-4">
            {submitStatus && (
              <div className={`mb-3 p-2 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <p className="text-xs">{submitStatus.message}</p>
              </div>
            )}
            
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* I am a */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  I am a <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Individual', 'Agent', 'Builder'].map((type) => (
                    <label
                      key={type}
                      className={`px-3 py-1.5 border rounded-lg cursor-pointer text-center transition-all text-xs ${
                        formData.userType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                          : 'border-gray-300 hover:border-blue-400 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={type}
                        checked={formData.userType === type}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                {errors.userType && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.userType}</p>
                )}
              </div>

              {/* I am looking to */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  I am looking to <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Sell', 'Rent'].map((action) => (
                    <label
                      key={action}
                      className={`px-3 py-1.5 border rounded-lg cursor-pointer text-center transition-all text-xs ${
                        formData.lookingTo === action
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                          : 'border-gray-300 hover:border-blue-400 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="lookingTo"
                        value={action}
                        checked={formData.lookingTo === action}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {action}
                    </label>
                  ))}
                </div>
                {errors.lookingTo && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.lookingTo}</p>
                )}
              </div>

              {/* My Property is */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  My Property is <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Residential', 'Commercial'].map((type) => (
                    <label
                      key={type}
                      className={`px-3 py-1.5 border rounded-lg cursor-pointer text-center transition-all text-xs ${
                        formData.propertyType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                          : 'border-gray-300 hover:border-blue-400 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        value={type}
                        checked={formData.propertyType === type}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                {errors.propertyType && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.propertyType}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-1.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {countryCodes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`flex-1 px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.mobile ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.mobile}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.email}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-2.5 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.city ? 'border-red-400 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your City"
                />
                {errors.city && (
                  <p className="mt-0.5 text-[10px] text-red-600">{errors.city}</p>
                )}
              </div>

              {/* Terms */}
              <div className="md:col-span-2">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded mt-0.5 mr-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">
                    I agree to HousePredict <a href="#" className="text-blue-600 hover:underline">T&C</a>, <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, & <a href="#" className="text-blue-600 hover:underline">Cookie Policy</a> <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-0.5 text-[10px] text-red-600 ml-5">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-800 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600">
            Questions? Call <a href="tel:+919876543210" className="text-blue-600 font-medium hover:underline">+91 98765 43210</a> or email <a href="mailto:advertising@housepredict.com" className="text-blue-600 font-medium hover:underline">advertising@housepredict.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdvertiseWithUs