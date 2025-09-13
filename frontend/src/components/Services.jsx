import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

// Smart Services Tabs
const smartServicesTabs = {
  Buyers: [
    { name: "Property Valuation", icon: <Home className="w-10 h-10 text-blue-600" /> },
    { name: "Rent Agreement", icon: <FileText className="w-10 h-10 text-green-600" /> },
    { name: "Auctioned Property", icon: <Gavel className="w-10 h-10 text-orange-600" /> },
    { name: "Escrow Services", icon: <Scale className="w-10 h-10 text-purple-600" /> },
    { name: "Comparator", icon: <Columns3 className="w-10 h-10 text-pink-600" /> },
  ],
  Developers: [
    { name: "Advertize With Us", icon: <Building2 className="w-10 h-10 text-orange-600" /> },
    { name: "Venture Investment", icon: <TrendingUp className="w-10 h-10 text-blue-600" /> },
    { name: "Data Insights", icon: <BarChart2 className="w-10 h-10 text-green-600" /> },
    { name: "Market Trends", icon: <TrendingUp className="w-10 h-10 text-purple-600" /> },
    { name: "Property Valuation", icon: <Home className="w-10 h-10 text-pink-600" /> },
  ],
  Dealers: [
    { name: "Listings", icon: <ClipboardList className="w-10 h-10 text-blue-600" /> },
    { name: "Dealer Connect", icon: <Users className="w-10 h-10 text-green-600" /> },
    { name: "Contact Developers", icon: <Phone className="w-10 h-10 text-orange-600" /> },
    { name: "Channel Partners", icon: <Briefcase className="w-10 h-10 text-purple-600" /> },
    { name: "Registration & Docs", icon: <ScrollText className="w-10 h-10 text-pink-600" /> },
  ],
};

// Extra Services
const insightServices = [
  { name: "Market Analysis", image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg" },
  { name: "Price Trends", image: "https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg", link: "/price-trends" },
  { name: "Investment Reports", image: "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg" },
  { name: "Area Demographics", image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg" },
];

const trendingServices = [
  { name: "Smart Homes", image: "https://images.pexels.com/photos/6782351/pexels-photo-6782351.jpeg" },
  { name: "Co-working Spaces", image: "https://images.pexels.com/photos/3182782/pexels-photo-3182782.jpeg" },
  { name: "Sustainable Living", image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg" },
  { name: "Luxury Condos", image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg" },
];

const curatedServices = [
  { name: "Premium Locations", image: "https://images.pexels.com/photos/18246434/pexels-photo-18246434.jpeg" },
  { name: "Budget Friendly", image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" },
  { name: "Family Homes", image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" },
  { name: "Investment Properties", image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg" },
];

// Section Component
const ServiceSection = ({ title, description, services, bgColor }) => (
  <div className={`${bgColor} px-6 py-14`}>
    <div className="max-w-7xl mx-auto">
      <div className="text-left mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-700 text-lg max-w-2xl">{description}</p>
        <div className="mt-3 w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((service, idx) => {
          const cardContent = (
            <Card
              key={idx}
              className="overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
            >
              <div className="h-40 bg-gray-100">
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

          return service.link ? (
            <Link to={service.link} key={idx}>
              {cardContent}
            </Link>
          ) : (
            cardContent
          );
        })}
      </div>
    </div>
  </div>
);


const Services = () => {
  const [activeTab, setActiveTab] = useState("Buyers");

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
            {smartServicesTabs[activeTab].map((service, idx) => (
              <Card
                key={idx}
                className="overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
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
            ))}
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <ServiceSection
        title="Data-Driven Insights"
        description="Leverage real-time analytics and expert insights to make informed decisions."
        services={insightServices}
        bgColor="bg-gray-50"
      />
      <ServiceSection
        title="What's Trending"
        description="Discover the latest trends shaping modern real estate."
        services={trendingServices}
        bgColor="bg-white"
      />
      <ServiceSection
        title="Curated Recommendations"
        description="Handpicked properties tailored to your lifestyle and investment goals."
        services={curatedServices}
        bgColor="bg-gray-50"
      />
    </div>
  );
};

export default Services;
