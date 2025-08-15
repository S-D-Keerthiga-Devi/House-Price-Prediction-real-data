import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PropertyGraph({ rentalYield, fairValue }) {
    const getQuadrant = (x, y) => {
        if (x > 50 && y > 50) return { name: "Q3: High Value, High Yield", color: "text-emerald-600", bg: "bg-emerald-100" };
        if (x > 50 && y <= 50) return { name: "Q2: High Value, Low Yield", color: "text-blue-600", bg: "bg-blue-100" };
        if (x <= 50 && y > 50) return { name: "Q4: Low Value, High Yield", color: "text-amber-600", bg: "bg-amber-100" };
        return { name: "Q1: Low Value, Low Yield", color: "text-red-600", bg: "bg-red-100" };
    };

    const quadrant = getQuadrant(fairValue, rentalYield);

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Investment Quadrant</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-48 bg-gray-50 rounded-lg mb-4">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Grid lines */}
                        <line x1="100" y1="0" x2="100" y2="200" stroke="#d1d5db" strokeWidth="1" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke="#d1d5db" strokeWidth="1" />
                        
                        {/* Quadrant labels */}
                        <text x="50" y="20" textAnchor="middle" className="text-xs fill-gray-600">Q2</text>
                        <text x="150" y="20" textAnchor="middle" className="text-xs fill-gray-600">Q3</text>
                        <text x="50" y="190" textAnchor="middle" className="text-xs fill-gray-600">Q1</text>
                        <text x="150" y="190" textAnchor="middle" className="text-xs fill-gray-600">Q4</text>
                        
                        {/* Data point */}
                        <circle
                            cx={fairValue * 2}
                            cy={200 - (rentalYield * 2)}
                            r="6"
                            fill="#f59e0b"
                            stroke="#d97706"
                            strokeWidth="2"
                        />
                    </svg>
                    
                    {/* Axis labels */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                        Fair Value →
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-600">
                        Rental Yield →
                    </div>
                </div>
                
                <div className={`p-3 rounded-lg ${quadrant.bg}`}>
                    <div className={`text-sm font-medium ${quadrant.color}`}>
                        {quadrant.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        Fair Value: {fairValue}% | Rental Yield: {rentalYield}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}