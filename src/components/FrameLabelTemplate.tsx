
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, Printer, Tag } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// Dimensions: 100mm x 16mm
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
      {/* Left side - Frame ID and QR Code */}
      <div className="w-1/4 p-1 flex flex-col items-start justify-center">
        <div className="text-[8px] font-bold mb-0.5 text-gray-800">{frame.frameId}</div>
        <div className="flex justify-center items-center">
          <QrCode className="h-8 w-8" />
        </div>
      </div>
      
      {/* Middle - Brand and Price */}
      <div className="w-2/4 p-1 flex flex-col justify-center items-center">
        <div className="text-[10px] font-bold leading-tight text-center uppercase">{frame.brand}</div>
        <div className="text-[8px] leading-tight text-center">{frame.model}</div>
        <div className="text-[8px] text-gray-600 leading-tight">{frame.color}</div>
        <div className="text-[11px] font-bold mt-0.5">K.D. {frame.price.toFixed(3)}</div>
      </div>
      
      {/* Right side - Tag section (as seen in example) */}
      <div className="w-1/4 flex items-center justify-center relative">
        <div className="absolute right-0 top-0 bottom-0 w-4 border-l border-dashed border-gray-300" 
          style={{ borderTopRightRadius: "0.5rem", borderBottomRightRadius: "0.5rem" }}>
        </div>
      </div>
    </div>
  );
};

export const FrameLabelTemplate: React.FC = () => {
  const { frames } = useInventoryStore();
  const [selectedFrames, setSelectedFrames] = React.useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { t, language } = useLanguage();
  
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
      toast.error(t("please_select"));
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  const printLabels = () => {
    setTimeout(() => {
      window.print();
      setIsDialogOpen(false);
      
      toast.success(`${t("labels_sent")} (${selectedFrames.length})`);
    }, 300);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t("frame_labels")}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
          >
            {selectedFrames.length === frames.length ? t("deselect_all") : t("select_all")}
          </Button>
          <Button 
            size="sm" 
            onClick={handlePrint}
            disabled={selectedFrames.length === 0}
          >
            <Printer className="h-4 w-4 mr-1" /> {t("print_labels")} ({selectedFrames.length})
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
                <p className="text-sm font-bold mt-1">{frame.price.toFixed(2)} KWD</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {frames.length === 0 && (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">{t("no_frames")}</h3>
          <p className="text-muted-foreground mb-4">
            {t("no_frames_inventory")}
          </p>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t("preview_labels")}</DialogTitle>
            <DialogDescription>
              {t("zebra_printer_setup")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 max-h-96 overflow-y-auto p-2">
            {selectedFrames.map(frameId => {
              const frame = frames.find(f => f.frameId === frameId);
              return frame ? <FrameLabel key={frameId} frame={frame} /> : null;
            })}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={printLabels}>
              <Printer className="h-4 w-4 mr-1" /> {t("print_labels")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Print-only section that will be hidden on screen but visible when printing */}
      <div className="hidden print:block">
        <div className="flex flex-col gap-0">
          {selectedFrames.map(frameId => {
            const frame = frames.find(f => f.frameId === frameId);
            return frame ? <FrameLabel key={frameId} frame={frame} /> : null;
          })}
        </div>
      </div>
    </div>
  );
};
