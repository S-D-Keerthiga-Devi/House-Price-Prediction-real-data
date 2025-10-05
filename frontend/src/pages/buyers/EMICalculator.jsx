import React, { useState, useEffect } from 'react';
import { Home, Plus, Trash2, Save } from 'lucide-react';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [tenure, setTenure] = useState(10);
  const [interest, setInterest] = useState(9);
  const [showPrePayment, setShowPrePayment] = useState(false);
  const [prePaymentAmount, setPrePaymentAmount] = useState(50000);
  const [prePaymentFrequency, setPrePaymentFrequency] = useState('monthly');
  const [prePaymentStartDate, setPrePaymentStartDate] = useState('2025-11-01');
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interest / 12 / 100;
    const numberOfMonths = tenure * 12;
    
    const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);
    
    const totalAmount = emi * numberOfMonths;
    const totalInterest = totalAmount - principal;
    const processingFees = 25000;
    
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      processingFees,
      principal
    };
  };
  
  const handleSaveData = async () => {
    const result = calculateEMI();
    const dataToSave = {
      loanAmount,
      tenure,
      interest,
      emi: result.emi,
      totalInterest: result.totalInterest,
      processingFees: result.processingFees,
      prePayment: showPrePayment ? {
        amount: prePaymentAmount,
        frequency: prePaymentFrequency,
        startDate: prePaymentStartDate
      } : null
    };
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/emi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setSavedData([...savedData, { ...dataToSave, timestamp: new Date().toISOString() }]);
        alert('Data saved successfully!');
        console.log('Saved data:', responseData.data);
      } else {
        alert('Failed to save data: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateAmortizationSchedule = () => {
    const principal = loanAmount;
    const monthlyRate = interest / 12 / 100;
    let totalMonths = tenure * 12;
    const emi = calculateEMI().emi;
    
    let balance = principal;
    const schedule = [];
    let currentYear = 2025;
    let currentMonth = 10; // October (1-indexed)
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let yearData = { 
      year: currentYear, 
      principal: 0, 
      interest: 0, 
      balance: 0, 
      paid: 0, 
      prePayment: 0,
      months: []
    };
    
    for (let month = 1; month <= totalMonths && balance > 0.01; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = emi - interestPayment;
      
      // Handle last payment
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;
      
      // Check for pre-payment
      let monthlyPrePayment = 0;
      if (showPrePayment && balance > 0.01) {
        const paymentDate = new Date(prePaymentStartDate);
        const currentDate = new Date(currentYear, currentMonth - 1, 1);
        
        if (currentDate >= paymentDate) {
          if (prePaymentFrequency === 'monthly') {
            monthlyPrePayment = prePaymentAmount;
          } else if (prePaymentFrequency === 'yearly' && currentMonth === paymentDate.getMonth() + 1) {
            monthlyPrePayment = prePaymentAmount;
          }
          
          if (monthlyPrePayment > balance) {
            monthlyPrePayment = balance;
          }
          balance -= monthlyPrePayment;
        }
      }
      
      yearData.principal += principalPayment;
      yearData.interest += interestPayment;
      yearData.prePayment += monthlyPrePayment;
      
      yearData.months.push({
        month: monthNames[currentMonth - 1],
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        paid: ((principal - balance) / principal) * 100,
        prePayment: monthlyPrePayment
      });
      
      // Move to next month
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        // End of year - save year data and start new year
        yearData.balance = Math.max(0, balance);
        yearData.paid = ((principal - balance) / principal) * 100;
        schedule.push({ ...yearData });
        
        currentYear++;
        yearData = { 
          year: currentYear, 
          principal: 0, 
          interest: 0, 
          balance: 0, 
          paid: 0, 
          prePayment: 0,
          months: []
        };
      }
    }
    
    // Push last year if it has data
    if (yearData.months.length > 0) {
      yearData.balance = Math.max(0, balance);
      yearData.paid = 100;
      schedule.push({ ...yearData });
    }
    
    return schedule;
  };
  
  // Fetch saved data on component mount
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/emi');
        const data = await response.json();
        if (data.success) {
          setSavedData(data.data);
        }
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    fetchSavedData();
  }, []);
  
  const result = calculateEMI();
  const amortizationSchedule = generateAmortizationSchedule();
  
  // Calculate total with pre-payments
  const totalPrePayment = amortizationSchedule.reduce((sum, year) => sum + year.prePayment, 0);
  const totalWithFees = result.principal + result.totalInterest + result.processingFees;
  
  const principalPercentage = (result.principal / totalWithFees) * 100;
  const interestPercentage = (result.totalInterest / totalWithFees) * 100;
  const feesPercentage = (result.processingFees / totalWithFees) * 100;
  
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };
  
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(num);
  };
  
  return (
    <div className="min-h-screen bg-white p-4 md:p-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between border-b-4 border-blue-900">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-3 rounded-lg">
              <Home className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Home Loan EMI Calculator</h1>
          </div>
          <button
            onClick={handleSaveData}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-900 text-white hover:bg-blue-800'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Data
              </>
            )}
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Left Panel - Input Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6 border-l-4 border-blue-900">
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-900 font-semibold text-base">Loan Amount (₹)</label>
                <span className="text-sm text-gray-600 font-medium">₹1L - ₹5Cr</span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${((loanAmount - 100000) / (50000000 - 100000)) * 100}%, #d1d5db ${((loanAmount - 100000) / (50000000 - 100000)) * 100}%, #d1d5db 100%)`
                }}
              />
              <input
                type="text"
                value={formatCurrency(loanAmount)}
                readOnly
                className="w-full mt-3 p-3 border-2 border-gray-300 rounded-lg text-lg font-semibold text-gray-900 bg-gray-50 focus:outline-none"
              />
            </div>
            
            {/* Tenure */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-900 font-semibold text-base">Tenure (Years)</label>
                <span className="text-sm text-gray-600 font-medium">2 - 30</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${((tenure - 2) / (30 - 2)) * 100}%, #d1d5db ${((tenure - 2) / (30 - 2)) * 100}%, #d1d5db 100%)`
                }}
              />
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full mt-3 p-3 border-2 border-gray-300 rounded-lg text-lg font-semibold text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-900"
              />
            </div>
            
            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-gray-900 font-semibold text-base">Rate of Interest (%)</label>
                <span className="text-sm text-gray-600 font-medium">7% - 15%</span>
              </div>
              <input
                type="range"
                min="7"
                max="15"
                step="0.1"
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${((interest - 7) / (15 - 7)) * 100}%, #d1d5db ${((interest - 7) / (15 - 7)) * 100}%, #d1d5db 100%)`
                }}
              />
              <input
                type="number"
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                step="0.1"
                className="w-full mt-3 p-3 border-2 border-gray-300 rounded-lg text-lg font-semibold text-gray-900 bg-gray-50 focus:outline-none focus:border-blue-900"
              />
            </div>
            
            {/* Pre-Payment Toggle */}
            <div className="pt-4 border-t-2 border-gray-200">
              <button
                onClick={() => setShowPrePayment(!showPrePayment)}
                className="flex items-center gap-2 text-blue-900 font-semibold hover:text-blue-800 transition-colors text-base"
              >
                <Plus size={22} />
                Add Pre-payment
              </button>
            </div>
            
            {/* Pre-Payment Options */}
            {showPrePayment && (
              <div className="bg-blue-50 rounded-lg p-5 space-y-4 border-2 border-blue-900">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">Pre-Payment Details</h3>
                
                <div>
                  <label className="text-sm text-gray-700 mb-2 block font-semibold">Amount(₹)</label>
                  <input
                    type="number"
                    value={prePaymentAmount}
                    onChange={(e) => setPrePaymentAmount(Number(e.target.value))}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 bg-white"
                    placeholder="₹ 50,000"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-700 mb-2 block font-semibold">Frequency</label>
                  <div className="relative">
                    <select
                      value={prePaymentFrequency}
                      onChange={(e) => setPrePaymentFrequency(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 bg-white appearance-none cursor-pointer pr-10"
                    >
                      <option value="monthly">Every Month</option>
                      <option value="yearly">Every Year</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-700 mb-2 block font-semibold">Pre-Payment Start Date</label>
                  <input
                    type="date"
                    value={prePaymentStartDate}
                    onChange={(e) => setPrePaymentStartDate(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 bg-white"
                  />
                </div>
                
                <button
                  onClick={() => setShowPrePayment(false)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors mt-4"
                >
                  <Trash2 size={18} />
                  Delete Pre-Payment
                </button>
              </div>
            )}
          </div>
          
          {/* Right Panel - Results */}
          <div className="space-y-6">
            {/* EMI Display */}
            <div className="bg-blue-900 rounded-lg shadow-md p-8 text-white border-b-4 border-blue-800">
              <p className="text-base opacity-90 mb-2 font-medium">Your EMI Per Month</p>
              <h2 className="text-5xl font-bold">{formatCurrency(result.emi)}</h2>
            </div>
            
            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-900">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Principal */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1e3a8a"
                    strokeWidth="40"
                    strokeDasharray={`${principalPercentage * 5.03} ${500 - principalPercentage * 5.03}`}
                    className="cursor-pointer transition-all duration-300"
                    style={{ strokeWidth: hoveredSegment === 'principal' ? '45' : '40' }}
                    onMouseEnter={() => setHoveredSegment('principal')}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  {/* Interest */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="40"
                    strokeDasharray={`${interestPercentage * 5.03} ${500 - interestPercentage * 5.03}`}
                    strokeDashoffset={-principalPercentage * 5.03}
                    className="cursor-pointer transition-all duration-300"
                    style={{ strokeWidth: hoveredSegment === 'interest' ? '45' : '40' }}
                    onMouseEnter={() => setHoveredSegment('interest')}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                  {/* Fees */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="40"
                    strokeDasharray={`${feesPercentage * 5.03} ${500 - feesPercentage * 5.03}`}
                    strokeDashoffset={-(principalPercentage + interestPercentage) * 5.03}
                    className="cursor-pointer transition-all duration-300"
                    style={{ strokeWidth: hoveredSegment === 'fees' ? '45' : '40' }}
                    onMouseEnter={() => setHoveredSegment('fees')}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                </svg>
                
                {/* Hover Tooltip */}
                {hoveredSegment && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-900 text-center z-10">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {hoveredSegment === 'principal' && 'Loan Amount'}
                      {hoveredSegment === 'interest' && 'Total Interest'}
                      {hoveredSegment === 'fees' && 'Processing Fees'}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {hoveredSegment === 'principal' && formatCurrency(result.principal)}
                      {hoveredSegment === 'interest' && formatCurrency(result.totalInterest)}
                      {hoveredSegment === 'fees' && formatCurrency(result.processingFees)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {hoveredSegment === 'principal' && `${principalPercentage.toFixed(1)}%`}
                      {hoveredSegment === 'interest' && `${interestPercentage.toFixed(1)}%`}
                      {hoveredSegment === 'fees' && `${feesPercentage.toFixed(1)}%`}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Legend */}
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border-2 border-blue-900"
                  onMouseEnter={() => setHoveredSegment('interest')}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-700"></div>
                    <span className="text-gray-900 font-semibold text-sm">Total Interest</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(result.totalInterest)}</span>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border-2 border-blue-900"
                  onMouseEnter={() => setHoveredSegment('fees')}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                    <span className="text-gray-900 font-semibold text-sm">Processing Fees</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(result.processingFees)}</span>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border-2 border-blue-900 bg-blue-50"
                  onMouseEnter={() => setHoveredSegment('principal')}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-900"></div>
                    <span className="text-gray-900 font-semibold text-sm">Loan Amount</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatCurrency(result.principal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Amortization Table */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-900 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Home Loan Amortization Table</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-4 text-left text-sm font-semibold">Year<br/>(yyyy)</th>
                  <th className="p-4 text-right text-sm font-semibold">Principal<br/>(₹)</th>
                  <th className="p-4 text-right text-sm font-semibold">Interest<br/>(₹)</th>
                  <th className="p-4 text-right text-sm font-semibold">Balance<br/>(₹)</th>
                  <th className="p-4 text-right text-sm font-semibold">Paid<br/>(%)</th>
                  <th className="p-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row, index) => (
                  <React.Fragment key={row.year}>
                    <tr 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors border-b border-gray-200`}
                    >
                      <td className="p-4">
                        <span className="text-blue-900 font-semibold">{row.year}</span>
                      </td>
                      <td className="p-4 text-right font-semibold text-gray-900">{formatNumber(row.principal)}</td>
                      <td className="p-4 text-right font-semibold text-gray-900">{formatNumber(row.interest)}</td>
                      <td className="p-4 text-right">
                        <div className="font-semibold text-gray-900">{formatNumber(row.balance)}</div>
                        {row.prePayment > 0 && (
                          <div className="text-xs text-green-700 font-semibold mt-1">
                            Pre Payment: {formatCurrency(row.prePayment)}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right font-semibold text-gray-900">{row.paid.toFixed(2)}%</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setExpandedYears({...expandedYears, [row.year]: !expandedYears[row.year]})}
                          className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
                        >
                          {expandedYears[row.year] ? 'Collapse' : 'Expand'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Monthly Breakdown */}
                    {expandedYears[row.year] && (
                      <tr>
                        <td colSpan="6" className="p-0">
                          <div className="bg-blue-50 border-l-4 border-blue-900">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-blue-800 text-white">
                                  <th className="p-3 text-left text-xs font-semibold">Month</th>
                                  <th className="p-3 text-right text-xs font-semibold">Principal (₹)</th>
                                  <th className="p-3 text-right text-xs font-semibold">Interest (₹)</th>
                                  <th className="p-3 text-right text-xs font-semibold">Balance (₹)</th>
                                  <th className="p-3 text-right text-xs font-semibold">Paid (%)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.months.map((monthData, mIndex) => (
                                  <tr 
                                    key={mIndex}
                                    className={`${mIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                                  >
                                    <td className="p-3 text-sm text-gray-900 font-medium">{monthData.month}</td>
                                    <td className="p-3 text-right text-sm text-gray-900">{formatNumber(monthData.principal)}</td>
                                    <td className="p-3 text-right text-sm text-gray-900">{formatNumber(monthData.interest)}</td>
                                    <td className="p-3 text-right text-sm">
                                      <div className="text-gray-900">{formatNumber(monthData.balance)}</div>
                                      {monthData.prePayment > 0 && (
                                        <div className="text-xs text-green-700 font-semibold mt-1">
                                          +{formatCurrency(monthData.prePayment)}
                                        </div>
                                      )}
                                    </td>
                                    <td className="p-3 text-right text-sm text-gray-900">{monthData.paid.toFixed(2)}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Saved EMI Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-900">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved EMI Results</h2>
          
          {savedData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="p-3 text-left text-sm font-semibold">Date</th>
                    <th className="p-3 text-right text-sm font-semibold">Loan Amount</th>
                    <th className="p-3 text-right text-sm font-semibold">Tenure</th>
                    <th className="p-3 text-right text-sm font-semibold">Interest</th>
                    <th className="p-3 text-right text-sm font-semibold">EMI</th>
                    <th className="p-3 text-right text-sm font-semibold">Total Interest</th>
                    <th className="p-3 text-right text-sm font-semibold">Pre-Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {savedData.map((data, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-sm">
                        {new Date(data.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right text-sm font-semibold">
                        {formatCurrency(data.loanAmount)}
                      </td>
                      <td className="p-3 text-right text-sm">{data.tenure} years</td>
                      <td className="p-3 text-right text-sm">{data.interest}%</td>
                      <td className="p-3 text-right text-sm font-semibold">
                        {formatCurrency(data.emi)}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {formatCurrency(data.totalInterest)}
                      </td>
                      <td className="p-3 text-right text-sm">
                        {data.prePayment ? 
                          `${formatCurrency(data.prePayment.amount)} (${data.prePayment.frequency})` : 
                          'None'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No saved EMI results found. Calculate and save your EMI results to see them here.</p>
          )}
        </div>
      </div>
    </div>
  );
}