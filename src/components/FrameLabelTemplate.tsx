
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

const LabelComponent = ({ frame }: { frame: FrameItem }) => {
  return (
    <div className="label-container" style={{
      width: "100mm",
      height: "16mm",
      border: "1px solid #000",
      display: "flex",
      fontFamily: "Arial, sans-serif",
      pageBreakInside: "avoid",
      marginBottom: "5mm" // Space between labels when printing multiple
    }}>
      {/* Left section (Brand, Model, Color, Size, Price) */}
      <div style={{
        width: "60mm",
        height: "100%",
        borderRight: "1px solid #000",
        padding: "2mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <div style={{
          fontWeight: "bold",
          fontSize: "9pt",
          marginBottom: "1mm"
        }}>{frame.brand}</div>
        <div style={{
          fontSize: "7pt",
          marginBottom: "1mm"
        }}>
          <span style={{ fontWeight: "bold" }}>Model:</span> {frame.model || "-"} <span style={{ fontWeight: "bold" }}>Color:</span> {frame.color || "-"} <span style={{ fontWeight: "bold" }}>Size:</span> {frame.size || "-"}
        </div>
        <div style={{
          fontWeight: "bold",
          fontSize: "9pt"
        }}>K.D. {frame.price.toFixed(3)}</div>
      </div>

      {/* Right section (Logo top, QR bottom right) */}
      <div style={{
        width: "40mm",
        height: "100%",
        padding: "2mm",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}>
        {/* Store Logo */}
        <div className="store-logo" style={{
          display: "flex",
          justifyContent: "center",
          width: "100%"
        }}>
          <MoenLogo className="w-auto" style={{ maxHeight: "5mm", height: "auto" }} />
        </div>

        {/* QR Code - positioned at bottom right */}
        <div className="qr-code" style={{
          position: "absolute",
          bottom: "2mm",
          right: "2mm"
        }}>
          <QRCodeSVG 
            value={frame.frameId} 
            size={20} // Smaller QR code to fit in the layout
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
    
    // Instead of using window.open, create an iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);
    
    // Base64 encode the logo URL for embedding directly in the HTML
    const logoUrl = "/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png";
    
    // Change from const to let for printContent
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Frame Labels</title>
        <style>
          /* Reset default margins/padding */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            padding: 2mm;
          }
          /* Main container for the label */
          .label-container {
            width: 100mm;
            height: 16mm;
            border: 1px solid #000;
            display: flex;
            font-family: Arial, sans-serif;
            page-break-inside: avoid;
            margin-bottom: 5mm;
          }
          /* Left section (Brand, Model, Color, Size, Price) */
          .left-section {
            width: 60mm;
            height: 100%;
            border-right: 1px solid #000;
            padding: 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          /* Text styling */
          .brand-name {
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 1mm;
          }
          .detail-info {
            font-size: 7pt;
            margin-bottom: 1mm;
          }
          .detail-label {
            font-weight: bold;
          }
          .price {
            font-weight: bold;
            font-size: 9pt;
          }
          /* Right section (Logo top, QR bottom) */
          .right-section {
            width: 40mm;
            height: 100%;
            padding: 2mm;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          /* Logo container (top) */
          .store-logo {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-bottom: 2mm;
          }
          .store-logo img {
            max-height: 5mm;
            width: auto;
          }
          /* QR code container (bottom right) */
          .qr-code {
            position: absolute;
            bottom: 2mm;
            right: 2mm;
          }
          .qr-code img {
            height: 5mm;
            width: 5mm;
          }
          @media print {
            body {
              padding: 0;
            }
            @page {
              size: 100mm 16mm;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
    `;
    
    // Generate HTML for each selected frame
    selectedFrames.forEach(frame => {
      printContent += `
        <div class="label-container">
          <div class="left-section">
            <div class="brand-name">${frame.brand}</div>
            <div class="detail-info">
              <span class="detail-label">Model:</span> ${frame.model || "-"} 
              <span class="detail-label">Color:</span> ${frame.color || "-"} 
              <span class="detail-label">Size:</span> ${frame.size || "-"}
            </div>
            <div class="price">K.D. ${frame.price.toFixed(3)}</div>
          </div>
          <div class="right-section">
            <div class="store-logo">
              <img src="${logoUrl}" alt="Store Logo">
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(frame.frameId)}" alt="QR Code">
            </div>
          </div>
        </div>
      `;
    });
    
    printContent += `
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.parent.postMessage('print-complete', '*');
              }, 500);
            }, 2000); // Increased timeout to ensure images load
          });
        </script>
      </body>
      </html>
    `;
    
    // Listen for completion message
    window.addEventListener('message', function handler(e) {
      if (e.data === 'print-complete') {
        window.removeEventListener('message', handler);
        document.body.removeChild(iframe);
      }
    }, { once: true });
    
    // Write the HTML to the iframe and trigger printing
    if (iframe.contentWindow) {
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(printContent);
      iframe.contentWindow.document.close();
    } else {
      toast.error("Failed to create print frame");
      document.body.removeChild(iframe);
    }
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
  
  // Handle frame selection
  const toggleFrameSelection = (frameId: string) => {
    if (selectedFrames.includes(frameId)) {
      setSelectedFrames(selectedFrames.filter(id => id !== frameId));
    } else {
      setSelectedFrames([...selectedFrames, frameId]);
    }
  };
  
  // Select/deselect all frames
  const toggleSelectAll = () => {
    if (selectedFrames.length === filteredFrames.length) {
      setSelectedFrames([]);
    } else {
      setSelectedFrames(filteredFrames.map(frame => frame.frameId));
    }
  };
  
  // Filter frames based on search text
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
  
  // Handle print button click
  const handlePrint = () => {
    if (selectedFrames.length === 0) {
      toast.warning(t("selectFramesForPrinting"));
      return;
    }
    
    printSelectedFrames(selectedFrames);
  };
  
  // Reset search and selection
  const handleReset = () => {
    setSearchText("");
    setSelectedFrames([]);
    setFilteredFrames(frames);
  };
  
  // Filter frames when search text changes
  React.useEffect(() => {
    handleSearch();
  }, [searchText]);
  
  // Update filtered frames when frames change
  React.useEffect(() => {
    setFilteredFrames(frames);
  }, [frames]);
  
  return (
    <div className="space-y-4">
      {/* Controls */}
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
      
      {/* Preview */}
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
      
      {/* Print preview (hidden) */}
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
