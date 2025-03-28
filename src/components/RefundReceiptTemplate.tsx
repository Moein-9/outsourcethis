import React from 'react';
import { Refund } from '@/store/invoiceStore';
import { usePatientStore } from '@/store/patientStore';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  CreditCard, 
  User, 
  Phone, 
  Glasses, 
  Info, 
  RefreshCcw,
  UserCircle2,
  Clock,
  CircleDollarSign,
  Store,
  FileText,
  Package,
  CheckCircle
} from 'lucide-react';
import { MoenLogo, storeInfo } from "@/assets/logo";
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface RefundReceiptTemplateProps {
  refund: {
    refundId: string;
    invoiceId: string;
    patientName: string;
    patientPhone: string;
    patientId?: string;
    refundAmount: number;
    refundMethod: string;
    refundReason: string;
    refundDate: string;
    originalTotal: number;
    frameBrand?: string;
    frameModel?: string;
    frameColor?: string;
    lensType?: string;
    invoiceItems?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
    staffNotes?: string;
  };
  language: string;
}

export const RefundReceiptTemplate: React.FC<RefundReceiptTemplateProps> = ({ refund, language }) => {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';
  
  // Format the date using date-fns
  const formattedDate = format(new Date(refund.refundDate), 'dd/MM/yyyy hh:mm a');
  
  return (
    <div 
      className="print-receipt modern-receipt"
      id="refund-receipt"
      dir={isArabic ? "rtl" : "ltr"}
      style={{ 
        width: '80mm', 
        maxWidth: '80mm',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '0',
        fontSize: '12px',
        fontFamily: isArabic ? 'Zain, sans-serif' : 'Yrsa, serif',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        direction
      }}
    >
      {/* Header with Sleek Gradient */}
      <div className="receipt-header" style={{
        background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
        padding: '16px 12px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '50%', 
            padding: '6px', 
            width: '50px', 
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MoenLogo className="filter brightness-0 invert" style={{ height: '36px', width: 'auto' }} />
          </div>
        </div>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' }}>{storeInfo.name}</h2>
        <p style={{ fontSize: '11px', marginBottom: '2px', opacity: '0.9', textAlign: 'center' }}>{storeInfo.address}</p>
        <p style={{ fontSize: '11px', opacity: '0.9', textAlign: 'center' }}>{isArabic ? "هاتف" : "Phone"}: {storeInfo.phone}</p>
      </div>
      
      {/* Receipt Type Badge */}
      <div style={{ 
        margin: '-18px auto 15px', 
        width: 'fit-content', 
        position: 'relative', 
        zIndex: '1',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          color: '#0891b2',
          borderRadius: '30px',
          padding: '8px 16px',
          fontWeight: 'bold',
          fontSize: '14px',
          border: '2px solid #0891b2',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <RefreshCcw style={{ width: '16px', height: '16px' }} />
          <span>{isArabic ? "إيصال استرداد" : "REFUND RECEIPT"}</span>
        </div>
      </div>

      {/* Main Content with Cards */}
      <div style={{ padding: '0 12px 12px' }}>
        {/* Customer Information */}
        <div className="info-card" style={{
          backgroundColor: '#f0f9ff',
          borderRadius: '10px',
          padding: '10px',
          marginBottom: '12px',
          border: '1px solid #e0f2fe'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            borderBottom: '1px dashed #bae6fd',
            paddingBottom: '5px',
            marginBottom: '8px',
            color: '#0c4a6e',
            fontWeight: 'bold',
            fontSize: '13px'
          }}>
            <User style={{ width: '14px', height: '14px' }} />
            <span>{isArabic ? "معلومات العميل" : "Customer Information"}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCircle2 style={{ width: '12px', height: '12px', color: '#0e7490' }} />
              <span style={{ color: '#334155' }}>{isArabic ? "الاسم" : "Name"}:</span>
            </div>
            <span style={{ fontWeight: 'bold' }}>{refund.patientName}</span>
          </div>
          
          {refund.patientPhone && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone style={{ width: '12px', height: '12px', color: '#0e7490' }} />
                <span style={{ color: '#334155' }}>{isArabic ? "الهاتف" : "Phone"}:</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>{refund.patientPhone}</span>
            </div>
          )}
        </div>
        
        {/* Refund Details */}
        <div className="info-card" style={{
          backgroundColor: '#f0fdfa',
          borderRadius: '10px',
          padding: '10px',
          marginBottom: '12px',
          border: '1px solid #ccfbf1'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            borderBottom: '1px dashed #99f6e4',
            paddingBottom: '5px',
            marginBottom: '8px',
            color: '#115e59',
            fontWeight: 'bold',
            fontSize: '13px'
          }}>
            <Receipt style={{ width: '14px', height: '14px' }} />
            <span>{isArabic ? "تفاصيل الإيصال" : "Receipt Details"}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div style={{ 
              padding: '4px 8px', 
              backgroundColor: '#f1f5f9',
              borderRadius: '15px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}>
              #{refund.refundId}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: '#f8fafc',
              borderRadius: '15px',
              fontSize: '11px',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}>
              <Clock style={{ width: '10px', height: '10px' }} />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '6px',
            borderTop: '1px dashed #e2e8f0',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText style={{ width: '12px', height: '12px', color: '#0f766e' }} />
              <span style={{ color: '#334155' }}>{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
            </div>
            <span style={{ fontWeight: 'bold' }}>#{refund.invoiceId}</span>
          </div>
        </div>
        
        {/* Products Section */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(to right, #0891b2, #0e7490)', 
            padding: '8px 12px', 
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Package style={{ width: '14px', height: '14px' }} />
            <span>{isArabic ? "المنتجات" : "Products"}</span>
          </div>

          {/* Product Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Frame Info */}
            {refund.frameBrand && (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                padding: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <div style={{ 
                    color: '#334155', 
                    fontWeight: 'bold',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Glasses style={{ width: '12px', height: '12px', color: '#0e7490' }} />
                    <span>{isArabic ? "الإطار" : "Frame"}</span>
                  </div>
                  <div style={{ 
                    backgroundColor: '#0ea5e9', 
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}>
                    {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#f8fafc',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {refund.frameBrand} {refund.frameModel} 
                  {refund.frameColor && ` (${refund.frameColor})`}
                </div>
              </div>
            )}
            
            {/* Lens Info */}
            {refund.lensType && (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                padding: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <div style={{ 
                    color: '#334155', 
                    fontWeight: 'bold',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Info style={{ width: '12px', height: '12px', color: '#0e7490' }} />
                    <span>{isArabic ? "العدسات" : "Lenses"}</span>
                  </div>
                  <div style={{ 
                    backgroundColor: '#14b8a6', 
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px'
                  }}>
                    {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#f8fafc',
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {refund.lensType}
                </div>
              </div>
            )}
            
            {/* Other Items */}
            {refund.invoiceItems && refund.invoiceItems.length > 0 && !refund.frameBrand && !refund.lensType && (
              refund.invoiceItems.map((item, index) => (
                <div key={index} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: item.quantity && item.quantity > 1 ? '6px' : '0'
                  }}>
                    <div style={{ 
                      color: '#334155', 
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      backgroundColor: '#0ea5e9', 
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}>
                      {item.price.toFixed(3)} KWD
                    </div>
                  </div>
                  
                  {item.quantity && item.quantity > 1 && (
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {isArabic ? "الكمية" : "Quantity"}: {item.quantity}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Refund Details */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(to right, #0891b2, #0e7490)', 
            padding: '8px 12px', 
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <RefreshCcw style={{ width: '14px', height: '14px' }} />
            <span>{isArabic ? "تفاصيل الاسترداد" : "Refund Details"}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Refund Method */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              padding: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: '#475569', fontWeight: '500', fontSize: '12px' }}>
                {isArabic ? "طريقة الاسترداد" : "Refund Method"}
              </div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#f8fafc',
                padding: '4px 10px',
                borderRadius: '15px',
                fontWeight: 'bold',
                fontSize: '11px',
                color: '#0c4a6e',
                border: '1px solid #e0f2fe'
              }}>
                <CreditCard style={{ width: '11px', height: '11px', color: '#0e7490' }} />
                <span>{refund.refundMethod}</span>
              </div>
            </div>
            
            {/* Refund Reason */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              padding: '10px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                color: '#475569', 
                fontWeight: '500', 
                fontSize: '12px',
                marginBottom: '6px' 
              }}>
                {isArabic ? "سبب الاسترداد" : "Reason for Refund"}
              </div>
              <div style={{ 
                backgroundColor: '#f8fafc',
                padding: '8px',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#334155',
                fontWeight: '500',
                border: '1px solid #f1f5f9',
                lineHeight: '1.3'
              }}>
                {refund.refundReason}
              </div>
            </div>
            
            {/* Staff Notes */}
            {refund.staffNotes && (
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                padding: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div style={{ 
                  color: '#475569', 
                  fontWeight: '500', 
                  fontSize: '12px',
                  marginBottom: '6px' 
                }}>
                  {isArabic ? "ملاحظات" : "Notes"}
                </div>
                <div style={{ 
                  backgroundColor: '#f8fafc',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#64748b',
                  fontStyle: 'italic',
                  border: '1px solid #f1f5f9',
                  lineHeight: '1.3'
                }}>
                  {refund.staffNotes}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Amount Information */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px',
          padding: '12px',
          border: '2px solid #ccfbf1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          marginBottom: '15px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#475569'
          }}>
            <span>{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
            <span style={{ fontWeight: 'bold', color: '#334155' }}>{refund.originalTotal.toFixed(3)} KWD</span>
          </div>
          
          <div style={{ 
            height: '1px', 
            backgroundColor: '#e2e8f0', 
            margin: '8px 0',
            backgroundImage: 'linear-gradient(to right, transparent, #94a3b8, transparent)'
          }}></div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '2px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              color: '#0f766e',
              fontWeight: 'bold',
              fontSize: '13px'
            }}>
              <CircleDollarSign style={{ width: '14px', height: '14px' }} />
              <span>{isArabic ? "مبلغ الاسترداد" : "Refund Amount"}:</span>
            </div>
            <div style={{ 
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#0f766e',
              backgroundColor: '#f0fdfa',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #99f6e4'
            }}>
              {refund.refundAmount.toFixed(3)} KWD
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 5px rgba(34, 197, 94, 0.3)'
          }}>
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            <span>{isArabic ? "تم الاسترداد" : "Refunded"}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        backgroundColor: '#f1f5f9',
        padding: '10px',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#475569',
          marginBottom: '4px'
        }}>
          {isArabic
            ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
            : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div style={{ 
          fontSize: '10px',
          color: '#64748b'
        }}>
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
      </div>

      <style>
        {`
        @media print {
          @page {
            size: 80mm auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body {
            width: 80mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          #refund-receipt {
            width: 80mm !important;
            max-width: 80mm !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            text-align: center !important;
            border-radius: 0 !important;
          }
          
          .print-receipt * {
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          html, body {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-receipt {
            height: fit-content !important;
            min-height: fit-content !important;
            max-height: fit-content !important;
          }
          
          .print-receipt {
            break-inside: avoid !important;
            break-after: avoid-page !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
          
          /* Ensure gradients and colors print correctly */
          .receipt-header,
          [style*="background: linear-gradient"] {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        `}
      </style>
    </div>
  );
};
