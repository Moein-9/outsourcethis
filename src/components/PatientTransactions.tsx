
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
import { ScrollArea } from "./ui/scroll-area";

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
  
  const getActiveWorkOrders = () => {
    return workOrders.filter(wo => !wo.status || wo.status !== 'completed');
  };
  
  const getCompletedWorkOrders = () => {
    return workOrders.filter(wo => wo.status === 'completed');
  };
  
  const activeWorkOrders = getActiveWorkOrders();
  const completedWorkOrders = getCompletedWorkOrders();
  
  const findInvoiceForWorkOrder = (workOrderId?: string) => {
    if (!workOrderId) return null;
    return invoices.find(inv => inv.workOrderId === workOrderId);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t("transactionHistory")}</CardTitle>
        <CardDescription>{t("workOrderAndInvoiceHistory")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" onValueChange={(value) => setActiveTab(value as "active" | "completed")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              <span>{t("activeWorkOrders")}</span>
              <Badge variant="secondary" className="ml-1">
                {activeWorkOrders.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex gap-2 items-center">
              <Check className="h-4 w-4" />
              <span>{t("completedWorkOrders")}</span>
              <Badge variant="secondary" className="ml-1">
                {completedWorkOrders.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          {/* Active Work Orders */}
          <TabsContent value="active">
            {activeWorkOrders.length > 0 ? (
              <ScrollArea className="max-h-[400px]">
                <Table>
                  <TableHeader className="bg-primary/5 sticky top-0">
                    <TableRow>
                      <TableHead>{t("date")}</TableHead>
                      <TableHead>{t("details")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeWorkOrders.map((workOrder) => {
                      const relatedInvoice = findInvoiceForWorkOrder(workOrder.id);
                      return (
                        <TableRow key={workOrder.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(workOrder.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-orange-500" />
                                {t("workOrderNumber")}: {workOrder.id}
                              </div>
                              {relatedInvoice && (
                                <div className="text-sm flex items-center gap-1.5">
                                  <Receipt className="h-3.5 w-3.5 text-green-500" />
                                  {t("invoiceNumber")}: {relatedInvoice.invoiceId}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {workOrder.lensType && (
                                  <span className="inline-block mr-2">{workOrder.lensType.name}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200">
                              {t("inProgress")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-blue-200 hover:bg-blue-50 text-blue-700"
                                onClick={() => onEditWorkOrder(workOrder)}
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" />
                                {t("edit")}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 border-green-200 hover:bg-green-50 text-green-700"
                                onClick={() => onMarkAsPickedUp(workOrder)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                {t("customerPickedUp")}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                <FileText className="h-12 w-12 mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">{t("noActiveWorkOrders")}</h3>
                <p className="max-w-md mt-2">{t("allWorkOrdersCompleted")}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Completed Work Orders */}
          <TabsContent value="completed">
            {completedWorkOrders.length > 0 ? (
              <ScrollArea className="max-h-[400px]">
                <Table>
                  <TableHeader className="bg-primary/5 sticky top-0">
                    <TableRow>
                      <TableHead>{t("date")}</TableHead>
                      <TableHead>{t("details")}</TableHead>
                      <TableHead>{t("pickedUpAt")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedWorkOrders.map((workOrder) => {
                      const relatedInvoice = findInvoiceForWorkOrder(workOrder.id);
                      return (
                        <TableRow key={workOrder.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(workOrder.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-green-500" />
                                {t("workOrderNumber")}: {workOrder.id}
                              </div>
                              {relatedInvoice && (
                                <div className="text-sm flex items-center gap-1.5">
                                  <Receipt className="h-3.5 w-3.5 text-green-500" />
                                  {t("invoiceNumber")}: {relatedInvoice.invoiceId}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                {workOrder.lensType && (
                                  <span className="inline-block mr-2">{workOrder.lensType.name}</span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                              {formatDate(workOrder.pickedUpAt)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8"
                              onClick={() => onEditWorkOrder(workOrder)}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              {t("view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                <FileText className="h-12 w-12 mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">{t("noCompletedWorkOrders")}</h3>
                <p className="max-w-md mt-2">{t("noCompletedWorkOrdersDescription")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
