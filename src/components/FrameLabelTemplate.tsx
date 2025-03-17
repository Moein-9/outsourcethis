
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
import { Printer, Tag, QrCode, Info } from "lucide-react";
import { toast } from "sonner";
import { MoenLogoBlack } from "@/assets/logo";
import QRCode from "qrcode.react";

// Dimensions: 100mm x 16mm (standard Zebra label size)
const LABEL_WIDTH = "100mm";
const LABEL_HEIGHT = "16mm";

interface FrameLabelProps {
  frame: FrameItem;
}

// Export the FrameLabel component so it can be used in other components
export const FrameLabel: React.FC<FrameLabelProps> = ({ frame }) => {
  // Generate QR data
  const qrData = JSON.stringify({
    id: frame.frameId,
    brand: frame.brand,
    model: frame.model,
    price: frame.price
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
      {/* Left side - Store logo, Frame ID, Model and QR Code */}
      <div className="w-3/5 p-1 flex flex-col items-start justify-center relative">
        <div className="absolute top-0 left-1 w-8 h-6">
          <MoenLogoBlack className="w-8 h-6" />
        </div>
        <div className="text-[8px] font-bold mb-0.5 text-black mt-1 ml-10">ID: {frame.frameId}</div>
        <div className="text-[8px] font-bold mb-0.5 text-black ml-10">Model: {frame.model}</div>
        <div className="text-[8px] mb-0.5 text-gray-700 ml-10">Size: {frame.size || "N/A"}</div>
        <div className="text-[8px] mb-0.5 text-gray-700 ml-10">Color: {frame.color}</div>
        <div className="absolute right-2 top-1 bottom-1 flex items-center">
          <QRCode 
            value={qrData} 
            size={40} 
            renderAs="svg"
            level="L"
            includeMargin={false}
            className="h-10 w-10"
          />
        </div>
      </div>
      
      {/* Right side - Brand and Price */}
      <div className="w-2/5 p-1 flex flex-col justify-center items-end pr-2">
        <div className="text-[10px] font-bold uppercase mb-1">{frame.brand}</div>
        <div className="text-[12px] font-bold">K.D. {frame.price.toFixed(3)}</div>
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
                font-family: Arial, sans-serif;
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
              .left-side {
                width: 60%;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                position: relative;
              }
              .right-side {
                width: 40%;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                padding-right: 4px;
              }
              .logo {
                position: absolute;
                top: 0;
                left: 1px;
                width: 32px;
                height: 24px;
              }
              .frame-id {
                font-size: 8px;
                font-weight: bold;
                margin-bottom: 0.5px;
                margin-left: 40px;
                margin-top: 1px;
              }
              .frame-model {
                font-size: 8px;
                font-weight: bold;
                margin-bottom: 0.5px;
                margin-left: 40px;
              }
              .frame-size, .frame-color {
                font-size: 8px;
                margin-bottom: 0.5px;
                color: #444;
                margin-left: 40px;
              }
              .qr-code {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
              }
              .brand {
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 1px;
              }
              .price {
                font-size: 12px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
      `);

      // Add the QR code library
      printWindow.document.write(`
        <script src="https://cdn.jsdelivr.net/npm/qrcode.react@3.1.0/lib/index.min.js"></script>
      `);

      selectedFrames.forEach(frameId => {
        const frame = frames.find(f => f.frameId === frameId);
        if (frame) {
          const qrData = JSON.stringify({
            id: frame.frameId,
            brand: frame.brand,
            model: frame.model,
            price: frame.price
          });
          
          printWindow.document.write(`
            <div class="label-container">
              <div class="left-side">
                <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" class="logo" alt="Moen Logo">
                <div class="frame-id">ID: ${frame.frameId}</div>
                <div class="frame-model">Model: ${frame.model}</div>
                <div class="frame-size">Size: ${frame.size || 'N/A'}</div>
                <div class="frame-color">Color: ${frame.color}</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${encodeURIComponent(qrData)}" class="qr-code" alt="QR Code">
              </div>
              <div class="right-side">
                <div class="brand">${frame.brand}</div>
                <div class="price">K.D. ${frame.price.toFixed(3)}</div>
              </div>
            </div>
          `);
        }
      });

      printWindow.document.write(`
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Print after a short delay to ensure content is loaded
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        
        try {
          printWindow.print();
          // Handle print dialog close or cancel
          setTimeout(() => {
            // Check if the print window is still open
            if (!printWindow.closed) {
              printWindow.close();
            }
            
            setIsDialogOpen(false);
            toast.success(`تم إرسال ${selectedFrames.length} بطاقة للطباعة`);
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
        id: frame.frameId,
        brand: frame.brand,
        model: frame.model,
        price: frame.price
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
                font-family: Arial, sans-serif;
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
              .left-side {
                width: 60%;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                position: relative;
              }
              .right-side {
                width: 40%;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                padding-right: 4px;
              }
              .logo {
                position: absolute;
                top: 0;
                left: 1px;
                width: 32px;
                height: 24px;
              }
              .frame-id {
                font-size: 8px;
                font-weight: bold;
                margin-bottom: 0.5px;
                margin-left: 40px;
                margin-top: 1px;
              }
              .frame-model {
                font-size: 8px;
                font-weight: bold;
                margin-bottom: 0.5px;
                margin-left: 40px;
              }
              .frame-size, .frame-color {
                font-size: 8px;
                margin-bottom: 0.5px;
                color: #444;
                margin-left: 40px;
              }
              .qr-code {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
              }
              .brand {
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 1px;
              }
              .price {
                font-size: 12px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              <div class="left-side">
                <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" class="logo" alt="Moen Logo">
                <div class="frame-id">ID: ${frame.frameId}</div>
                <div class="frame-model">Model: ${frame.model}</div>
                <div class="frame-size">Size: ${frame.size || 'N/A'}</div>
                <div class="frame-color">Color: ${frame.color}</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${encodeURIComponent(qrData)}" class="qr-code" alt="QR Code">
              </div>
              <div class="right-side">
                <div class="brand">${frame.brand}</div>
                <div class="price">K.D. ${frame.price.toFixed(3)}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Print after a short delay to ensure content is loaded
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        
        try {
          printWindow.print();
          // Handle print dialog close or cancel
          setTimeout(() => {
            // Check if the print window is still open
            if (!printWindow.closed) {
              printWindow.close();
            }
            toast.success("تم إرسال البطاقة للطباعة");
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

// Export the singleFramePrint function to be used by FrameInventory
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
        id: frame.frameId,
        brand: frame.brand,
        model: frame.model,
        price: frame.price
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
                font-family: Arial, sans-serif;
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
              .left-side {
                width: 60%;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                position: relative;
              }
              .right-side {
                width: 40%;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                padding-right: 4px;
              }
              .logo {
                position: absolute;
                top: 0;
                left: 1px;
                width: 32px;
                height: 24px;
              }
              .frame-id {
                font-size: 8px;
                font-weight: bold;
                margin-bottom: 0.5px;
                margin-left: 40px;
                margin-top: 1px;
              }
              .frame-model {
                font-size: 8px;
                font-weight: bold;
                margin-bottom: 0.5px;
                margin-left: 40px;
              }
              .frame-size, .frame-color {
                font-size: 8px;
                margin-bottom: 0.5px;
                color: #444;
                margin-left: 40px;
              }
              .qr-code {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 40px;
                height: 40px;
              }
              .brand {
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 1px;
              }
              .price {
                font-size: 12px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              <div class="left-side">
                <img src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" class="logo" alt="Moen Logo">
                <div class="frame-id">ID: ${frame.frameId}</div>
                <div class="frame-model">Model: ${frame.model}</div>
                <div class="frame-size">Size: ${frame.size || 'N/A'}</div>
                <div class="frame-color">Color: ${frame.color}</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=${encodeURIComponent(qrData)}" class="qr-code" alt="QR Code">
              </div>
              <div class="right-side">
                <div class="brand">${frame.brand}</div>
                <div class="price">K.D. ${frame.price.toFixed(3)}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Print after a short delay to ensure content is loaded
      printWindow.addEventListener('load', () => {
        printWindow.focus();
        
        try {
          printWindow.print();
          // Handle print dialog close or cancel
          setTimeout(() => {
            // Check if the print window is still open
            if (!printWindow.closed) {
              printWindow.close();
            }
            toast.success("تم إرسال البطاقة للطباعة");
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
