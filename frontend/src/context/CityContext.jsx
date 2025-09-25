import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CityContext = createContext();

// Create a provider component
export const CityProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [selectedCity, setSelectedCity] = useState(() => {
    const savedCity = localStorage.getItem('selectedCity');
    return savedCity || '';
  });

  // Update localStorage when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
    }
  }, [selectedCity]);

  // Value to be provided to consumers
  const value = {
    selectedCity,
    setSelectedCity,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

// Custom hook for using the city context
export const useCity = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};