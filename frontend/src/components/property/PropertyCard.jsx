import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
    Heart, 
    X, 
    Phone, 
    ExternalLink, 
    MapPin, 
    Home, 
    Car, 
    Crown, 
    Leaf, 
    TrendingUp,
    Plus
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
            case 'Platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Silver': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
        >
            <Card className="overflow-hidden shadow-2xl bg-white">
                <CardHeader className="p-0">
                    <div className="relative h-80">
                        <img
                            src={property.image_url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Badge className={getBuilderColor(property.builder)}>
                                <Crown className="w-3 h-3 mr-1" />
                                {property.builder}
                            </Badge>
                            {property.luxury_segment && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Luxury
                                </Badge>
                            )}
                        </div>
                        <div className="absolute bottom-4 left-4">
                            <Badge className={property.fresh_resale === 'Fresh' 
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-orange-100 text-orange-800 border-orange-200'
                            }>
                                {property.fresh_resale}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">{property.title}</h2>
                        <p className="text-slate-600 mb-4">{property.description}</p>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span>{property.location}</span>
                            </div>
                            <div className="text-2xl font-bold text-amber-600">
                                {formatPrice(property.price)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-800">Property Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <div className="text-sm text-slate-600">Area</div>
                                        <div className="font-semibold">{property.area} sq ft</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <div className="text-sm text-slate-600">Type</div>
                                        <div className="font-semibold">{property.property_type}</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <div className="text-sm text-slate-600">Parking</div>
                                        <div className="font-semibold flex items-center gap-1">
                                            <Car className="w-4 h-4" />
                                            {property.authenticated_parking ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <div className="text-sm text-slate-600">Metro</div>
                                        <div className="font-semibold">{property.metro_proximity}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-800">Nearby Localities</h3>
                                <div className="space-y-2">
                                    {property.nearby_schools?.length > 0 && (
                                        <div className="text-sm">
                                            <span className="font-medium text-slate-600">Schools: </span>
                                            {property.nearby_schools.join(', ')}
                                        </div>
                                    )}
                                    {property.nearby_hospitals?.length > 0 && (
                                        <div className="text-sm">
                                            <span className="font-medium text-slate-600">Hospitals: </span>
                                            {property.nearby_hospitals.join(', ')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-800">Environmental Factors</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="text-sm text-green-600">Green Cover</div>
                                        <div className="font-semibold flex items-center gap-1">
                                            <Leaf className="w-4 h-4" />
                                            {property.green_cover_percent}%
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-sm text-blue-600">AQI</div>
                                        <div className="font-semibold">{property.aqi}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-800">Investment Analysis</h3>
                                <PropertyGraph 
                                    rentalYield={property.rental_yield} 
                                    fairValue={property.fair_value} 
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-800">Growth Potential</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-lg">
                                        <div className="text-sm text-emerald-600">2-Year Growth</div>
                                        <div className="font-semibold flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            {property.growth_2_year}%
                                        </div>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-lg">
                                        <div className="text-sm text-emerald-600">5-Year Growth</div>
                                        <div className="font-semibold flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4" />
                                            {property.growth_5_year}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-800">Scores</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                                        <div className="text-sm text-amber-600">AI Score</div>
                                        <div className="text-2xl font-bold text-amber-700">
                                            {property.ai_score}/10
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                                        <div className="text-sm text-purple-600">Lifestyle</div>
                                        <div className="text-2xl font-bold text-purple-700">
                                            {property.lifestyle_score}/10
                                        </div>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center">
                                        <div className="text-sm text-green-600">Nature</div>
                                        <div className="text-2xl font-bold text-green-700">
                                            {property.nature_score}/10
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-slate-200">
                        <Button
                            onClick={() => onLike(property.id)}
                            variant="outline"
                            className="flex-1 sm:flex-none border-green-200 text-green-700 hover:bg-green-50"
                        >
                            <Heart className="w-4 h-4 mr-2" />
                            Like
                        </Button>
                        <Button
                            onClick={() => onDislike(property.id)}
                            variant="outline"
                            className="flex-1 sm:flex-none border-red-200 text-red-700 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Dislike
                        </Button>
                        <Button
                            onClick={() => onContact(property.contact_info)}
                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                        <Button
                            onClick={() => onB2BRedirect(property.b2b_website)}
                            variant="outline"
                            className="flex-1 sm:flex-none"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            B2B Website
                        </Button>
                        <Button
                            onClick={() => onAddToComparator(property)}
                            className="flex-1 sm:flex-none bg-amber-600 hover:bg-amber-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Compare
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}