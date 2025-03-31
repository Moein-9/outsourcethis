
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDefaultLocationId, storeLocations } from '@/assets/logo';

type LocationId = keyof typeof storeLocations;

interface StoreLocationContextType {
  selectedLocation: LocationId;
  setSelectedLocation: (locationId: LocationId) => void;
  locations: typeof storeLocations;
}

const StoreLocationContext = createContext<StoreLocationContextType | undefined>(undefined);

export const StoreLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationId>(getDefaultLocationId() as LocationId);

  // Load saved location from localStorage if available
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation && storeLocations[savedLocation as LocationId]) {
      setSelectedLocation(savedLocation as LocationId);
    }
  }, []);

  // Save location to localStorage when changed
  useEffect(() => {
    localStorage.setItem('selectedLocation', selectedLocation);
  }, [selectedLocation]);

  return (
    <StoreLocationContext.Provider 
      value={{ 
        selectedLocation, 
        setSelectedLocation, 
        locations: storeLocations 
      }}
    >
      {children}
    </StoreLocationContext.Provider>
  );
};

export const useStoreLocation = (): StoreLocationContextType => {
  const context = useContext(StoreLocationContext);
  if (context === undefined) {
    throw new Error('useStoreLocation must be used within a StoreLocationProvider');
  }
  return context;
};
