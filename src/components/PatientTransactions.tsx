
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
  Edit 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

interface PatientTransactionsProps {
  workOrders: WorkOrder[];
  invoices: Invoice[];
  onEditWorkOrder: (workOrder: WorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  workOrders,
  invoices,
  onEditWorkOrder
}) => {
  const { language, t } = useLanguageStore();
  const [activeTab, setActiveTab] = React.useState<"active" | "completed">("active");
  const isMobile = useIsMobile();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return language === 'ar' ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const getActiveWorkOrders = (workOrders: WorkOrder[]) => {
    return workOrders.filter(wo => {
      const invoice = invoices.find(inv => inv.workOrderId === wo.id);
      return !invoice || !invoice.isPaid;
    });
  };
  
  const getCompletedWorkOrders = (workOrders: WorkOrder[]) => {
    return workOrders.filter(wo => {
      const invoice = invoices.find(inv => inv.workOrderId === wo.id);
      return invoice && invoice.isPaid;
    });
  };

  // Card layout for mobile view to replace tables
  const TransactionCard = ({ workOrder, invoice, index, onEdit }: { 
    workOrder: WorkOrder, 
    invoice?: Invoice, 
    index: number,
    onEdit?: (wo: WorkOrder) => void 
  }) => {
    const status = !invoice ? (language === 'ar' ? "قيد التنفيذ" : "In Progress") : 
      invoice.isPaid ? (language === 'ar' ? "مدفوعة" : "Paid") : 
      invoice.deposit > 0 ? (language === 'ar' ? "مدفوعة جزئيًا" : "Partially Paid") : 
      (language === 'ar' ? "غير مدفوعة" : "Unpaid");
    
    const statusColor = !invoice ? "bg-amber-500" : 
      invoice.isPaid ? "bg-green-500" : 
      invoice.deposit > 0 ? "bg-amber-500" : "bg-red-500";
    
    return (
      <div className={`p-3 border rounded-md mb-2 ${index % 2 === 0 ? 'bg-amber-50/30' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="font-medium">WO-{workOrder.id.substring(0, 8)}</div>
            <div className="text-xs text-muted-foreground">{formatDate(workOrder.createdAt)}</div>
          </div>
          <Badge className={`${statusColor} whitespace-nowrap`}>{status}</Badge>
        </div>
        
        <div className="text-sm mb-2">
          {language === 'ar' ? "نوع العدسة:" : "Lens Type:"} {workOrder.lensType?.name || '-'}
        </div>
        
        <div className="flex justify-end gap-1 mt-3">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 border-amber-200 hover:bg-amber-50"
              onClick={() => onEdit(workOrder)}
            >
              <Edit className="h-3.5 w-3.5 text-amber-600" />
              <span className="ml-1">{t('edit')}</span>
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-amber-200 hover:bg-amber-50"
          >
            <Printer className="h-3.5 w-3.5 text-amber-600" />
            <span className="ml-1">{t('print')}</span>
          </Button>
        </div>
      </div>
    );
  }

  const InvoiceCard = ({ invoice, index }: { invoice: Invoice, index: number }) => {
    return (
      <div className={`p-3 border rounded-md mb-2 ${index % 2 === 0 ? 'bg-green-50/30' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="font-medium">INV-{invoice.invoiceId.substring(0, 8)}</div>
            <div className="text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</div>
          </div>
          <Badge className="bg-green-500 whitespace-nowrap">
            {language === 'ar' ? "مدفوعة" : "Paid"}
          </Badge>
        </div>
        
        <div className="text-sm mb-2 font-semibold">
          {invoice.total.toFixed(3)} {t('kwd')}
        </div>
        
        <div className="flex justify-end gap-1 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-green-200 hover:bg-green-50"
          >
            <Eye className="h-3.5 w-3.5 text-green-600" />
            <span className="ml-1">{t('view')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-green-200 hover:bg-green-50"
          >
            <Printer className="h-3.5 w-3.5 text-green-600" />
            <span className="ml-1">{t('print')}</span>
          </Button>
        </div>
      </div>
    );
  }

  const CompletedWorkOrderCard = ({ workOrder, index }: { workOrder: WorkOrder, index: number }) => {
    return (
      <div className={`p-3 border rounded-md mb-2 ${index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">WO-{workOrder.id.substring(0, 8)}</div>
          <div className="text-xs text-muted-foreground">{formatDate(workOrder.createdAt)}</div>
        </div>
        
        <div className="text-sm mb-2">
          {language === 'ar' ? "نوع العدسة:" : "Lens Type:"} {workOrder.lensType?.name || '-'}
        </div>
        
        <div className="flex justify-end gap-1 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-blue-200 hover:bg-blue-50"
          >
            <Eye className="h-3.5 w-3.5 text-blue-600" />
            <span className="ml-1">{t('view')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-blue-200 hover:bg-blue-50"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" />
            <span className="ml-1">{t('print')}</span>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="border-amber-200 shadow-md w-full">
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
          <Receipt className="h-5 w-5" />
          {language === 'ar' ? "سجل المعاملات" : "Transaction History"}
        </CardTitle>
        <CardDescription>
          {language === 'ar' ? "أوامر العمل والفواتير الخاصة بالعميل" : "Work orders and invoices for the client"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
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
                isMobile ? (
                  <div className="space-y-2">
                    {getActiveWorkOrders(workOrders).map((workOrder, index) => {
                      const invoice = invoices.find(inv => inv.workOrderId === workOrder.id);
                      return (
                        <TransactionCard 
                          key={workOrder.id} 
                          workOrder={workOrder} 
                          invoice={invoice} 
                          index={index}
                          onEdit={onEditWorkOrder}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <ScrollArea className="max-h-[350px]">
                      <Table>
                        <TableHeader className="bg-amber-50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="w-[100px]">{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                            <TableHead className="w-[100px]">{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                            <TableHead className="w-[100px]">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                            <TableHead className="w-[100px]">{t('status')}</TableHead>
                            <TableHead className="w-[120px] text-right">{t('actions')}</TableHead>
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
                                <TableCell className="truncate max-w-[100px]">WO-{workOrder.id.substring(0, 8)}</TableCell>
                                <TableCell className="truncate max-w-[100px]">{workOrder.lensType?.name || '-'}</TableCell>
                                <TableCell className="truncate max-w-[100px]">{formatDate(workOrder.createdAt)}</TableCell>
                                <TableCell>
                                  <Badge className={`${statusColor} whitespace-nowrap`}>{status}</Badge>
                                </TableCell>
                                <TableCell className="text-right p-1">
                                  <div className="flex justify-end gap-1">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      className="h-8 w-8 border-amber-200 hover:bg-amber-50"
                                      onClick={() => onEditWorkOrder(workOrder)}
                                      title={t('edit')}
                                    >
                                      <Edit className="h-3.5 w-3.5 text-amber-600" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      className="h-8 w-8 border-amber-200 hover:bg-amber-50"
                                      title={t('print')}
                                    >
                                      <Printer className="h-3.5 w-3.5 text-amber-600" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )
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
                isMobile ? (
                  <div className="space-y-2">
                    {invoices.filter(inv => inv.isPaid).map((invoice, index) => (
                      <InvoiceCard key={invoice.invoiceId} invoice={invoice} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <ScrollArea className="max-h-[300px]">
                      <Table>
                        <TableHeader className="bg-green-50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="w-[120px]">{language === 'ar' ? "رقم الفاتورة" : "Invoice No."}</TableHead>
                            <TableHead className="w-[80px]">{language === 'ar' ? "المبلغ" : "Amount"}</TableHead>
                            <TableHead className="w-[120px]">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                            <TableHead className="w-[80px]">{t('status')}</TableHead>
                            <TableHead className="w-[120px] text-right">{t('actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.filter(inv => inv.isPaid).map((invoice, index) => (
                            <TableRow key={invoice.invoiceId} className={index % 2 === 0 ? 'bg-green-50/30' : ''}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell className="truncate max-w-[120px]">INV-{invoice.invoiceId.substring(0, 8)}</TableCell>
                              <TableCell>{invoice.total.toFixed(3)} {t('kwd')}</TableCell>
                              <TableCell className="truncate max-w-[120px]">{formatDate(invoice.createdAt)}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 whitespace-nowrap">
                                  {language === 'ar' ? "مدفوعة" : "Paid"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right p-1">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 border-green-200 hover:bg-green-50"
                                    title={t('view')}
                                  >
                                    <Eye className="h-3.5 w-3.5 text-green-600" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 border-green-200 hover:bg-green-50"
                                    title={t('print')}
                                  >
                                    <Printer className="h-3.5 w-3.5 text-green-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )
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
                isMobile ? (
                  <div className="space-y-2">
                    {getCompletedWorkOrders(workOrders).map((workOrder, index) => (
                      <CompletedWorkOrderCard key={workOrder.id} workOrder={workOrder} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <ScrollArea className="max-h-[300px]">
                      <Table>
                        <TableHeader className="bg-blue-50 sticky top-0 z-10">
                          <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="w-[140px]">{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                            <TableHead className="w-[140px]">{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                            <TableHead className="w-[120px]">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                            <TableHead className="w-[120px] text-right">{t('actions')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCompletedWorkOrders(workOrders).map((workOrder, index) => (
                            <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-blue-50/30' : ''}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell className="truncate max-w-[140px]">WO-{workOrder.id.substring(0, 8)}</TableCell>
                              <TableCell className="truncate max-w-[140px]">{workOrder.lensType?.name || '-'}</TableCell>
                              <TableCell className="truncate max-w-[120px]">{formatDate(workOrder.createdAt)}</TableCell>
                              <TableCell className="text-right p-1">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 border-blue-200 hover:bg-blue-50"
                                    title={t('view')}
                                  >
                                    <Eye className="h-3.5 w-3.5 text-blue-600" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 border-blue-200 hover:bg-blue-50"
                                    title={t('print')}
                                  >
                                    <Printer className="h-3.5 w-3.5 text-blue-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )
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
