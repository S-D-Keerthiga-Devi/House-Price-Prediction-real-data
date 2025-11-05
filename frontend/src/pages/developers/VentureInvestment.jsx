import React, { useState } from 'react';

function VentureInvestment() {
  const [formData, setFormData] = useState({
    firstName: '',
    mobileNumber: '',
    email: '',
    investmentAmount: '',
    industryPreference: '',
    riskTolerance: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Thank you! Our team will contact you within 24 hours.');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 py-12 mt-20">
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          Venture Investment
        </h2>
        <p className="text-blue-700 text-center mb-6 text-sm">
          Invest in high-growth startups
        </p>
        
        <div className="space-y-4">
          {/* Full Name and Mobile Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-blue-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-blue-900 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-900 font-semibold text-sm">+91</span>
                </div>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  maxLength="10"
                  className="pl-12 w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
                  placeholder="Mobile number"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Investment Amount and Industry Preference */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="investmentAmount" className="block text-sm font-semibold text-blue-900 mb-2">
                Investment Amount
              </label>
              <select
                id="investmentAmount"
                name="investmentAmount"
                value={formData.investmentAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
              >
                <option value="">Select amount</option>
                <option value="under-5lakh">Under ₹5L</option>
                <option value="5-10lakh">₹5 - 10L</option>
                <option value="10-25lakh">₹10 - 25L</option>
                <option value="25-50lakh">₹25 - 50L</option>
                <option value="50lakh-1cr">₹50L - 1Cr</option>
                <option value="1-5cr">₹1 - 5Cr</option>
                <option value="above-5cr">Above ₹5Cr</option>
              </select>
            </div>

            <div>
              <label htmlFor="industryPreference" className="block text-sm font-semibold text-blue-900 mb-2">
                Industry
              </label>
              <select
                id="industryPreference"
                name="industryPreference"
                value={formData.industryPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-900"
              >
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="fintech">Fintech</option>
                <option value="healthcare">Healthcare</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS</option>
                <option value="ai-ml">AI & ML</option>
                <option value="clean-energy">Clean Energy</option>
                <option value="edtech">EdTech</option>
                <option value="diverse">Diversified</option>
              </select>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-3">
              Risk Tolerance
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="riskTolerance"
                  value="conservative"
                  checked={formData.riskTolerance === 'conservative'}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-900 focus:ring-blue-500 border-blue-900 cursor-pointer"
                />
                <span className="ml-2 text-blue-900 font-medium">Low</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="riskTolerance"
                  value="moderate"
                  checked={formData.riskTolerance === 'moderate'}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-900 focus:ring-blue-500 border-blue-900 cursor-pointer"
                />
                <span className="ml-2 text-blue-900 font-medium">Medium</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="riskTolerance"
                  value="aggressive"
                  checked={formData.riskTolerance === 'aggressive'}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-900 focus:ring-blue-500 border-blue-900 cursor-pointer"
                />
                <span className="ml-2 text-blue-900 font-medium">High</span>
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
              {isSubmitting ? 'Submitting...' : 'Get Investment Opportunities'}
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="pt-2">
            <p className="text-xs text-blue-700 text-center">
              By continuing I agree to Terms & Conditions
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">Startup Investment</h3>
          <p className="text-sm text-blue-700">Curated opportunities from top startups</p>
        </div>
      </div>
    </div>
  );
}

export default VentureInvestment;