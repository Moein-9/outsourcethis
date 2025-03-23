
import React from "react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/store/languageStore";
import { WorkOrder, Invoice } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Receipt, 
  AlertCircle, 
  FileText, 
  Eye, 
  Printer, 
  Edit,
  Check,
  Clock
} from "lucide-react";

interface PatientTransactionsProps {
  workOrders: WorkOrder[];
  invoices: Invoice[];
  onEditWorkOrder: (workOrder: WorkOrder) => void;
  onMarkAsPickedUp: (workOrder: WorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  workOrders,
  invoices,
  onEditWorkOrder,
  onMarkAsPickedUp
}) => {
  const { language, t } = useLanguageStore();
  const [activeTab, setActiveTab] = React.useState<"active" | "completed">("active");
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return language === 'ar' ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "hh:mm a", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return "";
    }
  };
  
  const getActiveWorkOrders = (workOrders: WorkOrder[]) => {
    return workOrders.filter(wo => !wo.status || wo.status !== 'completed');
  };
  
  const getCompletedWorkOrders = (workOrders: WorkOrder[]) => {
    return workOrders.filter(wo => wo.status === 'completed');
  };
  
  return (
    <Card className="border-amber-200 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
          <Receipt className="h-5 w-5" />
          {language === 'ar' ? "سجل المعاملات" : "Transaction History"}
        </CardTitle>
        <CardDescription>
          {language === 'ar' ? "أوامر العمل والفواتير الخاصة بالعميل" : "Work orders and invoices for the client"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="active" 
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "active" | "completed")}
          className="w-full"
        >
          <TabsList className="w-full mb-4 grid grid-cols-2 bg-amber-100/50">
            <TabsTrigger value="active" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              {language === 'ar' ? "أوامر عمل نشطة" : "Active Work Orders"}
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              {language === 'ar' ? "المعاملات المكتملة" : "Completed Transactions"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0 space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2 flex items-center gap-1.5 text-amber-700">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                {language === 'ar' ? "أوامر العمل قيد التنفيذ" : "Work Orders in Progress"}
              </h3>
              
              {getActiveWorkOrders(workOrders).length > 0 ? (
                <div className="rounded-md border overflow-hidden shadow-sm overflow-x-visible">
                  <Table>
                    <TableHeader className="bg-amber-50">
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                        <TableHead>{language === 'ar' ? "رقم الفاتورة" : "Invoice No."}</TableHead>
                        <TableHead>{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                        <TableHead>{language === 'ar' ? "تاريخ الطلب" : "Order Date"}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getActiveWorkOrders(workOrders).map((workOrder, index) => {
                        const invoice = invoices.find(inv => inv.workOrderId === workOrder.id);
                        const status = !invoice ? (language === 'ar' ? "قيد التنفيذ" : "In Progress") : 
                          invoice.isPaid ? (language === 'ar' ? "مدفوعة" : "Paid") : 
                          invoice.deposit > 0 ? (language === 'ar' ? "مدفوعة جزئيًا" : "Partially Paid") : 
                          (language === 'ar' ? "غير مدفوعة" : "Unpaid");
                        
                        const statusColor = !invoice ? "bg-amber-500" : 
                          invoice.isPaid ? "bg-green-500" : 
                          invoice.deposit > 0 ? "bg-amber-500" : "bg-red-500";
                        
                        return (
                          <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-amber-50/30' : ''}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>WO-{workOrder.id.substring(0, 8)}</TableCell>
                            <TableCell>{invoice ? `INV-${invoice.invoiceId.substring(0, 8)}` : '-'}</TableCell>
                            <TableCell>{workOrder.lensType?.name || '-'}</TableCell>
                            <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                            <TableCell>
                              <Badge className={statusColor}>{status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-amber-200 hover:bg-amber-50"
                                  onClick={() => onEditWorkOrder(workOrder)}
                                >
                                  <Edit className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
                                  {t('edit')}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-200 hover:bg-green-50"
                                  onClick={() => onMarkAsPickedUp(workOrder)}
                                >
                                  <Check className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-600`} />
                                  {language === 'ar' ? "تم الاستلام" : "Picked Up"}
                                </Button>
                                <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
                                  <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
                                  {t('print')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md bg-amber-50/20">
                  <FileText className="h-10 w-10 mx-auto text-amber-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1 text-amber-700">
                    {language === 'ar' ? "لا توجد أوامر عمل نشطة" : "No Active Work Orders"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {language === 'ar' 
                      ? "لا يوجد أوامر عمل نشطة لهذا العميل حالياً."
                      : "There are no active work orders for this client at the moment."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0 space-y-8">
            <div>
              <h3 className="text-md font-medium mb-2 flex items-center gap-1.5 text-green-700">
                <AlertCircle className="h-4 w-4 text-green-500" />
                {language === 'ar' ? "الفواتير المكتملة" : "Completed Invoices"}
              </h3>
              
              {invoices.filter(inv => inv.isPaid).length > 0 ? (
                <div className="rounded-md border overflow-hidden shadow-sm overflow-x-visible">
                  <Table>
                    <TableHeader className="bg-green-50">
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>{language === 'ar' ? "رقم الفاتورة" : "Invoice No."}</TableHead>
                        <TableHead>{language === 'ar' ? "المبلغ" : "Amount"}</TableHead>
                        <TableHead>{language === 'ar' ? "تاريخ الفاتورة" : "Invoice Date"}</TableHead>
                        <TableHead>{t('status')}</TableHead>
                        <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.filter(inv => inv.isPaid).map((invoice, index) => (
                        <TableRow key={invoice.invoiceId} className={index % 2 === 0 ? 'bg-green-50/30' : ''}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>INV-{invoice.invoiceId.substring(0, 8)}</TableCell>
                          <TableCell>{invoice.total.toFixed(3)} {t('kwd')}</TableCell>
                          <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">
                              {language === 'ar' ? "مدفوعة" : "Paid"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                                <Eye className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-600`} />
                                {t('view')}
                              </Button>
                              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                                <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-600`} />
                                {t('print')}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md bg-green-50/20">
                  <FileText className="h-10 w-10 mx-auto text-green-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1 text-green-700">
                    {language === 'ar' ? "لا توجد فواتير مكتملة" : "No Completed Invoices"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {language === 'ar' 
                      ? "لا يوجد فواتير مكتملة لهذا العميل حالياً."
                      : "There are no completed invoices for this client at the moment."}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2 flex items-center gap-1.5 text-blue-700">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                {language === 'ar' ? "أوامر العمل المكتملة" : "Completed Work Orders"}
              </h3>
              
              {getCompletedWorkOrders(workOrders).length > 0 ? (
                <div className="rounded-md border overflow-hidden shadow-sm overflow-x-visible">
                  <Table>
                    <TableHeader className="bg-blue-50">
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                        <TableHead>{language === 'ar' ? "رقم الفاتورة" : "Invoice No."}</TableHead>
                        <TableHead>{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                        <TableHead>{language === 'ar' ? "تاريخ الطلب" : "Order Date"}</TableHead>
                        <TableHead>{language === 'ar' ? "وقت الاستلام" : "Pickup Time"}</TableHead>
                        <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCompletedWorkOrders(workOrders).map((workOrder, index) => {
                        const invoice = invoices.find(inv => inv.workOrderId === workOrder.id);
                        return (
                          <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-blue-50/30' : ''}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>WO-{workOrder.id.substring(0, 8)}</TableCell>
                            <TableCell>{invoice ? `INV-${invoice.invoiceId.substring(0, 8)}` : '-'}</TableCell>
                            <TableCell>{workOrder.lensType?.name || '-'}</TableCell>
                            <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                                {formatTime(workOrder.pickedUpAt)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                  <Eye className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-blue-600`} />
                                  {t('view')}
                                </Button>
                                <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                  <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-blue-600`} />
                                  {t('print')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 border rounded-md bg-blue-50/20">
                  <FileText className="h-10 w-10 mx-auto text-blue-300 mb-3" />
                  <h3 className="text-lg font-medium mb-1 text-blue-700">
                    {language === 'ar' ? "لا توجد أوامر عمل مكتملة" : "No Completed Work Orders"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {language === 'ar' 
                      ? "لا يوجد أوامر عمل مكتملة لهذا العميل حالياً."
                      : "There are no completed work orders for this client at the moment."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
