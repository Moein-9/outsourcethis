/*
 * Refund Manager Component
 *
 * This component handles the refund and exchange management process,
 * storing data directly in Supabase.
 *
 * Required Supabase Schema:
 * If these columns are missing in the 'invoices' table, run the following SQL in Supabase:
 *
 * ALTER TABLE invoices
 * ADD COLUMN IF NOT EXISTS is_refunded BOOLEAN DEFAULT false,
 * ADD COLUMN IF NOT EXISTS refund_amount NUMERIC(10,3) DEFAULT 0,
 * ADD COLUMN IF NOT EXISTS refund_date TIMESTAMP WITH TIME ZONE,
 * ADD COLUMN IF NOT EXISTS refund_method TEXT,
 * ADD COLUMN IF NOT EXISTS refund_reason TEXT,
 * ADD COLUMN IF NOT EXISTS refund_id TEXT,
 * ADD COLUMN IF NOT EXISTS staff_notes TEXT,
 * ADD COLUMN IF NOT EXISTS payments JSONB DEFAULT '[]'::jsonb;
 */

import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import {
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Receipt,
  ShoppingBag,
  RefreshCcw,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RefundReceiptTemplate } from "./RefundReceiptTemplate";
import { PrintService } from "@/utils/PrintService";
import * as ReactDOMServer from "react-dom/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isValid } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Define Invoice interface based on the Supabase structure
interface Invoice {
  id: string;
  invoice_id: string;
  work_order_id?: string;
  patient_id?: string;
  patient_name: string;
  patient_phone?: string;

  invoice_type: "glasses" | "contacts" | "exam" | "repair";

  lens_type?: string;
  lens_price?: number;
  coating?: string;
  coating_price?: number;
  coating_color?: string;
  thickness?: string;
  thickness_price?: number;

  frame_brand?: string;
  frame_model?: string;
  frame_color?: string;
  frame_size?: string;
  frame_price?: number;

  contact_lens_items?: any;
  contact_lens_rx?: any;

  service_name?: string;
  service_price?: number;

  discount: number;
  deposit: number;
  total: number;
  remaining: number;

  payment_method: string;
  auth_number?: string;
  is_paid: boolean;
  is_refunded?: boolean;
  refund_amount?: number;
  refund_date?: string;
  refund_method?: string;
  refund_reason?: string;
  refund_id?: string;
  staff_notes?: string;

  created_at: string;
  payments?: any;
}

export const RefundManager: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { getPatientById } = usePatientStore();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundMethod, setRefundMethod] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [staffNotes, setStaffNotes] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "dd/MM/yyyy") : "Invalid Date";
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال رقم الفاتورة أو اسم العميل أو رقم الهاتف"
          : "Please enter an invoice number, customer name, or phone number"
      );
      return;
    }

    setIsSearching(true);
    setErrorMessage("");

    try {
      // Search in Supabase using ilike for case-insensitive partial matching
      // @ts-ignore: We know invoices exists in Supabase but TypeScript doesn't
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .or(
          `invoice_id.ilike.%${searchTerm}%,patient_name.ilike.%${searchTerm}%,patient_phone.ilike.%${searchTerm}%`
        )
        .eq("is_refunded", false);

      if (error) {
        throw error;
      }

      // Map the data to our Invoice interface format
      const parsedResults = data.map((invoice: any) => ({
        id: invoice.id,
        invoice_id: invoice.invoice_id,
        work_order_id: invoice.work_order_id,
        patient_id: invoice.patient_id,
        patient_name: invoice.patient_name || "",
        patient_phone: invoice.patient_phone || "",

        invoice_type: invoice.invoice_type,

        lens_type: invoice.lens_type,
        lens_price: Number(invoice.lens_price) || 0,
        coating: invoice.coating,
        coating_price: Number(invoice.coating_price) || 0,
        coating_color: invoice.coating_color,
        thickness: invoice.thickness,
        thickness_price: Number(invoice.thickness_price) || 0,

        frame_brand: invoice.frame_brand,
        frame_model: invoice.frame_model,
        frame_color: invoice.frame_color,
        frame_size: invoice.frame_size,
        frame_price: Number(invoice.frame_price) || 0,

        contact_lens_items:
          typeof invoice.contact_lens_items === "string"
            ? JSON.parse(invoice.contact_lens_items)
            : invoice.contact_lens_items,
        contact_lens_rx:
          typeof invoice.contact_lens_rx === "string"
            ? JSON.parse(invoice.contact_lens_rx)
            : invoice.contact_lens_rx,

        service_name: invoice.service_name,
        service_price: Number(invoice.service_price) || 0,

        discount: Number(invoice.discount) || 0,
        deposit: Number(invoice.deposit) || 0,
        total: Number(invoice.total) || 0,
        remaining: Number(invoice.remaining) || 0,

        payment_method: invoice.payment_method || "",
        auth_number: invoice.auth_number,
        is_paid: Boolean(invoice.is_paid),
        is_refunded: Boolean(invoice.is_refunded),
        refund_amount: Number(invoice.refund_amount) || 0,
        refund_date: invoice.refund_date,
        refund_method: invoice.refund_method,
        refund_reason: invoice.refund_reason,
        refund_id: invoice.refund_id,
        staff_notes: invoice.staff_notes,

        created_at: invoice.created_at,
        payments:
          typeof invoice.payments === "string"
            ? JSON.parse(invoice.payments)
            : invoice.payments || [],
      }));

      setSearchResults(parsedResults);

      if (parsedResults.length === 0) {
        toast.error(
          language === "ar" ? "لم يتم العثور على فواتير" : "No invoices found"
        );
      }
    } catch (error: any) {
      console.error("Error searching invoices:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء البحث عن الفواتير"
          : "An error occurred while searching for invoices"
      );
      setErrorMessage(error.message || "Error searching invoices");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    // Set refund amount to the deposit (amount actually paid) instead of total
    setRefundAmount(invoice.deposit);
    setSuccess("");
    setErrorMessage("");
  };

  const handleRefundAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setRefundAmount(0);
    } else {
      setRefundAmount(value);

      if (selectedInvoice && value > selectedInvoice.deposit) {
        toast.warning(
          language === "ar"
            ? "مبلغ الاسترداد لا يمكن أن يتجاوز المبلغ المدفوع"
            : "Refund amount cannot exceed the amount paid"
        );
      }
    }
  };

  const validateRefund = () => {
    if (!selectedInvoice) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار فاتورة أولاً"
          : "Please select an invoice first"
      );
      return false;
    }

    if (refundAmount <= 0) {
      toast.error(
        language === "ar"
          ? "يجب أن يكون مبلغ الاسترداد أكبر من 0"
          : "Refund amount must be greater than 0"
      );
      return false;
    }

    // Validate against deposit (amount paid) instead of total
    if (refundAmount > selectedInvoice.deposit) {
      toast.error(
        language === "ar"
          ? "مبلغ الاسترداد لا يمكن أن يتجاوز المبلغ المدفوع"
          : "Refund amount cannot exceed the amount paid"
      );
      return false;
    }

    if (!refundMethod) {
      toast.error(
        language === "ar"
          ? "يرجى اختيار طريقة الاسترداد"
          : "Please select a refund method"
      );
      return false;
    }

    if (!refundReason.trim()) {
      toast.error(
        language === "ar"
          ? "يرجى إدخال سبب الاسترداد"
          : "Please enter a reason for the refund"
      );
      return false;
    }

    return true;
  };

  const handleProcessRefund = async () => {
    if (!validateRefund() || !selectedInvoice) return;

    try {
      const refundId = `RF${Date.now()}`;
      const refundDate = new Date().toISOString();

      console.log("Processing refund:", {
        invoiceId: selectedInvoice.invoice_id,
        refundAmount,
        refundMethod,
        refundReason,
        staffNotes,
      });

      // Update the invoice in Supabase
      // @ts-ignore: We know invoices exists in Supabase but TypeScript doesn't
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          is_refunded: true,
          refund_amount: refundAmount,
          refund_method: refundMethod,
          refund_reason: refundReason,
          refund_date: refundDate,
          refund_id: refundId,
          staff_notes: staffNotes,
        })
        .eq("invoice_id", selectedInvoice.invoice_id);

      if (updateError) {
        console.error("Error updating invoice:", updateError);
        throw new Error(updateError.message);
      }

      // If there's an associated work order, update its status
      if (selectedInvoice.work_order_id) {
        // @ts-ignore: We know work_orders exists in Supabase but TypeScript doesn't
        const { error: workOrderError } = await supabase
          .from("work_orders")
          .update({
            status: "refunded",
          })
          .eq("work_order_id", selectedInvoice.work_order_id);

        if (workOrderError) {
          console.error(
            "Warning: Could not update work order status:",
            workOrderError
          );
          // We don't want to fail the whole process if just the work order update fails
          toast.warning(
            language === "ar"
              ? "تم معالجة الاسترداد ولكن لم يتم تحديث حالة طلب العمل"
              : "Refund processed but work order status could not be updated"
          );
        }
      }

      setSuccess(
        language === "ar"
          ? "تم معالجة استرداد الأموال بنجاح"
          : "Refund processed successfully"
      );
      toast.success(
        language === "ar"
          ? "تمت معالجة استرداد الأموال بنجاح"
          : "The refund has been processed successfully"
      );

      const contactLensItemsFormatted = selectedInvoice.contact_lens_items
        ? selectedInvoice.contact_lens_items.map((item: any) => ({
            name: `${item.brand} ${item.type} ${item.color || ""}`.trim(),
            price: item.price,
            quantity: item.qty || 1,
          }))
        : [];

      const refundInfo = {
        refundId,
        invoiceId: selectedInvoice.invoice_id,
        patientName: selectedInvoice.patient_name,
        patientPhone: selectedInvoice.patient_phone,
        patientId: selectedInvoice.patient_id,
        refundAmount,
        refundMethod,
        refundReason,
        refundDate,
        originalTotal: selectedInvoice.total,
        frameBrand: selectedInvoice.frame_brand,
        frameModel: selectedInvoice.frame_model,
        frameColor: selectedInvoice.frame_color,
        lensType: selectedInvoice.lens_type,
        invoiceItems: [
          ...(selectedInvoice.frame_brand
            ? [
                {
                  name:
                    selectedInvoice.frame_brand +
                    " " +
                    selectedInvoice.frame_model,
                  price: selectedInvoice.frame_price,
                  quantity: 1,
                },
              ]
            : []),
          ...(selectedInvoice.lens_type
            ? [
                {
                  name: selectedInvoice.lens_type,
                  price: selectedInvoice.lens_price,
                  quantity: 1,
                },
              ]
            : []),
          ...(selectedInvoice.coating
            ? [
                {
                  name: selectedInvoice.coating,
                  price: selectedInvoice.coating_price,
                  quantity: 1,
                },
              ]
            : []),
          ...contactLensItemsFormatted,
        ],
        staffNotes,
      };

      setTimeout(() => {
        const receiptElement = (
          <RefundReceiptTemplate refund={refundInfo} language={language} />
        );

        const receiptHtml = ReactDOMServer.renderToString(receiptElement);

        PrintService.printHtml(
          PrintService.prepareReceiptDocument(
            receiptHtml,
            language === "ar"
              ? `إيصال استرداد - ${refundId}`
              : `Refund Receipt - ${refundId}`
          ),
          "receipt",
          () => {
            toast.success(
              language === "ar"
                ? "تتم معالجة طباعة الإيصال"
                : "Processing print request"
            );
          }
        );
      }, 300);

      setTimeout(() => {
        setSelectedInvoice(null);
        setRefundAmount(0);
        setRefundMethod("");
        setRefundReason("");
        setStaffNotes("");
        setSearchResults([]);
        setSearchTerm("");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error.message ||
          (language === "ar"
            ? "حدث خطأ أثناء معالجة الاسترداد"
            : "An error occurred while processing the refund")
      );
      toast.error(
        error.message ||
          (language === "ar"
            ? "حدث خطأ أثناء معالجة الاسترداد"
            : "An error occurred while processing the refund")
      );
    }
  };

  const goToPatientProfile = () => {
    if (selectedInvoice && selectedInvoice.patient_id) {
      navigate(`/patient/${selectedInvoice.patient_id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-full">
            <RefreshCcw className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              {language === "ar"
                ? "إدارة استرداد الأموال والاستبدال"
                : "Refund & Exchange Management"}
            </h1>
            <p className="text-blue-600 font-medium">
              {language === "ar"
                ? "معالجة استرداد الأموال واستبدال المنتجات للعملاء"
                : "Process refunds and product exchanges for customers"}
            </p>
          </div>
        </div>
      </div>

      <Card className="border-blue-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 pb-4">
          <CardTitle className="flex items-center text-blue-700 gap-2">
            <Search className="h-5 w-5" />
            {language === "ar" ? "البحث عن فاتورة" : "Search for Invoice"}
          </CardTitle>
          <CardDescription>
            {language === "ar"
              ? "ابحث عن الفاتورة بواسطة رقم الفاتورة، اسم العميل، أو رقم الهاتف"
              : "Search for an invoice by invoice number, customer name, or phone number"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    language === "ar"
                      ? "ابحث بواسطة رقم الفاتورة، اسم العميل، أو رقم الهاتف"
                      : "Search by invoice number, customer name, or phone number"
                  }
                  className="pl-10 border-blue-200 focus:border-blue-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="gap-2 bg-blue-600 hover:bg-blue-700 md:w-auto w-full"
              >
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {language === "ar" ? "بحث" : "Search"}
              </Button>
            </div>

            {success && (
              <Alert
                variant="default"
                className="bg-green-50 text-green-800 border-green-200"
              >
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="font-medium">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive" className="border-red-300 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {searchResults.length > 0 && (
              <div className="rounded-lg overflow-hidden border border-blue-200 shadow-sm">
                <div className="bg-blue-50 p-3 text-blue-700 font-medium border-b border-blue-200">
                  {language === "ar" ? "نتائج البحث" : "Search Results"} (
                  {searchResults.length})
                </div>
                <Table>
                  <TableHeader className="bg-blue-50/70">
                    <TableRow>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "رقم الفاتورة" : "Invoice ID"}
                      </TableHead>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "العميل" : "Customer"}
                      </TableHead>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "رقم الهاتف" : "Phone"}
                      </TableHead>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "التاريخ" : "Date"}
                      </TableHead>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
                      </TableHead>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "المبلغ المدفوع" : "Amount Paid"}
                      </TableHead>
                      <TableHead className="text-blue-700 font-semibold">
                        {language === "ar" ? "الحالة" : "Status"}
                      </TableHead>
                      <TableHead className="text-right text-blue-700 font-semibold">
                        {language === "ar" ? "الإجراءات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((invoice) => (
                      <TableRow
                        key={invoice.invoice_id}
                        className={`hover:bg-blue-50/30 transition-colors 
                          ${
                            selectedInvoice?.invoice_id === invoice.invoice_id
                              ? "bg-blue-100/30"
                              : ""
                          }`}
                      >
                        <TableCell className="font-medium">
                          {invoice.invoice_id}
                        </TableCell>
                        <TableCell>{invoice.patient_name}</TableCell>
                        <TableCell>{invoice.patient_phone}</TableCell>
                        <TableCell>{formatDate(invoice.created_at)}</TableCell>
                        <TableCell className="font-medium text-blue-700">
                          {invoice.total.toFixed(3)} KWD
                        </TableCell>
                        <TableCell className="font-semibold text-green-700">
                          {invoice.deposit.toFixed(3)} KWD
                        </TableCell>
                        <TableCell>
                          {invoice.is_paid ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              {language === "ar" ? "مدفوع" : "Paid"}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                              {language === "ar" ? "غير مدفوع" : "Unpaid"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectInvoice(invoice)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-400"
                          >
                            {language === "ar" ? "اختيار" : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {selectedInvoice && (
              <div className="mt-6 border rounded-lg border-blue-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 border-b border-blue-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-800">
                        {language === "ar"
                          ? "معلومات استرداد الأموال"
                          : "Refund Information"}
                      </span>
                    </h3>
                    <Badge className="bg-blue-600">
                      {language === "ar"
                        ? `رقم الفاتورة: ${selectedInvoice.invoice_id}`
                        : `Invoice: ${selectedInvoice.invoice_id}`}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 bg-white/70 p-3 rounded-md">
                    <div className="space-y-1">
                      <div className="text-xs text-blue-600 font-medium">
                        {language === "ar" ? "العميل" : "Customer"}
                      </div>
                      <div className="font-medium flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        {selectedInvoice.patient_name}
                        {selectedInvoice.patient_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={goToPatientProfile}
                            className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 ml-1"
                          >
                            {language === "ar" ? "عرض" : "View"}
                          </Button>
                        )}
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                        {selectedInvoice.patient_phone}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-blue-600 font-medium">
                        {language === "ar"
                          ? "معلومات الفاتورة"
                          : "Invoice Details"}
                      </div>
                      <div className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        {formatDate(selectedInvoice.created_at)}
                      </div>
                      <div className="text-sm">
                        {selectedInvoice.invoice_type === "glasses" ? (
                          <span>
                            {selectedInvoice.frame_brand} -{" "}
                            {selectedInvoice.frame_model}
                          </span>
                        ) : (
                          <span>
                            {language === "ar"
                              ? "عدسات لاصقة"
                              : "Contact Lenses"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-blue-600 font-medium">
                        {language === "ar"
                          ? "معلومات الدفع"
                          : "Payment Details"}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {language === "ar"
                            ? "المبلغ الإجمالي:"
                            : "Total Amount:"}
                        </div>
                        <div className="font-medium text-blue-800">
                          {selectedInvoice.total.toFixed(3)} KWD
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {language === "ar"
                            ? "المبلغ المدفوع:"
                            : "Amount Paid:"}
                        </div>
                        <div className="font-bold text-green-700">
                          {selectedInvoice.deposit.toFixed(3)} KWD
                        </div>
                      </div>
                      {!selectedInvoice.is_paid && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {language === "ar"
                              ? "المبلغ المتبقي:"
                              : "Remaining Amount:"}
                          </div>
                          <div className="font-medium text-amber-600">
                            {selectedInvoice.remaining.toFixed(3)} KWD
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {language === "ar"
                            ? "طريقة الدفع:"
                            : "Payment Method:"}
                        </div>
                        <div>{selectedInvoice.payment_method}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          {language === "ar"
                            ? "حالة الدفع:"
                            : "Payment Status:"}
                        </div>
                        <div>
                          {selectedInvoice.is_paid ? (
                            <Badge className="bg-green-100 text-green-800">
                              {language === "ar" ? "مدفوع" : "Paid"}
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">
                              {language === "ar" ? "غير مدفوع" : "Unpaid"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-6 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="refundAmount"
                        className="text-blue-700 font-medium"
                      >
                        {language === "ar" ? "مبلغ الاسترداد" : "Refund Amount"}
                      </Label>
                      <Input
                        id="refundAmount"
                        type="number"
                        step="0.001"
                        value={refundAmount}
                        onChange={handleRefundAmountChange}
                        className="text-lg font-semibold border-blue-200 focus:border-blue-400"
                      />
                      <p className="text-sm text-blue-600 font-medium">
                        {language === "ar"
                          ? `المبلغ المدفوع للفاتورة: ${selectedInvoice.deposit.toFixed(
                              3
                            )} KWD`
                          : `Amount paid: ${selectedInvoice.deposit.toFixed(
                              3
                            )} KWD`}
                      </p>
                      {!selectedInvoice.is_paid && (
                        <div className="flex items-center mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
                          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <p className="text-sm">
                            {language === "ar"
                              ? `هذه الفاتورة غير مدفوعة بالكامل. المبلغ المتبقي: ${selectedInvoice.remaining.toFixed(
                                  3
                                )} KWD`
                              : `This invoice is not fully paid. Remaining amount: ${selectedInvoice.remaining.toFixed(
                                  3
                                )} KWD`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="refundMethod"
                        className="text-blue-700 font-medium"
                      >
                        {language === "ar"
                          ? "طريقة الاسترداد"
                          : "Refund Method"}
                      </Label>
                      <Select
                        value={refundMethod}
                        onValueChange={setRefundMethod}
                      >
                        <SelectTrigger
                          id="refundMethod"
                          className="border-blue-200 focus:ring-blue-400"
                        >
                          <SelectValue
                            placeholder={
                              language === "ar"
                                ? "اختر طريقة الاسترداد"
                                : "Select refund method"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash" className="text-base">
                            {language === "ar" ? "نقداً" : "Cash"}
                          </SelectItem>
                          <SelectItem value="KNET" className="text-base">
                            {language === "ar" ? "كي نت" : "KNET"}
                          </SelectItem>
                          <SelectItem value="Credit Card" className="text-base">
                            {language === "ar" ? "بطاقة ائتمان" : "Credit Card"}
                          </SelectItem>
                          <SelectItem
                            value="Store Credit"
                            className="text-base"
                          >
                            {language === "ar" ? "رصيد المتجر" : "Store Credit"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="refundReason"
                      className="text-blue-700 font-medium"
                    >
                      {language === "ar" ? "سبب الاسترداد" : "Refund Reason"}
                    </Label>
                    <Select
                      value={refundReason}
                      onValueChange={setRefundReason}
                    >
                      <SelectTrigger
                        id="refundReason"
                        className="border-blue-200 focus:ring-blue-400"
                      >
                        <SelectValue
                          placeholder={
                            language === "ar"
                              ? "اختر سبب الاسترداد"
                              : "Select refund reason"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Customer Dissatisfied"
                          className="text-base"
                        >
                          {language === "ar"
                            ? "العميل غير راضٍ"
                            : "Customer Dissatisfied"}
                        </SelectItem>
                        <SelectItem
                          value="Product Defect"
                          className="text-base"
                        >
                          {language === "ar"
                            ? "عيب في المنتج"
                            : "Product Defect"}
                        </SelectItem>
                        <SelectItem
                          value="Incorrect Prescription"
                          className="text-base"
                        >
                          {language === "ar"
                            ? "وصفة طبية غير صحيحة"
                            : "Incorrect Prescription"}
                        </SelectItem>
                        <SelectItem
                          value="Frame Exchange"
                          className="text-base"
                        >
                          {language === "ar"
                            ? "استبدال الإطار"
                            : "Frame Exchange"}
                        </SelectItem>
                        <SelectItem value="Billing Error" className="text-base">
                          {language === "ar"
                            ? "خطأ في الفواتير"
                            : "Billing Error"}
                        </SelectItem>
                        <SelectItem value="Other" className="text-base">
                          {language === "ar" ? "آخر" : "Other"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="staffNotes"
                      className="text-blue-700 font-medium"
                    >
                      {language === "ar"
                        ? "ملاحظات إضافية"
                        : "Additional Notes"}
                    </Label>
                    <Textarea
                      id="staffNotes"
                      value={staffNotes}
                      onChange={(e) => setStaffNotes(e.target.value)}
                      placeholder={
                        language === "ar"
                          ? "أدخل أي ملاحظات إضافية هنا..."
                          : "Enter any additional notes here..."
                      }
                      className="h-24 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        {selectedInvoice && (
          <CardFooter className="flex justify-between p-4 bg-blue-50 border-t border-blue-200">
            <Button
              variant="outline"
              onClick={() => setSelectedInvoice(null)}
              className="gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleProcessRefund}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCcw className="h-4 w-4" />
              {language === "ar" ? "معالجة استرداد الأموال" : "Process Refund"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
