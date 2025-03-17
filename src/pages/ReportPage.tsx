
import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { DailySalesReport } from "@/components/reports/DailySalesReport";
import { ComparativeAnalysis } from "@/components/reports/ComparativeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data generator function
const generateMockData = () => {
  const mockData = [];
  const today = new Date();
  const paymentMethods = ["نقداً", "كي نت", "Visa", "MasterCard"];
  const lensTypes = ["متعددة البؤر", "أحادية البؤر", "قراءة", "بعيدة المدى"];
  const coatings = ["مضاد للانعكاس", "مضاد للماء", "مضاد للخدش", "حماية من الأشعة الزرقاء"];
  const frameBrands = ["Ray-Ban", "Gucci", "Prada", "Oakley", "Dior", "Chanel"];
  
  // Generate invoices for today
  for (let i = 0; i < 5; i++) {
    const lensPrice = Math.floor(Math.random() * 50 + 20) * 5;
    const framePrice = Math.floor(Math.random() * 80 + 40) * 5;
    const coatingPrice = Math.floor(Math.random() * 15 + 5) * 5;
    const total = lensPrice + framePrice + coatingPrice;
    const discount = Math.floor(Math.random() * 10) * 5;
    const finalTotal = total - discount;
    const deposit = Math.random() > 0.3 ? finalTotal : Math.floor(finalTotal * 0.7);
    
    mockData.push({
      patientName: `عميل ${i + 1}`,
      patientPhone: `9665${Math.floor(Math.random() * 10000000)}`,
      lensType: lensTypes[Math.floor(Math.random() * lensTypes.length)],
      lensPrice,
      coating: coatings[Math.floor(Math.random() * coatings.length)],
      coatingPrice,
      frameBrand: frameBrands[Math.floor(Math.random() * frameBrands.length)],
      frameModel: `موديل ${String.fromCharCode(65 + i)}`,
      frameColor: ["أسود", "بني", "أزرق", "ذهبي"][Math.floor(Math.random() * 4)],
      framePrice,
      discount,
      total: finalTotal,
      deposit,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
  }
  
  // Generate invoices for previous days (for comparison)
  for (let d = 1; d < 60; d++) {
    const date = new Date();
    date.setDate(today.getDate() - d);
    
    const invoiceCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < invoiceCount; i++) {
      const lensPrice = Math.floor(Math.random() * 50 + 20) * 5;
      const framePrice = Math.floor(Math.random() * 80 + 40) * 5;
      const coatingPrice = Math.floor(Math.random() * 15 + 5) * 5;
      const total = lensPrice + framePrice + coatingPrice;
      const discount = Math.floor(Math.random() * 10) * 5;
      const finalTotal = total - discount;
      const deposit = Math.random() > 0.3 ? finalTotal : Math.floor(finalTotal * 0.7);
      
      // Create invoice with past date
      const invoice = {
        patientName: `عميل ${d}${i}`,
        patientPhone: `9665${Math.floor(Math.random() * 10000000)}`,
        lensType: lensTypes[Math.floor(Math.random() * lensTypes.length)],
        lensPrice,
        coating: coatings[Math.floor(Math.random() * coatings.length)],
        coatingPrice,
        frameBrand: frameBrands[Math.floor(Math.random() * frameBrands.length)],
        frameModel: `موديل ${String.fromCharCode(65 + i)}`,
        frameColor: ["أسود", "بني", "أزرق", "ذهبي"][Math.floor(Math.random() * 4)],
        framePrice,
        discount,
        total: finalTotal,
        deposit,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      };
      
      // Manually set creation date to past date
      const id = `INV${Date.now() - d * 86400000 - i}`;
      const createdAt = date.toISOString();
      const remaining = Math.max(0, finalTotal - deposit);
      const isPaid = remaining === 0;
      
      mockData.push({
        ...invoice,
        invoiceId: id,
        createdAt,
        remaining,
        isPaid
      });
    }
  }
  
  return mockData;
};

const ReportPage: React.FC = () => {
  const invoiceStore = useInvoiceStore();
  
  const handleGenerateMockData = () => {
    // First clear existing data
    invoiceStore.clearInvoices && invoiceStore.clearInvoices();
    
    // Generate and add mock data
    const mockData = generateMockData();
    mockData.forEach(invoice => {
      if (invoice.invoiceId) {
        // Add pre-dated invoice directly
        invoiceStore.addExistingInvoice && invoiceStore.addExistingInvoice(invoice);
      } else {
        // Add today's invoice
        invoiceStore.addInvoice(invoice);
      }
    });
    
    toast.success("تم إنشاء بيانات تجريبية بنجاح");
  };
  
  const handleClearMockData = () => {
    invoiceStore.clearInvoices && invoiceStore.clearInvoices();
    toast.success("تم مسح البيانات التجريبية");
  };
  
  return (
    <Layout activeSection="reports" onNavigate={() => {}}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">تقارير النظام</h1>
        
        {/* Mock Data Controls - Remove this section when using real data */}
        <div className="flex gap-2 mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <Button 
            variant="outline" 
            className="bg-amber-100 hover:bg-amber-200 border-amber-200" 
            onClick={handleGenerateMockData}
          >
            إنشاء بيانات تجريبية
          </Button>
          <Button 
            variant="outline" 
            className="bg-red-100 hover:bg-red-200 border-red-200" 
            onClick={handleClearMockData}
          >
            مسح البيانات التجريبية
          </Button>
          <div className="flex-1 flex items-center text-amber-700 text-sm mr-2">
            ملاحظة: هذا الشريط للعرض فقط ويمكن إزالته عند استخدام بيانات حقيقية
          </div>
        </div>
        
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2 mb-4">
            <TabsTrigger value="daily">التقرير اليومي</TabsTrigger>
            <TabsTrigger value="comparative">التحليل المقارن</TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="daily" className="mt-0">
                <DailySalesReport />
              </TabsContent>

              <TabsContent value="comparative" className="mt-0">
                <ComparativeAnalysis />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportPage;
