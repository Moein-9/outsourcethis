
import React from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import { Patient } from '@/store/patientStore';
import { WorkOrder as InventoryWorkOrder } from '@/types/inventory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Edit, DollarSign, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PatientTransactionsProps {
  workOrders: InventoryWorkOrder[];
  invoices: Invoice[];
  patient: Patient;
  onEditWorkOrder: (workOrder: InventoryWorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  workOrders,
  invoices,
  patient,
  onEditWorkOrder
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return {
      date: date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', dateOptions),
      time: date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', timeOptions)
    };
  };
  
  return (
    <Card className={`mt-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-base">
          <ShoppingBag className="w-5 h-5 mr-2" />
          {language === 'ar' ? "المعاملات وأوامر العمل" : "Transactions & Work Orders"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workorders">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workorders" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {language === 'ar' ? "أوامر العمل" : "Work Orders"}
              {workOrders.length > 0 && (
                <Badge variant="secondary" className="ml-2">{workOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              {language === 'ar' ? "الفواتير" : "Invoices"}
              {invoices.length > 0 && (
                <Badge variant="secondary" className="ml-2">{invoices.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workorders" className="mt-4">
            {workOrders.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {language === 'ar' ? "لا توجد أوامر عمل" : "No work orders found"}
              </div>
            ) : (
              <div className="space-y-4">
                {workOrders.map((workOrder, index) => {
                  const formattedDate = formatDateTime(workOrder.createdAt);
                  return (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">
                            {language === 'ar' ? "رقم العمل" : "Work Order"}: {workOrder.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formattedDate.date} {formattedDate.time}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-lg">{workOrder.total.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                          <div className="flex mt-1">
                            {!workOrder.isPaid && (
                              <Badge variant="destructive" className="mr-2">
                                {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                              </Badge>
                            )}
                            {!workOrder.isPickedUp && (
                              <Badge variant="outline" className="border-amber-500 text-amber-600">
                                {language === 'ar' ? "لم يتم الاستلام" : "Not Picked Up"}
                              </Badge>
                            )}
                            {workOrder.isPaid && workOrder.isPickedUp && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                                {language === 'ar' ? "مكتمل" : "Completed"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {workOrder.frameBrand && (
                          <div>
                            <span className="text-sm font-medium">
                              {language === 'ar' ? "الإطار" : "Frame"}:
                            </span>
                            <span className="text-sm ml-1">
                              {workOrder.frameBrand} {workOrder.frameModel} ({workOrder.frameColor})
                            </span>
                          </div>
                        )}
                        
                        {workOrder.lensType && (
                          <div>
                            <span className="text-sm font-medium">
                              {language === 'ar' ? "العدسة" : "Lens"}:
                            </span>
                            <span className="text-sm ml-1">
                              {workOrder.lensType}
                            </span>
                          </div>
                        )}
                        
                        {workOrder.coating && (
                          <div>
                            <span className="text-sm font-medium">
                              {language === 'ar' ? "الطلاء" : "Coating"}:
                            </span>
                            <span className="text-sm ml-1">
                              {workOrder.coating}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => onEditWorkOrder(workOrder)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {language === 'ar' ? "تعديل" : "Edit"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-4">
            {invoices.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {language === 'ar' ? "لا توجد فواتير" : "No invoices found"}
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice, index) => {
                  const formattedDate = formatDateTime(invoice.createdAt);
                  return (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">
                            {language === 'ar' ? "رقم الفاتورة" : "Invoice"}: {invoice.invoiceId}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formattedDate.date} {formattedDate.time}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-lg">{invoice.total.toFixed(2)} {language === 'ar' ? "د.ك" : "KWD"}</span>
                          <div className="flex mt-1">
                            {!invoice.isPaid && (
                              <Badge variant="destructive">
                                {language === 'ar' ? "غير مدفوع" : "Unpaid"}
                              </Badge>
                            )}
                            {invoice.isPaid && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                                {language === 'ar' ? "مدفوع" : "Paid"}
                              </Badge>
                            )}
                            {invoice.isPickedUp && (
                              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                {language === 'ar' ? "تم الاستلام" : "Picked Up"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
