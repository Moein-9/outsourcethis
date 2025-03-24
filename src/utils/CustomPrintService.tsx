
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { printWorkOrderReceipt } from "@/components/WorkOrderReceiptPrint";

/**
 * Service for printing work orders and other documents
 */
export class CustomPrintService {
  /**
   * Prints a work order using the unified printing method
   */
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    // Use the unified printWorkOrderReceipt method for consistency
    printWorkOrderReceipt({
      invoice: invoice || workOrder,
      patientName: patient?.name || workOrder?.patientName,
      patientPhone: patient?.phone || workOrder?.patientPhone,
      rx: patient?.rx || workOrder?.rx
    });
  }
}
