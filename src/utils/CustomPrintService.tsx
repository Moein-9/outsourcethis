
import { toast } from "@/hooks/use-toast";
import { MoenLogo, storeInfo } from "@/assets/logo";
import { format } from "date-fns";

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
      
      // Add all the required styles and content
      printWindow.document.write(`
        <html>
          <head>
            <title>Work Order</title>
            <style>
              @media print {
                @page {
                  size: 80mm auto !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                body {
                  width: 80mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                }
                
                #custom-work-order-content {
                  width: 76mm !important;
                  max-width: 76mm !important;
                  page-break-after: always !important;
                  page-break-inside: avoid !important;
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  padding: 2mm !important;
                  margin: 0 !important;
                  background: white !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                }
                
                /* Force content to be visible */
                .print-receipt * {
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                
                /* Improve dynamic sizing */
                html, body {
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                }
                
                /* Fix Chrome printing issues */
                body {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                
                /* Dynamic height adjustment */
                .print-receipt {
                  height: fit-content !important;
                  min-height: fit-content !important;
                  max-height: fit-content !important;
                }
                
                /* Ensure proper page breaks and avoid blank pages */
                .print-receipt {
                  break-inside: avoid !important;
                  break-after: avoid-page !important;
                  page-break-inside: avoid !important;
                  page-break-after: avoid !important;
                }
                
                /* Styling for the new template */
                .text-center {
                  text-align: center !important;
                }
                
                .mb-1 {
                  margin-bottom: 1mm !important;
                }
                
                .mb-2 {
                  margin-bottom: 2mm !important;
                }
                
                .pb-1 {
                  padding-bottom: 1mm !important;
                }
                
                .border-b {
                  border-bottom: 1px solid #ddd !important;
                }
                
                .font-bold {
                  font-weight: bold !important;
                }
                
                .text-lg {
                  font-size: 16px !important;
                }
                
                .text-xs {
                  font-size: 12px !important;
                }
                
                .flex {
                  display: flex !important;
                }
                
                .justify-center {
                  justify-content: center !important;
                }
                
                .justify-between {
                  justify-content: space-between !important;
                }
                
                .w-auto {
                  width: auto !important;
                }
                
                .h-10 {
                  height: 10mm !important;
                }
                
                .font-medium {
                  font-weight: 500 !important;
                }
                
                .text-white {
                  color: white !important;
                }
                
                .py-0\.5 {
                  padding-top: 0.5mm !important;
                  padding-bottom: 0.5mm !important;
                }
                
                .bg-black {
                  background-color: black !important;
                }
                
                .space-y-0\.5 > * + * {
                  margin-top: 0.5mm !important;
                }
                
                .px-2 {
                  padding-left: 2mm !important;
                  padding-right: 2mm !important;
                }
                
                .font-semibold {
                  font-weight: 600 !important;
                }
                
                table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                }
                
                th, td {
                  padding: 0.5mm !important;
                  border: 1px solid #ddd !important;
                  text-align: center !important;
                }
                
                .bg-gray-200 {
                  background-color: #eee !important;
                }
                
                .p-0\.5 {
                  padding: 0.5mm !important;
                }
                
                .border {
                  border: 1px solid #ddd !important;
                }
                
                .p-1 {
                  padding: 1mm !important;
                }
                
                .bg-green-100 {
                  background-color: #dcfce7 !important;
                }
                
                .rounded {
                  border-radius: 2mm !important;
                }
                
                .border-green-300 {
                  border-color: #86efac !important;
                }
                
                .gap-0\.5 {
                  gap: 0.5mm !important;
                }
                
                .text-green-700 {
                  color: #15803d !important;
                }
                
                .text-sm {
                  font-size: 14px !important;
                }
                
                .text-green-600 {
                  color: #16a34a !important;
                }
                
                .bg-red-100 {
                  background-color: #fee2e2 !important;
                }
                
                .border-red-300 {
                  border-color: #fca5a5 !important;
                }
                
                .text-red-700 {
                  color: #b91c1c !important;
                }
                
                .text-red-600 {
                  color: #dc2626 !important;
                }
                
                .pt-1 {
                  padding-top: 1mm !important;
                }
                
                .text-\[9px\] {
                  font-size: 9px !important;
                }
                
                .mt-0\.5 {
                  margin-top: 0.5mm !important;
                }
                
                .w-full {
                  width: 100% !important;
                }
                
                .min-h-16 {
                  min-height: 16mm !important;
                }
                
                .h-6 {
                  height: 6mm !important;
                }
              }
              
              body {
                font-family: 'Cairo', Arial, sans-serif;
                margin: 0;
                padding: 0;
              }
            </style>
          </head>
          <body>
            <div id="custom-work-order-content"></div>
          </body>
        </html>
      `);
      
      // Format data for the work order
      const formattedWorkOrder = {
        invoiceId: workOrder.invoiceId || workOrder.id || "NEW",
        workOrderId: workOrder.workOrderId || workOrder.id || "NEW",
        patientName: patient?.name || workOrder.patientName || "",
        patientPhone: patient?.phone || workOrder.patientPhone || "",
        lensType: workOrder.lensType || "",
        coating: workOrder.coating || "",
        frameBrand: workOrder.frameBrand || "",
        frameModel: workOrder.frameModel || "",
        frameColor: workOrder.frameColor || "",
        frameSize: workOrder.frameSize || "",
        framePrice: workOrder.framePrice || 0,
        lensPrice: workOrder.lensPrice || 0,
        coatingPrice: workOrder.coatingPrice || 0,
        discount: workOrder.discount || 0,
        deposit: workOrder.deposit || 0,
        total: workOrder.total || 0,
        remaining: (workOrder.total || 0) - (workOrder.deposit || 0),
        createdAt: workOrder.createdAt || new Date().toISOString(),
        paymentMethod: workOrder.paymentMethod || "Cash",
        isPaid: (workOrder.deposit || 0) >= (workOrder.total || 0)
      };
      
      // Generate work order receipt content using a similar approach to CustomWorkOrderReceipt
      const getWorkOrderContent = () => {
        // Using the direction based on language
        const isRtl = document.documentElement.dir === 'rtl';
        const dirAttr = isRtl ? 'dir="rtl"' : 'dir="ltr"';
        const dirClass = isRtl ? 'rtl' : 'ltr';
        
        // Format data
        const rx = patient?.rx;
        const total = formattedWorkOrder.total;
        const deposit = formattedWorkOrder.deposit;
        const discount = formattedWorkOrder.discount;
        const subtotal = total + discount;
        const remaining = total - deposit;
        const isPaid = remaining <= 0;
        
        return `
          <div class="print-receipt ${dirClass}" ${dirAttr} style="width: 80mm; max-width: 80mm; margin: 0 auto; background-color: white; padding: 2mm; font-size: 12px; font-family: 'Cairo', sans-serif;">
            <div class="text-center border-b pb-1 mb-1">
              <div class="flex justify-center mb-1">
                <svg width="100" height="40" viewBox="0 0 240 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- SVG path for MoenLogo - simplified for print -->
                  <path d="M42.5 48C42.5 53.799 40.1884 59.3704 36.0754 63.4835C31.9623 67.5965 26.3909 69.9081 20.592 69.9081C14.793 69.9081 9.22165 67.5965 5.10857 63.4835C0.995498 59.3704 -1.31613 53.799 -1.31613 48C-1.31613 42.2011 0.995498 36.6296 5.10857 32.5166C9.22165 28.4035 14.793 26.0919 20.592 26.0919C26.3909 26.0919 31.9623 28.4035 36.0754 32.5166C40.1884 36.6296 42.5 42.2011 42.5 48ZM87.3558 26.0919H100.174V69.9081H87.3558V60.6247C84.8012 64.2189 81.4159 67.0911 77.5181 69.0037C73.6203 70.9163 69.3196 71.8081 64.9833 71.5838C60.647 71.3595 56.4434 70.027 52.7599 67.7097C49.0764 65.3925 46.0303 62.1617 43.9384 58.3286C41.8464 54.4955 40.777 50.2024 40.824 45.8456C40.871 41.4888 42.0328 37.2235 44.2067 33.4382C46.3805 29.6528 49.4963 26.494 53.2309 24.2649C56.9655 22.0358 61.1998 20.7963 65.5461 20.6671C69.8924 20.5379 74.1926 21.523 77.9805 23.5194C81.7683 25.5159 85.0255 28.4611 87.4433 32.102L87.3558 26.0919Z" fill="#FEB727"/>
                  <path d="M228.908 26.0919H240V69.9081H228.908V26.0919ZM137.485 26.0919H149.79V69.9081H137.485V26.0919ZM178.213 48.0001C178.192 44.4264 176.958 40.9962 174.71 38.32C172.462 35.6438 169.347 33.9119 165.95 33.4591C162.553 33.0063 159.133 33.8648 156.339 35.8685C153.544 37.8723 151.569 40.8707 150.752 44.3081C149.935 47.7455 150.327 51.3662 151.849 54.4956C153.372 57.625 155.925 60.0383 158.992 61.267C162.059 62.4957 165.425 62.4553 168.464 61.1539C171.503 59.8525 174.002 57.3848 175.457 54.2244L190.081 62.1826C186.95 66.5536 182.563 69.7915 177.508 71.4517C172.454 73.1119 167.003 73.1057 162.021 71.5339C157.039 69.9621 152.752 66.8408 149.724 62.7238C146.696 58.6068 144.975 53.6942 144.762 48.5842C144.548 43.4742 145.85 38.441 148.505 34.1067C151.161 29.7724 155.054 26.3472 159.701 24.2947C164.348 22.2422 169.508 21.661 174.499 22.6335C179.49 23.606 184.067 26.0825 187.638 29.7296L178.213 48.0001ZM204.358 58.2488L195.158 50.9338C195.158 50.9338 202.958 39.6001 215.108 39.6001V69.9081H204.358V58.2488Z" fill="#1E2F8C"/>
                </svg>
              </div>
              <h2 class="font-bold text-lg mb-0">${storeInfo.name}</h2>
              <p class="text-xs font-medium mb-0">${storeInfo.address}</p>
              <p class="text-xs font-medium">Phone: ${storeInfo.phone}</p>
            </div>

            <div class="text-center mb-1">
              <h3 class="font-bold text-lg mb-0">
                ${isRtl ? "أمر عمل" : "WORK ORDER"}
              </h3>
              <p class="text-xs mb-0">
                ${isRtl ? "ORDER #: " : "رقم الطلب: "}
                ${formattedWorkOrder.invoiceId}
              </p>
              <p class="text-xs">
                ${format(new Date(formattedWorkOrder.createdAt), 'yyyy-MM-dd HH:mm')}
              </p>
            </div>

            <div class="mb-2">
              <div class="text-center bg-black text-white py-0.5 mb-1 font-bold text-base border-y">
                ${isRtl 
                  ? "معلومات المريض | Patient Information" 
                  : "Patient Information | معلومات المريض"}
              </div>
              
              <div class="space-y-0.5 text-xs px-2">
                <div class="flex justify-between">
                  <span class="font-bold">Customer:</span>
                  <span class="font-semibold">${formattedWorkOrder.patientName}</span>
                </div>
                
                ${formattedWorkOrder.patientPhone ? `
                <div class="flex justify-between">
                  <span class="font-bold">Phone:</span>
                  <span class="font-semibold">${formattedWorkOrder.patientPhone}</span>
                </div>
                ` : ''}
              </div>
            </div>

            ${rx ? `
            <div class="mb-2">
              <div class="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
                ${isRtl 
                  ? "تفاصيل الوصفة الطبية | Prescription Details" 
                  : "Prescription Details | تفاصيل الوصفة الطبية"}
              </div>
              
              <table class="w-full border-collapse text-xs" style="direction: ltr">
                <thead>
                  <tr class="bg-gray-200">
                    <th class="p-0.5 border text-center font-bold">Eye</th>
                    <th class="p-0.5 border text-center font-bold">Sphere</th>
                    <th class="p-0.5 border text-center font-bold">Cylinder</th>
                    <th class="p-0.5 border text-center font-bold">Axis</th>
                    <th class="p-0.5 border text-center font-bold">Add</th>
                    <th class="p-0.5 border text-center font-bold">PD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="p-0.5 border font-bold text-center">R</td>
                    <td class="p-0.5 border text-center">${rx.sphereOD || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.cylOD || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.axisOD || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.addOD || rx.add || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
                  </tr>
                  <tr>
                    <td class="p-0.5 border font-bold text-center">L</td>
                    <td class="p-0.5 border text-center">${rx.sphereOS || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.cylOS || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.axisOS || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.addOS || rx.add || "—"}</td>
                    <td class="p-0.5 border text-center">${rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            ` : ''}

            <div class="mb-2">
              <div class="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
                ${isRtl 
                  ? "تفاصيل المنتج | Product Details" 
                  : "Product Details | تفاصيل المنتج"}
              </div>
              
              <div class="space-y-1 text-xs px-1">
                ${formattedWorkOrder.frameBrand ? `
                <div class="mb-1">
                  <div class="font-bold border-b pb-0.5 mb-0.5">
                    ${isRtl ? "الإطار (Frame)" : "Frame (الإطار)"}:
                  </div>
                  <div class="px-1 space-y-0.5">
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "الماركة (Brand)" : "Brand (الماركة)"}:</span>
                      <span>${formattedWorkOrder.frameBrand}</span>
                    </div>
                    ${formattedWorkOrder.frameModel ? `
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "الموديل (Model)" : "Model (الموديل)"}:</span>
                      <span>${formattedWorkOrder.frameModel}</span>
                    </div>
                    ` : ''}
                    ${formattedWorkOrder.frameColor ? `
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "اللون (Color)" : "Color (اللون)"}:</span>
                      <span>${formattedWorkOrder.frameColor}</span>
                    </div>
                    ` : ''}
                    ${formattedWorkOrder.frameSize ? `
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "المقاس (Size)" : "Size (المقاس)"}:</span>
                      <span>${formattedWorkOrder.frameSize}</span>
                    </div>
                    ` : ''}
                    ${formattedWorkOrder.framePrice > 0 ? `
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                      <span>${formattedWorkOrder.framePrice.toFixed(3)} KWD</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
                ` : ''}
                
                ${formattedWorkOrder.lensType ? `
                <div class="mb-1">
                  <div class="font-bold border-b pb-0.5 mb-0.5">
                    ${isRtl ? "العدسات (Lenses)" : "Lenses (العدسات)"}:
                  </div>
                  <div class="px-1 space-y-0.5">
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                      <span class="font-semibold">${formattedWorkOrder.lensType}</span>
                    </div>
                    ${formattedWorkOrder.lensPrice > 0 ? `
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                      <span>${formattedWorkOrder.lensPrice.toFixed(3)} KWD</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
                ` : ''}
                
                ${formattedWorkOrder.coating ? `
                <div class="mb-1">
                  <div class="font-bold border-b pb-0.5 mb-0.5">
                    ${isRtl ? "الطلاء (Coating)" : "Coating (الطلاء)"}:
                  </div>
                  <div class="px-1 space-y-0.5">
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "النوع (Type)" : "Type (النوع)"}:</span>
                      <span class="font-semibold">${formattedWorkOrder.coating}</span>
                    </div>
                    ${formattedWorkOrder.coatingPrice > 0 ? `
                    <div class="flex justify-between">
                      <span class="font-semibold">${isRtl ? "السعر (Price)" : "Price (السعر)"}:</span>
                      <span>${formattedWorkOrder.coatingPrice.toFixed(3)} KWD</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
                ` : ''}
              </div>
            </div>

            <div class="mb-2">
              <div class="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
                ${isRtl 
                  ? "معلومات الدفع | Payment Information" 
                  : "Payment Information | معلومات الدفع"}
              </div>
              
              <div class="space-y-0.5 text-xs px-2">
                <div class="flex justify-between">
                  <span class="font-bold">Subtotal:</span>
                  <span class="font-semibold">${subtotal.toFixed(3)} KWD</span>
                </div>
                
                ${discount > 0 ? `
                <div class="flex justify-between">
                  <span class="font-bold">Discount:</span>
                  <span class="font-semibold">-${discount.toFixed(3)} KWD</span>
                </div>
                ` : ''}
                
                <div class="flex justify-between">
                  <span class="font-bold">Total:</span>
                  <span class="font-semibold">${total.toFixed(3)} KWD</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="font-bold">Paid:</span>
                  <span class="font-semibold">${deposit.toFixed(3)} KWD</span>
                </div>
                
                ${isPaid ? `
                <div class="mt-1 p-1 bg-green-100 rounded border border-green-300 text-center">
                  <div class="flex items-center justify-center gap-0.5 text-green-700 font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                    <span class="text-sm">${isRtl ? "تم الدفع بالكامل" : "PAID IN FULL"}</span>
                  </div>
                  ${!isRtl ? `<div class="text-green-600 text-xs">تم الدفع بالكامل</div>` : 
                          `<div class="text-green-600 text-xs">PAID IN FULL</div>`}
                </div>
                ` : `
                <div class="mt-1">
                  <div class="p-1 bg-red-100 rounded border border-red-300 text-center">
                    <div class="font-bold text-red-700 text-sm">
                      ${isRtl ? "المبلغ المتبقي" : "REMAINING AMOUNT"}
                    </div>
                    <div class="text-base font-bold text-red-600">
                      ${remaining.toFixed(3)} KWD
                    </div>
                    ${!isRtl ? `<div class="text-red-600 text-xs">المبلغ المتبقي</div>` : 
                              `<div class="text-red-600 text-xs">REMAINING AMOUNT</div>`}
                  </div>
                </div>
                `}
              </div>
            </div>

            <div class="mb-2">
              <div class="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
                ${isRtl 
                  ? "تأكيد الجودة | Quality Confirmation" 
                  : "Quality Confirmation | تأكيد الجودة"}
              </div>
              
              <div class="flex gap-1 text-xs mb-1 px-1">
                <div class="border rounded p-0.5 flex-1">
                  <div class="font-bold mb-0.5 text-center border-b pb-0.5">
                    ${isRtl ? "توقيع الفني" : "Technician Signature"}
                  </div>
                  <div class="h-6"></div>
                </div>
                
                <div class="border rounded p-0.5 flex-1">
                  <div class="font-bold mb-0.5 text-center border-b pb-0.5">
                    ${isRtl ? "توقيع المدير" : "Manager Signature"}
                  </div>
                  <div class="h-6"></div>
                </div>
              </div>
            </div>

            <div class="mb-2">
              <div class="text-center bg-black text-white py-0.5 mb-1 font-bold text-base">
                ${isRtl 
                  ? "ملاحظات | Notes" 
                  : "Notes | ملاحظات"}
              </div>
              
              <div class="border rounded p-1 min-h-16">
                
              </div>
            </div>

            <div class="text-center border-t pt-1 text-xs">
              <p class="font-bold text-sm mb-0">
                ${isRtl ? "شكراً لاختياركم نظارات المعين" : "Thank you for choosing Moein Optical"}
              </p>
              <p class="text-[9px] mt-0.5">
                ${isRtl ? "هذا الإيصال يعتبر إثبات للطلب فقط وليس إيصال دفع" : 
                        "This receipt is proof of order only and not a payment receipt"}
              </p>
            </div>
          </div>
        `;
      };
      
      // Set the content directly in the print window
      const contentContainer = printWindow.document.getElementById('custom-work-order-content');
      if (contentContainer) {
        contentContainer.innerHTML = getWorkOrderContent();
        
        // Wait for content to load, then print
        setTimeout(() => {
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          
          // Close the window after printing (optional)
          // printWindow.close();
        }, 500);
      } else {
        printWindow.document.write("<p>Unable to find work order content. Please try again.</p>");
        printWindow.document.close();
      }
    } catch (error) {
      console.error("Error printing work order:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the work order.",
        variant: "destructive",
      });
    }
  }
}
