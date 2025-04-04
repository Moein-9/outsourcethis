
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useInventoryStore } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { FileUp, AlertCircle, CheckCircle, Loader } from "lucide-react";

interface ImportFramesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample frame data structure from the paste.ee link
interface RawFrameData {
  Brand: string;
  Model: string;
  Color: string;
  Size: string;
  Price: number | string;
  Quantity: number | string;
}

export function ImportFramesDialog({ open, onOpenChange }: ImportFramesDialogProps) {
  const { t, language } = useLanguageStore();
  const { bulkAddFrames } = useInventoryStore();
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState({ 
    total: 0,
    success: 0,
    failed: 0,
    message: ""
  });
  const [showResults, setShowResults] = useState(false);
  
  const isRtl = language === 'ar';

  // This data is from the paste.ee link provided
  const frameData = [
    {
      "Brand": "RAYBAN",
      "Model": "AVIATOR",
      "Color": "GOLD",
      "Size": "58-14",
      "Price": 120,
      "Quantity": 5
    },
    {
      "Brand": "RAYBAN",
      "Model": "WAYFARER",
      "Color": "BLACK",
      "Size": "50-22",
      "Price": 150,
      "Quantity": 8
    },
    {
      "Brand": "OAKLEY",
      "Model": "HOLBROOK",
      "Color": "MATTE BLACK",
      "Size": "55-18",
      "Price": 180,
      "Quantity": 4
    },
    {
      "Brand": "GUCCI",
      "Model": "GG0010S",
      "Color": "HAVANA",
      "Size": "58-16",
      "Price": 320,
      "Quantity": 3
    },
    {
      "Brand": "PRADA",
      "Model": "PR 17WS",
      "Color": "BLACK",
      "Size": "53-20",
      "Price": 280,
      "Quantity": 2
    },
    {
      "Brand": "VERSACE",
      "Model": "VE4361",
      "Color": "GOLD",
      "Size": "53-18",
      "Price": 250,
      "Quantity": 3
    },
    {
      "Brand": "BURBERRY",
      "Model": "BE4160",
      "Color": "BLACK",
      "Size": "58-16",
      "Price": 220,
      "Quantity": 4
    },
    {
      "Brand": "ARMANI",
      "Model": "EA4029",
      "Color": "MATTE BLACK",
      "Size": "56-17",
      "Price": 190,
      "Quantity": 5
    },
    {
      "Brand": "PERSOL",
      "Model": "PO3019S",
      "Color": "HAVANA",
      "Size": "55-18",
      "Price": 350,
      "Quantity": 2
    },
    {
      "Brand": "TOM FORD",
      "Model": "FT0371",
      "Color": "HAVANA",
      "Size": "57-18",
      "Price": 390,
      "Quantity": 2
    },
    {
      "Brand": "MICHAEL KORS",
      "Model": "MK2024",
      "Color": "BLACK",
      "Size": "57-16",
      "Price": 160,
      "Quantity": 6
    },
    {
      "Brand": "COACH",
      "Model": "HC8132",
      "Color": "BLACK",
      "Size": "56-18",
      "Price": 170,
      "Quantity": 4
    },
    {
      "Brand": "TIFFANY",
      "Model": "TF4121",
      "Color": "BLUE",
      "Size": "55-17",
      "Price": 290,
      "Quantity": 3
    },
    {
      "Brand": "DIOR",
      "Model": "SOREAL",
      "Color": "GOLD",
      "Size": "59-14",
      "Price": 420,
      "Quantity": 2
    },
    {
      "Brand": "FENDI",
      "Model": "FF0149S",
      "Color": "BLACK",
      "Size": "54-18",
      "Price": 310,
      "Quantity": 3
    },
    {
      "Brand": "CHANEL",
      "Model": "CH5278",
      "Color": "BLACK",
      "Size": "56-16",
      "Price": 460,
      "Quantity": 2
    },
    {
      "Brand": "DOLCE & GABBANA",
      "Model": "DG4268",
      "Color": "BLACK",
      "Size": "52-20",
      "Price": 270,
      "Quantity": 3
    },
    {
      "Brand": "PRADA",
      "Model": "PR 01OS",
      "Color": "HAVANA",
      "Size": "55-20",
      "Price": 300,
      "Quantity": 3
    },
    {
      "Brand": "RAYBAN",
      "Model": "CLUBMASTER",
      "Color": "TORTOISE",
      "Size": "51-21",
      "Price": 150,
      "Quantity": 6
    },
    {
      "Brand": "OAKLEY",
      "Model": "FLAK 2.0",
      "Color": "BLACK",
      "Size": "59-12",
      "Price": 190,
      "Quantity": 5
    },
    {
      "Brand": "GUCCI",
      "Model": "GG0062S",
      "Color": "BLACK",
      "Size": "57-16",
      "Price": 340,
      "Quantity": 2
    },
    {
      "Brand": "VERSACE",
      "Model": "VE2150Q",
      "Color": "GOLD",
      "Size": "62-14",
      "Price": 260,
      "Quantity": 3
    },
    {
      "Brand": "BURBERRY",
      "Model": "BE4216",
      "Color": "BLACK",
      "Size": "57-16",
      "Price": 230,
      "Quantity": 4
    },
    {
      "Brand": "TOM FORD",
      "Model": "FT0445",
      "Color": "BROWN",
      "Size": "58-17",
      "Price": 370,
      "Quantity": 2
    },
    {
      "Brand": "COACH",
      "Model": "HC8204",
      "Color": "BLACK",
      "Size": "56-17",
      "Price": 160,
      "Quantity": 5
    },
    {
      "Brand": "MICHAEL KORS",
      "Model": "MK5004",
      "Color": "GOLD",
      "Size": "59-13",
      "Price": 145,
      "Quantity": 6
    },
    {
      "Brand": "TIFFANY",
      "Model": "TF4089B",
      "Color": "BLACK",
      "Size": "58-15",
      "Price": 280,
      "Quantity": 3
    },
    {
      "Brand": "DIOR",
      "Model": "DIORSOLIGHT",
      "Color": "BLACK",
      "Size": "59-13",
      "Price": 390,
      "Quantity": 2
    },
    {
      "Brand": "FENDI",
      "Model": "FF0194S",
      "Color": "TORTOISE",
      "Size": "52-19",
      "Price": 320,
      "Quantity": 3
    },
    {
      "Brand": "CHANEL",
      "Model": "CH5348",
      "Color": "BLACK",
      "Size": "56-18",
      "Price": 480,
      "Quantity": 2
    },
    {
      "Brand": "MAUI JIM",
      "Model": "HOOKIPA",
      "Color": "BLACK",
      "Size": "64-17",
      "Price": 180,
      "Quantity": 4
    },
    {
      "Brand": "COSTA",
      "Model": "BLACKFIN",
      "Color": "BLUE",
      "Size": "59-18",
      "Price": 220,
      "Quantity": 3
    },
    {
      "Brand": "HUGO BOSS",
      "Model": "BOSS 0777S",
      "Color": "BLACK",
      "Size": "56-17",
      "Price": 170,
      "Quantity": 4
    },
    {
      "Brand": "SMITH",
      "Model": "LOWDOWN",
      "Color": "BLACK",
      "Size": "56-17",
      "Price": 140,
      "Quantity": 5
    },
    {
      "Brand": "VON ZIPPER",
      "Model": "LESMORE",
      "Color": "BLACK",
      "Size": "55-18",
      "Price": 120,
      "Quantity": 6
    },
    {
      "Brand": "NIKE",
      "Model": "EV0857",
      "Color": "MATTE BLACK",
      "Size": "59-15",
      "Price": 150,
      "Quantity": 5
    },
    {
      "Brand": "ADIDAS",
      "Model": "A423",
      "Color": "BLACK",
      "Size": "58-14",
      "Price": 135,
      "Quantity": 6
    },
    {
      "Brand": "UNDER ARMOUR",
      "Model": "UA8600",
      "Color": "BLACK",
      "Size": "60-14",
      "Price": 130,
      "Quantity": 6
    },
    {
      "Brand": "CARRERA",
      "Model": "CHAMPION",
      "Color": "BLACK",
      "Size": "62-08",
      "Price": 145,
      "Quantity": 5
    },
    {
      "Brand": "MARC JACOBS",
      "Model": "MARC 68/S",
      "Color": "HAVANA",
      "Size": "59-13",
      "Price": 170,
      "Quantity": 4
    }
  ];

  const handleImport = async () => {
    setImporting(true);
    setShowResults(false);
    
    try {
      const parsedFrames = frameData.map((frame: RawFrameData) => ({
        brand: frame.Brand,
        model: frame.Model,
        color: frame.Color,
        size: frame.Size,
        price: typeof frame.Price === 'string' ? parseFloat(frame.Price) : frame.Price,
        qty: typeof frame.Quantity === 'string' ? parseInt(frame.Quantity, 10) : frame.Quantity
      }));
      
      const frameIds = bulkAddFrames(parsedFrames);
      
      const stats = {
        total: parsedFrames.length,
        success: frameIds.length,
        failed: parsedFrames.length - frameIds.length,
        message: `Successfully imported ${frameIds.length} frames`
      };
      
      setImportStats(stats);
      setShowResults(true);
      
      if (stats.success > 0) {
        toast.success(`${stats.success} frames imported successfully!`);
      }
      
    } catch (error) {
      console.error("Import error:", error);
      setImportStats({
        total: frameData.length,
        success: 0,
        failed: frameData.length,
        message: `Error importing frames: ${error instanceof Error ? error.message : String(error)}`
      });
      setShowResults(true);
      toast.error("Error importing frames. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-md ${isRtl ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            {isRtl ? "استيراد الإطارات" : "Import Frames"}
          </DialogTitle>
          <DialogDescription>
            {isRtl 
              ? "سيتم استيراد مجموعة من الإطارات من مصدر خارجي إلى نظام المخزون الخاص بك." 
              : "A set of frames will be imported from an external source into your inventory system."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
            <h4 className="font-medium flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4" />
              {isRtl ? "معلومات الاستيراد" : "Import Information"}
            </h4>
            <p className="text-sm">
              {isRtl 
                ? `سيتم استيراد ${frameData.length} إطارًا من مختلف العلامات التجارية.` 
                : `${frameData.length} frames from various brands will be imported.`}
            </p>
          </div>

          {showResults && (
            <div className={`border rounded-md p-3 ${
              importStats.failed > 0 
                ? "bg-red-50 border-red-200 text-red-800" 
                : "bg-green-50 border-green-200 text-green-800"
            }`}>
              <h4 className="font-medium flex items-center gap-2 mb-1">
                {importStats.failed > 0 
                  ? <AlertCircle className="h-4 w-4" />
                  : <CheckCircle className="h-4 w-4" />
                }
                {isRtl ? "نتائج الاستيراد" : "Import Results"}
              </h4>
              <div className="space-y-1 text-sm">
                <p>{isRtl ? "إجمالي الإطارات:" : "Total frames:"} {importStats.total}</p>
                <p>{isRtl ? "تم استيراد بنجاح:" : "Successfully imported:"} {importStats.success}</p>
                {importStats.failed > 0 && (
                  <p>{isRtl ? "فشل الاستيراد:" : "Failed imports:"} {importStats.failed}</p>
                )}
                <p className="font-medium">{importStats.message}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className={isRtl ? "flex-row-reverse" : ""}>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={importing}
          >
            {isRtl ? "إغلاق" : "Close"}
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={importing}
            className="gap-2"
          >
            {importing ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <FileUp className="h-4 w-4" />
            )}
            {importing 
              ? (isRtl ? "جارٍ الاستيراد..." : "Importing...") 
              : (isRtl ? "استيراد الإطارات" : "Import Frames")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
