import React, { useState } from 'react'

function RegistrationDocs() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    registrationType: '',
    entityName: '',
    additionalInfo: ''
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

    if (!formData.registrationType) {
      newErrors.registrationType = 'Please select a registration type'
    }

    if (!formData.entityName.trim()) {
      newErrors.entityName = 'Entity name is required'
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
        message: 'Thank you for submitting your registration request! Our documentation team will contact you within 24-48 hours.'
      })
      
      setFormData({
        fullName: '',
        mobileNumber: '',
        email: '',
        registrationType: '',
        entityName: '',
        additionalInfo: ''
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
            Registration & Documentation
          </h1>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-5 py-4">
            <h2 className="text-xl font-semibold text-white text-center">
              Start Your Registration Process
            </h2>
            <p className="text-blue-100 text-center mt-1 text-sm">
              Submit your details and our experts will guide you through the process
            </p>
          </div>
          
          {/* Form Content */}
          <div className="p-5 bg-white">
            {submitStatus && (
              <div className={`mb-4 p-3 rounded-lg border ${
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
                    <p className={`text-sm font-medium ${
                      submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
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
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${
                    errors.fullName ? 'border-red-400 bg-red-50' : 'border-blue-900'
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
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${
                      errors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-blue-900'
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
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${
                      errors.email ? 'border-red-400 bg-red-50' : 'border-blue-900'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Registration Type */}
              <div>
                <label htmlFor="registrationType" className="block text-xs font-semibold text-blue-900 mb-1">
                  Registration Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="registrationType"
                  name="registrationType"
                  value={formData.registrationType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${
                    errors.registrationType ? 'border-red-400 bg-red-50' : 'border-blue-900'
                  }`}
                >
                  <option value="">Select registration type</option>
                  <option value="gst-registration">GST Registration</option>
                  <option value="company-incorporation">Company Incorporation</option>
                  <option value="partnership-firm">Partnership Firm Registration</option>
                  <option value="llp">LLP Registration</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                  <option value="trademark">Trademark Registration</option>
                  <option value="msme">MSME Registration</option>
                  <option value="import-export">Import Export Code (IEC)</option>
                  <option value="fssai">FSSAI License</option>
                  <option value="other">Other</option>
                </select>
                {errors.registrationType && (
                  <p className="mt-1 text-xs text-red-600">{errors.registrationType}</p>
                )}
              </div>

              {/* Entity Name */}
              <div>
                <label htmlFor="entityName" className="block text-xs font-semibold text-blue-900 mb-1">
                  Business/Entity Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="entityName"
                  name="entityName"
                  value={formData.entityName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent text-sm ${
                    errors.entityName ? 'border-red-400 bg-red-50' : 'border-blue-900'
                  }`}
                  placeholder="Enter business/entity name"
                />
                {errors.entityName && (
                  <p className="mt-1 text-xs text-red-600">{errors.entityName}</p>
                )}
              </div>
              
              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-xs font-semibold text-blue-900 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-transparent resize-none text-sm"
                  placeholder="Share any specific requirements or questions..."
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
                      Submit Registration Request
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>Registration Disclaimer:</strong> All registrations are subject to government approval and compliance with applicable laws.
                </p>
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

export default RegistrationDocs