import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Crown, Car, Leaf, TrendingUp } from "lucide-react";

export default function ComparisonTable({ properties = [], onRemoveProperty, onClose }) {
    if (properties.length === 0) return null;

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    const getBuilderColor = (builder) => {
        switch (builder) {
            case 'Platinum': return 'bg-purple-100 text-purple-800';
            case 'Gold': return 'bg-yellow-100 text-yellow-800';
            case 'Silver': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const parameters = [
        { key: 'title', label: 'Property Name' },
        { key: 'builder', label: 'Builder' },
        { key: 'location', label: 'Location' },
        { key: 'price', label: 'Price' },
        { key: 'area', label: 'Area (sq ft)' },
        { key: 'property_type', label: 'Type' },
        { key: 'nearby_schools', label: 'Schools' },
        { key: 'nearby_hospitals', label: 'Hospitals' },
        { key: 'metro_proximity', label: 'Metro Access' },
        { key: 'fresh_resale', label: 'Fresh/Resale' },
        { key: 'authenticated_parking', label: 'Parking' },
        { key: 'luxury_segment', label: 'Luxury Segment' },
        { key: 'lifestyle_score', label: 'Lifestyle Score' },
        { key: 'nature_score', label: 'Nature Score' },
        { key: 'aqi', label: 'AQI' },
        { key: 'traffic_situation', label: 'Traffic' },
        { key: 'green_cover_percent', label: 'Green Cover %' },
        { key: 'growth_2_year', label: '2-Year Growth %' },
        { key: 'growth_5_year', label: '5-Year Growth %' },
        { key: 'ai_score', label: 'AI Score' }
    ];

    const renderCellValue = (property, param) => {
        const value = property[param.key];
        
        switch (param.key) {
            case 'price':
                return formatPrice(value);
            case 'builder':
                return <Badge className={getBuilderColor(value)}><Crown className="w-3 h-3 mr-1" />{value}</Badge>;
            case 'authenticated_parking':
            case 'luxury_segment':
                return <Badge variant={value ? "default" : "secondary"}>{value ? 'Yes' : 'No'}</Badge>;
            case 'nearby_schools':
            case 'nearby_hospitals':
                return Array.isArray(value) ? value.join(', ') : value;
            case 'fresh_resale':
                return <Badge className={value === 'Fresh' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>{value}</Badge>;
            case 'lifestyle_score':
            case 'nature_score':
            case 'ai_score':
                return <span className="font-semibold">{value}/10</span>;
            case 'growth_2_year':
            case 'growth_5_year':
                return <span className="text-green-600 font-semibold flex items-center gap-1"><TrendingUp className="w-3 h-3" />{value}%</span>;
            case 'green_cover_percent':
                return <span className="text-green-600 flex items-center gap-1"><Leaf className="w-3 h-3" />{value}%</span>;
            default:
                return value;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-12"
            >
                <Card className="shadow-2xl">
                    <CardHeader className="bg-slate-900 text-white">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl">Property Comparison</CardTitle>
                            <Button 
                                variant="outline" 
                                size="icon"
                                onClick={onClose}
                                className="text-white border-white hover:bg-white hover:text-slate-900"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-slate-700 min-w-48">Parameter</th>
                                        {properties.map((property, index) => (
                                            <th key={property.id} className="text-left p-4 font-semibold text-slate-700 min-w-64">
                                                <div className="flex justify-between items-center">
                                                    <span className="truncate">{property.title}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRemoveProperty(property.id)}
                                                        className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {parameters.map((param, index) => (
                                        <tr key={param.key} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="p-4 font-medium text-slate-700 border-r border-slate-200">
                                                {param.label}
                                            </td>
                                            {properties.map((property) => (
                                                <td key={`${property.id}-${param.key}`} className="p-4 text-slate-600">
                                                    {renderCellValue(property, param)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}