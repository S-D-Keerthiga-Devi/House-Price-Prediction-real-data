import React, { useState } from 'react'

function VentureInvestment() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    investmentType: '',
    investmentAmount: '',
    industryPreference: '',
    investmentStage: '',
    riskTolerance: '',
    investmentHorizon: '',
    city: '',
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

    if (!formData.investmentType) {
      newErrors.investmentType = 'Please select an investment type'
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
        message: 'Thank you for your interest in Venture Investment! Our venture capital team will review your profile and contact you within 24 hours to discuss exclusive startup investment opportunities. For immediate assistance, please call us at +91 98765 43210.'
      })
      
      setFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        investmentType: '',
        investmentAmount: '',
        industryPreference: '',
        investmentStage: '',
        riskTolerance: '',
        investmentHorizon: '',
        city: '',
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
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-12 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-full mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-4 tracking-tight">
            Venture Investment Platform
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Invest in High-Growth Startups and Innovation
          </p>
          <div className="mt-4 h-1 w-24 bg-blue-900 mx-auto rounded-full"></div>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-900 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white text-center">
              Start Your Venture Investment Journey Today
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Share your investment preferences and our experts will guide you through exclusive startup opportunities
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
            
            <div className="space-y-7">
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

              {/* Investment Type */}
              <div>
                <label htmlFor="investmentType" className="block text-sm font-semibold text-blue-900 mb-2">
                  Investment Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="investmentType"
                  name="investmentType"
                  value={formData.investmentType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                    errors.investmentType ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                  }`}
                >
                  <option value="">Select investment type</option>
                  <option value="direct-equity">Direct Equity Investment</option>
                  <option value="venture-funds">Venture Capital Funds</option>
                  <option value="angel-investing">Angel Investing</option>
                  <option value="seed-funding">Seed Funding</option>
                  <option value="series-a">Series A Investment</option>
                  <option value="series-b-plus">Series B+ Investment</option>
                  <option value="syndicate">Syndicate Investment</option>
                  <option value="crowdfunding">Equity Crowdfunding</option>
                  <option value="secondary-shares">Secondary Share Purchase</option>
                  <option value="convertible-notes">Convertible Notes</option>
                  <option value="safe-agreements">SAFE Agreements</option>
                </select>
                {errors.investmentType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.investmentType}
                  </p>
                )}
              </div>

              {/* Investment Amount and Industry Preference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="investmentAmount" className="block text-sm font-semibold text-blue-900 mb-2">
                    Investment Amount
                  </label>
                  <select
                    id="investmentAmount"
                    name="investmentAmount"
                    value={formData.investmentAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select investment amount</option>
                    <option value="under-5lakh">Under ₹5 Lakhs</option>
                    <option value="5-10lakh">₹5 - 10 Lakhs</option>
                    <option value="10-25lakh">₹10 - 25 Lakhs</option>
                    <option value="25-50lakh">₹25 - 50 Lakhs</option>
                    <option value="50lakh-1cr">₹50 Lakhs - 1 Crore</option>
                    <option value="1-5cr">₹1 - 5 Crores</option>
                    <option value="above-5cr">Above ₹5 Crores</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="industryPreference" className="block text-sm font-semibold text-blue-900 mb-2">
                    Industry Preference
                  </label>
                  <select
                    id="industryPreference"
                    name="industryPreference"
                    value={formData.industryPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology & Software</option>
                    <option value="fintech">Fintech</option>
                    <option value="healthcare">Healthcare & Biotech</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="clean-energy">Clean Energy</option>
                    <option value="edtech">Education Technology</option>
                    <option value="food-beverage">Food & Beverage</option>
                    <option value="consumer-goods">Consumer Goods</option>
                    <option value="logistics">Logistics & Supply Chain</option>
                    <option value="diverse">Diversified Portfolio</option>
                  </select>
                </div>
              </div>

              {/* Investment Stage and Risk Tolerance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="investmentStage" className="block text-sm font-semibold text-blue-900 mb-2">
                    Preferred Investment Stage
                  </label>
                  <select
                    id="investmentStage"
                    name="investmentStage"
                    value={formData.investmentStage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select stage</option>
                    <option value="pre-seed">Pre-seed</option>
                    <option value="seed">Seed Stage</option>
                    <option value="early-stage">Early Stage (Series A)</option>
                    <option value="growth-stage">Growth Stage (Series B+)</option>
                    <option value="late-stage">Late Stage</option>
                    <option value="pre-ipo">Pre-IPO</option>
                    <option value="all-stages">Open to All Stages</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="riskTolerance" className="block text-sm font-semibold text-blue-900 mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    id="riskTolerance"
                    name="riskTolerance"
                    value={formData.riskTolerance}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select risk tolerance</option>
                    <option value="conservative">Conservative (Lower Risk)</option>
                    <option value="moderate">Moderate (Medium Risk)</option>
                    <option value="aggressive">Aggressive (High Risk)</option>
                    <option value="very-aggressive">Very Aggressive (Very High Risk)</option>
                  </select>
                </div>
              </div>

              {/* Investment Horizon and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="investmentHorizon" className="block text-sm font-semibold text-blue-900 mb-2">
                    Investment Horizon
                  </label>
                  <select
                    id="investmentHorizon"
                    name="investmentHorizon"
                    value={formData.investmentHorizon}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select time horizon</option>
                    <option value="short-term">3-5 years</option>
                    <option value="medium-term">5-7 years</option>
                    <option value="long-term">7-10 years</option>
                    <option value="very-long-term">10+ years</option>
                  </select>
                </div>

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
              </div>
              
              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-semibold text-blue-900 mb-2">
                  Additional Information & Preferences
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all resize-none"
                  placeholder="Tell us about your venture investment experience, startup preferences, portfolio goals, or any other details that will help us provide personalized startup recommendations..."
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
                      Start Venture Investing Now
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Investment Disclaimer:</strong> Venture capital investments involve high risk and may result in total loss of capital. Startups are inherently risky and illiquid. Past performance is not indicative of future returns. Please read all investment-related documents carefully before investing. These investments are suitable only for sophisticated investors who can bear the loss of their entire investment.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-8 text-center space-y-3">
          <div className="flex justify-center space-x-8 text-sm text-gray-700">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              SEBI Registered
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Platform
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Need immediate assistance? Call us at{' '}
            <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              +91 98765 43210
            </a>
          </p>
          <p className="text-xs text-gray-600">
            Our venture capital advisors are available Monday to Friday, 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}

export default VentureInvestment