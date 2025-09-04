import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Building2, User, DollarSign  } from "lucide-react"; // Example icons

const smartServices = [
  {
    name: "Developers",
    icon: <Building2 className="w-10 h-10 text-blue-600" />,
  },
  {
    name: "Dealers",
    icon: <Briefcase className="w-10 h-10 text-green-600" />,
  },
  {
    name: "Buyers",
    icon: <User className="w-10 h-10 text-orange-600" />,
  },
  {
    name: "Investors",
    icon: <DollarSign className="w-10 h-10 text-purple-600" />,
  },
];

const insightServices = [
  {
    name: "Market Analysis",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
  },
  {
    name: "Price Trends",
    image: "https://images.pexels.com/photos/7947664/pexels-photo-7947664.jpeg",
  },
  {
    name: "Investment Reports",
    image: "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg",
  },
  {
    name: "Area Demographics",
    image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg",
  },
];

const trendingServices = [
  {
    name: "Smart Homes",
    image: "https://images.pexels.com/photos/6782351/pexels-photo-6782351.jpeg",
  },
  {
    name: "Co-working Spaces",
    image: "https://images.pexels.com/photos/3182782/pexels-photo-3182782.jpeg",
  },
  {
    name: "Sustainable Living",
    image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
  },
  {
    name: "Luxury Condos",
    image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
  },
];

const curatedServices = [
  {
    name: "Premium Locations",
    image: "https://images.pexels.com/photos/18246434/pexels-photo-18246434.jpeg",
  },
  {
    name: "Budget Friendly",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
  },
  {
    name: "Family Homes",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
  },
  {
    name: "Investment Properties",
    image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg",
  },
];

const ServiceSection = ({ title, description, services, bgColor = "bg-white", isIconOnly = false }) => (
  <div className={`px-6 py-14 ${bgColor}`}>
    <div className="max-w-7xl mx-auto">
      {/* Heading + Description */}
      <div className="text-left mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl">
          {description}
        </p>
        <div className="mt-3 w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {services.map((service, idx) => (
          <Card
            key={idx}
            className="overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 group"
          >
            {!isIconOnly ? (
              <div className="relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-36 w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-36 bg-gray-50">
                {service.icon}
              </div>
            )}
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
);

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Smart Services Section */}
      <ServiceSection
        title="Smart Services"
        description="Explore tailored services for Developers, Dealers, and Buyers."
        services={smartServices}
        bgColor="bg-white"
        isIconOnly={true}
      />

      {/* Insights Section */}
      <ServiceSection
        title="Data-Driven Insights"
        description="Leverage real-time analytics and expert insights to make informed decisions."
        services={insightServices}
        bgColor="bg-gray-50"
      />

      {/* What's Trending Section */}
      <ServiceSection
        title="What's Trending"
        description="Discover the latest trends shaping modern real estate."
        services={trendingServices}
        bgColor="bg-white"
      />

      {/* Curated Recommendations Section */}
      <ServiceSection
        title="Curated Recommendations"
        description="Handpicked properties tailored to your lifestyle and investment goals."
        services={curatedServices}
        bgColor="bg-gray-50"
      />
    </div>
  );
}
