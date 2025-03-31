
import { create } from 'zustand';
import { storeLocations } from '@/assets/logo';

export interface StoreLocation {
  id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  phone: string;
  isDefault: boolean;
}

interface LocationState {
  locations: StoreLocation[];
  selectedLocation: StoreLocation;
  setSelectedLocation: (locationId: string) => void;
  getLocationById: (locationId: string) => StoreLocation | undefined;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  locations: storeLocations,
  selectedLocation: storeLocations.find(loc => loc.isDefault) || storeLocations[0],
  
  setSelectedLocation: (locationId: string) => {
    const location = storeLocations.find(loc => loc.id === locationId);
    if (location) {
      set({ selectedLocation: location });
    }
  },
  
  getLocationById: (locationId: string) => {
    return storeLocations.find(loc => loc.id === locationId);
  }
}));
