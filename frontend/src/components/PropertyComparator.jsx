// src/components/PropertyComparatorPage.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { properties as initialProperties } from '../data/PropertyData';
import { MapPin, Building, IndianRupee, Ruler, Star, ThumbsUp, ThumbsDown, Plus, BarChart2, Phone, ExternalLink } from 'lucide-react';

// Quadrant labels for the graph
const quadrantLabels = {
    q1: "Low Value, Low Yield",
    q2: "High Value, Low Yield",
    q3: "High Value, High Yield",
    q4: "Low Value, High Yield",
};

// Function to determine quadrant
const getQuadrant = (yieldVal, fairVal) => {
    if (yieldVal > 4.5 && fairVal > 7.5) return 'q3'; // High Value, High Yield
    if (yieldVal <= 4.5 && fairVal > 7.5) return 'q2'; // High Value, Low Yield
    if (yieldVal <= 4.5 && fairVal <= 7.5) return 'q1'; // Low Value, Low Yield
    return 'q4'; // Low Value, High Yield
};


// ## Reusable Chart Component ##
// Renders the Rental Yield vs. Fair Value graph
const ValueChart = ({ rentalYield, fairValue, isThumbnail = false }) => {
    const pointX = (rentalYield / 8) * 100; // Max yield of 8%
    const pointY = 100 - (fairValue / 12) * 100; // Max value of 12
    const quadrant = getQuadrant(rentalYield, fairValue);

    if (isThumbnail) {
        return (
            <div className="relative w-24 h-24 bg-gray-50 border rounded-md">
                 {/* Axes */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300"></div>
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300"></div>
                {/* Data Point */}
                <div 
                    className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md"
                    style={{ left: `calc(${pointX}% - 6px)`, top: `calc(${pointY}% - 6px)` }}
                ></div>
            </div>
        )
    }

    return (
        <div className="p-4 border rounded-lg bg-slate-50">
            <h4 className="font-bold text-center mb-2 text-gray-700">Rental Yield vs. Fair Value</h4>
            <div className="relative w-full h-48 bg-white border rounded-md">
                {/* Axes */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 -translate-y-1/2"></div>
                <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300 -translate-x-1/2"></div>

                {/* Axis Labels */}
                <span className="absolute bottom-0 -left-1 text-xs text-gray-500 -translate-y-6">Low Yield</span>
                <span className="absolute bottom-0 -right-1 text-xs text-gray-500 -translate-y-6">High Yield</span>
                <span className="absolute top-1/2 -left-2 text-xs text-gray-500 -translate-x-full rotate-[-90deg]">Low Value</span>
                <span className="absolute bottom-1/2 -left-2 text-xs text-gray-500 -translate-x-full rotate-[-90deg]">High Value</span>
                
                {/* Quadrant Text */}
                <span className="absolute top-2 right-2 text-xs text-gray-400">{quadrantLabels.q2}</span>
                <span className="absolute top-2 left-2 text-xs text-gray-400">{quadrantLabels.q4}</span>
                <span className="absolute bottom-2 right-2 text-xs text-gray-400">{quadrantLabels.q3}</span>
                <span className="absolute bottom-2 left-2 text-xs text-gray-400">{quadrantLabels.q1}</span>

                {/* Data Point */}
                <div 
                    className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pointX}%`, top: `${pointY}%` }}
                    title={`Yield: ${rentalYield}%, Value: ${fairValue}/10`}
                ></div>
            </div>
             <p className="text-center text-sm font-semibold mt-2 text-blue-700">Quadrant: {quadrantLabels[quadrant]}</p>
        </div>
    );
};

// ## Property Card Component ##
// Displays a single swipeable property card
const PropertyCard = ({ property, onAddToCompare, onSwipe }) => {
    const tags = {
      Platinum: "bg-gray-800 text-yellow-300",
      Gold: "bg-yellow-500 text-white",
      Silver: "bg-gray-300 text-gray-800",
    };

    return (
        <motion.div
            key={property.id}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="absolute w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="md:flex">
                <div className="md:w-1/3">
                    <img className="h-full w-full object-cover" src={property.image} alt={property.title} />
                </div>
                <div className="p-6 md:w-2/3">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${tags[property.builder]}`}>{property.builder} Builder</span>
                                {property.luxury === 'Yes' && <span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Luxury</span>}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mt-2">{property.title}</h2>
                            <p className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={14}/> {property.location}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                           <p className="text-2xl font-extrabold text-blue-600">{property.price}</p>
                           <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${property.status === 'Fresh' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{property.status}</span>
                        </div>
                    </div>
                    
                    <p className="mt-4 text-gray-700">{property.description}</p>
                    
                    {/* Details Grid */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2"><Ruler className="text-gray-500"/><div><p className="font-semibold">Area</p><p>{property.area}</p></div></div>
                        <div className="flex items-center gap-2"><Building className="text-gray-500"/><div><p className="font-semibold">Type</p><p>{property.type}</p></div></div>
                        <div className="flex items-center gap-2"><Star className="text-gray-500"/><div><p className="font-semibold">AI Score</p><p className="font-bold text-lg text-indigo-600">{property.aiScore}/10</p></div></div>
                        <div className="flex items-center gap-2"><BarChart2 className="text-gray-500"/><div><p className="font-semibold">Lifestyle</p><p className="font-bold text-lg text-indigo-600">{property.lifestyleScore}/100</p></div></div>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                        <ValueChart rentalYield={property.rentalYield} fairValue={property.fairValue} />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
                         <div className="flex gap-3">
                            <button onClick={() => onSwipe('dislike')} className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"><ThumbsDown/></button>
                            <button onClick={() => onSwipe('like')} className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition"><ThumbsUp/></button>
                         </div>
                         <div className="flex gap-3">
                             <button className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2"><Phone size={16}/> Contact Info</button>
                             <button className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2"><ExternalLink size={16}/> B2B Site</button>
                         </div>
                         <button onClick={() => onAddToCompare(property)} className="w-full sm:w-auto px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <Plus size={20}/> Add to Compare
                         </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


// ## Comparison Table Component ##
// Displays the side-by-side comparison of selected properties
const ComparisonTable = ({ properties }) => {
    const parameters = [
        { label: "Builder", key: "builder" },
        { label: "Location", key: "location" },
        { label: "Price", key: "price" },
        { label: "Area", key: "area" },
        { label: "Type", key: "type" },
        { label: "Nearby Localities", key: "nearbyLocalities", render: (p) => `Schools: ${p.nearbyLocalities.schools}, Hospitals: ${p.nearbyLocalities.hospitals}` },
        { label: "Approachability", key: "approachability" },
        { label: "Status", key: "status" },
        { label: "Parking", key: "parking" },
        { label: "Luxury", key: "luxury" },
        { label: "Lifestyle Score", key: "lifestyleScore" },
        { label: "Nature Score (AQI)", key: "natureScore.aqi", render: (p) => p.natureScore.aqi },
        { label: "Green Cover %", key: "natureScore.greenCover", render: (p) => p.natureScore.greenCover },
        { label: "2-Year Growth", key: "investmentPotential.twoYearGrowth", render: (p) => p.investmentPotential.twoYearGrowth },
        { label: "5-Year Growth", key: "investmentPotential.fiveYearGrowth", render: (p) => p.investmentPotential.fiveYearGrowth },
        { label: "AI Score", key: "aiScore" },
        { label: "Yield vs Value", key: "graph", render: (p) => <ValueChart rentalYield={p.rentalYield} fairValue={p.fairValue} isThumbnail={true}/> }
    ];

    const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

    return (
        <div className="w-full max-w-7xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Property Comparison</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3 min-w-[200px]">Parameter</th>
                            {properties.map(p => (
                                <th key={p.id} scope="col" className="px-6 py-3 min-w-[220px]">{p.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {parameters.map((param, index) => (
                            <tr key={param.key} className="border-b odd:bg-white even:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{param.label}</th>
                                {properties.map(p => (
                                    <td key={p.id} className="px-6 py-4">
                                        {param.render ? param.render(p) : getNestedValue(p, param.key)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ## Main Page Component ##
// Orchestrates the entire page layout and state
export default function PropertyComparatorPage() {
    const [properties, setProperties] = useState(initialProperties);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [comparedProperties, setComparedProperties] = useState([]);
    const [showComparator, setShowComparator] = useState(false);

    const handleSwipe = (direction) => {
        // Here you could add logic for 'liking' or 'disliking' a property
        console.log(`${direction}: ${properties[currentIndex].title}`);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    };

    const handleAddToCompare = (property) => {
        if (comparedProperties.length >= 4) {
            alert("You can only compare up to 4 properties.");
            return;
        }
        if (comparedProperties.some(p => p.id === property.id)) {
            alert("This property is already in the comparator.");
            return;
        }
        setComparedProperties(prev => [...prev, property]);
    };
    
    return (
        <div className="bg-slate-50 min-h-screen font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Search Section */}
                <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Find Your Perfect Property</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* Dropdowns */}
                        <select className="col-span-1 md:col-span-1 lg:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>India</option>
                        </select>
                        <select className="col-span-1 md:col-span-1 lg:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option>Gurugram</option>
                        </select>
                        {/* Text Boxes */}
                        <input type="text" placeholder="Location (e.g., Sector 65)" className="col-span-1 md:col-span-1 lg:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        <input type="text" placeholder="Budget (e.g., 4 Cr)" className="col-span-1 md:col-span-1 lg:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        <input type="text" placeholder="Area (e.g., 2000 sqft)" className="col-span-1 md:col-span-1 lg:col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                        {/* Search Button */}
                        <button className="col-span-1 lg:col-span-1 bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition-colors">Search</button>
                    </div>
                </div>

                {/* Property Swipe & Compare Button Section */}
                <div className="relative h-[650px] md:h-[550px] mb-8">
                    <AnimatePresence>
                        {properties.length > 0 && (
                            <PropertyCard
                                key={properties[currentIndex].id}
                                property={properties[currentIndex]}
                                onAddToCompare={handleAddToCompare}
                                onSwipe={handleSwipe}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center mb-8">
                    <button
                        onClick={() => setShowComparator(true)}
                        disabled={comparedProperties.length < 2}
                        className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Compare Properties ({comparedProperties.length} / 4)
                    </button>
                </div>


                {/* Comparator Table Section */}
                {showComparator && comparedProperties.length > 0 && (
                    <ComparisonTable properties={comparedProperties} />
                )}
            </div>
        </div>
    );
}