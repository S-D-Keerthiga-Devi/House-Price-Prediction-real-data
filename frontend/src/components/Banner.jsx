import React, { useState } from "react";
import {
  Search,
  BarChart3,
  Building2,
  PieChart,
  Lightbulb,
  Briefcase,
} from "lucide-react";

export default function Banner({ onScrollToForm }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden mt-16">
      {/* Background Image with Subtle Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(to bottom right, rgba(0,28,64,0.65), rgba(0,48,96,0.65)),
              url('https://images.pexels.com/photos/3646913/pexels-photo-3646913.jpeg')
            `,
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden px-8 py-12 md:px-12 md:py-16 transition-all hover:shadow-2xl">
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {/* Quote */}
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-snug">
                Explore properties,
                <br />
                gain insights, and unlock
                <br />
                new investment opportunities
              </h1>

              {/* Navy Search Bar */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all max-w-xl">
                <div className="flex items-center">
                  {/* Buy/Rent Selector */}
                  <div className="relative bg-gray-50 border-r border-gray-200 flex-shrink-0">
                    <select className="bg-transparent text-gray-700 px-4 py-3 text-sm font-medium cursor-pointer focus:outline-none appearance-none hover:bg-gray-100 transition-colors pr-8">
                      <option value="buy">Buy</option>
                      <option value="rent">Rent</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search location or property"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-sm bg-white min-w-0"
                  />

                  {/* Search Button */}
                  <button className="bg-blue-800 text-white px-4 py-4 hover:bg-blue-900 transition-colors flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Column - Services */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Services</h2>
              <div className="space-y-3">
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Property Valuation Report
                  </span>
                </button>
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">Comparator</span>
                </button>
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Lightbulb className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Smart Insights
                  </span>
                </button>
              </div>
              <button className="text-blue-800 hover:text-blue-900 font-medium flex items-center gap-2">
                More Services →
              </button>
            </div>

            {/* Right Column - Investments */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Investments</h2>
              <div className="space-y-3">
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <PieChart className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Fractional Investment
                  </span>
                </button>
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">REIT / SM REIT</span>
                </button>
                <button className="group w-full bg-blue-50 hover:bg-blue-100 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-blue-100 hover:border-blue-200 hover:shadow-md text-left">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5 text-blue-800" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Venture Invest
                  </span>
                </button>
              </div>
              <button className="text-blue-800 hover:text-blue-900 font-medium flex items-center gap-2">
                More Investments →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
