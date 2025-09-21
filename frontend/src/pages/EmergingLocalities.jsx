import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, MapPin, Calendar, Building, Filter } from 'lucide-react';
import { houseDetails } from '../api/house.js';

function EmergingLocalities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Gurgaon');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rate_desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState('');

  const cities = ['Gurgaon', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Noida'];
  const propertyCategories = ['all', 'Apartment', 'Other'];

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await houseDetails(selectedCity);
      if (response.success) {
        setData(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching property data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processData = () => {
    let processed = data.filter(item => {
      const matchesSearch = item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.property_category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Group by location to calculate trends
    const locationGroups = processed.reduce((acc, item) => {
      if (!acc[item.location]) {
        acc[item.location] = [];
      }
      acc[item.location].push(item);
      return acc;
    }, {});

    // Process each location group
    const locationStats = Object.keys(locationGroups).map(location => {
      const items = locationGroups[location].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        const monthOrder = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                           'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12};
        return (monthOrder[b.month] || 0) - (monthOrder[a.month] || 0);
      });

      const latest = items[0];
      const previous = items.find(item => 
        item.property_category === latest.property_category && 
        (item.year < latest.year || (item.year === latest.year && item.month !== latest.month))
      );

      let trend = 0;
      let trendPercentage = 0;
      if (previous) {
        trend = latest.rate_sqft - previous.rate_sqft;
        trendPercentage = ((trend / previous.rate_sqft) * 100).toFixed(1);
      }

      const avgRate = items.reduce((sum, item) => sum + item.rate_sqft, 0) / items.length;
      const categoryCount = items.reduce((acc, item) => {
        acc[item.property_category] = (acc[item.property_category] || 0) + 1;
        return acc;
      }, {});

      return {
        location: latest.location,
        currentRate: latest.rate_sqft,
        avgRate: Math.round(avgRate),
        trend,
        trendPercentage,
        lastUpdated: `${latest.month} ${latest.year}`,
        quarter: latest.quarter,
        categories: Object.keys(categoryCount),
        totalListings: items.length,
        categoryBreakdown: categoryCount
      };
    });

    // Sort based on selected criteria
    return locationStats.sort((a, b) => {
      switch (sortBy) {
        case 'rate_desc': return b.currentRate - a.currentRate;
        case 'rate_asc': return a.currentRate - b.currentRate;
        case 'trend_desc': return b.trend - a.trend;
        case 'trend_asc': return a.trend - b.trend;
        case 'name_asc': return a.location.localeCompare(b.location);
        default: return 0;
      }
    });
  };

  const formatPrice = (price) => {
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
    if (price >= 1000) return `₹${(price / 1000).toFixed(1)}K`;
    return `₹${price}`;
  };

  const processedData = processData();

  return (
    <div className="min-h-screen bg-gray-50">
      Emerging Localities
    </div>
  );
}

export default EmergingLocalities;