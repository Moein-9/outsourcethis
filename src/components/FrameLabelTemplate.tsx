
import React, { useState, useEffect } from "react";
import { useInventoryStore, FrameItem } from "@/store/inventoryStore";
import { QRCodeSVG } from "qrcode.react";
import { Printer, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguageStore } from "@/store/languageStore";
import { MoenLogo } from "@/assets/logo";
import { PrintService } from "@/utils/PrintService";

const LabelComponent = ({ frame }: { frame: FrameItem }) => {
  return (
    <div className="label-container">
      {/* Right section - brand info */}
      <div className="right-section">
        <div className="brand-name">{frame.brand}</div>
        <div className="detail-info">
          Model: {frame.model || "-"}<br/>
          Color: {frame.color || "-"}<br/>
          Size: {frame.size || "-"}
        </div>
        <div className="price">K.D. {frame.price.toFixed(3)}</div>
      </div>

      {/* Left section - QR code and logo */}
      <div className="left-section">
        <div className="store-logo">
          <MoenLogo className="w-auto" style={{ maxHeight: "4mm", height: "auto" }} />
        </div>
        
        <div className="qr-code">
          <QRCodeSVG 
            value={frame.frameId} 
            size={22}
            level="M"
          />
        </div>
      </div>
    </div>
  );
};

export const usePrintLabel = () => {
  const printSelectedFrames = (frameIds: string[]) => {
    const { frames } = useInventoryStore.getState();
    const selectedFrames = frames.filter(frame => frameIds.includes(frame.frameId));
    console.log('wawa')
    if (selectedFrames.length === 0) {
      toast.warning("No frames selected for printing");
      return;
    }
    
    // Generate the HTML content for each label
    let labelContent = '';
    
    selectedFrames.forEach(frame => {
      // Create QR code URL using a simple API
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=22x22&data=${encodeURIComponent(frame.frameId)}`;
      
      labelContent += `
        <div class="label-container">
          
          <div class="right-section">
            <div class="store-logo">
              <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" style="max-height: 2.5mm; width: auto;" />
            </div>
            <div class="qr-code">
              <img src="${qrCodeUrl}" width="22" height="22" alt="QR Code" />
            </div>
          </div>
          <div class="left-section">
            <div class="brand-name">${frame.brand}</div>
            <div class="detail-info">
              Model: ${frame.model || "-"}<br/>
              Color: ${frame.color || "-"}
              Size: ${frame.size || "-"}
            </div>
            <div class="price">K.D. ${frame.price.toFixed(3)}</div>
          </div>
        </div>
      `;
    });
    
    // Use PrintService to prepare and print the label document
    const htmlContent = PrintService.prepareLabelDocument(labelContent);
    
    // Print the labels
    PrintService.printHtml(htmlContent, 'label', () => {
      toast.success(`${selectedFrames.length} label(s) sent to printer`);
    });
  };
  
  const printSingleLabel = (frameId: string) => {
    printSelectedFrames([frameId]);
  };
  
  return { printSelectedFrames, printSingleLabel };
};

export const FrameLabelTemplate: React.FC = () => {
  const { frames } = useInventoryStore();
  const { t } = useLanguageStore();
  const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredFrames, setFilteredFrames] = useState(frames);
  const { printSelectedFrames } = usePrintLabel();
  
  const toggleFrameSelection = (frameId: string) => {
    if (selectedFrames.includes(frameId)) {
      setSelectedFrames(selectedFrames.filter(id => id !== frameId));
    } else {
      setSelectedFrames([...selectedFrames, frameId]);
    }
  };
  
  const toggleSelectAll = () => {
    if (selectedFrames.length === filteredFrames.length) {
      setSelectedFrames([]);
    } else {
      setSelectedFrames(filteredFrames.map(frame => frame.frameId));
    }
  };
  
  const handleSearch = () => {
    if (!searchText.trim()) {
      setFilteredFrames(frames);
      return;
    }
    
    const filtered = frames.filter(frame => {
      const searchLower = searchText.toLowerCase();
      return (
        frame.brand.toLowerCase().includes(searchLower) ||
        frame.model.toLowerCase().includes(searchLower) ||
        frame.color.toLowerCase().includes(searchLower) ||
        (frame.size && frame.size.toLowerCase().includes(searchLower))
      );
    });
    
    setFilteredFrames(filtered);
  };
  
  const handlePrint = () => {
    if (selectedFrames.length === 0) {
      toast.warning(t("selectFramesForPrinting"));
      return;
    }
    
    printSelectedFrames(selectedFrames);
  };
  
  const handleReset = () => {
    setSearchText("");
    setSelectedFrames([]);
    setFilteredFrames(frames);
  };
  
  // Update filtered frames when search text changes
  useEffect(() => {
    handleSearch();
  }, [searchText]);
  
  // Update filtered frames when frame data changes
  useEffect(() => {
    setFilteredFrames(frames);
  }, [frames]);
  
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="search-frames" className="text-xs font-medium mb-1 block">
              {t("searchFrames")}
            </Label>
            <Input
              id="search-frames"
              placeholder={t("searchByBrandModelColor")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={handleReset} className="h-10">
              <X className="h-4 w-4 mr-1" /> {t("reset")}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all"
              checked={selectedFrames.length === filteredFrames.length && filteredFrames.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <Label htmlFor="select-all" className="text-sm cursor-pointer">
              {t("selectAll")} ({filteredFrames.length})
            </Label>
          </div>
          
          <Button 
            onClick={handlePrint} 
            disabled={selectedFrames.length === 0}
            className="gap-1"
          >
            <Printer className="h-4 w-4" /> {t("printSelected")} ({selectedFrames.length})
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("labelPreview")}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFrames.length > 0 ? (
            <div className="space-y-3">
              {filteredFrames.map((frame) => (
                <div key={frame.frameId} className="flex items-center gap-3">
                  <Checkbox
                    id={`frame-${frame.frameId}`}
                    checked={selectedFrames.includes(frame.frameId)}
                    onCheckedChange={() => toggleFrameSelection(frame.frameId)}
                  />
                  <div className="flex-1 border rounded overflow-hidden">
                    <LabelComponent frame={frame} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{t("noFramesFound")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
