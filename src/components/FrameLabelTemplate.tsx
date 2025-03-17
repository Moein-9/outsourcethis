
import React from "react";
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
import { Printer, Tag } from "lucide-react";
import { toast } from "sonner";

// Dimensions: 100mm x 16mm (standard Zebra label size)
const LABEL_WIDTH = "100mm";
const LABEL_HEIGHT = "16mm";

interface FrameLabelProps {
  frame: FrameItem;
}

// Export the FrameLabel component so it can be used in other components
export const FrameLabel: React.FC<FrameLabelProps> = ({ frame }) => {
  return (
    <div 
      className="flex border border-gray-300 bg-white relative print:border-0"
      style={{ 
        width: LABEL_WIDTH, 
        height: LABEL_HEIGHT,
        pageBreakInside: "avoid",
      }}
    >
      {/* Left side - Frame ID and Barcode */}
      <div className="w-1/2 p-1 flex flex-col items-start justify-center">
        <div className="text-[10px] font-bold mb-0.5 text-black">{frame.frameId}</div>
        <div className="w-full h-8 bg-[url('/public/lovable-uploads/733e0754-fe7b-478e-a0f0-9ff7e5c7867c.png')] bg-no-repeat bg-contain bg-left"></div>
      </div>
      
      {/* Right side - Brand and Price */}
      <div className="w-1/2 p-1 flex flex-col justify-center items-end pr-3">
        <div className="text-[12px] font-bold uppercase mb-1">{frame.brand}</div>
        <div className="text-[14px] font-bold">K.D. {frame.price.toFixed(3)}</div>
      </div>
    </div>
  );
};

export const FrameLabelTemplate: React.FC = () => {
  const { frames } = useInventoryStore();
  const [selectedFrames, setSelectedFrames] = React.useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
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
    // Create a new window for printing to avoid printing the entire page
    const printWindow = window.open('', '_blank');
    
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
              }
              .label-container {
                width: ${LABEL_WIDTH};
                height: ${LABEL_HEIGHT};
                display: flex;
                page-break-after: always;
                border: none;
                overflow: hidden;
              }
              .left-side {
                width: 50%;
                padding: 4px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
              }
              .right-side {
                width: 50%;
                padding: 4px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                padding-right: 12px;
              }
              .frame-id {
                font-size: 10px;
                font-weight: bold;
                margin-bottom: 2px;
              }
              .barcode {
                width: 100%;
                height: 32px;
              }
              .brand {
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
                margin-bottom: 4px;
              }
              .price {
                font-size: 14px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
      `);

      selectedFrames.forEach(frameId => {
        const frame = frames.find(f => f.frameId === frameId);
        if (frame) {
          printWindow.document.write(`
            <div class="label-container">
              <div class="left-side">
                <div class="frame-id">${frame.frameId}</div>
                <div class="barcode"></div>
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
      printWindow.focus();
      
      // Print after a short delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        
        setIsDialogOpen(false);
        toast.success(`تم إرسال ${selectedFrames.length} بطاقة للطباعة`);
      }, 500);
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
