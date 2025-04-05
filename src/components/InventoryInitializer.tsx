
import { useState } from 'react';
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from 'sonner';
import { allFrames, contactLensesToImport } from "@/data/frameData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export const ImportInventoryButton = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const { frames, bulkImportFrames, addContactLens, contactLenses } = useInventoryStore();
  
  const importAllData = async () => {
    setIsImporting(true);
    try {
      // Import frames
      if (allFrames.length > 0) {
        const result = bulkImportFrames(allFrames);
        
        if (result.added > 0) {
          toast.success(`Successfully imported ${result.added} frames`);
        }
        
        if (result.duplicates > 0) {
          toast.info(`${result.duplicates} duplicate frames were skipped`);
        }
      }
      
      // Import contact lenses
      if (contactLenses.length <= 3 && contactLensesToImport.length > 0) {
        let importedLenses = 0;
        
        for (const lens of contactLensesToImport) {
          const isDuplicate = contactLenses.some(l => 
            l.brand === lens.brand && 
            l.type === lens.type && 
            l.power === lens.power
          );
          
          if (!isDuplicate) {
            addContactLens(lens);
            importedLenses++;
          }
        }
        
        if (importedLenses > 0) {
          toast.success(`Successfully imported ${importedLenses} contact lens types`);
        }
      }
    } catch (error) {
      toast.error(`Error importing inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isImporting}
        >
          {isImporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
          )}
          {isRtl ? "استيراد جميع الإطارات" : "Import All Frames"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRtl ? "استيراد جميع الإطارات" : "Import All Frames"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRtl 
              ? "هل أنت متأكد من رغبتك في استيراد جميع الإطارات؟ سيتم إضافة حوالي 600 إطار إلى المخزون."
              : "Are you sure you want to import all frames? This will add about 600 frames to your inventory."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isRtl ? "flex-row-reverse" : ""}>
          <AlertDialogCancel>
            {isRtl ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={importAllData} disabled={isImporting}>
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isRtl ? "جاري الاستيراد..." : "Importing..."}
              </>
            ) : (
              <>
                {isRtl ? "استيراد الإطارات" : "Import Frames"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// This component just ensures the photochromic samples are cleaned up
export const InventoryInitializer = () => {
  const cleanupSamplePhotochromicCoatings = useInventoryStore(
    (state) => state.cleanupSamplePhotochromicCoatings
  );
  
  useState(() => {
    // Clean up any existing sample photochromic coatings on component mount
    cleanupSamplePhotochromicCoatings();
  });

  return null; // This component doesn't render anything visible
};
