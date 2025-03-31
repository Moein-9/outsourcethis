
import React from 'react';
import { useStoreLocation, LocationId } from '@/store/storeLocationStore';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from '@/components/ui/button';
import { Check, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LocationSelectorProps {
  mini?: boolean;
  onSelect?: (locationId: string) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  mini = false,
  onSelect,
  className = ''
}) => {
  const { selectedLocation, setSelectedLocation, locations } = useStoreLocation();
  const { language, t } = useLanguageStore();
  const isRtl = language === 'ar';

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId as LocationId);
    if (onSelect) {
      onSelect(locationId);
    }
  };

  const currentLocation = locations[selectedLocation];

  if (mini) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`gap-1 ${className}`}>
            <MapPin className="h-3 w-3" />
            <span className="max-w-24 truncate text-xs">
              {isRtl ? currentLocation.name.ar : currentLocation.name.en}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRtl ? "end" : "start"}>
          {Object.values(locations).map((location) => (
            <DropdownMenuItem
              key={location.id}
              className="flex justify-between"
              onClick={() => handleLocationSelect(location.id)}
            >
              <span>{isRtl ? location.name.ar : location.name.en}</span>
              {selectedLocation === location.id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`justify-start gap-2 ${className}`}>
          <MapPin className="h-4 w-4" />
          <div className="flex flex-col items-start text-left">
            <span className="font-medium">
              {isRtl ? currentLocation.name.ar : currentLocation.name.en}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('changeLocation')}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "end" : "start"} className="w-56">
        {Object.values(locations).map((location) => (
          <DropdownMenuItem
            key={location.id}
            className="flex justify-between py-2"
            onClick={() => handleLocationSelect(location.id)}
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {isRtl ? location.name.ar : location.name.en}
              </span>
              <span className="text-xs text-muted-foreground">
                {isRtl ? location.address.ar : location.address.en}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('phone')}: {location.phone}
              </span>
            </div>
            {selectedLocation === location.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
