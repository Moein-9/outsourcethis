
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { ArrowLeft, Receipt, ArrowDownLeft, Printer } from "lucide-react";
import { toast } from "sonner";

interface RefundFormProps {
  invoice: Invoice;
  onBack: () => void;
  onRefundComplete: (refundId: string) => void;
}

export const RefundForm: React.FC<RefundFormProps> = ({ 
  invoice, 
  onBack,
  onRefundComplete
}) => {
  const { language, t } = useLanguageStore();
  const { processRefund } = useInvoiceStore();
  
  const [refundAmount, setRefundAmount] = useState<number>(invoice.total);
  const [reason, setReason] = useState<string>("");
  const [reasonType, setReasonType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = () => {
    if (refundAmount <= 0) {
      toast.error(language === 'ar' ? "مبلغ الاسترداد يجب أن يكون أكبر من صفر" : "Refund amount must be greater than zero");
      return;
    }
    
    if (refundAmount > invoice.total) {
      toast.error(language === 'ar' ? "مبلغ الاسترداد لا يمكن أن يتجاوز المبلغ الإجمالي" : "Refund amount cannot exceed total amount");
      return;
    }
    
    if (!reason.trim() && !reasonType) {
      toast.error(language === 'ar' ? "يرجى تحديد سبب الاسترداد" : "Please specify a reason for the refund");
      return;
    }
    
    setIsSubmitting(true);
    
    // Process refund with combined reason
    const fullReason = reasonType ? `${t(reasonType)}${reason ? ': ' + reason : ''}` : reason;
    const refundId = processRefund(invoice.invoiceId, refundAmount, fullReason);
    
    // Notify success
    toast.success(t('refundCompleted'), {
      description: language === 'ar' 
        ? `تم إنشاء فاتورة استرداد برقم ${refundId}` 
        : `Refund invoice created with ID: ${refundId}`
    });
    
    onRefundComplete(refundId);
    setIsSubmitting(false);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP', { 
        locale: language === 'ar' ? ar : enUS 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  const getReadableInvoiceType = (type?: string) => {
    if (!type) return "-";
    return type === 'glasses' ? t('glasses') : t('contacts');
  };
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('returnToSearch')}
          </Button>
          <CardTitle className="flex items-center">
            <ArrowDownLeft className="h-5 w-5 mr-2 text-red-500" />
            {t('processingRefund')}: {invoice.invoiceId}
          </CardTitle>
        </div>
        <CardDescription>
          {t('originalInvoice')} • {formatDate(invoice.createdAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="font-medium text-sm mb-2">{t('invoiceDetails')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{t('clientName')}</p>
              <p className="font-medium">{invoice.patientName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('phoneNumber')}</p>
              <p className="font-medium">{invoice.patientPhone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('invoiceType')}</p>
              <p className="font-medium">{getReadableInvoiceType(invoice.invoiceType)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('totalAmount')}</p>
              <p className="font-medium">{invoice.total.toFixed(3)} KWD</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('refundAmount')}</Label>
            <div className="relative">
              <Input 
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                max={invoice.total}
                min={0}
                step={0.001}
                className="pl-12"
              />
              <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r">
                <span className="text-muted-foreground">KWD</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' 
                ? `الحد الأقصى للاسترداد: ${invoice.total.toFixed(3)} د.ك` 
                : `Maximum refund: ${invoice.total.toFixed(3)} KWD`}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>{t('refundReason')}</Label>
            <Select
              value={reasonType}
              onValueChange={setReasonType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectReason')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frameDefective">{t('frameDefective')}</SelectItem>
                <SelectItem value="lensDefective">{t('lensDefective')}</SelectItem>
                <SelectItem value="customerDissatisfied">{t('customerDissatisfied')}</SelectItem>
                <SelectItem value="wrongPrescription">{t('wrongPrescription')}</SelectItem>
                <SelectItem value="other">{t('other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>{t('specifyReason')}</Label>
            <Textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={language === 'ar' ? "تفاصيل إضافية حول سبب الاسترداد..." : "Additional details about the refund reason..."}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between border-t pt-6">
        <Button variant="outline" onClick={onBack}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2 bg-red-600 hover:bg-red-700">
          <Receipt className="h-4 w-4" />
          {t('confirmRefund')}
        </Button>
      </CardFooter>
    </Card>
  );
};
