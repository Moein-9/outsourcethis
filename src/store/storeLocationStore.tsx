
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the available store locations
export type LocationId = 'arbid' | 'somait';

interface StoreLocation {
  id: LocationId;
  name: {
    en: string;
    ar: string;
  };
  address: {
    en: string;
    ar: string;
  };
  phone: string;
}

export const storeLocations: Record<LocationId, StoreLocation> = {
  arbid: {
    id: 'arbid',
    name: {
      en: 'Al Arbid Gallery Mall',
      ar: 'مجمع العربيد جاليري'
    },
    address: {
      en: 'Habeeb Munawer Street, Al Farwaniyah, Kuwait',
      ar: 'شارع حبيب مناور، الفروانية، الكويت'
    },
    phone: '24748201'
  },
  somait: {
    id: 'somait',
    name: {
      en: 'Al-Somait Plaza',
      ar: 'مجمع الصميط بلازا'
    },
    address: {
      en: 'Habeeb Munawer Street, Al Farwaniyah, Kuwait',
      ar: 'شارع حبيب مناور، الفروانية، الكويت'
    },
    phone: '24759016'
  }
};

interface LocationContextType {
  selectedLocation: LocationId;
  setSelectedLocation: (locationId: LocationId) => void;
  getLocationData: (locationId?: LocationId) => StoreLocation;
  locations: typeof storeLocations; // Add locations property to expose storeLocations
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const StoreLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Arbid or get from localStorage if available
  const [selectedLocation, setSelectedLocation] = useState<LocationId>(() => {
    const savedLocation = localStorage.getItem('storeLocation') as LocationId;
    return savedLocation && (savedLocation === 'arbid' || savedLocation === 'somait') 
      ? savedLocation 
      : 'arbid';
  });
  
  // Save location preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('storeLocation', selectedLocation);
  }, [selectedLocation]);
  
  // Get location data function
  const getLocationData = (locationId?: LocationId): StoreLocation => {
    const id = locationId || selectedLocation;
    return storeLocations[id];
  };
  
  return (
    <LocationContext.Provider value={{ 
      selectedLocation, 
      setSelectedLocation,
      getLocationData,
      locations: storeLocations // Expose storeLocations in the context
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useStoreLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useStoreLocation must be used within a StoreLocationProvider');
  }
  return context;
};
