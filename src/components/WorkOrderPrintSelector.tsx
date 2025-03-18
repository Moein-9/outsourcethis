
import React, { useState } from "react";
import { Invoice } from "@/store/invoiceStore";
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
import { PrinterIcon, Newspaper, FileText } from "lucide-react";
import { WorkOrderPrint } from "./WorkOrderPrint";
import { WorkOrderReceiptPrint } from "./WorkOrderReceiptPrint";
import { useLanguageStore } from "@/store/languageStore";

interface WorkOrderPrintSelectorProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: any[];
  contactLensRx?: any;
  trigger?: React.ReactNode;
}

export const WorkOrderPrintSelector: React.FC<WorkOrderPrintSelectorProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  trigger
}) => {
  const { t } = useLanguageStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"a4" | "receipt" | null>(null);
  
  const handlePrint = () => {
    if (!selectedFormat) return;
    
    setTimeout(() => {
      window.print();
      // Close dialog after printing
      setTimeout(() => setIsDialogOpen(false), 500);
    }, 200);
  };
  
  const renderPrintComponent = () => {
    if (selectedFormat === "a4") {
      return (
        <WorkOrderPrint
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
        />
      );
    } else if (selectedFormat === "receipt") {
      return (
        <WorkOrderReceiptPrint
          invoice={invoice}
          patientName={patientName}
          patientPhone={patientPhone}
          rx={rx}
          lensType={lensType}
          coating={coating}
          frame={frame}
          contactLenses={contactLenses}
          contactLensRx={contactLensRx}
        />
      );
    }
    
    return null;
  };
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm" className="gap-1">
              <PrinterIcon className="h-4 w-4" /> {t("printWorkOrder")}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("selectPrintFormat")}</DialogTitle>
            <DialogDescription>
              {t("choosePrintFormatDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div 
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                selectedFormat === "a4" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedFormat("a4")}
            >
              <FileText className={`h-8 w-8 ${selectedFormat === "a4" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">A4 {t("paper")}</span>
              <span className="text-xs text-center text-muted-foreground">{t("standardFormat")}</span>
            </div>
            
            <div 
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-all ${
                selectedFormat === "receipt" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedFormat("receipt")}
            >
              <Newspaper className={`h-8 w-8 ${selectedFormat === "receipt" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium">{t("receiptFormat")}</span>
              <span className="text-xs text-center text-muted-foreground">{t("compactFormat")}</span>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              disabled={!selectedFormat}
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              {t("print")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden print component */}
      <div className="hidden">
        {renderPrintComponent()}
      </div>
    </>
  );
};
