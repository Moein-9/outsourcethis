
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "@/hooks/use-toast";
import { CustomPrintService } from "@/utils/CustomPrintService";

interface PrintWorkOrderReceiptOptions {
  invoice: any;
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
  forcedLanguage?: 'en' | 'ar';
}

export const printWorkOrderReceipt = (options: PrintWorkOrderReceiptOptions) => {
  try {
    // Use our unified CustomPrintService for all printing operations
    CustomPrintService.printWorkOrder(
      options.invoice, 
      options.invoice, 
      { 
        name: options.patientName, 
        phone: options.patientPhone,
        rx: options.rx
      }
    );
  } catch (error) {
    console.error("Error printing work order:", error);
    toast({
      title: "Error",
      description: "Failed to print work order. Please try again.",
      variant: "destructive",
    });
  }
};
