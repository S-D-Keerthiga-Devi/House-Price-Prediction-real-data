import React, { useState, useEffect } from "react";
import { getAllPropertiesForComparison } from "../../api/house";
import { useNavigate } from "react-router-dom";
import { Bed, Bath, Home } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useCity } from "../../context/CityContext";

const Listings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCity } = useCity();



  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams(location.search);
        const propertyIds = queryParams.get("propertyIds");
        let response;
        if (propertyIds) {
          response = await getAllPropertiesForComparison({
            property_ids: propertyIds,
          });
          console.log("Property IDs response:", response);

          if (!response || !response.success) {
            setError(response?.message || "Failed to fetch properties");
            setProperties([]);
            setTotalPages(0);
            return;
          }

          const propertiesData = response.data || response.properties || [];

          // Ensure unique IDs for properties that don't have them
          const propertiesWithIds = propertiesData.map(
            (prop, index) => ({
              ...prop,
              id: prop.id || prop._id || `temp-id-${Date.now()}-${index}`,
            })
          );

          // Remove duplicate property names
          const uniqueProperties = propertiesWithIds.filter((property, index, self) =>
            index === self.findIndex((p) =>
              (p.id || p._id) === (property.id || property._id) ||
              `${(p.property_name || '').toLowerCase()}|${(p.location || '').toLowerCase()}|${(p.city || '').toLowerCase()}` === `${(property.property_name || '').toLowerCase()}|${(property.location || '').toLowerCase()}|${(property.city || '').toLowerCase()}`
            )
          );

          // Create unique display names per card
          const nameCounts = uniqueProperties.reduce((acc, p) => {
            const base = (p.property_name && p.property_name.trim()) || `Property in ${p.location || p.city || ''}`;
            acc[base] = (acc[base] || 0) + 1;
            return acc;
          }, {});
          const runningCounts = {};
          const withDisplayNames = uniqueProperties.map((p) => {
            const base = (p.property_name && p.property_name.trim()) || `Property in ${p.location || p.city || ''}`;
            if (nameCounts[base] > 1) {
              runningCounts[base] = (runningCounts[base] || 0) + 1;
              return { ...p, display_name: `${base} #${runningCounts[base]}` };
            }
            return { ...p, display_name: base };
          });

          console.log("Unique Properties after deduplication:", withDisplayNames);
          setProperties(withDisplayNames);
          setTotalPages(1);
        } else {
          const city = selectedCity || "pune"; // Fallback to "pune" if no city is selected
          response = await getAllPropertiesForComparison({
            city: city,
            page: page,
            limit: 10,
          });

          // Check if response is successful and has the expected structure
          if (!response || !response.success) {
            console.error("API request failed:", response);
            setError(response?.message || "Failed to fetch properties");
            setProperties([]);
            setTotalPages(0);
            return;
          }

          const propertiesData = response.data || response.properties || [];
          console.log("Properties data:", propertiesData);

          if (!Array.isArray(propertiesData)) {
            console.error("Invalid properties data structure:", propertiesData);
            setError("Invalid data format received from server");
            setProperties([]);
            setTotalPages(0);
            return;
          }

          // Ensure unique IDs for properties that don't have them
          const propertiesWithIds = propertiesData.map(
            (prop, index) => ({
              ...prop,
              id: prop.id || prop._id || `temp-id-${Date.now()}-${index}`,
            })
          );
          console.log("Properties with IDs:", propertiesWithIds);

          // Remove duplicates using stable keys (prefer id/_id, else name+location+city)
          const seenKeys = new Set();
          const uniqueProperties = propertiesWithIds.filter((p) => {
            const key = (p.id || p._id) || `${(p.property_name || '').toLowerCase()}|${(p.location || '').toLowerCase()}|${(p.city || '').toLowerCase()}`;
            if (seenKeys.has(key)) return false;
            seenKeys.add(key);
            return true;
          });
          // Create unique display names per card
          const nameCounts = uniqueProperties.reduce((acc, p) => {
            const base = (p.property_name && p.property_name.trim()) || `Property in ${p.location || p.city || ''}`;
            acc[base] = (acc[base] || 0) + 1;
            return acc;
          }, {});
          const runningCounts = {};
          const withDisplayNames = uniqueProperties.map((p) => {
            const base = (p.property_name && p.property_name.trim()) || `Property in ${p.location || p.city || ''}`;
            if (nameCounts[base] > 1) {
              runningCounts[base] = (runningCounts[base] || 0) + 1;
              return { ...p, display_name: `${base} #${runningCounts[base]}` };
            }
            return { ...p, display_name: base };
          });

          console.log("Unique Properties after deduplication:", withDisplayNames);
          setProperties(withDisplayNames);
          setTotalPages(response.totalPages || 1);
        }
      } catch (err) {
        setError(
          "An error occurred while fetching properties. Please try again later."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [location.search, selectedCity, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getImageUrl = (property) => {
    const city = (property.city || "default").toLowerCase();
    const locality = (property.location || "default").toLowerCase();
    const size = 5; // Sample size
    return `https://source.unsplash.com/random/800x600/?${city},${locality},house&size=${size}`;
  };

  const formatPrice = (price) => {
    if (!price || price === 0 || price === "0") return "Price on Request";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatRate = (rate) => {
    if (!rate || rate === 0 || rate === "0") return "";
    return `${formatPrice(rate)}/sq ft`;
  };

  const formatArea = (area) => {
    if (!area) return "N/A";
    return `${area} sq ft`;
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
      <div style={{ padding: "20px" }}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-blue-800 mb-6 text-center">
          Property Listings
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {properties.map((property) => (
            <div key={property.id || property._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col h-64">
              {/* Image Section */}
              <div className="relative h-24 bg-gray-100">
                {property.image_url ? (
                  <img
                    src={property.image_url}
                    alt={property.property_name || 'Property Image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <Home className="w-10 h-10 text-blue-400" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-blue-800 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {property.property_type || 'Residential'}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-3 flex-grow">
                <h3 className="text-sm font-bold text-gray-800 mb-1 truncate">
                  {property.bedrooms ? `${property.bedrooms}BHK ` : ''}
                  {property.display_name || property.property_name || `Property in ${property.location || property.city}`}
                </h3>
                <p className="text-xs text-gray-600 mb-2 truncate">
                  {property.location || "N/A"}, {property.city || "N/A"}
                </p>

                <div className="flex items-center text-gray-500 text-xs mb-2 space-x-3">
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1" />
                    <span>{property.bedrooms || 0} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 mr-1" />
                    <span>{property.bathrooms || property.bathroom || 0} Baths</span>
                  </div>
                </div>
              </div>

              {/* Price and Action Section */}
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-blue-800 truncate">{formatPrice(property.price_value)}</p>
                    {property.rate_sqft && property.rate_sqft !== 0 && property.rate_sqft !== "0" && (
                      <p className="text-xs text-gray-500 truncate">{formatRate(property.rate_sqft)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/property-details/${property.id || property._id}`)}
                    className="bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    View
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </div>
      </div>


    </div>
  );
};

export default Listings;