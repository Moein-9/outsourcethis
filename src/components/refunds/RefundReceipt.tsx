
import React from "react";
import { useInvoiceStore, Invoice, RefundExchange } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { ArrowLeft, Printer, Check, Info, Receipt, RefreshCw } from "lucide-react";
import { MoenLogo } from "@/assets/logo";

interface RefundReceiptProps {
  invoice: Invoice;
  onBack: () => void;
  onPrint: () => void;
}

export const RefundReceipt: React.FC<RefundReceiptProps> = ({
  invoice,
  onBack,
  onPrint
}) => {
  const { language, t } = useLanguageStore();
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP', { 
        locale: language === 'ar' ? ar : enUS 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  const refundData = invoice.refundExchange;
  
  return (
    <div className={`${dirClass} relative pt-6`}>
      <div className="print:hidden mb-4 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('returnToSearch')}
        </Button>
        <Button onClick={onPrint} className="gap-2">
          <Printer className="h-4 w-4" />
          {t('printRefundInvoice')}
        </Button>
      </div>
      
      <div className="mx-auto max-w-4xl p-6 bg-white rounded-lg shadow print:shadow-none">
        <div className={`flex justify-between items-start border-b pb-6 mb-6 ${dirClass}`}>
          <div className={`${language === 'ar' ? 'order-last' : 'order-first'}`}>
            <h1 className="text-xl font-bold">{t('refundReceiptTitle')}</h1>
            <p className="text-sm text-muted-foreground">{t('refundInvoice')} #{refundData?.id || '-'}</p>
            <p className="text-sm mt-1">{formatDate(refundData?.date || new Date().toISOString())}</p>
          </div>
          <MoenLogo className="h-12 w-auto" />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className={`${textAlignClass}`}>
            <h3 className="font-medium mb-2">{t('clientDetails')}</h3>
            <p className="text-sm"><strong>{t('name')}:</strong> {invoice.patientName}</p>
            <p className="text-sm"><strong>{t('phone')}:</strong> {invoice.patientPhone}</p>
            <p className="text-sm"><strong>{t('originalInvoice')}:</strong> {invoice.invoiceId}</p>
          </div>
          <div className={`${language === 'ar' ? 'text-left' : 'text-right'}`}>
            <h3 className="font-medium mb-2">{t('refundDetails')}</h3>
            <p className="text-sm">
              <strong>{t('refundDate')}:</strong> {formatDate(refundData?.date || new Date().toISOString())}
            </p>
            <p className="text-sm">
              <strong>{t('status')}:</strong> {t('completed')}
            </p>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-xs font-medium text-slate-700 border-b">
                <th className="px-4 py-3 text-left">{t('description')}</th>
                <th className="px-4 py-3 text-right">{t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm">
                  {invoice.invoiceType === 'glasses' ? (
                    <>
                      {invoice.frameBrand} {invoice.frameModel} {invoice.frameColor && `(${invoice.frameColor})`}
                      {invoice.lensType && ` + ${invoice.lensType}`}
                    </>
                  ) : (
                    <>
                      {t('contacts')} ({(invoice.contactLensItems || []).length})
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-right">{refundData?.amount.toFixed(3) || '0.000'} KWD</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50">
              <tr>
                <td className="px-4 py-3 font-medium">{t('totalRefund')}</td>
                <td className="px-4 py-3 font-bold text-right">{refundData?.amount.toFixed(3) || '0.000'} KWD</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {refundData?.reason && (
          <div className="border rounded-md p-4 mb-6 bg-slate-50">
            <h3 className="font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              {t('refundReason')}
            </h3>
            <p className="text-sm">{refundData.reason}</p>
          </div>
        )}
        
        <div className="flex justify-center border-t pt-6">
          <div className="text-center">
            <Check className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <h2 className="text-lg font-bold">{t('refundCompleted')}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t('thankYou')}</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground print:mt-16">
          <p>Moen Optician</p>
          <p>+965 12345678</p>
        </div>
      </div>
    </div>
  );
};
