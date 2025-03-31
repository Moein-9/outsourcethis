
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, MapPin } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreLocation, LocationId, storeLocations } from "@/store/storeLocationStore";
import { useLanguageStore } from "@/store/languageStore";

interface LocationSelectorProps {
  onSelect?: (locationId: string) => void;
  className?: string;
  mini?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSelect,
  className = "",
  mini = true,
}) => {
  const { selectedLocation, setSelectedLocation } = useStoreLocation();
  const { language, t } = useLanguageStore();
  
  // Use storeLocations directly instead of locations property from context
  const locations = storeLocations;
  
  const handleLocationSelect = (locationId: LocationId) => {
    setSelectedLocation(locationId);
    if (onSelect) {
      onSelect(locationId);
    }
  };
  
  // Mini version (just a button with the location name)
  if (mini) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={`flex items-center gap-1 ${className}`}>
            <MapPin className="h-4 w-4" />
            {language === 'ar' ? 
              locations[selectedLocation].name.ar : 
              locations[selectedLocation].name.en
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-2">
          <div className="space-y-2">
            {Object.entries(locations).map(([id, location]) => (
              <Button 
                key={id}
                variant={id === selectedLocation ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleLocationSelect(id as LocationId)}
              >
                <div className="flex items-center">
                  {id === selectedLocation && <Check className="mr-2 h-4 w-4" />}
                  {language === 'ar' ? location.name.ar : location.name.en}
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  
  // Full version (location cards with address and phone)
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-medium text-center">{t('changeLocation')}</h3>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(locations).map(([id, location]) => (
          <div 
            key={id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              id === selectedLocation ? 'bg-primary/10 border-primary/50' : 'hover:bg-muted'
            }`}
            onClick={() => handleLocationSelect(id as LocationId)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  {language === 'ar' ? location.name.ar : location.name.en}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'ar' ? location.address.ar : location.address.en}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('phone')}: {location.phone}
              </div>
            </div>
            {id === selectedLocation && (
              <div className="text-xs text-primary mt-2 text-right">
                {t('currentLocation')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
