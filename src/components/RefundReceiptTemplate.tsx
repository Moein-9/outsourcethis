
import React from "react";
import { Invoice } from "@/store/invoiceStore";

export interface RefundReceiptTemplateProps {
  invoice: Invoice;
}

export const RefundReceiptTemplate: React.FC<RefundReceiptTemplateProps> = ({ invoice }) => {
  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <h2>Refund Receipt</h2>
        <div className="receipt-id">#{invoice.refundId || 'N/A'}</div>
      </div>
      
      <div className="receipt-details">
        <div className="detail-row">
          <span className="detail-label">Invoice ID:</span>
          <span className="detail-value">{invoice.invoiceId}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Customer:</span>
          <span className="detail-value">{invoice.patientName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date:</span>
          <span className="detail-value">{new Date(invoice.refundDate || new Date()).toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Amount Refunded:</span>
          <span className="detail-value">{invoice.refundAmount?.toFixed(3) || '0.000'} KWD</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Refund Method:</span>
          <span className="detail-value">{invoice.refundMethod || 'N/A'}</span>
        </div>
        {invoice.refundReason && (
          <div className="detail-row">
            <span className="detail-label">Reason:</span>
            <span className="detail-value">{invoice.refundReason}</span>
          </div>
        )}
      </div>
      
      <div className="receipt-footer">
        <p>Thank you for your business</p>
      </div>
      
      <style jsx>{`
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
      `}</style>
    </div>
  );
};
