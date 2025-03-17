import React, { useRef, useEffect } from "react";
import { useInventoryStore, FrameItem } from "@/store/inventoryStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, Tag, Info, Glasses, Banknote, Hash, Ruler } from "lucide-react";
import { toast } from "sonner";
import { MoenLogoBlack } from "@/assets/logo";
import QRCode from "qrcode.react";
import { Separator } from "@/components/ui/separator";

// Dimensions: 100mm x 16mm (standard Zebra label size)
const LABEL_WIDTH = "100mm";
const LABEL_HEIGHT = "16mm";

interface FrameLabelProps {
  frame: FrameItem;
}

// Export the FrameLabel component so it can be used in other components
export const FrameLabel: React.FC<FrameLabelProps> = ({ frame }) => {
  // Generate QR data - keep it minimal for better scanning
  const qrData = JSON.stringify({
    brand: frame.brand,
    model: frame.model
  });
  
  return (
    <div 
      className="flex border border-gray-300 bg-white relative print:border-0 frame-label"
      style={{ 
        width: LABEL_WIDTH, 
        height: LABEL_HEIGHT,
        pageBreakInside: "avoid",
      }}
    >
      {/* Left side - QR Code */}
      <div className="w-1/4 flex items-center justify-center p-1">
        <QRCode 
          value={qrData} 
          size={48} 
          level="M"
          renderAs="svg"
          includeMargin={false}
          className="h-14 w-14"
        />
      </div>
      
      {/* Right side - All information */}
      <div className="w-3/4 p-1 flex flex-col justify-between">
        {/* Top row - Logo and ID */}
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center">
            <MoenLogoBlack className="w-auto h-3.5" />
            <div className="text-[9px] font-bold text-primary ml-2">نظارات الفتتين</div>
          </div>
          <div className="flex items-center text-[7px] font-bold text-black">
            <Hash className="h-2.5 w-2.5 mr-0.5 text-primary" />
            {frame.frameId}
          </div>
        </div>
        
        {/* Middle row - Brand and Model */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Glasses className="h-3 w-3 mr-0.5 text-primary" />
            <span className="text-[10px] font-bold uppercase text-primary mr-1">{frame.brand}</span>
          </div>
          <div className="text-[8px] font-medium">{frame.model}</div>
        </div>
        
        {/* Size and Color row */}
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center">
            <Ruler className="h-2.5 w-2.5 mr-0.5 text-primary" />
            <span className="text-[7px]">{frame.size || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Info className="h-2.5 w-2.5 mr-0.5 text-primary" />
            <span className="text-[7px]">{frame.color}</span>
          </div>
        </div>
        
        {/* Bottom row - Price */}
        <div className="flex justify-end items-center mt-1">
          <div className="flex items-center">
            <Banknote className="h-3.5 w-3.5 mr-1 text-primary" />
            <span className="text-[12px] font-bold">K.D. {frame.price.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FrameLabelTemplate: React.FC = () => {
  const { frames } = useInventoryStore();
  const [selectedFrames, setSelectedFrames] = React.useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const printWindowRef = useRef<Window | null>(null);
  
  // Clean up print window when component unmounts
  useEffect(() => {
    return () => {
      if (printWindowRef.current) {
        printWindowRef.current.close();
      }
    };
  }, []);
  
  const toggleFrameSelection = (frameId: string) => {
    setSelectedFrames(prev => 
      prev.includes(frameId) 
        ? prev.filter(id => id !== frameId) 
        : [...prev, frameId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedFrames.length === frames.length) {
      setSelectedFrames([]);
    } else {
      setSelectedFrames(frames.map(frame => frame.frameId));
    }
  };
  
  const handlePrint = () => {
    if (selectedFrames.length === 0) {
      toast.error("يرجى تحديد إطار واحد على الأقل للطباعة");
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  const printLabels = () => {
    // Close any previously opened print windows
    if (printWindowRef.current) {
      printWindowRef.current.close();
    }
    
    // Create a new window for printing to avoid printing the entire page
    const printWindow = window.open('', '_blank');
    printWindowRef.current = printWindow;
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Frame Labels</title>
            <style>
              @page {
                size: ${LABEL_WIDTH} ${LABEL_HEIGHT};
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Cairo', Arial, sans-serif;
                background: white;
              }
              .label-container {
                width: ${LABEL_WIDTH};
                height: ${LABEL_HEIGHT};
                display: flex;
                page-break-after: always;
                border: none;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
              }
              .qr-side {
                width: 25%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1px;
              }
              .separator {
                width: 1px;
                height: 100%;
                background-color: #e0e0e0;
              }
              .info-side {
                width: 75%;
                padding: 1px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5px;
              }
              .middle-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 1px;
              }
              .bottom-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1px;
              }
              .logo {
                height: 14px;
                width: auto;
                object-fit: contain;
              }
              .frame-id {
                display: flex;
                align-items: center;
                font-size: 7px;
                font-weight: bold;
                color: black;
              }
              .id-icon {
                height: 10px;
                width: 10px;
                margin-right: 2px;
                color: #f0b429;
              }
              .model-container {
                display: flex;
                align-items: center;
                font-size: 7px;
                font-weight: 500;
              }
              .model-icon {
                height: 10px;
                width: 10px;
                margin-right: 2px;
                color: #f0b429;
              }
              .size-color {
                display: flex;
                align-items: center;
                font-size: 6px;
                color: #444;
              }
              .info-icon {
                height: 8px;
                width: 8px;
                margin-right: 2px;
                color: #666;
              }
              .brand {
                font-size: 9px;
                font-weight: bold;
                text-transform: uppercase;
                color: #f0b429;
              }
              .price {
                display: flex;
                align-items: center;
                font-size: 10px;
                font-weight: bold;
              }
              .price-icon {
                height: 12px;
                width: 12px;
                margin-right: 2px;
                color: #f0b429;
              }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
          </head>
          <body>
      `);

      selectedFrames.forEach(frameId => {
        const frame = frames.find(f => f.frameId === frameId);
        if (frame) {
          const qrData = JSON.stringify({
            brand: frame.brand,
            model: frame.model
          });
          
          printWindow.document.write(`
            <div class="label-container">
              <div class="qr-side">
                <div id="qr-${frameId}"></div>
              </div>
              <div class="separator"></div>
              <div class="info-side">
                <div class="top-row">
                  <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" class="logo" alt="Moen Logo">
                  <div class="frame-id">
                    <svg xmlns="http://www.w3.org/2000/svg" class="id-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/><path d="M16 6l-4 12-4-12"/></svg>
                    ${frame.frameId}
                  </div>
                </div>
                <div class="middle-row">
                  <div class="model-container">
                    <svg xmlns="http://www.w3.org/2000/svg" class="model-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 7-8 10a1 1 0 0 1-1.6 0L4 10l2-7Z"/><path d="M21 10H3"/></svg>
                    ${frame.model}
                  </div>
                  <div class="size-color">
                    <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    ${frame.size || 'N/A'} | ${frame.color}
                  </div>
                </div>
                <div class="bottom-row">
                  <div class="brand">${frame.brand}</div>
                  <div class="price">
                    <svg xmlns="http://www.w3.org/2000/svg" class="price-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    K.D. ${frame.price.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
            <script>
              (function() {
                const qr = qrcode(0, 'M');
                qr.addData(${JSON.stringify(qrData)});
                qr.make();
                document.getElementById('qr-${frameId}').innerHTML = qr.createImgTag(2, 0);
              })();
            </script>
          `);
        }
      });

      printWindow.document.write(`
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        
        try {
          // Create a MediaQueryList object
          const mediaQueryList = printWindow.matchMedia('print');
          
          // Add event listener for print dialog close
          const handlePrintChange = (mql) => {
            if (!mql.matches && !printWindow.closed) {
              // Print dialog was closed/canceled
              setTimeout(() => {
                printWindow.close();
                setIsDialogOpen(false);
              }, 100);
            }
          };
          
          mediaQueryList.addEventListener('change', handlePrintChange);
          
          printWindow.print();
          
          // Successful print (user clicked Print)
          setTimeout(() => {
            // Only handle if window hasn't been closed yet by the mediaQueryList listener
            if (!printWindow.closed) {
              setIsDialogOpen(false);
              toast.success(`تم إرسال ${selectedFrames.length} بطاقة للطباعة`);
            }
          }, 1000);
        } catch (error) {
          console.error("Print error:", error);
          toast.error("حدث خطأ أثناء محاولة الطباعة");
          printWindow.close();
        }
      });
    } else {
      toast.error("فشل في فتح نافذة الطباعة");
    }
  };
  
  // Function to handle quick print from frame inventory
  const singleFramePrint = (frameId: string) => {
    // Close any previously opened print windows
    if (printWindowRef.current) {
      printWindowRef.current.close();
    }
    
    const frame = frames.find(f => f.frameId === frameId);
    if (!frame) {
      toast.error("لم يتم العثور على الإطار");
      return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindowRef.current = printWindow;
    
    if (printWindow) {
      const qrData = JSON.stringify({
        brand: frame.brand,
        model: frame.model
      });
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Frame Label</title>
            <style>
              @page {
                size: ${LABEL_WIDTH} ${LABEL_HEIGHT};
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Cairo', Arial, sans-serif;
                background: white;
              }
              .label-container {
                width: ${LABEL_WIDTH};
                height: ${LABEL_HEIGHT};
                display: flex;
                border: none;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
              }
              .qr-side {
                width: 25%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1px;
              }
              .separator {
                width: 1px;
                height: 100%;
                background-color: #e0e0e0;
              }
              .info-side {
                width: 75%;
                padding: 1px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5px;
              }
              .middle-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 1px;
              }
              .bottom-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1px;
              }
              .logo {
                height: 14px;
                width: auto;
                object-fit: contain;
              }
              .frame-id {
                display: flex;
                align-items: center;
                font-size: 7px;
                font-weight: bold;
                color: black;
              }
              .id-icon {
                height: 10px;
                width: 10px;
                margin-right: 2px;
                color: #f0b429;
              }
              .model-container {
                display: flex;
                align-items: center;
                font-size: 7px;
                font-weight: 500;
              }
              .model-icon {
                height: 10px;
                width: 10px;
                margin-right: 2px;
                color: #f0b429;
              }
              .size-color {
                display: flex;
                align-items: center;
                font-size: 6px;
                color: #444;
              }
              .info-icon {
                height: 8px;
                width: 8px;
                margin-right: 2px;
                color: #666;
              }
              .brand {
                font-size: 9px;
                font-weight: bold;
                text-transform: uppercase;
                color: #f0b429;
              }
              .price {
                display: flex;
                align-items: center;
                font-size: 10px;
                font-weight: bold;
              }
              .price-icon {
                height: 12px;
                width: 12px;
                margin-right: 2px;
                color: #f0b429;
              }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
          </head>
          <body>
            <div class="label-container">
              <div class="qr-side">
                <div id="qr-single"></div>
              </div>
              <div class="separator"></div>
              <div class="info-side">
                <div class="top-row">
                  <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" class="logo" alt="Moen Logo">
                  <div class="frame-id">
                    <svg xmlns="http://www.w3.org/2000/svg" class="id-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/><path d="M16 6l-4 12-4-12"/></svg>
                    ${frame.frameId}
                  </div>
                </div>
                <div class="middle-row">
                  <div class="model-container">
                    <svg xmlns="http://www.w3.org/2000/svg" class="model-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 7-8 10a1 1 0 0 1-1.6 0L4 10l2-7Z"/><path d="M21 10H3"/></svg>
                    ${frame.model}
                  </div>
                  <div class="size-color">
                    <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    ${frame.size || 'N/A'} | ${frame.color}
                  </div>
                </div>
                <div class="bottom-row">
                  <div class="brand">${frame.brand}</div>
                  <div class="price">
                    <svg xmlns="http://www.w3.org/2000/svg" class="price-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    K.D. ${frame.price.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
            <script>
              (function() {
                const qr = qrcode(0, 'M');
                qr.addData(${JSON.stringify(qrData)});
                qr.make();
                document.getElementById('qr-single').innerHTML = qr.createImgTag(2, 0);
              })();
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        
        try {
          // Create a MediaQueryList object
          const mediaQueryList = printWindow.matchMedia('print');
          
          // Add event listener for print dialog close
          const handlePrintChange = (mql) => {
            if (!mql.matches && !printWindow.closed) {
              // Print dialog was closed/canceled
              setTimeout(() => {
                printWindow.close();
              }, 100);
            }
          };
          
          mediaQueryList.addEventListener('change', handlePrintChange);
          
          printWindow.print();
          
          // Successful print (user clicked Print)
          setTimeout(() => {
            // Only handle if window hasn't been closed yet by the mediaQueryList listener
            if (!printWindow.closed) {
              toast.success("تم إرسال البطاقة للطباعة");
            }
          }, 1000);
        } catch (error) {
          console.error("Print error:", error);
          toast.error("حدث خطأ أثناء محاولة الطباعة");
          printWindow.close();
        }
      });
    } else {
      toast.error("فشل في فتح نافذة الطباعة");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">طباعة بطاقات الإطارات</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
          >
            {selectedFrames.length === frames.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
          </Button>
          <Button 
            size="sm" 
            onClick={handlePrint}
            disabled={selectedFrames.length === 0}
          >
            <Printer className="h-4 w-4 mr-1" /> طباعة البطاقات ({selectedFrames.length})
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {frames.map(frame => (
          <div 
            key={frame.frameId}
            className={`border rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedFrames.includes(frame.frameId) ? "border-primary bg-primary/5" : "border-gray-200"
            }`}
            onClick={() => toggleFrameSelection(frame.frameId)}
          >
            <div className="flex items-start gap-2">
              <Tag className={`h-4 w-4 ${selectedFrames.includes(frame.frameId) ? "text-primary" : "text-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{frame.brand} - {frame.model}</p>
                <p className="text-xs text-muted-foreground truncate">{frame.color}, {frame.size || "No size"}</p>
                <p className="text-sm font-bold mt-1">{frame.price.toFixed(3)} KWD</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {frames.length === 0 && (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">لا توجد إطارات</h3>
          <p className="text-muted-foreground mb-4">
            لا توجد إطارات في المخزون حاليًا.
          </p>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>معاينة بطاقات الإطارات</DialogTitle>
            <DialogDescription>
              ستتم طباعة البطاقات التالية. تأكد من إعداد طابعة Zebra وتحديد الحجم الصحيح (100مم × 16مم).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-60 overflow-y-auto p-2">
            {selectedFrames.slice(0, 3).map(frameId => {
              const frame = frames.find(f => f.frameId === frameId);
              return frame ? <FrameLabel key={frameId} frame={frame} /> : null;
            })}
            {selectedFrames.length > 3 && (
              <p className="text-center text-sm text-muted-foreground pt-2">
                و {selectedFrames.length - 3} بطاقات أخرى...
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={printLabels}>
              <Printer className="h-4 w-4 mr-1" /> طباعة البطاقات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const usePrintLabel = () => {
  const { frames } = useInventoryStore();
  const printWindowRef = useRef<Window | null>(null);
  
  // Clean up print window when component unmounts
  useEffect(() => {
    return () => {
      if (printWindowRef.current) {
        printWindowRef.current.close();
      }
    };
  }, []);
  
  const printSingleLabel = (frameId: string) => {
    // Close any previously opened print windows
    if (printWindowRef.current) {
      printWindowRef.current.close();
    }
    
    const frame = frames.find(f => f.frameId === frameId);
    if (!frame) {
      toast.error("لم يتم العثور على الإطار");
      return;
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindowRef.current = printWindow;
    
    if (printWindow) {
      const qrData = JSON.stringify({
        brand: frame.brand,
        model: frame.model
      });
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Frame Label</title>
            <style>
              @page {
                size: ${LABEL_WIDTH} ${LABEL_HEIGHT};
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: 'Cairo', Arial, sans-serif;
                background: white;
              }
              .label-container {
                width: ${LABEL_WIDTH};
                height: ${LABEL_HEIGHT};
                display: flex;
                border: none;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
              }
              .qr-side {
                width: 25%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 1px;
              }
              .separator {
                width: 1px;
                height: 100%;
                background-color: #e0e0e0;
              }
              .info-side {
                width: 75%;
                padding: 1px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .top-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5px;
              }
              .middle-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 1px;
              }
              .bottom-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1px;
              }
              .logo {
                height: 14px;
                width: auto;
                object-fit: contain;
              }
              .frame-id {
                display: flex;
                align-items: center;
                font-size: 7px;
                font-weight: bold;
                color: black;
              }
              .id-icon {
                height: 10px;
                width: 10px;
                margin-right: 2px;
                color: #f0b429;
              }
              .model-container {
                display: flex;
                align-items: center;
                font-size: 7px;
                font-weight: 500;
              }
              .model-icon {
                height: 10px;
                width: 10px;
                margin-right: 2px;
                color: #f0b429;
              }
              .size-color {
                display: flex;
                align-items: center;
                font-size: 6px;
                color: #444;
              }
              .info-icon {
                height: 8px;
                width: 8px;
                margin-right: 2px;
                color: #666;
              }
              .brand {
                font-size: 9px;
                font-weight: bold;
                text-transform: uppercase;
                color: #f0b429;
              }
              .price {
                display: flex;
                align-items: center;
                font-size: 10px;
                font-weight: bold;
              }
              .price-icon {
                height: 12px;
                width: 12px;
                margin-right: 2px;
                color: #f0b429;
              }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
          </head>
          <body>
            <div class="label-container">
              <div class="qr-side">
                <div id="qr-single"></div>
              </div>
              <div class="separator"></div>
              <div class="info-side">
                <div class="top-row">
                  <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" class="logo" alt="Moen Logo">
                  <div class="frame-id">
                    <svg xmlns="http://www.w3.org/2000/svg" class="id-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/><path d="M16 6l-4 12-4-12"/></svg>
                    ${frame.frameId}
                  </div>
                </div>
                <div class="middle-row">
                  <div class="model-container">
                    <svg xmlns="http://www.w3.org/2000/svg" class="model-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 7-8 10a1 1 0 0 1-1.6 0L4 10l2-7Z"/><path d="M21 10H3"/></svg>
                    ${frame.model}
                  </div>
                  <div class="size-color">
                    <svg xmlns="http://www.w3.org/2000/svg" class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    ${frame.size || 'N/A'} | ${frame.color}
                  </div>
                </div>
                <div class="bottom-row">
                  <div class="brand">${frame.brand}</div>
                  <div class="price">
                    <svg xmlns="http://www.w3.org/2000/svg" class="price-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                    K.D. ${frame.price.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
            <script>
              (function() {
                const qr = qrcode(0, 'M');
                qr.addData(${JSON.stringify(qrData)});
                qr.make();
                document.getElementById('qr-single').innerHTML = qr.createImgTag(2, 0);
              })();
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        
        try {
          // Create a MediaQueryList object
          const mediaQueryList = printWindow.matchMedia('print');
          
          // Add event listener for print dialog close
          const handlePrintChange = (mql) => {
            if (!mql.matches && !printWindow.closed) {
              // Print dialog was closed/canceled
              setTimeout(() => {
                printWindow.close();
              }, 100);
            }
          };
          
          mediaQueryList.addEventListener('change', handlePrintChange);
          
          printWindow.print();
          
          // Successful print (user clicked Print)
          setTimeout(() => {
            // Only handle if window hasn't been closed yet by the mediaQueryList listener
            if (!printWindow.closed) {
              toast.success("تم إرسال البطاقة للطباعة");
            }
          }, 1000);
        } catch (error) {
          console.error("Print error:", error);
          toast.error("حدث خطأ أثناء محاولة الطباعة");
          printWindow.close();
        }
      });
    } else {
      toast.error("فشل في فتح نافذة الطباعة");
    }
  };
  
  return { printSingleLabel };
};
