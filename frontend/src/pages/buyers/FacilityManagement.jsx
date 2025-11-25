import React, { useState } from 'react';
import { submitFacilityManagement } from '../../api/buyerApi';

function FacilityManagement() {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    propertyType: '',
    serviceType: '',
    additionalDetails: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select a property type';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFacilityManagement(formData);

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your request for facility management services has been submitted. Our team will contact you shortly.'
      });

      setFormData({
        name: '',
        mobileNumber: '',
        propertyType: '',
        serviceType: '',
        additionalDetails: ''
      });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 10000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-28 mb-4">
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          Facility Management
        </h2>
        <p className="text-blue-700 text-center mb-6 text-sm">
          Get professional management for your property
        </p>

        {submitStatus && (
          <div className={`mb-4 p-3 rounded-lg ${submitStatus.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            <p className="text-sm text-center">{submitStatus.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-blue-900 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 ${errors.name ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-semibold text-blue-900 mb-2">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-blue-900 font-semibold">+91</span>
              </div>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                maxLength="10"
                className={`pl-16 w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 ${errors.mobileNumber ? 'border-red-400 bg-red-50' : 'border-blue-900'
                  }`}
                placeholder="Enter mobile number"
              />
            </div>
            {errors.mobileNumber && <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>}
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-semibold text-blue-900 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 ${errors.propertyType ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
            >
              <option value="">Select property type</option>
              <option value="school">School</option>
              <option value="hospital">Hospital</option>
              <option value="hotel">Hotel</option>
              <option value="mall">Mall</option>
              <option value="office">Office</option>
              <option value="residential-society">Residential Society</option>
              <option value="industrial">Industrial</option>
              <option value="other">Other</option>
            </select>
            {errors.propertyType && <p className="mt-1 text-xs text-red-600">{errors.propertyType}</p>}
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="serviceType" className="block text-sm font-semibold text-blue-900 mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 ${errors.serviceType ? 'border-red-400 bg-red-50' : 'border-blue-900'
                }`}
            >
              <option value="">Select service type</option>
              <option value="maintenance-in-house">Maintenance in house</option>
              <option value="security-services">Security Services</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="pest-control">Pest Control</option>
              <option value="electrical-maintenance">Electrical Maintenance</option>
              <option value="plumbing-services">Plumbing Services</option>
              <option value="other">Other</option>
            </select>
            {errors.serviceType && <p className="mt-1 text-xs text-red-600">{errors.serviceType}</p>}
          </div>

          {/* Additional Details */}
          <div>
            <label htmlFor="additionalDetails" className="block text-sm font-semibold text-blue-900 mb-2">
              Additional Details
            </label>
            <textarea
              id="additionalDetails"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900 resize-none"
              placeholder="Any specific requirements..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="pt-2">
            <p className="text-xs text-blue-700 text-center">
              By continuing I agree to HousePredict T&C
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FacilityManagement;
