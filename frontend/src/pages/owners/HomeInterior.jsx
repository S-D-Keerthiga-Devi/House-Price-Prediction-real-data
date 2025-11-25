import React, { useState } from 'react'
import { submitHomeInterior } from '../../api/ownerApi'

function HomeInterior() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    interiorType: '',
    propertyType: '',
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
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
      await submitHomeInterior(formData)

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your interest! Our interior design team will contact you within 24 hours.'
      })

      setFormData({
        fullName: '',
        mobileNumber: '',
        email: '',
        interiorType: '',
        propertyType: '',
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
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-blue-900 mb-2 tracking-tight">
            Home Interior Design
          </h1>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-5 py-4">
            <h2 className="text-xl font-semibold text-white text-center">
              Get Your Free Design Consultation
            </h2>
            <p className="text-blue-100 text-center mt-1 text-sm">
              Share your requirements and our design experts will create a personalized solution
            </p>
          </div>

          {/* Form Content */}
          <div className="p-5 bg-white">
            {submitStatus && (
              <div className={`mb-4 p-3 rounded-lg border ${submitStatus.type === 'success'
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
                    <p className={`text-sm font-medium ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-blue-900 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-blue-900'
                    }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mobileNumber" className="block text-xs font-semibold text-blue-900 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${errors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-blue-900'
                      }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-blue-900 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-blue-900'
                      }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Interior Service Type */}
              <div>
                <label htmlFor="interiorType" className="block text-xs font-semibold text-blue-900 mb-1">
                  Interior Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="interiorType"
                  name="interiorType"
                  value={formData.interiorType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${errors.interiorType ? 'border-red-400 bg-red-50' : 'border-blue-900'
                    }`}
                >
                  <option value="">Select a service</option>
                  <option value="full-home-interior">Full Home Interior</option>
                  <option value="modular-kitchen">Modular Kitchen</option>
                  <option value="bedroom-design">Bedroom Design</option>
                  <option value="living-room">Living Room</option>
                  <option value="bathroom-design">Bathroom Design</option>
                  <option value="office-interior">Home Office</option>
                  <option value="furniture-design">Custom Furniture</option>
                  <option value="renovation">Home Renovation</option>
                </select>
                {errors.interiorType && (
                  <p className="mt-1 text-xs text-red-600">{errors.interiorType}</p>
                )}
              </div>

              {/* Property and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="propertyType" className="block text-xs font-semibold text-blue-900 mb-1">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="">Select property type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa/House</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="studio">Studio</option>
                    <option value="duplex">Duplex</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-xs font-semibold text-blue-900 mb-1">
                    Approximate Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5lakh">Under ₹5 Lakhs</option>
                    <option value="5-10lakh">₹5 - 10 Lakhs</option>
                    <option value="10-15lakh">₹10 - 15 Lakhs</option>
                    <option value="15-25lakh">₹15 - 25 Lakhs</option>
                    <option value="above-25lakh">Above ₹25 Lakhs</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Timeline and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="timeline" className="block text-xs font-semibold text-blue-900 mb-1">
                    Expected Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm"
                  >
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (Within 1 month)</option>
                    <option value="1-2months">1-2 Months</option>
                    <option value="2-3months">2-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-semibold text-blue-900 mb-1">
                    City/Location
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label htmlFor="serviceNeed" className="block text-xs font-semibold text-blue-900 mb-1">
                  Design Preferences
                </label>
                <textarea
                  id="serviceNeed"
                  name="serviceNeed"
                  value={formData.serviceNeed}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent resize-none text-sm"
                  placeholder="Tell us about your style preferences..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Get Free Consultation
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-700">
            Need immediate assistance? Call us at{' '}
            <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              +91 98765 43210
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeInterior