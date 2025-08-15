import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, DollarSign, Home, Navigation } from "lucide-react";

export default function SearchSection({ onSearch }) {
    const [searchParams, setSearchParams] = useState({
        country: "",
        city: "",
        location: "",
        budget: "",
        area: "",
        landmark: ""
    });

    const handleSearch = () => {
        onSearch(searchParams);
    };

    const updateParam = (key, value) => {
        setSearchParams(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
                        Find Your Perfect
                        <span className="text-amber-400 font-medium"> Property</span>
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Advanced property search with AI-powered matching
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Country</label>
                            <Select value={searchParams.country} onValueChange={(value) => updateParam('country', value)}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="india">India</SelectItem>
                                    <SelectItem value="usa">United States</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="canada">Canada</SelectItem>
                                    <SelectItem value="australia">Australia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">City</label>
                            <Select value={searchParams.city} onValueChange={(value) => updateParam('city', value)}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mumbai">Mumbai</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="bangalore">Bangalore</SelectItem>
                                    <SelectItem value="pune">Pune</SelectItem>
                                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Enter specific location"
                                    value={searchParams.location}
                                    onChange={(e) => updateParam('location', e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Budget</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Enter budget range"
                                    value={searchParams.budget}
                                    onChange={(e) => updateParam('budget', e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Area (sq ft)</label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Enter area requirement"
                                    value={searchParams.area}
                                    onChange={(e) => updateParam('area', e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nearby Landmark</label>
                            <div className="relative">
                                <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="School, hospital, metro..."
                                    value={searchParams.landmark}
                                    onChange={(e) => updateParam('landmark', e.target.value)}
                                    className="pl-10 h-12"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-12 py-3 rounded-xl text-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Search Properties
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}