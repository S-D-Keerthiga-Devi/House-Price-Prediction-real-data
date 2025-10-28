import React, { useState } from 'react'

function HomeInterior() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    interiorType: '',
    propertyType: '',
    roomsToDesign: '',
    budget: '',
    timeline: '',
    city: '',
    serviceNeed: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.interiorType) {
      newErrors.interiorType = 'Please select an interior service type'
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
      // Replace with your actual API endpoint
      // const response = await axios.post('/api/home-interior', formData)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your interest! Our interior design team will review your requirements and contact you within 24 hours to schedule a free consultation. For immediate assistance, please call us at +91 98765 43210.'
      })
      
      setFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        interiorType: '',
        propertyType: '',
        roomsToDesign: '',
        budget: '',
        timeline: '',
        city: '',
        serviceNeed: ''
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
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-4 tracking-tight">
            Home Interior Design
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Transform Your Space into Your Dream Home
          </p>
          <div className="mt-4 h-1 w-24 bg-blue-900 mx-auto rounded-full"></div>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-900 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white text-center">
              Get Your Free Design Consultation
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Share your requirements and our design experts will create a personalized solution for you
            </p>
          </div>
          
          {/* Form Content */}
          <div className="p-8 sm:p-10 bg-white">
            {submitStatus && (
              <div className={`mb-8 p-5 rounded-xl border-2 ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border-green-600' 
                  : 'bg-red-50 border-red-600'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {submitStatus.type === 'success' ? (
                      <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium leading-relaxed ${
                      submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div onSubmit={handleSubmit} className="space-y-7">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-blue-900 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.firstName ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-blue-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-semibold text-blue-900 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Interior Service Type */}
              <div>
                <label htmlFor="interiorType" className="block text-sm font-semibold text-blue-900 mb-2">
                  Interior Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="interiorType"
                  name="interiorType"
                  value={formData.interiorType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                    errors.interiorType ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                  }`}
                >
                  <option value="">Select a service</option>
                  <option value="full-home-interior">Full Home Interior Design</option>
                  <option value="modular-kitchen">Modular Kitchen</option>
                  <option value="bedroom-design">Bedroom Design</option>
                  <option value="living-room">Living Room Design</option>
                  <option value="bathroom-design">Bathroom Design</option>
                  <option value="office-interior">Home Office Interior</option>
                  <option value="false-ceiling">False Ceiling & Lighting</option>
                  <option value="furniture-design">Custom Furniture Design</option>
                  <option value="renovation">Home Renovation</option>
                  <option value="consultation">Design Consultation Only</option>
                </select>
                {errors.interiorType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.interiorType}
                  </p>
                )}
              </div>

              {/* Property and Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-semibold text-blue-900 mb-2">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa/Independent House</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="studio">Studio Apartment</option>
                    <option value="duplex">Duplex</option>
                    <option value="office">Office Space</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="roomsToDesign" className="block text-sm font-semibold text-blue-900 mb-2">
                    Number of Rooms/Areas to Design
                  </label>
                  <input
                    type="text"
                    id="roomsToDesign"
                    name="roomsToDesign"
                    value={formData.roomsToDesign}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="e.g., 2 BHK, 3 rooms, etc."
                  />
                </div>
              </div>

              {/* Budget and Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-blue-900 mb-2">
                    Approximate Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select your budget range</option>
                    <option value="under-5lakh">Under ₹5 Lakhs</option>
                    <option value="5-10lakh">₹5 - 10 Lakhs</option>
                    <option value="10-15lakh">₹10 - 15 Lakhs</option>
                    <option value="15-25lakh">₹15 - 25 Lakhs</option>
                    <option value="25-50lakh">₹25 - 50 Lakhs</option>
                    <option value="above-50lakh">Above ₹50 Lakhs</option>
                    <option value="flexible">Flexible/Not Sure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-semibold text-blue-900 mb-2">
                    Expected Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (Within 1 month)</option>
                    <option value="1-2months">1-2 Months</option>
                    <option value="2-3months">2-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="flexible">Flexible</option>
                    <option value="planning">Just Planning</option>
                  </select>
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-blue-900 mb-2">
                  City/Location
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  placeholder="Enter your city"
                />
              </div>
              
              {/* Additional Requirements */}
              <div>
                <label htmlFor="serviceNeed" className="block text-sm font-semibold text-blue-900 mb-2">
                  Design Preferences & Additional Details
                </label>
                <textarea
                  id="serviceNeed"
                  name="serviceNeed"
                  value={formData.serviceNeed}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all resize-none"
                  placeholder="Tell us about your style preferences, specific requirements, inspirations, or any other details that will help us understand your vision better..."
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
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
                      Get Free Consultation
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-700">
            Need immediate assistance? Call us at{' '}
            <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              +91 98765 43210
            </a>
          </p>
          <p className="text-xs text-gray-600">
            Our design consultants are available Monday to Saturday, 10:00 AM - 7:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeInterior