import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Building2,
  User,
  FileText,
  Home,
  TrendingUp,
  BarChart2,
  ClipboardList,
  Users,
  Phone,
  ScrollText,
  Scale,
  Gavel,
  FileCheck,
  Columns3,
  Lightbulb,
  X,
  MapPin,
  ArrowUp,
  Calculator,
  Paintbrush,
  Banknote
} from "lucide-react"; 
import { useNavigate } from "react-router-dom";

// Smart Services Tabs
const smartServicesTabs = {
  Buyers: [
    { name: "Property Valuation", icon: <Home className="w-10 h-10 text-blue-600" />, link: "/property-valuation" },
    { name: "EMI Calculator", icon: <Calculator className="w-10 h-10 text-yellow-500" />, link: "/emi-calculator" },
    { name: "Rent Agreement", icon: <FileText className="w-10 h-10 text-green-600" />, link: "/rent-agreement" },
    { name: "Auctioned Property", icon: <Gavel className="w-10 h-10 text-orange-600" />, link: "/auctioned-property" },
    { name: "Escrow Services", icon: <Scale className="w-10 h-10 text-purple-600" />, link: "/escrow-services" },
    { name: "Comparator", icon: <Columns3 className="w-10 h-10 text-pink-600" />, link: "/comparator", isComparator: true },
    { name: "AI Interior Design", icon: <Paintbrush className="w-10 h-10 text-blue-600" />, link: "/interior"},
    { name: "Home Loan", icon: <Banknote className="w-10 h-10 text-amber-600" />, link: "/home-loan"},
  ],
  Developers: [
    { name: "Advertize With Us", icon: <Building2 className="w-10 h-10 text-orange-600" />, link: "/advertise-with-us" },
    { name: "Venture Investment", icon: <TrendingUp className="w-10 h-10 text-blue-600" />, link: "/venture-invest" },
    { name: "Data Insights", icon: <BarChart2 className="w-10 h-10 text-green-600" />, link: "/data-insights" },
    { name: "Market Trends", icon: <TrendingUp className="w-10 h-10 text-purple-600" />, link: "/market-trends" },
    { name: "Property Valuation", icon: <Home className="w-10 h-10 text-pink-600" />, link: "/property-valuation" },
  ],
  Dealers: [
    { name: "Listings", icon: <ClipboardList className="w-10 h-10 text-blue-600" />, link: "/listings" },
    { name: "Dealer Connect", icon: <Users className="w-10 h-10 text-green-600" />, link: "/dealer-connect" },
    { name: "Contact Developers", icon: <Phone className="w-10 h-10 text-orange-600" />, link: "/contact-developers" },
    { name: "Channel Partners", icon: <Briefcase className="w-10 h-10 text-purple-600" />, link: "/channel-partners" },
    { name: "Registration & Docs", icon: <ScrollText className="w-10 h-10 text-pink-600" />, link: "/registration-docs" },
  ],
  Owners: [
    { name: "Know Your Property Value", icon: <Scale className="w-10 h-10 text-blue-600" />, link: "/know-property" },
    { name: "Facility Management", icon: <Briefcase className="w-10 h-10 text-green-600" />, link: "/property-manage" },
    { name: "Home Interior", icon: <Lightbulb className="w-10 h-10 text-orange-600" />, link: "/home-interior" },
    { name: "Post Property", icon: <Building2 className="w-10 h-10 text-purple-600" />, link: "/post-property" },
    { name: "Property Legal Services", icon: <Gavel className="w-10 h-10 text-red-600" />, link: "/property-legal" },
  ],
};

// Extra Services
const insightServices = [
  {
    name: "Price Trends",
    image: "https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg",
    link: "/price-trends",
    isPriceTrends: true // Special flag for Price Trends
  },
  {
    name: "Heatmaps",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
    link: "/heatmaps-page",
    isHeatmaps: true
  },
  {
    name: "Price to Income Index",
    image: "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg",
    link: "/price-income-index-page",
    isPriceToIncome: true
  },
  {
    name: "Emerging Localities",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60",
    link: "/emerging-localities-page",
    isEmergingLocalities: true // Special flag for Emerging Localities
  },
];

const trendingServices = [
  {
    name: "Trending Projects",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60",
    link: "/trending-projects"
  },
  {
    name: "Trending Localities",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60",
    link: "/trending-localities"
  },
  {
    name: "Trending Developers",
    image: "https://images.unsplash.com/photo-1729838809728-48566c1ef0e9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/trending-developers"
  },
  {
    name: "Trending Dealers",
    image: "https://plus.unsplash.com/premium_photo-1679857225696-05ce9885bb3b?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/trending-dealers"
  },
];

const curatedServices = [
  {
    name: "Hot Selling Projects",
    image: "https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/hot-selling-projects"
  },
  {
    name: "Affordable Projects",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    link: "/affordable-projects"
  },
  {
    name: "Extra Space, Extra Comfort",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60",
    link: "/extra-space-comfort"
  },
  {
    name: "Special Auction Deals",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=60",
    link: "/special-auction-deals"
  },
];

// Section Component
const ServiceSection = ({ title, description, services, bgColor, onServiceClick }) => (
  <div className={`${bgColor} px-6 py-14`}>
    <div className="max-w-7xl mx-auto">
      <div className="text-left mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-700 text-lg max-w-2xl">{description}</p>
        <div className="mt-3 w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
        {services.map((service, idx) => {
          const cardContent = (
            <Card
              key={idx}
              className="overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
              onClick={() => onServiceClick && onServiceClick(service)}
            >
              <div className="h-32 sm:h-36 md:h-40 bg-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 text-center">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-black transition">
                  {service.name}
                </p>
              </CardContent>
            </Card>
          );

          return cardContent;
        })}
      </div>
    </div>
  </div>
);

const Services = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Get the saved tab from localStorage or default to "Buyers"
    return localStorage.getItem("activeServicesTab") || "Buyers";
  });
  const navigate = useNavigate()
  
  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeServicesTab", activeTab);
  }, [activeTab]);

  const handleServiceClick = (service) => {
    if (service.isPriceTrends) {
      // Dispatch custom event to trigger message box in header for Price Trends
      const event = new CustomEvent('showPriceTrendsMessage');
      window.dispatchEvent(event);
      return;
    }
    
    if (service.isEmergingLocalities) {
      const event = new CustomEvent('showEmergingLocalitiesMessage');
      window.dispatchEvent(event);
      return;
    }

    if(service.isHeatmaps){
      const event = new CustomEvent('showHeatmapsMessage');
      window.dispatchEvent(event);
      return;
    }

    if(service.isPriceToIncome){
      const event = new CustomEvent('showPriceToIncomeMessage');
      window.dispatchEvent(event);
      return;
    }

    if(service.isComparator){
      // Dispatch custom event to trigger message box in header for Heatmaps
      const event = new CustomEvent('showComparatorMessage');
      window.dispatchEvent(event);
      return;
    }
    
    // Handle navigation for all services that have a link
    if (service.link) {
      navigate(service.link);
    }
  };

  return (
    <div>
      {/* Smart Services */}
      <div className="px-6 py-14 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Services</h2>
            <p className="text-gray-700 text-lg max-w-2xl">
              Explore tailored services for Developers, Dealers, and Buyers.
            </p>
            <div className="mt-3 w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            {Object.keys(smartServicesTabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {smartServicesTabs[activeTab].map((service, idx) => {
              const cardContent = (
                <Card
                  key={idx}
                  className="overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="flex items-center justify-center h-28 bg-gray-50">
                    {service.icon}
                  </div>
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-black transition">
                      {service.name}
                    </p>
                  </CardContent>
                </Card>
              );

              return cardContent;
            })}
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <ServiceSection
        title="Smart Insights"
        description="Leverage real-time analytics and expert insights to make informed decisions."
        services={insightServices}
        bgColor="bg-gray-50"
        onServiceClick={handleServiceClick}
      />
      <ServiceSection
        title="What's Buzzing Today?"
        description="Discover the latest trends shaping modern real estate."
        services={trendingServices}
        bgColor="bg-white"
        onServiceClick={handleServiceClick}
      />
      <ServiceSection
        title="Our Top Recommendations"
        description="Handpicked properties tailored to your lifestyle and investment goals."
        services={curatedServices}
        bgColor="bg-gray-50"
        onServiceClick={handleServiceClick}
      />
    </div>
  );
};

export default Services;