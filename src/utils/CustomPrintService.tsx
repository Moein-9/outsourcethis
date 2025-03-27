
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
      
      // Extract data for printing
      const orderNumber = workOrder?.id || invoice?.workOrderId || `WO${Date.now().toString().slice(-6)}`;
      const createdAt = invoice?.createdAt || workOrder?.createdAt || new Date();
      const dateFormatted = new Date(createdAt).toLocaleString('en-US', {
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      const patientName = patient?.name || invoice?.patientName || workOrder?.patientName || "N/A";
      const patientPhone = patient?.phone || invoice?.patientPhone || workOrder?.patientPhone || "";
      
      const rx = patient?.rx || workOrder?.rx || {};
      
      const frameData = {
        brand: workOrder?.frameBrand || invoice?.frameBrand || "",
        model: workOrder?.frameModel || invoice?.frameModel || "",
        color: workOrder?.frameColor || invoice?.frameColor || "",
        size: workOrder?.frameSize || invoice?.frameSize || "",
      };
      
      const lensType = workOrder?.lensType || invoice?.lensType || "";
      const lensTypeString = typeof lensType === 'object' ? lensType?.type || '' : String(lensType);
      
      const coating = workOrder?.coating || invoice?.coating || "";
      const coatingString = typeof coating === 'object' ? coating?.name || '' : String(coating);
      
      const thickness = workOrder?.thickness || invoice?.thickness || "";
      
      // Add all the required styles and content
      printWindow.document.write(`
        <html>
          <head>
            <title>Work Order - ${orderNumber}</title>
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
                  color: black !important;
                  font-family: Arial, sans-serif;
                }
                
                .print-wrapper {
                  width: 80mm !important;
                  page-break-after: always !important;
                  page-break-inside: avoid !important;
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  margin: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                
                /* Force content to be visible */
                * {
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                
                .header {
                  text-align: center;
                  padding: 8px 10px;
                  border-bottom: 1px solid #eee;
                }
                
                .section-header {
                  background-color: #f5f5f5;
                  padding: 4px 8px;
                  margin: 8px 0;
                  text-align: center;
                  font-weight: 600;
                  color: #555;
                }
                
                .content-section {
                  padding: 0 10px;
                  margin-bottom: 10px;
                }
                
                .grid-2 {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 5px;
                }
                
                table {
                  width: 100%;
                  border-collapse: collapse;
                  direction: ltr;
                }
                
                th, td {
                  border: 1px solid #ddd;
                  padding: 3px;
                  text-align: center;
                  font-size: 10px;
                }
                
                th {
                  font-weight: bold;
                }
                
                .frame-box, .notes-box {
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  padding: 5px;
                  margin-bottom: 8px;
                }
                
                .frame-title {
                  font-weight: bold;
                  margin-bottom: 4px;
                }
                
                .signature-box {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                  margin: 10px 0;
                  padding: 0 10px;
                }
                
                .signature-container {
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  padding: 5px;
                  text-align: center;
                }
                
                .signature-title {
                  font-weight: bold;
                  font-size: 10px;
                  margin-bottom: 4px;
                  text-align: center;
                }
                
                .signature-line {
                  height: 40px;
                  border-bottom: 1px solid #888;
                  margin-bottom: 4px;
                }
                
                .date-line {
                  font-size: 9px;
                  text-align: center;
                }
                
                .lens-section {
                  margin: 10px 0;
                  padding: 0 10px;
                }
                
                .lens-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 2px;
                }
                
                .text-right {
                  text-align: right;
                }
                
                .text-bold {
                  font-weight: bold;
                }
              }
            </style>
          </head>
          <body>
            <div class="print-wrapper">
              <!-- Header with Logo and Order Info -->
              <div class="header">
                <div style="font-size: 18px; font-weight: bold;">نظارات المعين</div>
                <div style="font-size: 14px; font-weight: bold; margin: 4px 0;">
                  <span>Work Order | أمر العمل</span>
                </div>
                <div style="font-size: 12px; font-weight: bold;">${orderNumber}</div>
                <div style="font-size: 11px;">${dateFormatted}</div>
                <div style="font-size: 10px; margin-top: 4px;">${window.location.hostname}</div>
                <div style="font-size: 10px;">9016 2475 الهاتف</div>
              </div>
              
              <!-- Patient Information -->
              <div class="section-header">
                patientInformation (Patient Info)
              </div>
              
              <div class="content-section">
                <div class="grid-2">
                  <div style="text-align: right; font-weight: bold;">الاسم:</div>
                  <div>${patientName}</div>
                  
                  ${patientPhone ? `
                  <div style="text-align: right; font-weight: bold;">الهاتف:</div>
                  <div>${patientPhone}</div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Product Details -->
              <div class="section-header">
                productDetails (Product Details)
              </div>
              
              <div class="content-section">
                ${frameData.brand ? `
                <div class="frame-box">
                  <div class="frame-title">Frame (الإطار)</div>
                  <div class="grid-2">
                    <div style="text-align: right; font-weight: bold;">الماركة:</div>
                    <div>${frameData.brand}</div>
                    
                    ${frameData.model ? `
                    <div style="text-align: right; font-weight: bold;">الموديل:</div>
                    <div>${frameData.model}</div>
                    ` : ''}
                    
                    ${frameData.color ? `
                    <div style="text-align: right; font-weight: bold;">اللون:</div>
                    <div>${frameData.color}</div>
                    ` : ''}
                    
                    ${frameData.size ? `
                    <div style="text-align: right; font-weight: bold;">الحجم:</div>
                    <div>${frameData.size}</div>
                    ` : ''}
                  </div>
                </div>
                ` : ''}
              </div>
              
              <!-- Prescription Details -->
              ${rx && rx.sphereOD ? `
              <div class="section-header">
                prescriptionDetails (Prescription Details)
              </div>
              
              <div class="content-section">
                <table>
                  <thead>
                    <tr>
                      <th>العين</th>
                      <th>SPH</th>
                      <th>CYL</th>
                      <th>AXIS</th>
                      <th>ADD</th>
                      <th>PD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="font-weight: bold;">OD (يمين)</td>
                      <td>${rx.sphereOD || "—"}</td>
                      <td>${rx.cylOD || "—"}</td>
                      <td>${rx.axisOD || "—"}</td>
                      <td>${rx.addOD || rx.add || "—"}</td>
                      <td>${rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold;">OS (يسار)</td>
                      <td>${rx.sphereOS || "—"}</td>
                      <td>${rx.cylOS || "—"}</td>
                      <td>${rx.axisOS || "—"}</td>
                      <td>${rx.addOS || rx.add || "—"}</td>
                      <td>${rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              ` : ''}
              
              <!-- Lens Details -->
              ${lensTypeString ? `
              <div class="lens-section">
                <div class="lens-grid">
                  <div class="text-right text-bold">العدسات</div>
                  <div class="text-bold">type:</div>
                  
                  <div class="text-right">${this.getLensTypeArabic(lensTypeString)}</div>
                  <div>${lensTypeString}</div>
                  
                  ${coatingString ? `
                  <div class="text-right text-bold">coating:</div>
                  <div>${this.getCoatingArabic(coatingString)}</div>
                  ` : ''}
                  
                  ${thickness ? `
                  <div class="text-right text-bold">thickness:</div>
                  <div>${thickness}</div>
                  ` : ''}
                </div>
              </div>
              ` : ''}
              
              <!-- Notes -->
              <div class="section-header">
                Notes (ملاحظات)
              </div>
              
              <div class="content-section">
                <div class="notes-box" style="min-height: 50px;"></div>
              </div>
              
              <!-- Signatures -->
              <div class="signature-box">
                <div class="signature-container">
                  <div class="signature-title">qualityConfirmation (QC)</div>
                  <div class="signature-line"></div>
                  <div class="date-line">Date: __/__ /____</div>
                </div>
                
                <div class="signature-container">
                  <div class="signature-title">technicianSignature (Technician)</div>
                  <div class="signature-line"></div>
                  <div class="date-line">Date: __/__ /____</div>
                </div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                // Force background colors to print properly
                document.body.style.webkitPrintColorAdjust = 'exact';
                document.body.style.printColorAdjust = 'exact';
                
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      
      // Wait for content to load before proceeding
      printWindow.document.close();
      
    } catch (error) {
      console.error("Error printing work order:", error);
      toast({
        title: "Error",
        description: "An error occurred while trying to print the work order.",
        variant: "destructive",
      });
    }
  }
  
  static getLensTypeArabic(lensType: string): string {
    const lensTypeMap: Record<string, string> = {
      "Single Vision": "نظارات للنظر",
      "Progressive": "عدسات متعددة البؤر",
      "Bifocal": "ثنائية البؤرة",
      "Reading": "نظارات للقراءة",
      "Distance": "نظارات للنظر البعيد",
      "Intermediate": "نظارات للمسافة المتوسطة",
    };
    
    return lensTypeMap[lensType] || lensType;
  }
  
  static getCoatingArabic(coating: string): string {
    const coatingMap: Record<string, string> = {
      "Anti-Reflective": "طلاء مضاد للانعكاس",
      "Blue Light Filter": "فلتر الضوء الأزرق",
      "Photochromic": "عدسات متغيرة اللون",
      "Scratch Resistant": "مقاوم للخدش",
      "UV Protection": "حماية من الأشعة فوق البنفسجية",
      "Polarized": "استقطاب",
      "Basic": "عادي",
    };
    
    return coatingMap[coating] || coating;
  }
}
