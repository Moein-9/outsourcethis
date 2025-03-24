
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomPrintWorkOrderButton } from "./CustomPrintWorkOrderButton";

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
            <div className="font-medium text-base">WO-{workOrder.id.substring(0, 8)}</div>
            <div className="text-sm text-muted-foreground">{formatDate(workOrder.createdAt)}</div>
          </div>
          <Badge className={`${statusColor} whitespace-nowrap text-sm font-medium px-2 py-1`}>{status}</Badge>
        </div>
        
        <div className="text-base mb-2">
          {language === 'ar' ? "نوع العدسة:" : "Lens Type:"} {workOrder.lensType?.name || '-'}
        </div>
        
        <div className="flex justify-end gap-1 mt-3">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 px-3 border-amber-200 hover:bg-amber-50 font-medium"
              onClick={() => onEdit(workOrder)}
            >
              <Edit className="h-4 w-4 text-amber-600 mr-1.5" />
              <span>{t('edit')}</span>
            </Button>
          )}
          <CustomPrintWorkOrderButton
            workOrder={workOrder}
            invoice={invoice}
            variant="outline"
            size="sm"
            className="h-9 px-3 border-amber-200 hover:bg-amber-50 font-medium"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 border-amber-200 hover:bg-amber-50 font-medium"
            >
              <Printer className="h-4 w-4 text-amber-600 mr-1.5" />
              <span>{t('print')}</span>
            </Button>
          </CustomPrintWorkOrderButton>
        </div>
      </div>
    );
  }

  const InvoiceCard = ({ invoice, index }: { invoice: Invoice, index: number }) => {
    return (
      <div className={`p-3 border rounded-md mb-2 ${index % 2 === 0 ? 'bg-green-50/30' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="font-medium text-base">INV-{invoice.invoiceId.substring(0, 8)}</div>
            <div className="text-sm text-muted-foreground">{formatDate(invoice.createdAt)}</div>
          </div>
          <Badge className="bg-green-500 whitespace-nowrap text-sm font-medium px-2 py-1">
            {language === 'ar' ? "مدفوعة" : "Paid"}
          </Badge>
        </div>
        
        <div className="text-base mb-2 font-semibold">
          {invoice.total.toFixed(3)} {t('kwd')}
        </div>
        
        <div className="flex justify-end gap-1 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 border-green-200 hover:bg-green-50 font-medium"
          >
            <Eye className="h-4 w-4 text-green-600 mr-1.5" />
            <span>{t('view')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 border-green-200 hover:bg-green-50 font-medium"
          >
            <Printer className="h-4 w-4 text-green-600 mr-1.5" />
            <span>{t('print')}</span>
          </Button>
        </div>
      </div>
    );
  }

  const CompletedWorkOrderCard = ({ workOrder, index }: { workOrder: WorkOrder, index: number }) => {
    return (
      <div className={`p-3 border rounded-md mb-2 ${index % 2 === 0 ? 'bg-blue-50/30' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium text-base">WO-{workOrder.id.substring(0, 8)}</div>
          <div className="text-sm text-muted-foreground">{formatDate(workOrder.createdAt)}</div>
        </div>
        
        <div className="text-base mb-2">
          {language === 'ar' ? "نوع العدسة:" : "Lens Type:"} {workOrder.lensType?.name || '-'}
        </div>
        
        <div className="flex justify-end gap-1 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 border-blue-200 hover:bg-blue-50 font-medium"
          >
            <Eye className="h-4 w-4 text-blue-600 mr-1.5" />
            <span>{t('view')}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 border-blue-200 hover:bg-blue-50 font-medium"
          >
            <Printer className="h-4 w-4 text-blue-600 mr-1.5" />
            <span>{t('print')}</span>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="border-amber-200 shadow-md w-full overflow-hidden">
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
            <TabsTrigger value="active" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-base py-2">
              {language === 'ar' ? "أوامر عمل نشطة" : "Active Work Orders"}
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-base py-2">
              {language === 'ar' ? "المعاملات المكتملة" : "Completed Transactions"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-amber-700">
                <AlertCircle className="h-5 w-5 text-amber-500" />
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
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-amber-50 sticky top-0 z-10">
                        <TableRow className="hover:bg-amber-50/70">
                          <TableHead className="w-[50px] text-base font-semibold">#</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{t('status')}</TableHead>
                          <TableHead className="w-[140px] text-right text-base font-semibold">{t('actions')}</TableHead>
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
                            <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-amber-50/30'}>
                              <TableCell className="font-medium text-base p-3">{index + 1}</TableCell>
                              <TableCell className="p-3">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="text-base font-medium">WO-{workOrder.id.substring(0, 8)}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{workOrder.id}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="p-3">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="text-base">{workOrder.lensType?.name || '-'}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{workOrder.lensType?.name || '-'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="p-3 text-base">{formatDate(workOrder.createdAt)}</TableCell>
                              <TableCell className="p-3">
                                <Badge className={`${statusColor} text-sm font-medium px-2 py-1`}>{status}</Badge>
                              </TableCell>
                              <TableCell className="text-right p-3">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-9 px-3 border-amber-200 hover:bg-amber-50 font-medium"
                                    onClick={() => onEditWorkOrder(workOrder)}
                                  >
                                    <Edit className="h-4 w-4 text-amber-600 mr-1.5" />
                                    <span>{t('edit')}</span>
                                  </Button>
                                  <CustomPrintWorkOrderButton
                                    workOrder={workOrder}
                                    invoice={invoice}
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 border-amber-200 hover:bg-amber-50 font-medium"
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9 px-3 border-amber-200 hover:bg-amber-50 font-medium"
                                    >
                                      <Printer className="h-4 w-4 text-amber-600 mr-1.5" />
                                      <span>{t('print')}</span>
                                    </Button>
                                  </CustomPrintWorkOrderButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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
              <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-green-700">
                <AlertCircle className="h-5 w-5 text-green-500" />
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
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-green-50 sticky top-0 z-10">
                        <TableRow className="hover:bg-green-50/70">
                          <TableHead className="w-[50px] text-base font-semibold">#</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "رقم الفاتورة" : "Invoice No."}</TableHead>
                          <TableHead className="w-[100px] text-base font-semibold">{language === 'ar' ? "المبلغ" : "Amount"}</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                          <TableHead className="w-[100px] text-base font-semibold">{t('status')}</TableHead>
                          <TableHead className="w-[140px] text-right text-base font-semibold">{t('actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.filter(inv => inv.isPaid).map((invoice, index) => (
                          <TableRow key={invoice.invoiceId} className={index % 2 === 0 ? 'bg-green-50/30 hover:bg-green-50/50' : 'hover:bg-green-50/30'}>
                            <TableCell className="font-medium text-base p-3">{index + 1}</TableCell>
                            <TableCell className="p-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-base font-medium">INV-{invoice.invoiceId.substring(0, 8)}</div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{invoice.invoiceId}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="p-3 text-base">{invoice.total.toFixed(3)} {t('kwd')}</TableCell>
                            <TableCell className="p-3 text-base">{formatDate(invoice.createdAt)}</TableCell>
                            <TableCell className="p-3">
                              <Badge className="bg-green-500 text-sm font-medium px-2 py-1">
                                {language === 'ar' ? "مدفوعة" : "Paid"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right p-3">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-9 px-3 border-green-200 hover:bg-green-50 font-medium"
                                >
                                  <Eye className="h-4 w-4 text-green-600 mr-1.5" />
                                  <span>{t('view')}</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-9 px-3 border-green-200 hover:bg-green-50 font-medium"
                                >
                                  <Printer className="h-4 w-4 text-green-600 mr-1.5" />
                                  <span>{t('print')}</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
              <h3 className="text-lg font-medium mb-3 flex items-center gap-1.5 text-blue-700">
                <AlertCircle className="h-5 w-5 text-blue-500" />
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
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-blue-50 sticky top-0 z-10">
                        <TableRow className="hover:bg-blue-50/70">
                          <TableHead className="w-[50px] text-base font-semibold">#</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                          <TableHead className="w-[120px] text-base font-semibold">{language === 'ar' ? "التاريخ" : "Date"}</TableHead>
                          <TableHead className="w-[140px] text-right text-base font-semibold">{t('actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCompletedWorkOrders(workOrders).map((workOrder, index) => (
                          <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-blue-50/30 hover:bg-blue-50/50' : 'hover:bg-blue-50/30'}>
                            <TableCell className="font-medium text-base p-3">{index + 1}</TableCell>
                            <TableCell className="p-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-base font-medium">WO-{workOrder.id.substring(0, 8)}</div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{workOrder.id}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="p-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="text-base">{workOrder.lensType?.name || '-'}</div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{workOrder.lensType?.name || '-'}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="p-3 text-base">{formatDate(workOrder.createdAt)}</TableCell>
                            <TableCell className="text-right p-3">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-9 px-3 border-blue-200 hover:bg-blue-50 font-medium"
                                >
                                  <Eye className="h-4 w-4 text-blue-600 mr-1.5" />
                                  <span>{t('view')}</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-9 px-3 border-blue-200 hover:bg-blue-50 font-medium"
                                >
                                  <Printer className="h-4 w-4 text-blue-600 mr-1.5" />
                                  <span>{t('print')}</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
