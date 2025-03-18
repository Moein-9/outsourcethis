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
      marginBottom: "5mm",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        width: "50mm",
        height: "100%",
        padding: "2mm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <div style={{
          fontWeight: "bold",
          fontSize: "11pt",
          marginBottom: "1mm"
        }}>{frame.brand}</div>
        <div style={{
          fontSize: "9pt",
          marginBottom: "1mm"
        }}>
          Model: {frame.model || "-"} Color: {frame.color || "-"} Size: {frame.size || "-"}
        </div>
        <div style={{
          fontWeight: "bold",
          fontSize: "11pt"
        }}>K.D. {frame.price.toFixed(3)}</div>
      </div>

      <div style={{
        width: "50mm",
        height: "100%",
        padding: "2mm",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div className="store-logo" style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginBottom: "1mm"
        }}>
          <MoenLogo className="w-auto" style={{ maxHeight: "5mm", height: "auto" }} />
        </div>
        
        <div className="qr-code" style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1mm"
        }}>
          <QRCodeSVG 
            value={frame.frameId} 
            size={30}
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
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    
    document.body.appendChild(iframe);
    
    const logoUrl = "/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png";
    
    let printContent = `
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
            border: 1px solid #000;
            display: flex;
            font-family: Arial, sans-serif;
            page-break-inside: avoid;
            margin-bottom: 0;
            position: relative;
            overflow: hidden;
          }
          .left-section {
            width: 50mm;
            height: 100%;
            padding: 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .right-section {
            width: 50mm;
            height: 100%;
            padding: 2mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .brand-name {
            font-weight: bold;
            font-size: 11pt;
            margin-bottom: 1mm;
          }
          .detail-info {
            font-size: 9pt;
            margin-bottom: 1mm;
          }
          .price {
            font-weight: bold;
            font-size: 11pt;
          }
          .store-logo {
            display: flex;
            justify-content: center;
            width: 100%;
            margin-bottom: 1mm;
          }
          .store-logo img {
            max-height: 5mm;
            width: auto;
          }
          .qr-code {
            display: flex;
            justify-content: center;
            margin-top: 1mm;
          }
          .qr-code img {
            height: 30px;
            width: 30px;
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
              page-break-after: always;
              border: none;
            }
          }
        </style>
      </head>
      <body>
    `;
    
    selectedFrames.forEach(frame => {
      printContent += `
        <div class="label-container">
          <div class="left-section">
            <div class="brand-name">${frame.brand}</div>
            <div class="detail-info">
              Model: ${frame.model || "-"} 
              Color: ${frame.color || "-"} 
              Size: ${frame.size || "-"}
            </div>
            <div class="price">K.D. ${frame.price.toFixed(3)}</div>
          </div>
          <div class="right-section">
            <div class="store-logo">
              <img src="${logoUrl}" alt="Store Logo">
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(frame.frameId)}" alt="QR Code">
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
            }, 1000);
          });
        </script>
      </body>
      </html>
    `;
    
    window.addEventListener('message', function handler(e) {
      if (e.data === 'print-complete') {
        window.removeEventListener('message', handler);
        document.body.removeChild(iframe);
      }
    }, { once: true });
    
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
