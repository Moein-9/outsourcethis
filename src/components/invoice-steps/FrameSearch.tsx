
import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore, FrameItem } from "@/store/inventoryStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { Input } from "@/components/ui/input";
import { Search, Glasses, Sun } from "lucide-react";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FrameSearchProps {
  onFrameSelected: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }) => void;
  selectedFrame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  sunglassesMode?: boolean; // New prop to filter for sunglasses
}

export const FrameSearch: React.FC<FrameSearchProps> = ({ 
  onFrameSelected, 
  selectedFrame,
  sunglassesMode = false 
}) => {
  const { t, language } = useLanguageStore();
  const { frames, searchFrames } = useInventoryStore();
  const { setValue } = useInvoiceForm();
  
  const [query, setQuery] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const [filteredFrames, setFilteredFrames] = useState<FrameItem[]>([]);
  
  useEffect(() => {
    // Filter frames based on the query and sunglassesMode prop
    const results = searchFrames(query).filter(frame => {
      if (sunglassesMode) {
        return frame.isSunglasses === true;
      } else {
        return frame.isSunglasses !== true; // Only regular frames for normal frame selection
      }
    });
    setFilteredFrames(results);
  }, [query, frames, searchFrames, sunglassesMode]);
  
  const handleSelectFrame = (frame: FrameItem) => {
    onFrameSelected({
      brand: frame.brand,
      model: frame.model,
      color: frame.color,
      size: frame.size,
      price: frame.price
    });
    
    // Set frame type based on whether it's sunglasses or regular
    if (sunglassesMode) {
      setValue('frameSunglasses', true);
    } else {
      setValue('frameSunglasses', false);
    }
    
    setOpenPopover(false);
  };
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const directionClass = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="space-y-4" dir={directionClass}>
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto flex items-center justify-between gap-2 border-blue-200"
            >
              {sunglassesMode ? (
                <Sun className="h-4 w-4 text-orange-500" />
              ) : (
                <Glasses className="h-4 w-4 text-blue-500" />
              )}
              <span>
                {sunglassesMode
                  ? (language === 'ar' ? "اختر نظارة شمسية" : "Select Sunglasses")
                  : (language === 'ar' ? "اختر إطار" : "Select Frame")
                }
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start" side="bottom" sideOffset={5} width={400}>
            <Command>
              <CommandInput 
                placeholder={
                  sunglassesMode
                    ? (language === 'ar' ? "ابحث عن نظارة شمسية..." : "Search sunglasses...")
                    : (language === 'ar' ? "ابحث عن إطار..." : "Search frames...")
                }
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {sunglassesMode
                    ? (language === 'ar' ? "لا توجد نظارات شمسية" : "No sunglasses found")
                    : (language === 'ar' ? "لا توجد إطارات" : "No frames found")
                  }
                </CommandEmpty>
                <CommandGroup>
                  {filteredFrames.map((frame) => (
                    <CommandItem
                      key={frame.frameId}
                      onSelect={() => handleSelectFrame(frame)}
                      className="flex justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {frame.brand} {frame.model}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {frame.color} • {frame.size}
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {frame.price.toFixed(3)} KWD
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {selectedFrame.brand && (
          <div className="w-full p-3 border border-blue-100 bg-blue-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-blue-700">
                  {selectedFrame.brand} {selectedFrame.model}
                </div>
                <div className="text-sm text-blue-600">
                  {selectedFrame.color} • {selectedFrame.size}
                </div>
              </div>
              <Badge className={`${sunglassesMode ? 'bg-orange-500' : 'bg-blue-500'}`}>
                {selectedFrame.price.toFixed(3)} KWD
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
