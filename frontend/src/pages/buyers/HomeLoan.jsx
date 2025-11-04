import React, { useState } from 'react'

function HomeLoan() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    loanAmount: '',
    loanPurpose: '',
    propertyStatus: '',
    propertyType: '',
    propertyValue: '',
    propertyLocation: '',
    employmentType: '',
    monthlyIncome: '',
    existingLoans: '',
    creditScore: '',
    downPayment: '',
    loanTenure: '',
    city: '',
    state: '',
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

    if (!formData.loanAmount.trim()) {
      newErrors.loanAmount = 'Loan amount is required'
    }

    if (!formData.propertyStatus) {
      newErrors.propertyStatus = 'Please select property status'
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
        message: 'Thank you for applying for a Home Loan! Our loan experts will review your application and contact you within 24 hours to discuss loan options, interest rates, and next steps. For immediate assistance, please call us at +91 98765 43210.'
      })
      
      setFormData({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        loanAmount: '',
        loanPurpose: '',
        propertyStatus: '',
        propertyType: '',
        propertyValue: '',
        propertyLocation: '',
        employmentType: '',
        monthlyIncome: '',
        existingLoans: '',
        creditScore: '',
        downPayment: '',
        loanTenure: '',
        city: '',
        state: '',
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-blue-900 mb-4 tracking-tight">
            Home Loan Application
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Make Your Dream Home a Reality with Our Flexible Loan Options
          </p>
          <div className="mt-4 h-1 w-24 bg-blue-900 mx-auto rounded-full"></div>
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-900 overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-900 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white text-center">
              Apply for Home Loan Today
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Share your details and our loan experts will help you find the best home loan options
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

              {/* Loan Amount and Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="loanAmount" className="block text-sm font-semibold text-blue-900 mb-2">
                    Loan Amount Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                      errors.loanAmount ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                    }`}
                    placeholder="Enter amount (e.g., 50,00,000)"
                  />
                  {errors.loanAmount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.loanAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="loanPurpose" className="block text-sm font-semibold text-blue-900 mb-2">
                    Loan Purpose
                  </label>
                  <select
                    id="loanPurpose"
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select loan purpose</option>
                    <option value="purchase-new">Purchase New Property</option>
                    <option value="purchase-resale">Purchase Resale Property</option>
                    <option value="construction">Home Construction</option>
                    <option value="renovation">Home Renovation</option>
                    <option value="extension">Home Extension</option>
                    <option value="plot-purchase">Plot Purchase</option>
                    <option value="balance-transfer">Balance Transfer</option>
                    <option value="top-up">Top-up Loan</option>
                  </select>
                </div>
              </div>

              {/* Property Status */}
              <div>
                <label htmlFor="propertyStatus" className="block text-sm font-semibold text-blue-900 mb-2">
                  Property Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="propertyStatus"
                  name="propertyStatus"
                  value={formData.propertyStatus}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all ${
                    errors.propertyStatus ? 'border-red-400 bg-red-50' : 'border-blue-900 hover:border-blue-700'
                  }`}
                >
                  <option value="">Select property status</option>
                  <option value="identified">Property Identified</option>
                  <option value="not-decided">Property Not Yet Decided</option>
                  <option value="under-negotiation">Under Negotiation</option>
                  <option value="token-paid">Token Amount Paid</option>
                  <option value="agreement-signed">Agreement Signed</option>
                </select>
                {errors.propertyStatus && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.propertyStatus}
                  </p>
                )}
              </div>

              {/* Property Type and Value */}
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
                    <option value="apartment">Apartment/Flat</option>
                    <option value="independent-house">Independent House</option>
                    <option value="villa">Villa</option>
                    <option value="plot">Plot/Land</option>
                    <option value="duplex">Duplex</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="studio">Studio Apartment</option>
                    <option value="row-house">Row House</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="propertyValue" className="block text-sm font-semibold text-blue-900 mb-2">
                    Property Value
                  </label>
                  <input
                    type="text"
                    id="propertyValue"
                    name="propertyValue"
                    value={formData.propertyValue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="Enter property value"
                  />
                </div>
              </div>

              {/* Property Location */}
              <div>
                <label htmlFor="propertyLocation" className="block text-sm font-semibold text-blue-900 mb-2">
                  Property Location
                </label>
                <input
                  type="text"
                  id="propertyLocation"
                  name="propertyLocation"
                  value={formData.propertyLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  placeholder="Enter property location/area"
                />
              </div>

              {/* Employment Type and Monthly Income */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employmentType" className="block text-sm font-semibold text-blue-900 mb-2">
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select employment type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed-professional">Self-Employed Professional</option>
                    <option value="self-employed-business">Self-Employed Business</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="retired">Retired</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-semibold text-blue-900 mb-2">
                    Monthly Income
                  </label>
                  <select
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select income range</option>
                    <option value="under-25k">Under ₹25,000</option>
                    <option value="25k-50k">₹25,000 - 50,000</option>
                    <option value="50k-75k">₹50,000 - 75,000</option>
                    <option value="75k-1lakh">₹75,000 - 1 Lakh</option>
                    <option value="1-2lakh">₹1 - 2 Lakhs</option>
                    <option value="2-5lakh">₹2 - 5 Lakhs</option>
                    <option value="above-5lakh">Above ₹5 Lakhs</option>
                  </select>
                </div>
              </div>

              {/* Existing Loans and Credit Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="existingLoans" className="block text-sm font-semibold text-blue-900 mb-2">
                    Existing Loans/EMIs
                  </label>
                  <select
                    id="existingLoans"
                    name="existingLoans"
                    value={formData.existingLoans}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select option</option>
                    <option value="no-loans">No Existing Loans</option>
                    <option value="under-10k">Under ₹10,000/month</option>
                    <option value="10k-25k">₹10,000 - 25,000/month</option>
                    <option value="25k-50k">₹25,000 - 50,000/month</option>
                    <option value="above-50k">Above ₹50,000/month</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="creditScore" className="block text-sm font-semibold text-blue-900 mb-2">
                    Credit Score (if known)
                  </label>
                  <select
                    id="creditScore"
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select credit score range</option>
                    <option value="dont-know">Don't Know</option>
                    <option value="below-650">Below 650</option>
                    <option value="650-700">650 - 700</option>
                    <option value="700-750">700 - 750</option>
                    <option value="750-800">750 - 800</option>
                    <option value="above-800">Above 800</option>
                  </select>
                </div>
              </div>

              {/* Down Payment and Loan Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="downPayment" className="block text-sm font-semibold text-blue-900 mb-2">
                    Down Payment Available
                  </label>
                  <input
                    type="text"
                    id="downPayment"
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="Enter down payment amount"
                  />
                </div>

                <div>
                  <label htmlFor="loanTenure" className="block text-sm font-semibold text-blue-900 mb-2">
                    Preferred Loan Tenure
                  </label>
                  <select
                    id="loanTenure"
                    name="loanTenure"
                    value={formData.loanTenure}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                  >
                    <option value="">Select tenure</option>
                    <option value="5-years">5 Years</option>
                    <option value="10-years">10 Years</option>
                    <option value="15-years">15 Years</option>
                    <option value="20-years">20 Years</option>
                    <option value="25-years">25 Years</option>
                    <option value="30-years">30 Years</option>
                  </select>
                </div>
              </div>

              {/* Current Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-blue-900 mb-2">
                    Current City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-blue-900 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all"
                    placeholder="Enter state"
                  />
                </div>
              </div>
              
              {/* Additional Information */}
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-semibold text-blue-900 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent hover:border-blue-700 transition-all resize-none"
                  placeholder="Share any additional details about your property, co-applicant information, special requirements, or any questions you have about the home loan process..."
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
                      Apply for Home Loan
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
                  <strong>Loan Disclaimer:</strong> Home loan approval is subject to credit assessment, property valuation, and bank policies. Interest rates and loan amounts are subject to eligibility criteria. Processing fees and other charges may apply. All loan details are indicative and subject to final approval by the lending institution.
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Competitive Interest Rates
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Quick Approval
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Need immediate assistance? Call us at{' '}
            <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:text-blue-700 transition-colors">
              +91 98765 43210
            </a>
          </p>
          <p className="text-xs text-gray-600">
            Our home loan experts are available Monday to Saturday, 9:00 AM - 7:00 PM
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeLoan