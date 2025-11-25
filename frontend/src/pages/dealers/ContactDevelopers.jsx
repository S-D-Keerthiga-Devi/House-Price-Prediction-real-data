import React, { useState } from 'react'
import { submitContactDeveloper } from '../../api/dealerApi'

function ContactDevelopers() {
  const [formData, setFormData] = useState({
    firstName: '',
    mobileNumber: '',
    email: '',
    company: '',
    inquiryType: '',
    projectType: '',
    budget: '',
    message: ''
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

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
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
      await submitContactDeveloper(formData)

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for contacting our real estate development team! We will get back to you within 24 hours. For urgent matters, call +91 98765 43210.'
      })

      setFormData({
        firstName: '',
        mobileNumber: '',
        email: '',
        company: '',
        inquiryType: '',
        projectType: '',
        budget: '',
        message: ''
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
          Contact Real Estate Developers
        </h2>
        <p className="text-blue-700 text-center mb-4 text-xs">
          Get in touch for custom real estate technology solutions
        </p>

        <div className="space-y-3">
          {submitStatus && (
            <div className={`mb-3 p-3 rounded-lg ${submitStatus.type === 'success'
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
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-blue-900'
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
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-blue-900'
                  }`}
                placeholder="10-digit number"
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>
              )}
            </div>
          </div>

          {/* Email and Company */}
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
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.email ? 'border-red-400 bg-red-50' : 'border-blue-900'
                  }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-xs font-semibold text-blue-900 mb-1">
                Company/Organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Company name"
              />
            </div>
          </div>

          {/* Inquiry Type and Project Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inquiryType" className="block text-xs font-semibold text-blue-900 mb-1">
                Inquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.inquiryType ? 'border-red-400 bg-red-50' : 'border-blue-900'
                  }`}
              >
                <option value="">Select inquiry type</option>
                <option value="property-listing">Property Listing Website</option>
                <option value="real-estate-portal">Real Estate Portal</option>
                <option value="property-management">Property Management System</option>
                <option value="real-estate-crm">Real Estate CRM</option>
                <option value="virtual-tour">Virtual Tour Solution</option>
                <option value="real-estate-app">Real Estate Mobile App</option>
                <option value="real-estate-analytics">Real Estate Analytics</option>
                <option value="mls-integration">MLS/Property Database Integration</option>
                <option value="maintenance-support">Maintenance & Support</option>
                <option value="other">Other Real Estate Inquiry</option>
              </select>
              {errors.inquiryType && (
                <p className="mt-1 text-xs text-red-600">{errors.inquiryType}</p>
              )}
            </div>

            <div>
              <label htmlFor="projectType" className="block text-xs font-semibold text-blue-900 mb-1">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select project type</option>
                <option value="property-website">Property Listing Website</option>
                <option value="real-estate-portal">Real Estate Portal</option>
                <option value="property-management">Property Management Software</option>
                <option value="real-estate-crm">Real Estate CRM</option>
                <option value="virtual-tour">Virtual Tour Platform</option>
                <option value="real-estate-mobile">Real Estate Mobile App</option>
                <option value="analytics-dashboard">Real Estate Analytics Dashboard</option>
                <option value="mls-integration">MLS/Property Database Integration</option>
                <option value="agent-portal">Real Estate Agent Portal</option>
                <option value="customer-portal">Customer Portal</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="budget" className="block text-xs font-semibold text-blue-900 mb-1">
                Estimated Budget
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select budget range</option>
                <option value="under-1lakh">Under ₹1 Lakh</option>
                <option value="1-3lakh">₹1 - 3 Lakhs</option>
                <option value="3-5lakh">₹3 - 5 Lakhs</option>
                <option value="5-10lakh">₹5 - 10 Lakhs</option>
                <option value="10-25lakh">₹10 - 25 Lakhs</option>
                <option value="25-50lakh">₹25 - 50 Lakhs</option>
                <option value="above-50lakh">Above ₹50 Lakhs</option>
                <option value="flexible">Flexible/Negotiable</option>
              </select>
            </div>
            <div></div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-blue-900 mb-1">
              Project Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="2"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm ${errors.message ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
              placeholder="Describe your real estate project requirements..."
            ></textarea>
            {errors.message && (
              <p className="mt-1 text-xs text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
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
          <h3 className="text-sm font-semibold text-blue-900 mb-1">Real Estate Development Services</h3>
          <p className="text-xs text-blue-700">Specialized solutions for property technology needs</p>
        </div>
      </div>
    </div>
  )
}

export default ContactDevelopers