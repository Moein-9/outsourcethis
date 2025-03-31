
import React from "react";
import { Invoice } from "@/store/invoiceStore";

export interface RefundReceiptTemplateProps {
  invoice?: Invoice;
  refund?: {
    refundId: string;
    invoiceId: string;
    patientName: string;
    patientPhone: string;
    patientId?: string;
    refundAmount: number;
    refundMethod: string;
    refundReason: string;
    refundDate: string;
    originalTotal?: number;
    frameBrand?: string;
    frameModel?: string;
    frameColor?: string;
    lensType?: string;
    invoiceItems?: Array<{name: string; price: number; quantity: number}>;
    staffNotes?: string;
  };
  language?: string;
}

export const RefundReceiptTemplate: React.FC<RefundReceiptTemplateProps> = ({ 
  invoice, 
  refund,
  language
}) => {
  // Use refund data if provided, otherwise fall back to invoice data
  const refundId = refund?.refundId || invoice?.refundId || 'N/A';
  const invoiceId = refund?.invoiceId || invoice?.invoiceId || 'N/A';
  const customerName = refund?.patientName || invoice?.patientName || 'N/A';
  const refundDate = refund?.refundDate || invoice?.refundDate || new Date().toISOString();
  const refundAmount = refund?.refundAmount || invoice?.refundAmount || 0;
  const refundMethod = refund?.refundMethod || invoice?.refundMethod || 'N/A';
  const refundReason = refund?.refundReason || invoice?.refundReason || '';
  const isRtl = language === 'ar';
  
  return (
    <div className="receipt-container" dir={isRtl ? "rtl" : "ltr"}>
      <div className="receipt-header">
        <h2>{isRtl ? "إيصال استرداد" : "Refund Receipt"}</h2>
        <div className="receipt-id">#{refundId}</div>
      </div>
      
      <div className="receipt-details">
        <div className="detail-row">
          <span className="detail-label">{isRtl ? "رقم الفاتورة:" : "Invoice ID:"}</span>
          <span className="detail-value">{invoiceId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{isRtl ? "العميل:" : "Customer:"}</span>
          <span className="detail-value">{customerName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{isRtl ? "التاريخ:" : "Date:"}</span>
          <span className="detail-value">{new Date(refundDate).toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{isRtl ? "المبلغ المسترد:" : "Amount Refunded:"}</span>
          <span className="detail-value">{refundAmount.toFixed(3)} KWD</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">{isRtl ? "طريقة الاسترداد:" : "Refund Method:"}</span>
          <span className="detail-value">{refundMethod}</span>
        </div>
        {refundReason && (
          <div className="detail-row">
            <span className="detail-label">{isRtl ? "السبب:" : "Reason:"}</span>
            <span className="detail-value">{refundReason}</span>
          </div>
        )}
      </div>
      
      <div className="receipt-footer">
        <p>{isRtl ? "شكراً لتعاملكم معنا" : "Thank you for your business"}</p>
      </div>
      
      <style>
        {`
        .receipt-container {
          font-family: 'Arial', sans-serif;
          width: 300px;
          padding: 20px;
          border: 1px solid #ccc;
          margin: 0 auto;
        }
        
        .receipt-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 10px;
        }
        
        .receipt-id {
          font-size: 14px;
          color: #666;
        }
        
        .receipt-details {
          margin-bottom: 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .detail-label {
          font-weight: bold;
        }
        
        .receipt-footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
        }
        `}
      </style>
    </div>
  );
};
