import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Heart, X, Phone, ExternalLink, MapPin, Car, Crown, Leaf, TrendingUp, Plus
} from "lucide-react";
import PropertyGraph from "./PropertyGraph";

export default function PropertyCard({ 
  property, 
  onLike, 
  onDislike, 
  onContact, 
  onB2BRedirect, 
  onAddToComparator 
}) {
  const getBuilderColor = (builder) => {
    switch (builder) {
      case "Platinum": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Gold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Silver": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price on request";
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto w-full"
    >
      <Card className="overflow-hidden shadow-xl bg-white rounded-2xl">
        {/* Image Header */}
        <CardHeader className="p-0">
          <div className="relative h-80 w-full">
            <img
              src={property.image_url}
              alt={property.title || "Property"}
              className="w-full h-full object-cover"
            />

            {/* Badges (top right) */}
            <div className="absolute top-4 right-4 flex flex-wrap gap-2">
              {property.builder && (
                <Badge className={getBuilderColor(property.builder)}>
                  <Crown className="w-3 h-3 mr-1" />
                  {property.builder}
                </Badge>
              )}
              {property.luxury_segment && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Luxury
                </Badge>
              )}
            </div>

            {/* Fresh/Resale (bottom left) */}
            {property.fresh_resale && (
              <div className="absolute bottom-4 left-4">
                <Badge
                  className={
                    property.fresh_resale === "Fresh"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-orange-100 text-orange-800 border-orange-200"
                  }
                >
                  {property.fresh_resale}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 sm:p-8">
          {/* Title + Price */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              {property.title || "Unnamed Property"}
            </h2>
            <p className="text-slate-600 mb-4">
              {property.description || "No description available."}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>{property.location || "Location not specified"}</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {formatPrice(property.price)}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">
                  Property Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Detail label="Area" value={`${property.area || "N/A"} sq ft`} />
                  <Detail label="Type" value={property.property_type || "N/A"} />
                  <Detail
                    label="Parking"
                    value={property.authenticated_parking ? "Yes" : "No"}
                    icon={<Car className="w-4 h-4" />}
                  />
                  <Detail
                    label="Metro"
                    value={property.metro_proximity || "N/A"}
                  />
                </div>
              </div>

              {/* Nearby */}
              {(property.nearby_schools?.length > 0 ||
                property.nearby_hospitals?.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-800">
                    Nearby Localities
                  </h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    {property.nearby_schools?.length > 0 && (
                      <div>
                        <span className="font-medium">Schools:</span>{" "}
                        {property.nearby_schools.join(", ")}
                      </div>
                    )}
                    {property.nearby_hospitals?.length > 0 && (
                      <div>
                        <span className="font-medium">Hospitals:</span>{" "}
                        {property.nearby_hospitals.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Environmental */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">
                  Environmental Factors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Detail
                    label="Green Cover"
                    value={`${property.green_cover_percent || 0}%`}
                    icon={<Leaf className="w-4 h-4" />}
                    color="green"
                  />
                  <Detail
                    label="AQI"
                    value={property.aqi || "N/A"}
                    color="blue"
                  />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Investment */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">
                  Investment Analysis
                </h3>
                <PropertyGraph
                  rentalYield={property.rental_yield}
                  fairValue={property.fair_value}
                />
              </div>

              {/* Growth */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">
                  Growth Potential
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Detail
                    label="2-Year Growth"
                    value={`${property.growth_2_year || 0}%`}
                    icon={<TrendingUp className="w-4 h-4" />}
                    color="emerald"
                  />
                  <Detail
                    label="5-Year Growth"
                    value={`${property.growth_5_year || 0}%`}
                    icon={<TrendingUp className="w-4 h-4" />}
                    color="emerald"
                  />
                </div>
              </div>

              {/* Scores */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-slate-800">
                  Scores
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Score label="AI Score" value={property.ai_score} color="amber" />
                  <Score label="Lifestyle" value={property.lifestyle_score} color="purple" />
                  <Score label="Nature" value={property.nature_score} color="green" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-200">
            <ActionButton
              onClick={() => onLike(property.id)}
              icon={<Heart className="w-4 h-4 mr-2" />}
              label="Like"
              variant="outline"
              className="border-green-200 text-green-700 hover:bg-green-50"
            />
            <ActionButton
              onClick={() => onDislike(property.id)}
              icon={<X className="w-4 h-4 mr-2" />}
              label="Dislike"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            />
            <ActionButton
              onClick={() => onContact(property.contact_info)}
              icon={<Phone className="w-4 h-4 mr-2" />}
              label="Contact"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            />
            <ActionButton
              onClick={() => onB2BRedirect(property.b2b_website)}
              icon={<ExternalLink className="w-4 h-4 mr-2" />}
              label="B2B Website"
              variant="outline"
            />
            <ActionButton
              onClick={() => onAddToComparator(property)}
              icon={<Plus className="w-4 h-4 mr-2" />}
              label="Add to Compare"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* 🔹 Small helper components for DRY */
const Detail = ({ label, value, icon, color }) => (
  <div className={`p-3 rounded-lg bg-${color || "slate"}-50`}>
    <div className={`text-sm text-${color || "slate"}-600`}>{label}</div>
    <div className="font-semibold flex items-center gap-1">
      {icon} {value}
    </div>
  </div>
);

const Score = ({ label, value, color }) => (
  <div className={`p-3 rounded-lg bg-${color}-50 text-center`}>
    <div className={`text-sm text-${color}-600`}>{label}</div>
    <div className={`text-2xl font-bold text-${color}-700`}>
      {value || 0}/10
    </div>
  </div>
);

const ActionButton = ({ onClick, icon, label, ...props }) => (
  <Button onClick={onClick} {...props} className={`flex-1 sm:flex-none ${props.className}`}>
    {icon} {label}
  </Button>
);
