import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyDetailsById } from "../../api/house";
import { 
  Bed, 
  Bath, 
  Home, 
  MapPin, 
  Ruler, 
  Car, 
  Building2, 
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Home as HomeIcon
} from "lucide-react";
import { CircularProgress, Alert } from "@mui/material";

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPropertyDetailsById(id);
        
        if (!response || !response.success) {
          setError(response?.message || "Failed to fetch property details");
          return;
        }
        
        setProperty(response.property);
      } catch (err) {
        setError("An error occurred while fetching property details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    } else {
      setError("Property ID is missing");
      setLoading(false);
    }
  }, [id]);

  const formatPrice = (price) => {
    if (!price || price === 0 || price === "0") return "Price on Request";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN").format(value);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Listings
          </button>
          <Alert severity="error">{error}</Alert>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Alert severity="info">Property not found</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Listings
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {property.bedrooms ? `${property.bedrooms}BHK ` : ''}
                Property in {property.location || property.city || "N/A"}
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {property.location || "N/A"}, {property.city || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(property.price_value)}
              </p>
              {property.rate_sqft && property.rate_sqft !== 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {formatPrice(property.rate_sqft)}/sq ft
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                {property.image_url ? (
                  <img
                    src={property.image_url}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <HomeIcon className="w-32 h-32 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {property.property_type || "Residential"}
                </div>
              </div>
            </div>

            {/* Basic Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Bed className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {property.bedrooms || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Bath className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {property.bathroom || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Ruler className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {property.area ? `${formatNumber(property.area)} sq ft` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Car className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parking</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {property.parking_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Developer Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.developer_name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Furnishing Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.furnishing_status || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Construction Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.construction_status || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Property Age</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.property_age_years !== null && property.property_age_years !== undefined
                      ? `${property.property_age_years} years`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Balconies</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.balconies !== null && property.balconies !== undefined
                      ? property.balconies
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Days on Market</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.days_on_market !== null && property.days_on_market !== undefined
                      ? `${property.days_on_market} days`
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Amenities Count</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {property.amenities_count !== null && property.amenities_count !== undefined
                      ? property.amenities_count
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Investment Metrics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Rental Yield</span>
                  <span className="font-semibold text-gray-800">
                    {formatPercentage(property.rental_yield)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Investment Potential</span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(property.investment_potential)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Future Growth</span>
                  <span className="font-semibold text-gray-800">
                    {formatPercentage(property.future_growth_prediction)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Affordability Index</span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(property.affordability_index)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-green-600" />
                Quality Metrics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Lifestyle Quality</span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(property.lifestyle_quality_index)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Facing Score</span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(property.facing_score)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Builder Grade</span>
                  <span className="font-semibold text-gray-800">
                    {formatNumber(property.builder_grade)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Neighborhood Avg Income</span>
                  <span className="font-semibold text-gray-800">
                    {property.neighbourhood_avg_income
                      ? formatPrice(property.neighbourhood_avg_income)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Interested in this property?</h2>
              <p className="text-blue-100 mb-4">
                Get in touch with us to schedule a viewing or get more information.
              </p>
              <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors">
                Contact Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;

