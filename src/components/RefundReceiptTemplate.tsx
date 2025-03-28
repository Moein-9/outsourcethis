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
      className="print-receipt thermal-receipt"
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
        borderRadius: '0',
        direction
      }}
    >
      {/* Header - Black and white friendly */}
      <div className="receipt-header" style={{
        background: 'white',
        padding: '12px 8px',
        color: 'black',
        textAlign: 'center',
        borderBottom: '1px solid black'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
          <MoenLogo className="w-auto h-10" />
        </div>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '2px', textAlign: 'center' }}>{storeInfo.name}</h2>
        <p style={{ fontSize: '11px', marginBottom: '1px', textAlign: 'center' }}>{storeInfo.address}</p>
        <p style={{ fontSize: '11px', textAlign: 'center' }}>{isArabic ? "هاتف" : "Phone"}: {storeInfo.phone}</p>
      </div>
      
      {/* Receipt Type Badge */}
      <div style={{ 
        margin: '6px auto', 
        width: 'fit-content',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'white',
          color: 'black',
          borderRadius: '0',
          padding: '4px 8px',
          fontWeight: 'bold',
          fontSize: '14px',
          border: '1px solid black',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <RefreshCcw style={{ width: '14px', height: '14px' }} />
          <span>{isArabic ? "إيصال استرداد" : "REFUND RECEIPT"}</span>
        </div>
      </div>

      {/* Main Content - Thermal printer friendly */}
      <div style={{ padding: '0 8px 8px' }}>
        {/* Customer Information */}
        <div style={{
          borderRadius: '0',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid black'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            borderBottom: '1px dashed #000',
            paddingBottom: '4px',
            marginBottom: '6px',
            color: 'black',
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
            marginBottom: '4px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCircle2 style={{ width: '12px', height: '12px' }} />
              <span>{isArabic ? "الاسم" : "Name"}:</span>
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
                <Phone style={{ width: '12px', height: '12px' }} />
                <span>{isArabic ? "الهاتف" : "Phone"}:</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>{refund.patientPhone}</span>
            </div>
          )}
        </div>
        
        {/* Refund Details */}
        <div style={{
          borderRadius: '0',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid black'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            borderBottom: '1px dashed #000',
            paddingBottom: '4px',
            marginBottom: '6px',
            color: 'black',
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
            marginBottom: '6px'
          }}>
            <div style={{ 
              padding: '3px 6px', 
              backgroundColor: 'white',
              borderRadius: '0',
              fontSize: '11px',
              fontWeight: 'bold',
              border: '1px solid black'
            }}>
              #{refund.refundId}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              padding: '3px 6px',
              backgroundColor: 'white',
              borderRadius: '0',
              fontSize: '11px',
              border: '1px solid black'
            }}>
              <Clock style={{ width: '10px', height: '10px' }} />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '4px',
            borderTop: '1px dashed #000',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText style={{ width: '12px', height: '12px' }} />
              <span>{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
            </div>
            <span style={{ fontWeight: 'bold' }}>#{refund.invoiceId}</span>
          </div>
        </div>
        
        {/* Products Section */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ 
            background: 'black', 
            padding: '6px 8px', 
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '8px'
          }}>
            <Package style={{ width: '14px', height: '14px' }} />
            <span>{isArabic ? "المنتجات" : "Products"}</span>
          </div>

          {/* Product Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Frame Info */}
            {refund.frameBrand && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '6px',
                border: '1px solid black'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    color: 'black', 
                    fontWeight: 'bold',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Glasses style={{ width: '12px', height: '12px' }} />
                    <span>{isArabic ? "الإطار" : "Frame"}</span>
                  </div>
                  <div style={{ 
                    backgroundColor: 'white', 
                    color: 'black',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    border: '1px solid black',
                    fontSize: '11px'
                  }}>
                    {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '4px',
                  border: '1px solid black',
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
                padding: '6px',
                border: '1px solid black'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <div style={{ 
                    color: 'black', 
                    fontWeight: 'bold',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Info style={{ width: '12px', height: '12px' }} />
                    <span>{isArabic ? "العدسات" : "Lenses"}</span>
                  </div>
                  <div style={{ 
                    backgroundColor: 'white', 
                    color: 'black',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    border: '1px solid black',
                    fontSize: '11px'
                  }}>
                    {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '4px',
                  border: '1px solid black',
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
                  padding: '6px',
                  border: '1px solid black'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: item.quantity && item.quantity > 1 ? '4px' : '0'
                  }}>
                    <div style={{ 
                      color: 'black', 
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      backgroundColor: 'white', 
                      color: 'black',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      border: '1px solid black',
                      fontSize: '11px'
                    }}>
                      {item.price.toFixed(3)} KWD
                    </div>
                  </div>
                  
                  {item.quantity && item.quantity > 1 && (
                    <div style={{ 
                      backgroundColor: 'white',
                      padding: '4px',
                      border: '1px solid black',
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
        <div style={{ marginBottom: '10px' }}>
          <div style={{ 
            background: 'black', 
            padding: '6px 8px', 
            color: 'white',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '8px'
          }}>
            <RefreshCcw style={{ width: '14px', height: '14px' }} />
            <span>{isArabic ? "تفاصيل الاسترداد" : "Refund Details"}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Refund Method */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '8px',
              border: '1px solid black',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: 'black', fontWeight: '500', fontSize: '12px' }}>
                {isArabic ? "طريقة الاسترداد" : "Refund Method"}
              </div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'white',
                padding: '2px 8px',
                fontWeight: 'bold',
                fontSize: '11px',
                color: 'black',
                border: '1px solid black'
              }}>
                <CreditCard style={{ width: '11px', height: '11px' }} />
                <span>{refund.refundMethod}</span>
              </div>
            </div>
            
            {/* Refund Reason */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '8px',
              border: '1px solid black'
            }}>
              <div style={{ 
                color: 'black', 
                fontWeight: '500', 
                fontSize: '12px',
                marginBottom: '4px' 
              }}>
                {isArabic ? "سبب الاسترداد" : "Reason for Refund"}
              </div>
              <div style={{ 
                backgroundColor: 'white',
                padding: '6px',
                fontSize: '11px',
                color: 'black',
                fontWeight: '500',
                border: '1px solid black',
                lineHeight: '1.3'
              }}>
                {refund.refundReason}
              </div>
            </div>
            
            {/* Staff Notes */}
            {refund.staffNotes && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '8px',
                border: '1px solid black'
              }}>
                <div style={{ 
                  color: 'black', 
                  fontWeight: '500', 
                  fontSize: '12px',
                  marginBottom: '4px' 
                }}>
                  {isArabic ? "ملاحظات" : "Notes"}
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '6px',
                  fontSize: '11px',
                  color: 'black',
                  fontStyle: 'italic',
                  border: '1px solid black',
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
          padding: '10px',
          border: '2px solid black',
          marginBottom: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'black'
          }}>
            <span>{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
            <span style={{ fontWeight: 'bold', color: 'black' }}>{refund.originalTotal.toFixed(3)} KWD</span>
          </div>
          
          <div style={{ 
            height: '1px', 
            backgroundColor: 'black', 
            margin: '6px 0'
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
              gap: '4px',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '13px'
            }}>
              <CircleDollarSign style={{ width: '14px', height: '14px' }} />
              <span>{isArabic ? "مبلغ ال��سترداد" : "Refund Amount"}:</span>
            </div>
            <div style={{ 
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'black',
              backgroundColor: 'white',
              padding: '3px 8px',
              border: '2px solid black'
            }}>
              {refund.refundAmount.toFixed(3)} KWD
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            backgroundColor: 'white',
            color: 'black',
            padding: '6px 12px',
            fontWeight: 'bold',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '2px solid black'
          }}>
            <CheckCircle style={{ width: '16px', height: '16px' }} />
            <span>{isArabic ? "تم الاسترداد" : "Refunded"}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        borderTop: '1px solid black',
        padding: '8px',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '11px',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '4px'
        }}>
          {isArabic
            ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
            : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div style={{ 
          fontSize: '10px',
          color: 'black'
        }}>
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
        <div style={{ marginTop: '4px', fontSize: '12px' }}>
          {'- '.repeat(12)}
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
          }
          
          .thermal-receipt {
            font-family: ${isArabic ? 'Zain, sans-serif' : 'Yrsa, serif'} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .thermal-receipt * {
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          .receipt-header {
            background: white !important;
            color: black !important;
            border-bottom: 1px solid black !important;
          }
        }
        `}
      </style>
    </div>
  );
};
