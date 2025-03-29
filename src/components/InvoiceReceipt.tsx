
import React from 'react';
import { format } from 'date-fns';
import { useLanguageStore } from '@/store/languageStore';
import { Invoice } from '@/store/invoiceStore';
import { RefreshCcw } from 'lucide-react';

interface InvoiceReceiptProps {
  invoice: Invoice;
  isPrintable?: boolean;
}

export const InvoiceReceipt: React.FC<InvoiceReceiptProps> = ({ 
  invoice, 
  isPrintable = false 
}) => {
  const { language } = useLanguageStore();
  const isRTL = language === 'ar';
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  const hasEditHistory = invoice.editHistory && invoice.editHistory.length > 0;

  return (
    <div className={`w-full ${isPrintable ? 'receipt-print text-black' : ''} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Receipt Header */}
      <div className="text-center mb-4 pt-2">
        <div className="font-bold text-lg">VISION CENTER</div>
        <div className="text-sm">
          {isRTL ? 'مركز البصريات - الكويت' : 'Optical Center - Kuwait'}
        </div>
        <div className="text-sm">
          {isRTL ? 'هاتف: 123-456-7890' : 'Tel: 123-456-7890'}
        </div>
      </div>
      
      {/* Receipt Title */}
      <div className="text-center mb-3 border-t border-b border-gray-300 py-1">
        <div className="font-bold">
          {isRTL ? 'فاتورة' : 'INVOICE'}
        </div>
        <div>
          {invoice.invoiceId}
        </div>
      </div>
      
      {/* Customer Info */}
      <div className="mb-3 px-1">
        <div className="text-sm">
          <span className="font-bold">{isRTL ? 'العميل:' : 'Customer:'}</span> {invoice.patientName}
        </div>
        {invoice.patientPhone && (
          <div className="text-sm">
            <span className="font-bold">{isRTL ? 'الهاتف:' : 'Phone:'}</span> {invoice.patientPhone}
          </div>
        )}
        <div className="text-sm">
          <span className="font-bold">{isRTL ? 'التاريخ:' : 'Date:'}</span> {formatDate(invoice.createdAt)}
        </div>
      </div>
      
      {/* Edit Notification */}
      {hasEditHistory && (
        <div className="mb-3 px-1 text-sm">
          <div className="flex items-center gap-1 font-bold">
            <RefreshCcw className="h-3 w-3" />
            {isRTL ? 'تم تعديل الطلب' : 'Order Modified'}
          </div>
          <div className="text-xs">
            {isRTL ? 'آخر تعديل:' : 'Last edit:'} {formatDateTime(invoice.lastEditedAt || '')}
          </div>
        </div>
      )}
      
      {/* Order Items */}
      <table className="w-full text-sm mb-3">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-1 px-1">{isRTL ? 'المنتج' : 'Item'}</th>
            <th className="text-right py-1 px-1">{isRTL ? 'السعر' : 'Price'}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.frameBrand && (
            <tr className="border-b border-gray-200">
              <td className="py-1 px-1">
                {invoice.frameBrand} {invoice.frameModel} {invoice.frameColor} 
                {invoice.frameSize && <span> ({invoice.frameSize})</span>}
              </td>
              <td className="text-right py-1 px-1">{invoice.framePrice.toFixed(3)} KWD</td>
            </tr>
          )}
          
          {invoice.lensType && (
            <tr className="border-b border-gray-200">
              <td className="py-1 px-1">
                {typeof invoice.lensType === 'object' && invoice.lensType !== null
                  ? invoice.lensType.name
                  : String(invoice.lensType ?? '')}
                {invoice.thickness && ` - ${invoice.thickness}`}
              </td>
              <td className="text-right py-1 px-1">{invoice.lensPrice.toFixed(3)} KWD</td>
            </tr>
          )}
          
          {invoice.coating && invoice.coatingPrice > 0 && (
            <tr className="border-b border-gray-200">
              <td className="py-1 px-1">{invoice.coating}</td>
              <td className="text-right py-1 px-1">{invoice.coatingPrice.toFixed(3)} KWD</td>
            </tr>
          )}
          
          {invoice.contactLensItems && invoice.contactLensItems.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-1 px-1">
                {item.brand} {item.type} {item.color} x{item.qty || 1}
              </td>
              <td className="text-right py-1 px-1">{(item.price * (item.qty || 1)).toFixed(3)} KWD</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Price Summary */}
      <div className="border-t border-gray-300 pt-2 px-1">
        <div className="flex justify-between text-sm">
          <span>{isRTL ? 'المجموع:' : 'Subtotal:'}</span>
          <span>{(invoice.total + invoice.discount).toFixed(3)} KWD</span>
        </div>
        
        {invoice.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span>{isRTL ? 'الخصم:' : 'Discount:'}</span>
            <span>-{invoice.discount.toFixed(3)} KWD</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-gray-300">
          <span>{isRTL ? 'الإجمالي:' : 'Total:'}</span>
          <span>{invoice.total.toFixed(3)} KWD</span>
        </div>
        
        {invoice.deposit > 0 && (
          <div className="flex justify-between text-sm">
            <span>{isRTL ? 'المدفوع:' : 'Paid:'}</span>
            <span>{invoice.deposit.toFixed(3)} KWD</span>
          </div>
        )}
        
        {invoice.remaining > 0 && (
          <div className="flex justify-between text-sm font-bold">
            <span>{isRTL ? 'المتبقي:' : 'Balance:'}</span>
            <span>{invoice.remaining.toFixed(3)} KWD</span>
          </div>
        )}
      </div>
      
      {/* Payment Method */}
      <div className="mt-2 px-1 text-sm">
        <div>
          <span className="font-bold">{isRTL ? 'طريقة الدفع:' : 'Payment Method:'}</span> {invoice.paymentMethod}
        </div>
        
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="mt-1">
            <div className="font-bold text-xs">{isRTL ? 'سجل المدفوعات:' : 'Payment History:'}</div>
            {invoice.payments.map((payment, index) => (
              <div key={index} className="text-xs flex justify-between">
                <span>{formatDate(payment.date)} - {payment.method}</span>
                <span>{payment.amount.toFixed(3)} KWD</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit History */}
      {hasEditHistory && (
        <div className="mt-3 px-1 pt-2 border-t border-gray-300">
          <div className="text-xs font-bold mb-1">{isRTL ? 'سجل التعديلات:' : 'Edit History:'}</div>
          <div className="text-xs">
            {invoice.editHistory?.map((edit, index) => (
              <div key={index} className="flex justify-between mb-1">
                <span>{edit.notes}</span>
                <span>{formatDateTime(edit.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-gray-300 text-center text-xs">
        <div>{isRTL ? 'شكراً لزيارتك' : 'Thank you for your business'}</div>
        <div>{isRTL ? 'يرجى الاحتفاظ بالإيصال للرجوع إليه' : 'Please keep receipt for your records'}</div>
        <div className="mt-1">{formatDate(new Date().toISOString())}</div>
      </div>
    </div>
  );
};
