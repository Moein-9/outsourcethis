
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { printWorkOrderReceipt } from "@/components/WorkOrderReceiptPrint";

export class CustomPrintService {
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
