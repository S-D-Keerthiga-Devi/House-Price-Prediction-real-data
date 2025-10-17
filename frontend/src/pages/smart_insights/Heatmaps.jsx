// HeatmapMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import "leaflet/dist/leaflet.css";
import { coordinates } from "../../api/house.js";
import { useLocation } from "react-router-dom";

const FitBounds = ({ bounds, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      // Add padding to make the view more comfortable
      const padding = 0.01; // Adjust this value as needed
      map.fitBounds([
        [bounds.minLat - padding, bounds.minLng - padding],
        [bounds.maxLat + padding, bounds.maxLng + padding],
      ], {
        padding: [20, 20], // Padding in pixels
        maxZoom: 13 // Prevent zooming too close
      });
    } else if (center) {
      map.setView(center, 12);
    }
  }, [bounds, center, map]);
  
  return null;
};

const Heatmaps = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [mapCenter, setMapCenter] = useState([28.4595, 77.0266]); // Default Gurgaon coordinates
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const cityFromURL = params.get("city");

  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (cityFromURL) {
      setSelectedCity(cityFromURL);
    }
  }, [cityFromURL]);

  // City coordinates mapping for better centering
  const cityCoordinates = {
    "Gurgaon": [28.4595, 77.0266],
    "Mumbai": [19.0760, 72.8777],
    "Delhi": [28.7041, 77.1025],
    "Bangalore": [12.9716, 77.5946],
    "Chennai": [13.0827, 80.2707],
    "Hyderabad": [17.3850, 78.4867],
    "Pune": [18.5204, 73.8567],
    "Kolkata": [22.5726, 88.3639],
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await coordinates(selectedCity);
        if (res && res.success && res.data?.length > 0) {
          const cleaned = res.data.map((p) => {
            const lat = Number(p?.location?.coordinates?.[1] || p.lat);
            const lng = Number(p?.location?.coordinates?.[0] || p.lng);
            const rate_sqft = Number(p.rate_sqft || p.price_per_sqft || 0);
            
            return {
              lat,
              lng,
              rate_sqft,
              city: p.city,
              property_category: p.property_category,
              area: p.location || "Unknown Area",
            };
          }).filter(p => 
            !isNaN(p.lat) && 
            !isNaN(p.lng) && 
            p.rate_sqft > 0 &&
            p.lat !== 0 && 
            p.lng !== 0
          );

          setHeatmapData(cleaned);
          setBounds(res.bounds);
          
          // Set map center based on city or calculated center
          if (cityCoordinates[selectedCity]) {
            setMapCenter(cityCoordinates[selectedCity]);
          } else if (cleaned.length > 0) {
            // Calculate center from data points
            const avgLat = cleaned.reduce((sum, p) => sum + p.lat, 0) / cleaned.length;
            const avgLng = cleaned.reduce((sum, p) => sum + p.lng, 0) / cleaned.length;
            setMapCenter([avgLat, avgLng]);
          }
        }
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[450px] bg-gray-50 rounded-xl border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading heatmap data...</p>
        </div>
      </div>
    );
  }

  if (heatmapData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[450px] bg-gray-50 rounded-xl border">
        <div className="text-center">
          <p className="text-base text-gray-700">No data available for {selectedCity}</p>
          <p className="text-sm text-gray-500">Please try a different city</p>
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...heatmapData.map(p => p.rate_sqft), 1);
  const minPrice = Math.min(...heatmapData.map(p => p.rate_sqft));
  
  const points = heatmapData.map(p => ({
    lat: p.lat,
    lng: p.lng,
    weight: (p.rate_sqft - minPrice) / (maxPrice - minPrice) || 0.1 // Normalize between 0 and 1
  }));

  return (
    <div className="relative w-full rounded-xl overflow-hidden border h-[360px] sm:h-[420px] md:h-[500px]">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border max-w-xs">
        <h3 className="font-semibold text-sm mb-2">Price per sqft (₹)</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
            <span>₹{minPrice.toLocaleString()} - ₹{Math.round(minPrice + (maxPrice - minPrice) * 0.3).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-cyan-400 rounded-sm"></div>
            <span>₹{Math.round(minPrice + (maxPrice - minPrice) * 0.3).toLocaleString()} - ₹{Math.round(minPrice + (maxPrice - minPrice) * 0.5).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-lime-400 rounded-sm"></div>
            <span>₹{Math.round(minPrice + (maxPrice - minPrice) * 0.5).toLocaleString()} - ₹{Math.round(minPrice + (maxPrice - minPrice) * 0.7).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-yellow-400 rounded-sm"></div>
            <span>₹{Math.round(minPrice + (maxPrice - minPrice) * 0.7).toLocaleString()} - ₹{Math.round(minPrice + (maxPrice - minPrice) * 0.9).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500 rounded-sm"></div>
            <span>₹{Math.round(minPrice + (maxPrice - minPrice) * 0.9).toLocaleString()}+</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-gray-600">
          <p><strong>{heatmapData.length}</strong> properties</p>
          <p><strong>{selectedCity}</strong></p>
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={11} style={{ height: "100%", width: "100%" }} className="z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        
        <FitBounds bounds={bounds} center={mapCenter} />
        
        <HeatmapLayer
          fitBoundsOnLoad={false}
          fitBoundsOnUpdate={false}
          points={points}
          longitudeExtractor={(m) => m.lng}
          latitudeExtractor={(m) => m.lat}
          intensityExtractor={(m) => m.weight}
          radius={20}
          blur={15}
          max={1}
          gradient={{
            0.1: "#0000ff",   // Blue for lowest prices
            0.3: "#00ffff",   // Cyan
            0.5: "#00ff00",   // Lime/Green
            0.7: "#ffff00",   // Yellow
            0.9: "#ff8000",   // Orange
            1.0: "#ff0000"    // Red for highest prices
          }}
        />

        {/* Hoverable markers with improved styling */}
        {heatmapData.map((p, idx) => (
          <CircleMarker
            key={`marker-${idx}`}
            center={[p.lat, p.lng]}
            radius={8}
            opacity={0}
            fillOpacity={0}
            interactive={true}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -10]} 
              opacity={0.95}
              className="custom-tooltip"
            >
              <div className="p-2 min-w-[150px]">
                <div className="font-bold text-lg text-green-600">
                  ₹{p.rate_sqft.toLocaleString()}/sqft
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <div><strong>Type:</strong> {p.property_category || "Residential"}</div>
                  <div><strong>Area:</strong> {p.area}</div>
                  <div><strong>Location:</strong> {p.city}</div>
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      <style jsx>{`
        .leaflet-tooltip.custom-tooltip {
          background-color: rgba(255, 255, 255, 0.95);
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .leaflet-tooltip.custom-tooltip::before {
          border-top-color: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  );
};

export default Heatmaps;