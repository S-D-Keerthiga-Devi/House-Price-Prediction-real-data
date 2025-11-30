import React, { useState } from 'react';
import { submitHomeLoan } from '../../api/buyerApi';

function HomeLoan() {
  const [formData, setFormData] = useState({
    loanAmount: '',
    mobileNumber: '',
    city: '',
    propertyFinalized: ''
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

  const handleSubmit = async () => {
    console.log("DEBUG: Submitting Home Loan Form - Version 2025-11-30-v1");
    setIsSubmitting(true);

    try {
      await submitHomeLoan(formData);

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your request has been submitted successfully. Our team will contact you shortly.'
      });

      setFormData({
        loanAmount: '',
        mobileNumber: '',
        city: '',
        propertyFinalized: ''
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
          Get your Best Home Loan offer!
        </h2>
        <p className="text-blue-700 text-center mb-6 text-sm">
          Compare rates from top lenders
        </p>

        {submitStatus && (
          <div className={`mb-4 p-3 rounded-lg ${submitStatus.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            <p className="text-sm text-center">{submitStatus.message}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Loan Amount */}
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-semibold text-blue-900 mb-2">
              Enter Loan Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-blue-900 font-semibold">₹</span>
              </div>
              <input
                type="text"
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-semibold text-blue-900 mb-2">
              Mobile Number
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
                className="pl-16 w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-blue-900 mb-2">
              Which city are you buying in?
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
              placeholder="Enter city name"
            />
          </div>

          {/* Property Finalized */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-3">
              Have you finalized your property?
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="propertyFinalized"
                  value="yes"
                  checked={formData.propertyFinalized === 'yes'}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-900 focus:ring-blue-500 border-blue-900 cursor-pointer"
                />
                <span className="ml-2 text-blue-900 font-medium">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="propertyFinalized"
                  value="no"
                  checked={formData.propertyFinalized === 'no'}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-900 focus:ring-blue-500 border-blue-900 cursor-pointer"
                />
                <span className="ml-2 text-blue-900 font-medium">No</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? 'Checking...' : 'Check Offers'}
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="pt-2">
            <p className="text-xs text-blue-700 text-center">
              By continuing I agree to HousePredict T&C
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeLoan;