import React, { useState } from "react";
import { ArrowRight, MapPin, TrendingUp, BarChart2, PieChart, Building2, Users, ShoppingCart, FileText, Eye, Brain, Coins, TrendingDown, Briefcase, ChevronRight } from "lucide-react";

export default function Banner({ onScrollToForm }) {
  const [activeTab, setActiveTab] = useState("services");

  const tabs = [
    { id: "services", label: "Services", icon: <Building2 className="w-4 h-4" /> },
    { id: "insights", label: "Insights", icon: <Eye className="w-4 h-4" /> },
    { id: "investment", label: "Investment", icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const servicesContent = {
    developers: {
      title: "For Developers",
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      services: [
        { name: "Property Valuation Report", desc: "Comprehensive market analysis" },
        { name: "Price Comparator", desc: "Competitive pricing insights" },
        { name: "Smart Market Insights", desc: "AI-powered market trends" }
      ]
    },
    dealers: {
      title: "For Dealers",
      icon: <Users className="w-6 h-6 text-green-500" />,
      services: [
        { name: "Portfolio Valuation", desc: "Multi-property analysis" },
        { name: "Deal Comparator", desc: "Transaction benchmarking" },
        { name: "Market Intelligence", desc: "Real-time market data" }
      ]
    },
    buyers: {
      title: "For Buyers",
      icon: <ShoppingCart className="w-6 h-6 text-purple-500" />,
      services: [
        { name: "Property Assessment", desc: "Fair value estimation" },
        { name: "Neighborhood Analysis", desc: "Area growth potential" },
        { name: "Investment Advice", desc: "Personalized recommendations" }
      ]
    }
  };

  const investmentOptions = [
    {
      title: "Fractional Investment",
      desc: "Own a fraction of premium properties",
      icon: <PieChart className="w-5 h-5 text-amber-500" />,
      link: "/fractional-investment"
    },
    {
      title: "REIT / SM REIT",
      desc: "Real Estate Investment Trusts",
      icon: <BarChart2 className="w-5 h-5 text-green-500" />,
      link: "/reit-investment"
    },
    {
      title: "Venture Invest",
      desc: "High-growth property ventures",
      icon: <Briefcase className="w-5 h-5 text-blue-500" />,
      link: "/venture-investment"
    }
  ];

  return (
    <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-10 mt-6">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1682309553075-c84ea8d9d49a?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury home exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
      </div>

      {/* Content Grid - 3 Columns */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* Column 1: Main Content (1/3) */}
          <div className="lg:col-span-1 text-white">
            <div className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-amber-400 bg-black/50 rounded-full border border-amber-400/50 backdrop-blur-sm">
              <Coins className="w-4 h-4 mr-2" />
              Compare, Predict, and Decide
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Know Your{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Property's Value
              </span>{" "}
              Instantly
            </h1>

            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Our AI-powered platform provides comprehensive property analysis, market insights, and investment opportunities. Make data-driven decisions with confidence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={onScrollToForm}
                className="group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 
             text-white px-4 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl 
             transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
              >
                <span>Get Price Estimate</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-black/30 p-1 rounded-xl backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Services Section (1/3) */}
          <div className="lg:col-span-1">
            {activeTab === "services" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">Our Services</h2>
                {Object.values(servicesContent).map((category, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        {category.icon}
                      </div>
                      <h3 className="text-white font-semibold text-base">{category.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.services.map((service, idx) => (
                        <div key={idx} className="flex items-start gap-2 group cursor-pointer">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 group-hover:scale-125 transition-transform"></div>
                          <div>
                            <h4 className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors">
                              {service.name}
                            </h4>
                            <p className="text-gray-400 text-[11px] mt-0.5 hidden sm:block">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}


            {activeTab === "insights" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Market Insights</h2>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-8 h-8 text-purple-400" />
                    <h3 className="text-white font-bold text-lg">AI-Powered Analytics</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                      <span className="text-gray-300 text-sm">Market Trend Analysis</span>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                      <span className="text-gray-300 text-sm">Price Prediction Models</span>
                      <BarChart2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                      <span className="text-gray-300 text-sm">Neighborhood Scoring</span>
                      <MapPin className="w-4 h-4 text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "investment" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Investment Options</h2>
                {investmentOptions.map((option, index) => (
                  <a
                    key={index}
                    href={option.link}
                    className="block bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          {option.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg group-hover:text-amber-400 transition-colors">{option.title}</h3>
                          <p className="text-gray-400 text-sm">{option.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Statistics & Features (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Why Choose Us</h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg border border-amber-400/30 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-400 mb-1">10K+</div>
                <div className="text-gray-300 text-sm">Properties Analyzed</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">95%</div>
                <div className="text-gray-300 text-sm">Accuracy Rate</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">50+</div>
                <div className="text-gray-300 text-sm">Cities Covered</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-gray-300 text-sm">Support</div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Platform Features</h3>
              <div className="space-y-3">
                {[
                  { icon: <FileText className="w-4 h-4" />, text: "Detailed Property Reports" },
                  { icon: <BarChart2 className="w-4 h-4" />, text: "Real-time Market Data" },
                  { icon: <Brain className="w-4 h-4" />, text: "AI-Powered Predictions" },
                  { icon: <MapPin className="w-4 h-4" />, text: "Location Intelligence" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                    <div className="text-amber-400">{feature.icon}</div>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-lg border border-amber-400/30 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Ready to Get Started?</h3>
              <p className="text-gray-300 text-sm mb-4">Join thousands of satisfied users</p>
              <button
                onClick={onScrollToForm}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
              >
                Start Analysis
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}