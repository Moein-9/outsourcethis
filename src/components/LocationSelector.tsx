
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLocationStore } from '@/store/locationStore';
import { useLanguageStore } from '@/store/languageStore';

interface LocationSelectorProps {
  selectedLocationId?: string;
  onLocationChange?: (locationId: string) => void;
  inline?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationId,
  onLocationChange,
  inline = false
}) => {
  const { locations, selectedLocation, setSelectedLocation } = useLocationStore();
  const { language } = useLanguageStore();
  const isArabic = language === 'ar';
  
  const currentLocationId = selectedLocationId || selectedLocation.id;
  
  const handleLocationChange = (value: string) => {
    if (onLocationChange) {
      onLocationChange(value);
    } else {
      setSelectedLocation(value);
    }
  };
  
  return (
    <div className={inline ? "space-y-2" : "space-y-4"}>
      <div className={inline ? "" : "mb-2"}>
        <Label className="text-sm font-medium">
          {isArabic ? "موقع المتجر:" : "Store Location:"}
        </Label>
      </div>
      
      <RadioGroup
        value={currentLocationId}
        onValueChange={handleLocationChange}
        className={inline ? "flex flex-wrap gap-2" : "space-y-2"}
      >
        {locations.map((location) => (
          <div 
            key={location.id} 
            className={inline 
              ? "flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 border rounded-md p-2 cursor-pointer hover:bg-gray-100"
              : "flex items-center space-x-2 rtl:space-x-reverse border p-3 rounded-md cursor-pointer hover:bg-gray-50"
            }
            onClick={() => handleLocationChange(location.id)}
          >
            <RadioGroupItem value={location.id} id={`location-${location.id}`} />
            <Label 
              htmlFor={`location-${location.id}`} 
              className="cursor-pointer flex-1"
            >
              <div className="font-medium">
                {isArabic ? location.nameAr : location.nameEn}
              </div>
              <div className="text-xs text-gray-500">
                {isArabic ? location.addressAr : location.addressEn}
              </div>
              <div className="text-xs">
                {isArabic ? `هاتف: ${location.phone}` : `Tel: ${location.phone}`}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
