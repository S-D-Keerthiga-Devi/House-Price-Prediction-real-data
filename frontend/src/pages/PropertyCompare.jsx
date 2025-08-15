import React, { useState, useEffect } from "react";
import propertyData from "/src/data/Property.json"; // plain JSON import
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import SearchSection from "../components/property/SearchSection";
import PropertyCard from "../components/property/PropertyCard";
import ComparisonTable from "../components/property/ComparisonTable";

export default function PropertyComparator() {
    const [properties, setProperties] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [comparisonProperties, setComparisonProperties] = useState([]);
    const [showComparison, setShowComparison] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        // load data from JSON at start
        setProperties(propertyData);
    }, []);

    const handleSearch = async (searchParams) => {
        setIsLoading(true);
        setSearchPerformed(true);

        setTimeout(() => {
            // Just filter by match_score for now
            const filtered = [...propertyData].sort((a, b) => b.match_score - a.match_score);
            setProperties(filtered);
            setCurrentIndex(0);
            setIsLoading(false);
        }, 1500);
    };

    const handleLike = (propertyId) => {
        console.log("Liked property:", propertyId);
    };

    const handleDislike = (propertyId) => {
        console.log("Disliked property:", propertyId);
        nextProperty();
    };

    const handleContact = (contactInfo) => {
        window.open(`tel:${contactInfo}`, '_blank');
    };

    const handleB2BRedirect = (website) => {
        window.open(website, '_blank');
    };

    const handleAddToComparator = (property) => {
        if (comparisonProperties.length < 4 && !comparisonProperties.find(p => p.id === property.id)) {
            setComparisonProperties(prev => [...prev, property]);
        }
    };

    const handleRemoveFromComparator = (propertyId) => {
        setComparisonProperties(prev => prev.filter(p => p.id !== propertyId));
    };

    const nextProperty = () => {
        if (currentIndex < properties.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const previousProperty = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const currentProperty = properties[currentIndex];

    return (
        <div className="min-h-screen bg-gray-50">
            <SearchSection onSearch={handleSearch} />

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
                        <p className="text-slate-600 text-lg">Finding your perfect properties...</p>
                    </div>
                </div>
            )}

            {!isLoading && searchPerformed && properties.length > 0 && (
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Property Results ({properties.length} found)
                            </h2>
                            <p className="text-slate-600">
                                Showing property {currentIndex + 1} of {properties.length}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {comparisonProperties.length > 0 && (
                                <Button
                                    onClick={() => setShowComparison(!showComparison)}
                                    className="bg-slate-900 hover:bg-slate-800"
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Compare ({comparisonProperties.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={previousProperty}
                            disabled={currentIndex === 0}
                            className="shrink-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {currentProperty && (
                                    <PropertyCard
                                        key={currentProperty.id}
                                        property={currentProperty}
                                        onLike={handleLike}
                                        onDislike={handleDislike}
                                        onContact={handleContact}
                                        onB2BRedirect={handleB2BRedirect}
                                        onAddToComparator={handleAddToComparator}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextProperty}
                            disabled={currentIndex === properties.length - 1}
                            className="shrink-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {showComparison && (
                        <ComparisonTable
                            properties={comparisonProperties}
                            onRemoveProperty={handleRemoveFromComparator}
                            onClose={() => setShowComparison(false)}
                        />
                    )}
                </div>
            )}

            {!isLoading && searchPerformed && properties.length === 0 && (
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-4">No Properties Found</h2>
                    <p className="text-slate-600">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
}
