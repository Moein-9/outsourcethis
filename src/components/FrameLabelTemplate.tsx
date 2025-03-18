
import React, { useState, useRef } from "react";
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
    <div className="label-container" style={{
      width: "100mm",
      height: "16mm",
      border: "1px dashed #ccc",
      display: "flex",
      fontFamily: "Arial, sans-serif",
      pageBreakInside: "avoid",
      marginBottom: "5mm",
      position: "relative",
      overflow: "hidden",
      borderRadius: "8mm"
    }}>
      {/* Right section - brand info */}
      <div className="right-section" style={{
        width: "45mm",
        height: "100%",
        padding: "1mm 2mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginRight: "5cm" // Add margin to move this section closer to the QR code
      }}>
        <div className="brand-name" style={{
          fontWeight: "bold",
          fontSize: "9pt",
          marginBottom: "1mm",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>{frame.brand}</div>
        <div className="detail-info" style={{
          fontSize: "7pt",
          marginBottom: "1mm",
          lineHeight: "1.1"
        }}>
          Model: {frame.model || "-"}<br/>
          Color: {frame.color || "-"}<br/>
          Size: {frame.size || "-"}
        </div>
        <div className="price" style={{
          fontWeight: "bold",
          fontSize: "9pt"
        }}>K.D. {frame.price.toFixed(3)}</div>
      </div>

      {/* Left section - QR code and logo */}
      <div className="left-section" style={{
        width: "45mm",
        height: "100%",
        padding: "1mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div className="store-logo" style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: "1mm"
        }}>
          <MoenLogo className="w-auto" style={{ maxHeight: "4mm", height: "auto" }} />
        </div>
        
        <div className="qr-code" style={{
          display: "flex",
          justifyContent: "center"
        }}>
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
    
    if (selectedFrames.length === 0) return;
    
    const logoUrl = "/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png";
    
    let labelContent = '';
    
    selectedFrames.forEach(frame => {
      labelContent += `
        <div class="label-container">
          <div class="left-section">
            <div class="brand-name">${frame.brand}</div>
            <div class="detail-info">
              Model: ${frame.model || "-"}<br/>
              Color: ${frame.color || "-"}<br/>
              Size: ${frame.size || "-"}
            </div>
            <div class="price">K.D. ${frame.price.toFixed(3)}</div>
          </div>
          <div class="right-section">
            <div class="store-logo">
              <img src="${logoUrl}" alt="Store Logo">
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(frame.frameId)}" alt="QR Code">
            </div>
          </div>
        </div>
      `;
    });
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Frame Labels</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            padding: 0;
            margin: 0;
          }
          .label-container {
            width: 100mm;
            height: 16mm;
            display: flex;
            font-family: Arial, sans-serif;
            page-break-inside: avoid;
            page-break-after: always;
            position: relative;
            overflow: hidden;
            border-radius: 8mm;
          }
          .left-section {
            width: 45mm;
            height: 100%;
            padding: 1mm 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .right-section {
            width: 45mm;
            height: 100%;
            padding: 1mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .brand-name {
            font-weight: bold;
            font-size: 10pt;
            margin-bottom: 1mm;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .detail-info {
            font-size: 8pt;
            margin-bottom: 1mm;
            line-height: 1.1;
          }
          .price {
            font-weight: bold;
            font-size: 10pt;
          }
          .store-logo {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-bottom: 1mm;
          }
          .store-logo img {
            max-height: 4mm;
            width: auto;
          }
          .qr-code {
            display: flex;
            justify-content: center;
          }
          .qr-code img {
            height: 24px;
            width: 24px;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            @page {
              size: 100mm 16mm;
              margin: 0;
              padding: 0;
            }
            .label-container {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        ${labelContent}
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 500);
            }, 1000);
          });
        </script>
      </body>
      </html>
    `;
    
    PrintService.printHtml(printContent, () => {
      toast.success("Labels sent to printer");
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
  
  React.useEffect(() => {
    handleSearch();
  }, [searchText]);
  
  React.useEffect(() => {
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
      
      <div id="print-container" className="hidden">
        {selectedFrames.map((frameId) => {
          const frame = frames.find(f => f.frameId === frameId);
          if (!frame) return null;
          return <LabelComponent key={frameId} frame={frame} />;
        })}
      </div>
    </div>
  );
};

