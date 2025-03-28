
import React from "react";
import { format } from "date-fns";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, useInvoiceStore } from "@/store/invoiceStore";
import { MoenLogoGreen } from "@/assets/logo";
import { Separator } from "@/components/ui/separator";

interface RefundReceiptTemplateProps {
  invoice: Invoice;
  refundId: string;
  refundAmount: number;
  refundReason: string;
  refundMethod: string;
  isPrintable?: boolean;
}

export const RefundReceiptTemplate: React.FC<RefundReceiptTemplateProps> = ({
  invoice,
  refundId,
  refundAmount,
  refundReason,
  refundMethod,
  isPrintable = false
}) => {
  const { language, t } = useLanguageStore();
  const { getRefundById } = useInvoiceStore();
  const refund = getRefundById(refundId);
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd/MM/yyyy hh:mm a");
    } catch (e) {
      return date;
    }
  };

  return (
    <div className={`${dirClass} bg-white p-2 max-w-full print:p-0 ${isPrintable ? 'print-receipt' : ''}`} id="refund-receipt">
      <div className="mx-auto max-w-[80mm] print:w-[76mm] print:max-w-full" style={{ maxWidth: "80mm" }}>
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-4">
          <MoenLogoGreen className="h-10 w-auto mb-2" />
          <h2 className="text-lg font-bold text-primary">{t('moenzOptics') || "Moenz Optics"}</h2>
          <p className="text-xs">{t('moenzAddress') || "Hawally, Kuwait"}</p>
          <p className="text-xs">{t('moenzPhone') || "Tel: +965 2220 0000"}</p>
        </div>
        
        {/* Receipt Title */}
        <div className="border border-dashed border-gray-300 bg-primary-foreground py-2 px-3 text-center mb-3">
          <h1 className="text-lg font-bold">{t('refundReceipt') || "REFUND RECEIPT"}</h1>
        </div>
        
        {/* Receipt Details */}
        <div className="text-sm space-y-1 mb-3">
          <div className="flex justify-between">
            <span className="font-semibold">{t('refundNumber') || "Refund #"}:</span>
            <span>{refundId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{t('originalInvoice') || "Original Invoice"}:</span>
            <span>{invoice.invoiceId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">{t('date') || "Date"}:</span>
            <span>{formatDate(refund?.date || new Date().toISOString())}</span>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Customer Information */}
        <div className="text-sm space-y-1 mb-3">
          <h3 className="font-semibold">{t('customerInformation') || "Customer Information"}:</h3>
          <div className="flex justify-between">
            <span>{t('name') || "Name"}:</span>
            <span>{invoice.patientName}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('phone') || "Phone"}:</span>
            <span dir="ltr">{invoice.patientPhone}</span>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Items */}
        <div className="text-sm mb-3">
          <h3 className="font-semibold mb-1">{t('refundedItems') || "Refunded Items"}:</h3>
          
          <div className="border border-gray-200 rounded-sm mb-2">
            {invoice.invoiceType === "glasses" ? (
              <div className="p-2">
                <div className="flex justify-between mb-1">
                  <span>{t('frame') || "Frame"}:</span>
                  <span>{invoice.frameBrand} {invoice.frameModel}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>{t('lens') || "Lens"}:</span>
                  <span>{invoice.lensType}</span>
                </div>
                {invoice.coating && (
                  <div className="flex justify-between">
                    <span>{t('coating') || "Coating"}:</span>
                    <span>{invoice.coating}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2">
                <span>{t('contactLenses') || "Contact Lenses"}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Reason */}
        <div className="text-sm mb-3">
          <h3 className="font-semibold mb-1">{t('refundReason') || "Refund Reason"}:</h3>
          <div className="border border-gray-200 rounded-sm p-2">
            <p>{refundReason}</p>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        {/* Payment Details */}
        <div className="text-sm mb-5">
          <div className="flex justify-between font-semibold mb-1">
            <span>{t('originalAmount') || "Original Amount"}:</span>
            <span>{invoice.total.toFixed(3)} KWD</span>
          </div>
          
          <div className="flex justify-between font-semibold mb-1">
            <span>{t('refundAmount') || "Refund Amount"}:</span>
            <span>{refundAmount.toFixed(3)} KWD</span>
          </div>
          
          <div className="flex justify-between">
            <span>{t('refundMethod') || "Refund Method"}:</span>
            <span>{refundMethod}</span>
          </div>
          
          {refundMethod === "Card" && refund?.authNumber && (
            <div className="flex justify-between">
              <span>{t('authNumber') || "Auth Number"}:</span>
              <span>{refund.authNumber}</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-300 pt-2 text-center text-xs">
          <p>{t('thankYouForYourBusiness') || "Thank you for your business"}</p>
          <p>{t('returnPolicy') || "Returns and exchanges are subject to our policy"}</p>
          <p className="mt-2 text-gray-500">{t('moenzWebsite') || "www.moenzoptics.com"}</p>
        </div>
      </div>
    </div>
  );
};
