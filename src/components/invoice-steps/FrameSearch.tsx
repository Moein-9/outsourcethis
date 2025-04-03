
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Plus, PackageCheck, Sunglasses, Glasses } from "lucide-react";

interface FrameSearchProps {
  onFrameSelected: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    isSunglasses?: boolean;
  }) => void;
  selectedFrame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    isSunglasses?: boolean;
  };
}

export const FrameSearch: React.FC<FrameSearchProps> = ({ onFrameSelected, selectedFrame }) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const searchFrames = useInventoryStore((state) => state.searchFrames);
  
  const [frameSearch, setFrameSearch] = useState("");
  const [frameResults, setFrameResults] = useState<ReturnType<typeof searchFrames>>([]);
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  const handleFrameSearch = () => {
    if (!frameSearch.trim()) {
      toast(t('searchTermError'));
      return;
    }
    
    const results = searchFrames(frameSearch);
    setFrameResults(results);
    
    if (results.length === 0) {
      toast(t('noFramesFound'));
    }
  };
  
  const selectFrame = (frame: ReturnType<typeof searchFrames>[0]) => {
    const newFrame = {
      brand: frame.brand,
      model: frame.model,
      color: frame.color,
      size: frame.size,
      price: frame.price,
      isSunglasses: frame.isSunglasses
    };
    
    onFrameSelected(newFrame);
    setFrameResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="frameSearchBox" className={`text-muted-foreground block ${textAlignClass}`}>
          {t('searchTerm')}
        </Label>
        <div className={`flex ${dirClass === 'rtl' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
          <Input
            id="frameSearchBox"
            value={frameSearch}
            onChange={(e) => setFrameSearch(e.target.value)}
            placeholder={t('searchExample')}
            className={`flex-1 ${textAlignClass}`}
          />
          <Button onClick={handleFrameSearch} className="gap-1">
            <Search className="w-4 h-4" />
            {t('search')}
          </Button>
        </div>
      </div>
      
      {frameResults.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 border">{t('brand')}</th>
                <th className="p-2 border">{t('model')}</th>
                <th className="p-2 border">{t('color')}</th>
                <th className="p-2 border">{t('size')}</th>
                <th className="p-2 border">{t('price')} ({t('kwd')})</th>
                <th className="p-2 border">{t('quantity')}</th>
                <th className="p-2 border">{t('type')}</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {frameResults.map((frame, index) => (
                <tr 
                  key={index}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-2 border">{frame.brand}</td>
                  <td className="p-2 border">{frame.model}</td>
                  <td className="p-2 border">{frame.color}</td>
                  <td className="p-2 border">{frame.size}</td>
                  <td className="p-2 border">{frame.price.toFixed(2)}</td>
                  <td className="p-2 border">{frame.qty}</td>
                  <td className="p-2 border">
                    <div className="flex items-center">
                      {frame.isSunglasses ? (
                        <>
                          <Sunglasses className="w-4 h-4 mr-1" />
                          {t('sunglasses')}
                        </>
                      ) : (
                        <>
                          <Glasses className="w-4 h-4 mr-1" />
                          {t('eyeglasses')}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-2 border">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => selectFrame(frame)}
                      className="w-full"
                    >
                      <Plus className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                      {t('choose')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedFrame.brand && (
        <div className="mt-4 p-3 border rounded-lg bg-amber-50/50 border-amber-200/70">
          <h4 className={`font-medium text-amber-800 mb-2 flex items-center ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
            {selectedFrame.isSunglasses ? (
              <Sunglasses className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
            ) : (
              <PackageCheck className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
            )}
            {selectedFrame.isSunglasses ? t('selectedSunglasses') : t('selectedFrame')}
          </h4>
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-200/50">
                <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('brand')}</th>
                <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('model')}</th>
                <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('color')}</th>
                <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('size')}</th>
                <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('price')} ({t('kwd')})</th>
                <th className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}>{t('type')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`p-1 ${textAlignClass}`}>{selectedFrame.brand}</td>
                <td className={`p-1 ${textAlignClass}`}>{selectedFrame.model}</td>
                <td className={`p-1 ${textAlignClass}`}>{selectedFrame.color}</td>
                <td className={`p-1 ${textAlignClass}`}>{selectedFrame.size}</td>
                <td className={`p-1 ${textAlignClass} font-medium`}>{selectedFrame.price.toFixed(2)}</td>
                <td className={`p-1 ${textAlignClass}`}>
                  {selectedFrame.isSunglasses ? t('sunglasses') : t('eyeglasses')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
