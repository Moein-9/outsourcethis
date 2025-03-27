
import { toast } from "@/hooks/use-toast";

export class CustomPrintService {
  static printWorkOrder(workOrder: any, invoice?: any, patient?: any) {
    console.log("CustomPrintService: Printing work order", { workOrder, invoice, patient });
    
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Unable to open print window. Please allow popups for this site.",
          variant: "destructive",
        });
        return;
      }
      
      // Generate direct HTML content for the work order
      const htmlContent = CustomPrintService.generateWorkOrderHTML(workOrder, invoice, patient);
      
      // Write the HTML content to the print window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Set up print callbacks
      printWindow.onload = function() {
        // Apply any additional styling or scripts needed
        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
            printWindow.onafterprint = function() {
              printWindow.close();
            };
          } catch (error) {
            console.error("Error during print process:", error);
            printWindow.close();
          }
        }, 500);
      };
      
    } catch (error) {
      console.error("Error printing work order:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the work order.",
        variant: "destructive",
      });
    }
  }
  
  static generateWorkOrderHTML(workOrder: any, invoice?: any, patient?: any): string {
    if (!workOrder && !invoice) {
      return `
        <html>
          <head>
            <title>Work Order Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            </style>
          </head>
          <body>
            <h3>No valid work order data available</h3>
          </body>
        </html>
      `;
    }
    
    // Essential data extraction, similar to what's in CustomWorkOrderReceipt.tsx
    const patientName = patient?.name || invoice?.patientName || workOrder?.patientName || "Anonymous";
    const patientPhone = patient?.phone || invoice?.patientPhone || workOrder?.patientPhone || "";
    const orderNumber = workOrder?.id || invoice?.workOrderId || `WO${Date.now().toString().slice(-6)}`;
    const rx = patient?.rx || workOrder?.rx || { sphereOD: "", cylOD: "", axisOD: "", addOD: "", pdRight: "" };
    
    // Extract frame data
    const frameData = {
      brand: workOrder?.frameBrand || invoice?.frameBrand || "",
      model: workOrder?.frameModel || invoice?.frameModel || "",
      color: workOrder?.frameColor || invoice?.frameColor || "",
      size: workOrder?.frameSize || invoice?.frameSize || "",
      price: workOrder?.framePrice || invoice?.framePrice || 0
    };
    
    // Extract lens data
    const lensType = workOrder?.lensType || invoice?.lensType || "";
    const lensPrice = workOrder?.lensPrice || invoice?.lensPrice || 0;
    const coating = workOrder?.coating || invoice?.coating || "";
    const coatingPrice = workOrder?.coatingPrice || invoice?.coatingPrice || 0;
    
    // Calculate financial information
    const total = invoice?.total || workOrder?.total || 0;
    const deposit = invoice?.deposit || workOrder?.deposit || 0;
    const discount = invoice?.discount || workOrder?.discount || 0;
    const subtotal = total + discount;
    const amountPaid = invoice?.payments 
      ? invoice.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0) 
      : deposit || 0;
    const remaining = total - amountPaid;
    const isPaid = remaining <= 0;
    
    // Format for lens type and coating display
    const lensTypeString = typeof lensType === 'object' ? lensType?.type || '' : String(lensType);
    const coatingString = typeof coating === 'object' ? coating?.name || '' : String(coating);
    
    // Current date formatted
    const currentDate = new Date();
    const dateFormatted = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Work Order</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: 80mm auto !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            
            body {
              font-family: 'Arial', 'Cairo', sans-serif;
              margin: 0;
              padding: 0;
              width: 80mm;
              background: white;
              color: black;
              font-size: 12px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .work-order-container {
              width: 76mm;
              padding: 2mm;
              background: white;
              page-break-after: always;
              page-break-inside: avoid;
            }
            
            .header {
              text-align: center;
              border-bottom: 1px solid #ccc;
              padding-bottom: 2mm;
              margin-bottom: 2mm;
            }
            
            .logo {
              max-height: 12mm;
              margin: 0 auto 1mm auto;
            }
            
            .title {
              font-weight: bold;
              font-size: 14px;
              margin: 0;
            }
            
            .subtitle {
              font-size: 10px;
              margin: 0;
            }
            
            .section-header {
              background-color: black;
              color: white;
              text-align: center;
              padding: 1mm 0;
              margin: 2mm 0;
              font-weight: bold;
              font-size: 12px;
              border-radius: 3px;
            }
            
            .info-container {
              padding: 0 2mm;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1mm;
              font-size: 10px;
            }
            
            .info-label {
              font-weight: bold;
            }
            
            .rx-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
              direction: ltr;
            }
            
            .rx-table th, .rx-table td {
              border: 1px solid #ccc;
              padding: 1mm;
              text-align: center;
            }
            
            .rx-table th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            
            .section-card {
              border: 1px solid #ddd;
              border-radius: 3px;
              margin-bottom: 2mm;
              padding: 1mm;
            }
            
            .section-card-title {
              font-weight: bold;
              border-bottom: 1px solid #eee;
              padding-bottom: 1mm;
              margin-bottom: 1mm;
            }
            
            .payment-container {
              border: 1px solid #ddd;
              border-radius: 3px;
              padding: 2mm;
            }
            
            .payment-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1mm;
            }
            
            .payment-total {
              border-top: 1px solid #eee;
              padding-top: 1mm;
            }
            
            .paid-status {
              text-align: center;
              margin-top: 2mm;
              padding: 1.5mm;
              border-radius: 3px;
            }
            
            .paid-full {
              background-color: #e6f4ea;
              border: 1px solid #ceead6;
              color: #1e8e3e;
            }
            
            .paid-partial {
              background-color: #fef7e0;
              border: 1px solid #feefc3;
              color: #b93400;
            }
            
            .signature-section {
              display: flex;
              gap: 2mm;
              margin-bottom: 2mm;
            }
            
            .signature-box {
              flex: 1;
              border: 1px solid #ddd;
              padding: 1mm;
              text-align: center;
            }
            
            .signature-title {
              font-weight: bold;
              font-size: 9px;
              border-bottom: 1px solid #eee;
              padding-bottom: 0.5mm;
              margin-bottom: 1mm;
            }
            
            .signature-space {
              height: 8mm;
            }
            
            .notes-section {
              border: 1px solid #ddd;
              padding: 1mm;
              min-height: 15mm;
            }
            
            .footer {
              text-align: center;
              border-top: 1px solid #ccc;
              padding-top: 2mm;
              margin-top: 2mm;
              font-size: 10px;
            }
            
            .footer-title {
              font-weight: bold;
              margin-bottom: 1mm;
            }
            
            .footer-subtitle {
              font-size: 9px;
              color: #666;
            }
            
            /* Additional print-specific styles */
            @media print {
              html, body {
                width: 80mm;
                margin: 0;
                padding: 0;
              }
              
              .work-order-container {
                width: 76mm;
                padding: 2mm;
              }
              
              .section-header {
                background-color: black !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="work-order-container">
            <!-- Header with Store Info -->
            <div class="header">
              <div style="text-align: center;">
                <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
                  <text x="60" y="25" font-family="Arial" font-size="16" text-anchor="middle" font-weight="bold">Moein Optical</text>
                </svg>
              </div>
              <p class="title">Moein Optical</p>
              <p class="subtitle">123 Eye Care St, Kuwait</p>
              <p class="subtitle">Phone: +965 12345678</p>
            </div>
            
            <!-- Work Order Title -->
            <div class="section-header">
              WORK ORDER | أمر عمل
            </div>
            
            <div style="text-align: center; margin-bottom: 2mm;">
              <p style="font-size: 10px; margin: 0;">
                Order #: <span style="font-weight: bold;">${orderNumber}</span>
              </p>
              <p style="font-size: 10px; margin: 0; color: #666;">
                ${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}
              </p>
            </div>
            
            <!-- Patient Information -->
            <div class="section-header">
              Patient Information | معلومات المريض
            </div>
            
            <div class="info-container">
              <div class="info-row">
                <span class="info-label">Customer:</span>
                <span>${patientName}</span>
              </div>
              
              ${patientPhone ? `
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span>${patientPhone}</span>
              </div>
              ` : ''}
              
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span>${dateFormatted}</span>
              </div>
            </div>
            
            <!-- Prescription Details -->
            <div class="section-header">
              Prescription Details | تفاصيل الوصفة الطبية
            </div>
            
            <table class="rx-table">
              <thead>
                <tr>
                  <th>Eye</th>
                  <th>SPH</th>
                  <th>CYL</th>
                  <th>AXIS</th>
                  <th>ADD</th>
                  <th>PD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="background-color: #f0f0f0; font-weight: bold;">OD</td>
                  <td>${rx.sphereOD || "—"}</td>
                  <td>${rx.cylOD || "—"}</td>
                  <td>${rx.axisOD || "—"}</td>
                  <td>${rx.addOD || rx.add || "—"}</td>
                  <td>${rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
                </tr>
                <tr>
                  <td style="background-color: #f0f0f0; font-weight: bold;">OS</td>
                  <td>${rx.sphereOS || "—"}</td>
                  <td>${rx.cylOS || "—"}</td>
                  <td>${rx.axisOS || "—"}</td>
                  <td>${rx.addOS || rx.add || "—"}</td>
                  <td>${rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
                </tr>
              </tbody>
            </table>
            
            <div style="margin-top: 1mm; font-size: 9px; display: flex; justify-content: space-between;">
              <span>OD = Right Eye</span>
              <span>OS = Left Eye</span>
            </div>
            
            <!-- Product Details -->
            <div class="section-header">
              Product Details | تفاصيل المنتج
            </div>
            
            <div class="info-container">
              ${frameData.brand ? `
              <div class="section-card">
                <div class="section-card-title">
                  Frame (الإطار)
                </div>
                <div style="padding: 0 1mm;">
                  <div class="info-row">
                    <span class="info-label">Brand:</span>
                    <span>${frameData.brand}</span>
                  </div>
                  ${frameData.model ? `
                  <div class="info-row">
                    <span class="info-label">Model:</span>
                    <span>${frameData.model}</span>
                  </div>
                  ` : ''}
                  ${frameData.color ? `
                  <div class="info-row">
                    <span class="info-label">Color:</span>
                    <span>${frameData.color}</span>
                  </div>
                  ` : ''}
                  ${frameData.size ? `
                  <div class="info-row">
                    <span class="info-label">Size:</span>
                    <span>${frameData.size}</span>
                  </div>
                  ` : ''}
                  ${frameData.price > 0 ? `
                  <div class="info-row">
                    <span class="info-label">Price:</span>
                    <span style="font-weight: bold;">${frameData.price.toFixed(3)} KWD</span>
                  </div>
                  ` : ''}
                </div>
              </div>
              ` : ''}
              
              ${lensTypeString ? `
              <div class="section-card">
                <div class="section-card-title">
                  Lenses (العدسات)
                </div>
                <div style="padding: 0 1mm;">
                  <div class="info-row">
                    <span class="info-label">Type:</span>
                    <span>${lensTypeString}</span>
                  </div>
                  ${lensPrice > 0 ? `
                  <div class="info-row">
                    <span class="info-label">Price:</span>
                    <span style="font-weight: bold;">${lensPrice.toFixed(3)} KWD</span>
                  </div>
                  ` : ''}
                </div>
              </div>
              ` : ''}
              
              ${coatingString ? `
              <div class="section-card">
                <div class="section-card-title">
                  Coating (الطلاء)
                </div>
                <div style="padding: 0 1mm;">
                  <div class="info-row">
                    <span class="info-label">Type:</span>
                    <span>${coatingString}</span>
                  </div>
                  ${coatingPrice > 0 ? `
                  <div class="info-row">
                    <span class="info-label">Price:</span>
                    <span style="font-weight: bold;">${coatingPrice.toFixed(3)} KWD</span>
                  </div>
                  ` : ''}
                </div>
              </div>
              ` : ''}
            </div>
            
            <!-- Payment Information -->
            <div class="section-header">
              Payment Information | معلومات الدفع
            </div>
            
            <div class="payment-container">
              <div class="payment-row">
                <span style="font-weight: bold;">Subtotal:</span>
                <span>${subtotal.toFixed(3)} KWD</span>
              </div>
              
              ${discount > 0 ? `
              <div class="payment-row">
                <span style="font-weight: bold;">Discount:</span>
                <span>-${discount.toFixed(3)} KWD</span>
              </div>
              ` : ''}
              
              <div class="payment-row payment-total">
                <span style="font-weight: bold;">Total:</span>
                <span>${total.toFixed(3)} KWD</span>
              </div>
              
              <div class="payment-row">
                <span style="font-weight: bold;">Paid:</span>
                <span>${amountPaid.toFixed(3)} KWD</span>
              </div>
              
              ${isPaid ? `
              <div class="paid-status paid-full">
                <div style="display: flex; align-items: center; justify-content: center; gap: 1mm;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4" stroke="#1e8e3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="#1e8e3e" stroke-width="2"/>
                  </svg>
                  <span style="font-weight: bold;">PAID IN FULL</span>
                </div>
                <div style="font-size: 9px;">تم الدفع بالكامل</div>
              </div>
              ` : `
              <div class="paid-status paid-partial">
                <div style="font-weight: bold; font-size: 12px; text-align: center;">
                  REMAINING AMOUNT
                </div>
                <div style="font-size: 14px; font-weight: bold; text-align: center;">
                  ${remaining.toFixed(3)} KWD
                </div>
                <div style="font-size: 9px; text-align: center;">المبلغ المتبقي</div>
              </div>
              `}
            </div>
            
            <!-- Quality Confirmation -->
            <div class="section-header">
              Quality Confirmation | تأكيد الجودة
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-title">
                  Technician Signature
                </div>
                <div class="signature-space"></div>
              </div>
              
              <div class="signature-box">
                <div class="signature-title">
                  Manager Signature
                </div>
                <div class="signature-space"></div>
              </div>
            </div>
            
            <!-- Notes -->
            <div class="section-header">
              Notes | ملاحظات
            </div>
            
            <div class="notes-section">
              <!-- Empty space for handwritten notes -->
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p class="footer-title">
                Thank you for choosing Moein Optical
              </p>
              <p class="footer-subtitle">
                This receipt is proof of order only and not a payment receipt
              </p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
  }
}
