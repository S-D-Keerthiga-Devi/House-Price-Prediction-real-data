import React, { useState } from "react";
import {
  ArrowRight,
  MapPin,
  TrendingUp,
  BarChart2,
  PieChart,
  Building2,
  Users,
  ShoppingCart,
  FileText,
  Eye,
  Brain,
  Coins,
  Briefcase,
} from "lucide-react";

export default function Banner({ onScrollToForm }) {
  const [activeTab, setActiveTab] = useState("services");

  const servicesContent = {
    developers: {
      title: "For Developers",
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      services: ["Property Valuation Report", "Price Comparator", "Smart Market Insights"],
    },
    dealers: {
      title: "For Dealers",
      icon: <Users className="w-6 h-6 text-green-500" />,
      services: ["Portfolio Valuation", "Deal Comparator", "Market Intelligence"],
    },
    buyers: {
      title: "For Buyers",
      icon: <ShoppingCart className="w-6 h-6 text-purple-500" />,
      services: ["Property Assessment", "Neighborhood Analysis", "Investment Advice"],
    },
  };

  const investmentOptions = [
    { title: "Fractional Investment", icon: <PieChart className="w-5 h-5 text-amber-500" /> },
    { title: "REIT / SM REIT", icon: <BarChart2 className="w-5 h-5 text-green-500" /> },
    { title: "Venture Invest", icon: <Briefcase className="w-5 h-5 text-blue-500" /> },
  ];

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0">
        {/* Light orange-peach gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50"></div>

        {/* Very subtle pastel dots */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 200, 150, 0.25) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>



      {/* Content Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full mt-14">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Column 1: Main Content */}
          <div className="lg:col-span-1">
            <h1 className="text-5xl xl:text-6xl font-bold leading-tight mb-8 text-gray-900">
              Know Your <br />
              <span className="text-gray-800">Property's</span> <br />
              <span className="text-gray-900">Value Instantly</span>
            </h1>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our AI-powered platform provides property analysis, market insights, and
              investment opportunities. Make data-driven decisions with confidence.
            </p>

            <button
              onClick={onScrollToForm}
              className="flex items-center bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Price Estimate
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Services</h2>
              <div className="space-y-6">
                {Object.values(servicesContent).map((category, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {category.services.map((srv, idx) => (
                          <li key={idx}>
                            <button
                              className="text-left w-full px-2 py-1 rounded-md hover:bg-orange-50 hover:text-orange-600 transition"
                              onClick={() => console.log(`Clicked ${srv}`)} // replace with navigation or action
                            >
                              {srv}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Column 3: Investments */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Investments</h2>
              <div className="space-y-6">
                {investmentOptions.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => console.log(`Clicked ${option.title}`)} // Replace with navigation or action
                    className="flex items-start gap-4 w-full text-left p-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
