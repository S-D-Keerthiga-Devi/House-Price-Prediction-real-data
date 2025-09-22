import React, { useState, useEffect } from 'react';
import { coordinates } from '../api/house.js'; // Import your data function
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const createCustomIcon = (color, priceRange, location, hasActualCoordinates) => {
  const size = 40;
  const iconColor = hasActualCoordinates ? 'white' : '#FEF3C7'; // Light yellow for approximate
  const borderColor = hasActualCoordinates ? 'white' : '#F59E0B'; // Amber for approximate

  return L.divIcon({
    className: 'custom-area-marker',
    html: `
      <div style="
        background-color: ${color}; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 8px; 
        border: 3px solid ${borderColor}; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 10px;
        color: ${iconColor};
        text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        cursor: pointer;
        transition: transform 0.2s ease;
        position: relative;
      " 
      onmouseover="this.style.transform='scale(1.1)'"
      onmouseout="this.style.transform='scale(1)'"
      title="${location}">
        ${priceRange}
        ${!hasActualCoordinates ? `<div style="position: absolute; top: -5px; right: -5px; width: 10px; height: 10px; background-color: #F59E0B; border-radius: 50%; border: 1px solid white;"></div>` : ''}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Enhanced color scheme similar to the reference image
const getColor = (value, minValue, maxValue) => {
  if (value === null || value === undefined) return '#9CA3AF'; // Gray for missing data

  // Normalize value between 0 and 1
  const normalized = (value - minValue) / (maxValue - minValue);

  // Color scheme similar to the reference image
  if (normalized <= 0.2) return '#4A90E2'; // Blue for lowest prices
  if (normalized <= 0.4) return '#F5A623'; // Orange for low-medium prices  
  if (normalized <= 0.6) return '#7ED321'; // Green for medium prices
  if (normalized <= 0.8) return '#9013FE'; // Purple for medium-high prices
  return '#D0021B'; // Red for highest prices
};

// Get price range label
const getPriceRangeLabel = (value, minValue, maxValue) => {
  const normalized = (value - minValue) / (maxValue - minValue);
  if (normalized <= 0.2) return '₹' + Math.round(value / 1000) + 'K';
  if (normalized <= 0.4) return '₹' + Math.round(value / 1000) + 'K';
  if (normalized <= 0.6) return '₹' + Math.round(value / 1000) + 'K';
  if (normalized <= 0.8) return '₹' + Math.round(value / 1000) + 'K';
  return '₹' + Math.round(value / 1000) + 'K';
};

// City coordinates for centering the map with better zoom levels
const cityCoordinates = {
  'Gurgaon': { center: [28.4595, 77.0266], zoom: 13, radius: 0.15 },
  'Mumbai': { center: [19.0760, 72.8777], zoom: 12, radius: 0.25 },
  'Bangalore': { center: [12.9716, 77.5946], zoom: 12, radius: 0.25 },
  'Delhi': { center: [28.7041, 77.1025], zoom: 12, radius: 0.25 },
};

// Simple hash function to generate deterministic coordinates
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate deterministic coordinates within city bounds
const generateDeterministicCoordinates = (city, location) => {
  const cityConfig = cityCoordinates[city] || cityCoordinates['Gurgaon'];
  const [centerLat, centerLng] = cityConfig.center;
  const radius = cityConfig.radius;

  // Generate consistent hash values for this location
  const locationHash = hashCode(location);

  // Use hash to generate normalized values between 0 and 1
  const latNorm = (locationHash % 1000) / 1000;
  const lngNorm = ((locationHash * 7) % 1000) / 1000; // Multiply by 7 to get different value

  // Map to [-radius/2, radius/2]
  const latOffset = (latNorm - 0.5) * radius;
  const lngOffset = (lngNorm - 0.5) * radius;

  const lat = centerLat + latOffset;
  const lng = centerLng + lngOffset;

  return { lat, lng };
};

const Heatmaps = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [locations, setLocations] = useState([]); // Initialize as empty array
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [selectedCity, setSelectedCity] = useState('Gurgaon'); // Default city
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(cityCoordinates['Gurgaon'].center);
  const [mapZoom, setMapZoom] = useState(cityCoordinates['Gurgaon'].zoom);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Fetch and process data with deterministic coordinates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsDataLoaded(false);
      setError(null);
      
      try {
        console.log(`Fetching data for ${selectedCity}...`);
        const data = await coordinates(selectedCity);
        console.log('Data received:', data);

        if (!data) {
          console.error('No data returned from coordinates function');
          setError("No data available for the selected city");
          setIsLoading(false);
          setIsDataLoaded(true);
          return;
        }

        // Handle different data formats
        let processedData = data;
        if (data.data) {
          processedData = data.data;
        }

        if (!Array.isArray(processedData) || processedData.length === 0) {
          console.error('Data is not an array or is empty');
          setError("No data available for the selected city");
          setIsLoading(false);
          setIsDataLoaded(true);
          return;
        }

        // Get unique locations
        const uniqueLocations = [...new Set(processedData.map(item => item.location))];
        console.log('Unique locations:', uniqueLocations);

        // Find min and max values
        const values = processedData
          .map(item => parseFloat(item.rate_sqft))
          .filter(val => !isNaN(val) && val !== undefined && val !== null);
          
        if (values.length === 0) {
          console.error('No valid rate values found');
          setError("No rate data available");
          setIsLoading(false);
          setIsDataLoaded(true);
          return;
        }

        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        console.log('Price range:', minVal, 'to', maxVal);

        setMinValue(minVal);
        setMaxValue(maxVal);
        setLocations(uniqueLocations);

        // Group data by location and assign deterministic coordinates
        const locationDataMap = {};

        uniqueLocations.forEach(location => {
          const locationRecords = processedData.filter(item => item.location === location);

          // Sort by year and month to get the latest data
          locationRecords.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
          });

          // Get the latest record
          const latestRecord = locationRecords[0];

          // Check if we have valid coordinates
          const hasValidCoordinates = latestRecord.lat && latestRecord.lng;

          locationDataMap[location] = {
            location,
            rate_sqft: parseFloat(latestRecord.rate_sqft),
            year: latestRecord.year,
            month: latestRecord.month,
            property_category: latestRecord.property_category,
            allRecords: locationRecords,
            coordinates: hasValidCoordinates
              ? { lat: parseFloat(latestRecord.lat), lng: parseFloat(latestRecord.lng) }
              : generateDeterministicCoordinates(selectedCity, location),
            hasActualCoordinates: hasValidCoordinates
          };
        });

        const heatmapDataArray = Object.values(locationDataMap);
        console.log('Processed heatmap data:', heatmapDataArray);
        setHeatmapData(heatmapDataArray);
        setIsDataLoaded(true);
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching heatmap data:", error);
        setError(`Failed to load data: ${error.message || 'Unknown error'}`);
        setIsDataLoaded(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);

  // Update map center when city changes
  useEffect(() => {
    const cityConfig = cityCoordinates[selectedCity] || cityCoordinates['Gurgaon'];
    setMapCenter(cityConfig.center);
    setMapZoom(cityConfig.zoom);
    setSelectedLocation(null);
  }, [selectedCity]);

  // Handle location click on map
  const handleLocationClick = (locationData) => {
    setSelectedLocation(locationData);
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading real estate data...</p>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16 mt-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Real Estate Heatmap</h1>
        <p className="text-lg text-gray-600 mb-8">
          Interactive map showing property prices per square foot (₹/sqft) across different locations
        </p>


        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-[600px] w-full relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              key={selectedCity} // Force re-render when city changes
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {heatmapData.map((locationData, index) => {
                const coords = [locationData.coordinates.lat, locationData.coordinates.lng];
                const color = getColor(locationData.rate_sqft, minValue, maxValue);
                const priceLabel = getPriceRangeLabel(locationData.rate_sqft, minValue, maxValue);

                return (
                  <Marker
                    key={`${selectedCity}-${locationData.location}-${index}`}
                    position={coords}
                    icon={createCustomIcon(color, priceLabel, locationData.location, locationData.hasActualCoordinates)}
                    eventHandlers={{
                      click: () => handleLocationClick(locationData),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                      <div className="text-center bg-white p-2 rounded shadow-lg">
                        <strong className="text-gray-800">{locationData.location}</strong><br />
                        <span className="text-blue-600 font-semibold">₹{locationData.rate_sqft.toLocaleString('en-IN')}/sqft</span>
                      </div>
                    </Tooltip>
                    <Popup maxWidth={300} className="custom-popup">
                      <div className="p-3">
                        <h3 className="font-bold text-lg mb-3 text-gray-800">{locationData.location}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Rate:</span>
                            <span className="font-semibold text-blue-600">₹{locationData.rate_sqft.toLocaleString('en-IN')}/sqft</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Period:</span>
                            <span>{locationData.month} {locationData.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property Type:</span>
                            <span>{locationData.property_category}</span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Legend overlay */}
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000]">
              <h3 className="font-bold text-sm mb-3 text-gray-800">Current Price (per Sq. Ft.)</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#4A90E2' }}></div>
                  <span>Below ₹{Math.round(minValue + (maxValue - minValue) * 0.2).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#F5A623' }}></div>
                  <span>₹{Math.round(minValue + (maxValue - minValue) * 0.2).toLocaleString('en-IN')} - ₹{Math.round(minValue + (maxValue - minValue) * 0.4).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#7ED321' }}></div>
                  <span>₹{Math.round(minValue + (maxValue - minValue) * 0.4).toLocaleString('en-IN')} - ₹{Math.round(minValue + (maxValue - minValue) * 0.6).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#9013FE' }}></div>
                  <span>₹{Math.round(minValue + (maxValue - minValue) * 0.6).toLocaleString('en-IN')} - ₹{Math.round(minValue + (maxValue - minValue) * 0.8).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#D0021B' }}></div>
                  <span>₹{Math.round(minValue + (maxValue - minValue) * 0.8).toLocaleString('en-IN')} & Above</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Market Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Locations</div>
                  <div className="text-xl font-bold text-blue-600">{heatmapData.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Min Price</div>
                  <div className="text-xl font-bold text-green-600">₹{minValue.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Max Price</div>
                  <div className="text-xl font-bold text-red-600">₹{maxValue.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Avg Price</div>
                  <div className="text-xl font-bold text-purple-600">
                    {heatmapData.length > 0
                      ? `₹${Math.round(heatmapData.reduce((sum, item) => sum + item.rate_sqft, 0) / heatmapData.length).toLocaleString('en-IN')}`
                      : '₹0'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            {selectedLocation && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Location Details</h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-bold text-lg text-gray-800">{selectedLocation.location}</h3>
                    <div className="mt-2">
                      <p className="text-gray-600 text-sm">Current Rate</p>
                      <p className="text-2xl font-bold text-blue-600">₹{selectedLocation.rate_sqft.toLocaleString('en-IN')}/sqft</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Period</p>
                      <p className="font-semibold">{selectedLocation.month} {selectedLocation.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Property Type</p>
                      <p className="font-semibold">{selectedLocation.property_category}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-bold mb-3 text-gray-800">Price History</h4>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {selectedLocation.allRecords.slice(0, 8).map((record, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{record.month} {record.year}</span>
                          <span className="text-sm font-bold text-blue-600">₹{parseFloat(record.rate_sqft).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmaps;