import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder, useInvoiceStore } from "@/store/invoiceStore";
import { Patient } from "@/store/patientStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format, isValid, formatDistanceToNow } from "date-fns";
import {
  PencilLine,
  Receipt,
  Clock,
  CheckCircle,
  RefreshCcw,
  AlertTriangle,
  ShoppingBag,
  CheckCheck,
  Ban,
  User,
  Phone,
  Calendar,
  History,
  Archive,
  Trash2,
} from "lucide-react";
import { PrintOptionsDialog } from "./PrintOptionsDialog";
import { CustomPrintService } from "@/utils/CustomPrintService";
import { toast } from "sonner";
import { PrintReportButton } from "./reports/PrintReportButton";
import { RefundReceiptTemplate } from "./RefundReceiptTemplate";
import * as ReactDOMServer from "react-dom/server";
import { PrintService } from "@/utils/PrintService";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { DeleteOrderConfirmDialog } from "./DeleteOrderConfirmDialog";

interface TabbedTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  refundedInvoices: Invoice[];
  archivedInvoices: Invoice[];
  archivedWorkOrders: WorkOrder[];
  patient?: Patient;
  onDeleteWorkOrder?: (workOrder: WorkOrder) => void;
  lastEditTimestamp?: string | null;
}

export const TabbedTransactions: React.FC<TabbedTransactionsProps> = ({
  invoices,
  workOrders,
  refundedInvoices,
  archivedInvoices,
  archivedWorkOrders,
  patient,
  onDeleteWorkOrder,
  lastEditTimestamp,
}) => {
  const { language, t } = useLanguageStore();
  const { markAsPickedUp } = useInvoiceStore();
  const [activeTab, setActiveTab] = useState("active");
  const [pickedUpInvoices, setPickedUpInvoices] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sort invoices by date, newest first
  const sortedInvoices = [...invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filter active (not picked up and not refunded)
  const activeInvoices = sortedInvoices
    .filter((invoice) => !invoice.isPickedUp && !invoice.isRefunded)
    .filter((invoice) => !pickedUpInvoices.includes(invoice.invoiceId)); // Also exclude locally picked up invoices

  // Filter completed (picked up and not refunded)
  const completedInvoices = [
    ...sortedInvoices.filter(
      (invoice) => invoice.isPickedUp && !invoice.isRefunded
    ),
    // Also include locally picked up invoices that haven't synced from the store yet
    ...sortedInvoices.filter((invoice) =>
      pickedUpInvoices.includes(invoice.invoiceId)
    ),
  ];

  // Remove duplicates from completedInvoices (in case an invoice is in both lists)
  const uniqueCompletedInvoices = completedInvoices.filter(
    (invoice, index, self) =>
      index === self.findIndex((i) => i.invoiceId === invoice.invoiceId)
  );

  // Sort archived items by date, newest first
  const sortedArchivedInvoices = [...archivedInvoices].sort(
    (a, b) =>
      new Date(b.archivedAt || b.createdAt).getTime() -
      new Date(a.archivedAt || a.createdAt).getTime()
  );

  const sortedArchivedWorkOrders = [...archivedWorkOrders].sort(
    (a, b) =>
      new Date(b.archivedAt || b.createdAt).getTime() -
      new Date(a.archivedAt || a.createdAt).getTime()
  );

  // Effect to force refresh on lastEditTimestamp change or when archived items change
  useEffect(() => {
    if (lastEditTimestamp) {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [lastEditTimestamp]);

  // Effect to auto-switch to archive tab when a new item is archived
  useEffect(() => {
    if (archivedInvoices.length > 0 || archivedWorkOrders.length > 0) {
      // Only switch if the most recent item was archived in the last 5 seconds
      const latestArchivedItem = [
        ...archivedInvoices,
        ...archivedWorkOrders,
      ].sort(
        (a, b) =>
          new Date(b.archivedAt || "").getTime() -
          new Date(a.archivedAt || "").getTime()
      )[0];

      if (latestArchivedItem && latestArchivedItem.archivedAt) {
        const archivedTime = new Date(latestArchivedItem.archivedAt).getTime();
        const now = new Date().getTime();
        const timeDiff = now - archivedTime;

        // If archived in the last 5 seconds, switch to archive tab
        if (timeDiff < 5000) {
          setActiveTab("archived");
        }
      }
    }
  }, [archivedInvoices, archivedWorkOrders]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return "";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  const handlePrintWorkOrder = (workOrder: any, invoice?: any) => {
    try {
      CustomPrintService.printWorkOrder(workOrder, invoice, patient);
      toast.success(
        language === "ar"
          ? "تم إرسال أمر العمل للطباعة"
          : "Work order sent to printer"
      );
    } catch (error) {
      console.error("Error printing work order:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء الطباعة"
          : "Error printing work order"
      );
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    try {
      // Directly call the CustomPrintService to print invoice
      CustomPrintService.printInvoice(invoice);
      toast.success(
        language === "ar"
          ? "تم إرسال الفاتورة للطباعة"
          : "Invoice sent to printer"
      );
    } catch (error) {
      console.error("Error printing invoice:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء طباعة الفاتورة"
          : "Error printing invoice"
      );
    }
  };

  const handlePrintRefundReceipt = (invoice: any) => {
    try {
      // Create the refund info object from the invoice data
      const refundInfo = {
        refundId: invoice.refundId || "N/A",
        invoiceId: invoice.invoiceId,
        patientName: invoice.patientName,
        patientPhone: invoice.patientPhone,
        patientId: invoice.patientId,
        refundAmount: invoice.refundAmount || 0,
        refundMethod: invoice.refundMethod || "N/A",
        refundReason: invoice.refundReason || "N/A",
        refundDate: invoice.refundDate || new Date().toISOString(),
        originalTotal: invoice.total,
        frameBrand: invoice.frameBrand,
        frameModel: invoice.frameModel,
        frameColor: invoice.frameColor,
        lensType: invoice.lensType,
        invoiceItems: [
          ...(invoice.frameBrand
            ? [
                {
                  name: invoice.frameBrand + " " + invoice.frameModel,
                  price: invoice.framePrice,
                  quantity: 1,
                },
              ]
            : []),
          ...(invoice.lensType
            ? [
                {
                  name: invoice.lensType,
                  price: invoice.lensPrice,
                  quantity: 1,
                },
              ]
            : []),
          ...(invoice.coating
            ? [
                {
                  name: invoice.coating,
                  price: invoice.coatingPrice,
                  quantity: 1,
                },
              ]
            : []),
          ...(invoice.contactLensItems
            ? invoice.contactLensItems.map((item: any) => ({
                name: `${item.brand} ${item.type} ${item.color || ""}`.trim(),
                price: item.price,
                quantity: item.qty || 1,
              }))
            : []),
        ],
        staffNotes: invoice.refundNotes || "",
      };

      const receiptElement = (
        <RefundReceiptTemplate refund={refundInfo} language={language} />
      );

      const receiptHtml = ReactDOMServer.renderToString(receiptElement);

      PrintService.printHtml(
        PrintService.prepareReceiptDocument(
          receiptHtml,
          language === "ar"
            ? `إيصال استرداد - ${refundInfo.refundId}`
            : `Refund Receipt - ${refundInfo.refundId}`
        ),
        "receipt",
        () => {
          toast.success(
            language === "ar"
              ? "تم إرسال الإيصال للطباعة"
              : "Receipt sent to printer"
          );
        }
      );
    } catch (error) {
      console.error("Error printing refund receipt:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء طباعة إيصال الاسترداد"
          : "Error printing refund receipt"
      );
    }
  };

  const handleMarkAsPickedUp = (id: string, isInvoice: boolean = true) => {
    // Add to local state immediately to update UI
    setPickedUpInvoices((prev) => [...prev, id]);

    // Show success toast
    toast.success(
      language === "ar"
        ? "تم تسليم الطلب بنجاح"
        : "Order has been marked as picked up"
    );

    // Switch to completed tab after a short delay
    setTimeout(() => {
      setActiveTab("completed");
    }, 300);

    // Call the store method to persist the change
    markAsPickedUp(id, isInvoice);

    // Force a re-render after a delay to reflect changes
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 500);
  };

  const renderActiveTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-blue-50/30 rounded-lg my-2">
          <ShoppingBag className="h-12 w-12 mx-auto text-blue-300 mb-2" />
          <p className="font-medium">
            {language === "ar"
              ? "لا توجد معاملات نشطة"
              : "No active transactions"}
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y border border-blue-200 rounded-lg overflow-hidden bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
        {transactions.map((invoice) => {
          const hasBeenEdited = invoice.lastEditedAt !== undefined;
          const editTimeAgo = invoice.lastEditedAt
            ? getTimeAgo(invoice.lastEditedAt)
            : "";
          const relatedWorkOrder = workOrders.find(
            (wo) => wo.id === invoice.workOrderId
          );

          return (
            <div
              key={invoice.invoiceId}
              className="p-4 hover:bg-blue-50/60 transition-all animate-fade-in"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-900 text-lg">
                      {invoice.invoiceId}
                    </span>

                    {/* Payment Status */}
                    {invoice.isPaid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 ml-2"
                      >
                        {language === "ar" ? "مدفوع" : "Paid"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 ml-2"
                      >
                        {language === "ar" ? "غير مدفوع" : "Unpaid"}
                      </Badge>
                    )}

                    {/* Pickup Status */}
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200 ml-2 flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {language === "ar" ? "جاري التجهيز" : "Processing"}
                    </Badge>

                    {/* Edit Status - New */}
                    {hasBeenEdited && (
                      <Badge
                        variant="outline"
                        className="bg-violet-50 text-violet-700 border-violet-200 ml-2 flex items-center gap-1"
                      >
                        <History className="h-3 w-3" />
                        {language === "ar" ? "تم التعديل" : "Edited"}
                      </Badge>
                    )}
                  </div>

                  {/* Edit timestamp info - New */}
                  {hasBeenEdited && editTimeAgo && (
                    <div className="text-xs text-violet-600 flex items-center gap-1 mt-0.5 mb-1">
                      <History className="h-3 w-3" />
                      {language === "ar"
                        ? `تم التعديل ${editTimeAgo}`
                        : `Edited ${editTimeAgo}`}
                    </div>
                  )}

                  {/* Customer Info Card */}
                  <Card className="bg-blue-50/80 border-blue-200 max-w-xs">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {language === "ar" ? "معلومات العميل" : "Customer Info"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 space-y-1">
                      <div className="text-sm font-medium">
                        {invoice.patientName || t("anonymous")}
                      </div>
                      {invoice.patientPhone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {invoice.patientPhone}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.createdAt)}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-sm mt-1 font-medium text-indigo-700">
                    {invoice.invoiceType === "glasses" ? (
                      <span>
                        {invoice.frameBrand} {invoice.frameModel} -{" "}
                        {invoice.lensType || ""}
                      </span>
                    ) : (
                      <span>
                        {language === "ar" ? "عدسات لاصقة" : "Contact Lenses"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-indigo-900 text-xl">
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  {invoice.remaining > 0 && (
                    <div className="text-amber-600 font-medium text-sm mt-1">
                      {language === "ar" ? "المتبقي:" : "Remaining:"}{" "}
                      {invoice.remaining.toFixed(3)} KWD
                    </div>
                  )}
                  <div className="flex space-x-2 mt-3 justify-end">
                    {invoice.workOrderId &&
                      onDeleteWorkOrder &&
                      relatedWorkOrder && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
                          onClick={() => {
                            if (onDeleteWorkOrder) {
                              onDeleteWorkOrder(relatedWorkOrder);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          {language === "ar" ? "حذف الطلب" : "Delete Order"}
                        </Button>
                      )}

                    <PrintOptionsDialog
                      workOrder={invoice}
                      invoice={invoice}
                      patient={patient}
                      onPrintWorkOrder={() => handlePrintWorkOrder(invoice)}
                      onPrintInvoice={() => handlePrintInvoice(invoice)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 text-xs bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:text-cyan-800 hover:border-cyan-300"
                      >
                        <Receipt className="h-3.5 w-3.5 mr-1" />
                        {language === "ar" ? "طباعة" : "Print"}
                      </Button>
                    </PrintOptionsDialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300"
                      onClick={() =>
                        handleMarkAsPickedUp(invoice.invoiceId, true)
                      }
                    >
                      <CheckCheck className="h-3.5 w-3.5 mr-1" />
                      {language === "ar" ? "تم الاستلام" : "Mark as Picked Up"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCompletedTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-green-50/30 rounded-lg my-2">
          <CheckCheck className="h-12 w-12 mx-auto text-green-300 mb-2" />
          <p className="font-medium">
            {language === "ar"
              ? "لا توجد معاملات مكتملة"
              : "No completed transactions"}
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y border border-green-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50/30 to-emerald-50/30">
        {transactions.map((invoice) => {
          const hasBeenEdited = invoice.lastEditedAt !== undefined;

          return (
            <div
              key={invoice.invoiceId}
              className="p-4 hover:bg-green-50/60 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800 text-lg">
                      {invoice.invoiceId}
                    </span>

                    {/* Payment Status */}
                    {invoice.isPaid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 ml-2"
                      >
                        {language === "ar" ? "مدفوع" : "Paid"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 ml-2"
                      >
                        {language === "ar" ? "غير مدفوع" : "Unpaid"}
                      </Badge>
                    )}

                    {/* Pickup Status */}
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 ml-2 flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {language === "ar" ? "تم الاستلام" : "Picked up"}
                    </Badge>

                    {/* Edit Status - New */}
                    {hasBeenEdited && (
                      <Badge
                        variant="outline"
                        className="bg-violet-50 text-violet-700 border-violet-200 ml-2 flex items-center gap-1"
                      >
                        <History className="h-3 w-3" />
                        {language === "ar" ? "تم التعديل" : "Edited"}
                      </Badge>
                    )}
                  </div>

                  {/* Edit timestamp info - New */}
                  {hasBeenEdited && (
                    <div className="text-xs text-violet-600 flex items-center gap-1 mt-0.5 mb-1">
                      <History className="h-3 w-3" />
                      {language === "ar"
                        ? `تم التعديل ${getTimeAgo(invoice.lastEditedAt)}`
                        : `Edited ${getTimeAgo(invoice.lastEditedAt)}`}
                    </div>
                  )}

                  {/* Customer Info Card */}
                  <Card className="bg-green-50/80 border-green-200 max-w-xs">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {language === "ar" ? "معلومات العميل" : "Customer Info"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 space-y-1">
                      <div className="text-sm font-medium">
                        {invoice.patientName || t("anonymous")}
                      </div>
                      {invoice.patientPhone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {invoice.patientPhone}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.createdAt)}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-sm mt-1 font-medium text-green-700">
                    {invoice.invoiceType === "glasses" ? (
                      <span>
                        {invoice.frameBrand} {invoice.frameModel} -{" "}
                        {invoice.lensType || ""}
                      </span>
                    ) : (
                      <span>
                        {language === "ar" ? "عدسات لاصقة" : "Contact Lenses"}
                      </span>
                    )}
                  </div>

                  {invoice.pickedUpAt && (
                    <div className="text-xs mt-1.5 text-green-600 bg-green-50 rounded-md inline-block px-2 py-0.5">
                      {language === "ar"
                        ? "تم الاستلام بتاريخ:"
                        : "Picked up on:"}{" "}
                      {formatDate(invoice.pickedUpAt)}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="font-semibold text-green-800 text-xl">
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  {invoice.remaining > 0 && (
                    <div className="text-amber-600 font-medium text-sm mt-1">
                      {language === "ar" ? "المتبقي:" : "Remaining:"}{" "}
                      {invoice.remaining.toFixed(3)} KWD
                    </div>
                  )}
                  <div className="mt-3">
                    <PrintOptionsDialog
                      workOrder={invoice}
                      invoice={invoice}
                      patient={patient}
                      onPrintWorkOrder={() => handlePrintWorkOrder(invoice)}
                      onPrintInvoice={() => handlePrintInvoice(invoice)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-300"
                      >
                        <Receipt className="h-3.5 w-3.5 mr-1" />
                        {language === "ar" ? "طباعة" : "Print"}
                      </Button>
                    </PrintOptionsDialog>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRefundedTable = (transactions: Invoice[]) => {
    if (transactions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-red-50/30 rounded-lg my-2">
          <RefreshCcw className="h-12 w-12 mx-auto text-red-300 mb-2" />
          <p className="font-medium">
            {language === "ar"
              ? "لا توجد معاملات مستردة"
              : "No refunded transactions"}
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y border border-red-200 rounded-lg overflow-hidden bg-gradient-to-r from-red-50/20 to-pink-50/20">
        {transactions.map((invoice) => {
          const hasBeenEdited = invoice.lastEditedAt !== undefined;

          return (
            <div
              key={invoice.invoiceId}
              className="p-4 hover:bg-red-50/40 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-800 text-lg">
                      {invoice.invoiceId}
                    </span>

                    {/* Payment Status */}
                    {invoice.isPaid ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 ml-2"
                      >
                        {language === "ar" ? "مدفوع" : "Paid"}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 ml-2"
                      >
                        {language === "ar" ? "غير مدفوع" : "Unpaid"}
                      </Badge>
                    )}

                    {/* Refund Status */}
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200 ml-2 flex items-center gap-1"
                    >
                      <RefreshCcw className="h-3 w-3" />
                      {language === "ar" ? "مسترد" : "Refunded"}
                    </Badge>

                    {/* Edit Status - New */}
                    {hasBeenEdited && (
                      <Badge
                        variant="outline"
                        className="bg-violet-50 text-violet-700 border-violet-200 ml-2 flex items-center gap-1"
                      >
                        <History className="h-3 w-3" />
                        {language === "ar" ? "تم التعديل" : "Edited"}
                      </Badge>
                    )}
                  </div>

                  {/* Refund Date */}
                  {invoice.refundDate && (
                    <div className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {language === "ar"
                        ? "تاريخ الاسترداد:"
                        : "Refund date:"}{" "}
                      {formatDate(invoice.refundDate)}
                    </div>
                  )}

                  {/* Customer Info Card */}
                  <Card className="bg-red-50/60 border-red-200 max-w-xs">
                    <CardHeader className="pb-2 pt-3">
                      <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {language === "ar" ? "معلومات العميل" : "Customer Info"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-0 space-y-1">
                      <div className="text-sm font-medium">
                        {invoice.patientName || t("anonymous")}
                      </div>
                      {invoice.patientPhone && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {invoice.patientPhone}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(invoice.createdAt)}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-sm mt-1 font-medium text-red-700">
                    {invoice.invoiceType === "glasses" ? (
                      <span>
                        {invoice.frameBrand} {invoice.frameModel} -{" "}
                        {invoice.lensType || ""}
                      </span>
                    ) : (
                      <span>
                        {language === "ar" ? "عدسات لاصقة" : "Contact Lenses"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-red-800 text-xl">
                    {invoice.total.toFixed(3)} KWD
                  </div>
                  {invoice.refundAmount && (
                    <div className="text-red-600 font-medium text-sm mt-1">
                      {language === "ar"
                        ? "المبلغ المسترد:"
                        : "Refunded amount:"}{" "}
                      {invoice.refundAmount.toFixed(3)} KWD
                    </div>
                  )}
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
                      onClick={() => handlePrintRefundReceipt(invoice)}
                    >
                      <Receipt className="h-3.5 w-3.5 mr-1" />
                      {language === "ar" ? "طباعة الاسترداد" : "Print Refund"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderArchivedTable = (
    invoices: Invoice[],
    workOrders: WorkOrder[]
  ) => {
    if (invoices.length === 0 && workOrders.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-gray-50/30 rounded-lg my-2">
          <Archive className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="font-medium">
            {language === "ar" ? "لا توجد عناصر مؤرشفة" : "No archived items"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {invoices.length > 0 && (
          <div className="divide-y border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-gray-50/30 to-slate-50/30">
            {invoices.map((invoice) => (
              <div
                key={invoice.invoiceId}
                className="p-4 hover:bg-gray-50/60 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Receipt className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-800 text-lg">
                        {invoice.invoiceId}
                      </span>

                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200 ml-2 flex items-center gap-1"
                      >
                        <Archive className="h-3 w-3" />
                        {language === "ar" ? "مؤرشف" : "Archived"}
                      </Badge>

                      {invoice.isRefunded && (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 ml-2 flex items-center gap-1"
                        >
                          <RefreshCcw className="h-3 w-3" />
                          {language === "ar" ? "مسترد" : "Refunded"}
                        </Badge>
                      )}
                    </div>

                    {invoice.archivedAt && (
                      <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {language === "ar"
                          ? "تاريخ الأرشفة:"
                          : "Archived date:"}{" "}
                        {formatDate(invoice.archivedAt)}
                      </div>
                    )}

                    {invoice.archiveReason && (
                      <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-1 rounded">
                        {language === "ar" ? "سبب الأرشفة:" : "Archive reason:"}{" "}
                        {invoice.archiveReason}
                      </div>
                    )}

                    <Card className="bg-gray-50/80 border-gray-200 max-w-xs">
                      <CardHeader className="pb-2 pt-3">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {language === "ar"
                            ? "معلومات العميل"
                            : "Customer Info"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3 pt-0 space-y-1">
                        <div className="text-sm font-medium">
                          {invoice.patientName || t("anonymous")}
                        </div>
                        {invoice.patientPhone && (
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {invoice.patientPhone}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(invoice.createdAt)}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="text-sm mt-1 font-medium text-gray-700">
                      {invoice.invoiceType === "glasses" ? (
                        <span>
                          {invoice.frameBrand} {invoice.frameModel} -{" "}
                          {invoice.lensType || ""}
                        </span>
                      ) : (
                        <span>
                          {language === "ar" ? "عدسات لاصقة" : "Contact Lenses"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-800 text-xl">
                      {invoice.total.toFixed(3)} KWD
                    </div>
                    {invoice.isRefunded && invoice.refundAmount && (
                      <div className="text-red-600 font-medium text-sm mt-1">
                        {language === "ar" ? "المسترد:" : "Refunded:"}{" "}
                        {invoice.refundAmount.toFixed(3)} KWD
                      </div>
                    )}
                    <div className="mt-3">
                      {invoice.isRefunded && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800 hover:border-red-300"
                          onClick={() => handlePrintRefundReceipt(invoice)}
                        >
                          <Receipt className="h-3.5 w-3.5 mr-1" />
                          {language === "ar"
                            ? "طباعة إيصال الاسترداد"
                            : "Print Refund Receipt"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {workOrders.length > 0 && (
          <div className="divide-y border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-gray-50/30 to-slate-50/30 mt-4">
            {workOrders.map((workOrder) => (
              <div
                key={workOrder.id}
                className="p-4 hover:bg-gray-50/60 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-gray-800 text-lg">
                        {workOrder.id}
                      </span>

                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200 ml-2 flex items-center gap-1"
                      >
                        <Archive className="h-3 w-3" />
                        {language === "ar" ? "مؤرشف" : "Archived"}
                      </Badge>

                      {workOrder.isRefunded && (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 ml-2 flex items-center gap-1"
                        >
                          <RefreshCcw className="h-3 w-3" />
                          {language === "ar" ? "مسترد" : "Refunded"}
                        </Badge>
                      )}
                    </div>

                    {workOrder.archivedAt && (
                      <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {language === "ar"
                          ? "تاريخ الأرشفة:"
                          : "Archived date:"}{" "}
                        {formatDate(workOrder.archivedAt)}
                      </div>
                    )}

                    {workOrder.archiveReason && (
                      <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-1 rounded">
                        {language === "ar" ? "سبب الأرشفة:" : "Archive reason:"}{" "}
                        {workOrder.archiveReason}
                      </div>
                    )}

                    <div className="text-sm mt-1 font-medium text-gray-700">
                      {workOrder.lensType?.name && (
                        <span>{workOrder.lensType.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    {workOrder.lensType?.price && (
                      <div className="font-semibold text-gray-800 text-lg">
                        {workOrder.lensType.price.toFixed(3)} KWD
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="active" className="relative">
          {language === "ar" ? "نشط" : "Active"}
          {activeInvoices.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeInvoices.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed">
          {language === "ar" ? "مكتمل" : "Completed"}
          {uniqueCompletedInvoices.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {uniqueCompletedInvoices.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="refunded">
          {language === "ar" ? "مسترد" : "Refunded"}
          {refundedInvoices.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {refundedInvoices.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="archived">
          {language === "ar" ? "أرشيف" : "Archived"}
          {(archivedInvoices.length > 0 || archivedWorkOrders.length > 0) && (
            <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {archivedInvoices.length + archivedWorkOrders.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-4">
        {renderActiveTable(activeInvoices)}
      </TabsContent>

      <TabsContent value="completed" className="mt-4">
        {renderCompletedTable(uniqueCompletedInvoices)}
      </TabsContent>

      <TabsContent value="refunded" className="mt-4">
        {renderRefundedTable(refundedInvoices)}
      </TabsContent>

      <TabsContent value="archived" className="mt-4">
        {renderArchivedTable(sortedArchivedInvoices, sortedArchivedWorkOrders)}
      </TabsContent>
    </Tabs>
  );
};
