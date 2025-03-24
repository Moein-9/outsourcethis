
import { toast } from "@/hooks/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { PrintService } from "@/utils/PrintService";

/**
 * Service for printing work orders and other documents
 */
export class CustomPrintService {
  /**
   * Prints a work order using the unified printing method
   */
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    // Create the receipt content
    const receiptContent = `
      <div id="work-order-receipt" class="print-receipt" dir="${useLanguageStore.getState().language === 'ar' ? 'rtl' : 'ltr'}">
        <div class="receipt-container">
          <!-- Work order receipt content -->
          <div class="store-info text-center mb-2">
            <h2 class="text-lg font-bold mb-0">${workOrder?.storeName || "Optical Store"}</h2>
            <p class="text-xs mb-0">${workOrder?.storeAddress || ""}</p>
            <p class="text-sm font-bold">${workOrder?.storePhone || ""}</p>
          </div>
          
          <div class="customer-info mb-2">
            <p class="mb-0.5"><strong>Name:</strong> ${patient?.name || workOrder?.patientName || ""}</p>
            ${patient?.phone || workOrder?.patientPhone ? 
              `<p class="mb-0.5"><strong>Phone:</strong> ${patient?.phone || workOrder?.patientPhone}</p>` : ''}
            <p class="mb-0.5"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p class="mb-0.5"><strong>Work Order:</strong> ${invoice?.invoiceId || workOrder?.id || ""}</p>
          </div>
          
          ${workOrder?.rx || patient?.rx ? `
          <div class="rx-details mb-2">
            <h3 class="text-center font-bold border-t border-b py-1 mb-1">Prescription</h3>
            <table style="width:100%; border-collapse: collapse; font-size: 10px;" dir="ltr">
              <tr>
                <th style="border:1px solid #000; padding:2px; text-align:center;">Eye</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">SPH</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">CYL</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">AXIS</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">ADD</th>
                <th style="border:1px solid #000; padding:2px; text-align:center;">PD</th>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:2px; text-align:center;">OD</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.sphereOD || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.cylOD || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.axisOD || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.addOD || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.pdRight || "-"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:2px; text-align:center;">OS</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.sphereOS || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.cylOS || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.axisOS || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.addOS || "-"}</td>
                <td style="border:1px solid #000; padding:2px; text-align:center;">${(workOrder?.rx || patient?.rx)?.pdLeft || "-"}</td>
              </tr>
            </table>
          </div>
          ` : ''}
          
          <div class="product-info mb-2">
            <h3 class="text-center font-bold border-t border-b py-1 mb-1">Products</h3>
            ${invoice?.frameBrand || workOrder?.frameBrand ? `
            <div class="frame-details mb-1">
              <p class="mb-0.5 font-bold">Frame:</p>
              <p class="mb-0.5"><strong>Brand:</strong> ${invoice?.frameBrand || workOrder?.frameBrand || ""}</p>
              <p class="mb-0.5"><strong>Model:</strong> ${invoice?.frameModel || workOrder?.frameModel || ""}</p>
              ${invoice?.frameColor || workOrder?.frameColor ? 
                `<p class="mb-0.5"><strong>Color:</strong> ${invoice?.frameColor || workOrder?.frameColor}</p>` : ''}
              ${invoice?.frameSize || workOrder?.frameSize ? 
                `<p class="mb-0.5"><strong>Size:</strong> ${invoice?.frameSize || workOrder?.frameSize}</p>` : ''}
              <p class="mb-0.5"><strong>Price:</strong> ${(invoice?.framePrice || workOrder?.framePrice || 0).toFixed(3)} KWD</p>
            </div>
            ` : ''}
            
            ${invoice?.lensType || workOrder?.lensType ? `
            <div class="lens-details mb-1">
              <p class="mb-0.5 font-bold">Lenses:</p>
              <p class="mb-0.5"><strong>Type:</strong> ${invoice?.lensType || workOrder?.lensType || ""}</p>
              <p class="mb-0.5"><strong>Price:</strong> ${(invoice?.lensPrice || workOrder?.lensPrice || 0).toFixed(3)} KWD</p>
            </div>
            ` : ''}
            
            ${invoice?.coating || workOrder?.coating ? `
            <div class="coating-details mb-1">
              <p class="mb-0.5 font-bold">Coating:</p>
              <p class="mb-0.5"><strong>Type:</strong> ${invoice?.coating || workOrder?.coating || ""}</p>
              <p class="mb-0.5"><strong>Price:</strong> ${(invoice?.coatingPrice || workOrder?.coatingPrice || 0).toFixed(3)} KWD</p>
            </div>
            ` : ''}
          </div>
          
          <div class="payment-info mb-2">
            <h3 class="text-center font-bold border-t border-b py-1 mb-1">Payment</h3>
            <p class="mb-0.5"><strong>Subtotal:</strong> ${((invoice?.total || workOrder?.total || 0) + (invoice?.discount || workOrder?.discount || 0)).toFixed(3)} KWD</p>
            ${(invoice?.discount || workOrder?.discount) ? 
              `<p class="mb-0.5"><strong>Discount:</strong> -${(invoice?.discount || workOrder?.discount || 0).toFixed(3)} KWD</p>` : ''}
            <p class="mb-0.5 font-bold"><strong>Total:</strong> ${(invoice?.total || workOrder?.total || 0).toFixed(3)} KWD</p>
            <p class="mb-0.5"><strong>Paid:</strong> ${(invoice?.deposit || workOrder?.deposit || 0).toFixed(3)} KWD</p>
            <p class="mb-0.5"><strong>Remaining:</strong> ${((invoice?.total || workOrder?.total || 0) - (invoice?.deposit || workOrder?.deposit || 0)).toFixed(3)} KWD</p>
          </div>
          
          <div class="footer text-center mt-3 pt-1 border-t">
            <p class="text-sm mb-0">Thank you for your business!</p>
            <p class="text-xs">${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    `;
    
    // Use the PrintService to print with proper formatting for thermal receipt
    PrintService.printHtml(
      PrintService.prepareWorkOrderDocument(receiptContent, "Work Order"),
      'receipt',
      () => {
        toast({
          title: useLanguageStore.getState().t("printingCompleted"),
          description: useLanguageStore.getState().t("workOrderPrinted"),
        });
      }
    );
  }
}
