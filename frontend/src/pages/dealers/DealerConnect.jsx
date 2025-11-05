import React, { useState } from 'react'

function DealerConnect() {
  const [formData, setFormData] = useState({
    firstName: '',
    mobileNumber: '',
    email: '',
    businessName: '',
    businessType: '',
    dealershipType: '',
    experienceYears: '',
    inventorySize: '',
    annualRevenue: '',
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Full name is required'
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

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!formData.dealershipType) {
      newErrors.dealershipType = 'Please select a dealership type'
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
        message: 'Thank you for your interest! Our partnership team will review your dealership profile and contact you within 24 hours. For immediate assistance, call +91 98765 43210.'
      })
      
      setFormData({
        firstName: '',
        mobileNumber: '',
        email: '',
        businessName: '',
        businessType: '',
        dealershipType: '',
        experienceYears: '',
        inventorySize: '',
        annualRevenue: '',
        additionalInfo: ''
      })
      
      setTimeout(() => {
        setSubmitStatus(null)
      }, 10000)
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us at +91 98765 43210.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 py-8 mt-20">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-2xl w-full p-5">
        <h2 className="text-2xl font-bold text-blue-900 mb-1 text-center">
          Dealer Connect
        </h2>
        <p className="text-blue-700 text-center mb-4 text-xs">
          Partner with us to expand your business
        </p>
        
        <div className="space-y-3">
          {submitStatus && (
            <div className={`mb-3 p-3 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <p className="text-xs">{submitStatus.message}</p>
            </div>
          )}
          
          {/* Name and Mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold text-blue-900 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.firstName ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
                placeholder="Full name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
              )}
            </div>
            
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
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
                placeholder="10-digit number"
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>
              )}
            </div>
          </div>
          
          {/* Email and Business Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-blue-900 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.email ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="businessName" className="block text-xs font-semibold text-blue-900 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.businessName ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
                placeholder="Business name"
              />
              {errors.businessName && (
                <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>
              )}
            </div>
          </div>

          {/* Business Type and Dealership Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dealershipType" className="block text-xs font-semibold text-blue-900 mb-1">
                Dealership Type <span className="text-red-500">*</span>
              </label>
              <select
                id="dealershipType"
                name="dealershipType"
                value={formData.dealershipType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errors.dealershipType ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
              >
                <option value="">Select dealership type</option>
                <option value="automobile">Automobile</option>
                <option value="real-estate">Real Estate</option>
                <option value="electronics">Electronics & Appliances</option>
                <option value="machinery">Industrial Machinery</option>
                <option value="construction">Construction Equipment</option>
                <option value="agricultural">Agricultural Equipment</option>
                <option value="luxury-goods">Luxury Goods</option>
                <option value="furniture">Furniture & Home Decor</option>
                <option value="retail">Retail & FMCG</option>
                <option value="wholesale">Wholesale Distribution</option>
                <option value="franchise">Franchise</option>
                <option value="other">Other</option>
              </select>
              {errors.dealershipType && (
                <p className="mt-1 text-xs text-red-600">{errors.dealershipType}</p>
              )}
            </div>

            <div>
              <label htmlFor="experienceYears" className="block text-xs font-semibold text-blue-900 mb-1">
                Years of Experience
              </label>
              <select
                id="experienceYears"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select experience</option>
                <option value="less-than-1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10-20">10-20 years</option>
                <option value="20-plus">20+ years</option>
              </select>
            </div>
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
              rows="2"
              className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              placeholder="Tell us about your dealership goals..."
            ></textarea>
          </div>
          
          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Join Dealer Network'}
            </button>
          </div>

          {/* Terms */}
          <div className="pt-1">
            <p className="text-xs text-blue-700 text-center">
              By continuing I agree to Terms & Conditions
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Partnership Program</h3>
          <p className="text-xs text-blue-700">Exclusive opportunities for verified dealers</p>
        </div>
      </div>
    </div>
  )
}

export default DealerConnect