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
import { MoenLogo, storeLocations } from "@/assets/logo";
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
  locationId?: string;
}

export const RefundReceiptTemplate: React.FC<RefundReceiptTemplateProps> = ({ 
  refund, 
  language,
  locationId
}) => {
  const isArabic = language === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const textAlign = isArabic ? 'right' : 'left';
  
  // Find the appropriate store location
  const location = locationId 
    ? storeLocations.find(loc => loc.id === locationId) 
    : storeLocations[0]; // Default to the first location
  
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
        fontSize: '10px',
        fontFamily: isArabic ? 'Zain, sans-serif' : 'Yrsa, serif',
        overflow: 'hidden',
        borderRadius: '0',
        direction
      }}
    >
      {/* Header - Black and white friendly */}
      <div className="receipt-header" style={{
        background: 'white',
        padding: '8px 4px',
        color: 'black',
        textAlign: 'center',
        borderBottom: '1px solid black'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <MoenLogo className="w-auto h-8" />
        </div>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '1px', textAlign: 'center' }}>
          {isArabic ? location?.nameAr : location?.name}
        </h2>
        <p style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '1px', textAlign: 'center' }}>
          {isArabic ? location?.title.ar : location?.title.en}
        </p>
        <p style={{ fontSize: '9px', marginBottom: '1px', textAlign: 'center' }}>
          {isArabic ? location?.address.ar : location?.address.en}
        </p>
        <p style={{ fontSize: '9px', textAlign: 'center' }}>
          {isArabic ? "هاتف" : "Phone"}: {location?.phone}
        </p>
      </div>
      
      {/* Receipt Type Badge */}
      <div style={{ 
        margin: '4px auto', 
        width: 'fit-content',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'white',
          color: 'black',
          borderRadius: '0',
          padding: '3px 6px',
          fontWeight: 'bold',
          fontSize: '12px',
          border: '1px solid black',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <RefreshCcw style={{ width: '12px', height: '12px' }} />
          <span>{isArabic ? "إيصال استرداد" : "REFUND RECEIPT"}</span>
        </div>
      </div>

      {/* Main Content - Thermal printer friendly */}
      <div style={{ padding: '0 4px 6px' }}>
        {/* Customer Information */}
        <div style={{
          borderRadius: '0',
          padding: '6px 4px',
          marginBottom: '6px',
          border: '1px solid black'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px',
            borderBottom: '1px dashed #000',
            paddingBottom: '3px',
            marginBottom: '4px',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '11px'
          }}>
            <User style={{ width: '10px', height: '10px' }} />
            <span>{isArabic ? "معلومات العميل" : "Customer Information"}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2px',
            fontSize: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <UserCircle2 style={{ width: '9px', height: '9px' }} />
              <span>{isArabic ? "الاسم" : "Name"}:</span>
            </div>
            <span style={{ fontWeight: 'bold' }}>{refund.patientName}</span>
          </div>
          
          {refund.patientPhone && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Phone style={{ width: '9px', height: '9px' }} />
                <span>{isArabic ? "الهاتف" : "Phone"}:</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>{refund.patientPhone}</span>
            </div>
          )}
        </div>
        
        {/* Refund Details */}
        <div style={{
          borderRadius: '0',
          padding: '6px 4px',
          marginBottom: '6px',
          border: '1px solid black'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px',
            borderBottom: '1px dashed #000',
            paddingBottom: '3px',
            marginBottom: '4px',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '11px'
          }}>
            <Receipt style={{ width: '10px', height: '10px' }} />
            <span>{isArabic ? "تفاصيل الإيصال" : "Receipt Details"}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <div style={{ 
              padding: '2px 4px', 
              backgroundColor: 'white',
              borderRadius: '0',
              fontSize: '9px',
              fontWeight: 'bold',
              border: '1px solid black'
            }}>
              #{refund.refundId}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '3px',
              padding: '2px 4px',
              backgroundColor: 'white',
              borderRadius: '0',
              fontSize: '9px',
              border: '1px solid black'
            }}>
              <Clock style={{ width: '8px', height: '8px' }} />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '3px',
            borderTop: '1px dashed #000',
            fontSize: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <FileText style={{ width: '9px', height: '9px' }} />
              <span>{isArabic ? "رقم الفاتورة" : "Invoice"}:</span>
            </div>
            <span style={{ fontWeight: 'bold' }}>#{refund.invoiceId}</span>
          </div>
        </div>
        
        {/* Products Section */}
        <div style={{ marginBottom: '6px' }}>
          <div style={{ 
            background: 'black', 
            padding: '4px 6px', 
            color: 'white',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            marginBottom: '4px'
          }}>
            <Package style={{ width: '10px', height: '10px' }} />
            <span>{isArabic ? "المنتجات" : "Products"}</span>
          </div>

          {/* Product Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Frame Info */}
            {refund.frameBrand && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '4px',
                border: '1px solid black'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '3px'
                }}>
                  <div style={{ 
                    color: 'black', 
                    fontWeight: 'bold',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Glasses style={{ width: '9px', height: '9px' }} />
                    <span>{isArabic ? "الإطار" : "Frame"}</span>
                  </div>
                  <div style={{ 
                    backgroundColor: 'white', 
                    color: 'black',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    border: '1px solid black',
                    fontSize: '9px'
                  }}>
                    {refund.invoiceItems?.find(item => item.name.includes(refund.frameBrand || ''))?.price.toFixed(3) || '0.000'} KWD
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '3px',
                  border: '1px solid black',
                  fontSize: '9px',
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
                padding: '4px',
                border: '1px solid black'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '3px'
                }}>
                  <div style={{ 
                    color: 'black', 
                    fontWeight: 'bold',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Info style={{ width: '9px', height: '9px' }} />
                    <span>{isArabic ? "العدسات" : "Lenses"}</span>
                  </div>
                  <div style={{ 
                    backgroundColor: 'white', 
                    color: 'black',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    border: '1px solid black',
                    fontSize: '9px'
                  }}>
                    {refund.invoiceItems?.find(item => item.name.includes('lens') || item.name.includes('Lens'))?.price.toFixed(3) || '0.000'} KWD
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '3px',
                  border: '1px solid black',
                  fontSize: '9px',
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
                  padding: '4px',
                  border: '1px solid black'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: item.quantity && item.quantity > 1 ? '3px' : '0'
                  }}>
                    <div style={{ 
                      color: 'black', 
                      fontWeight: 'bold',
                      fontSize: '10px'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      backgroundColor: 'white', 
                      color: 'black',
                      fontWeight: 'bold',
                      padding: '2px 4px',
                      border: '1px solid black',
                      fontSize: '9px'
                    }}>
                      {item.price.toFixed(3)} KWD
                    </div>
                  </div>
                  
                  {item.quantity && item.quantity > 1 && (
                    <div style={{ 
                      backgroundColor: 'white',
                      padding: '3px',
                      border: '1px solid black',
                      fontSize: '9px',
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
        <div style={{ marginBottom: '6px' }}>
          <div style={{ 
            background: 'black', 
            padding: '4px 6px', 
            color: 'white',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            marginBottom: '4px'
          }}>
            <RefreshCcw style={{ width: '10px', height: '10px' }} />
            <span>{isArabic ? "تفاصيل الاسترداد" : "Refund Details"}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Refund Method */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '4px',
              border: '1px solid black',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ color: 'black', fontWeight: '500', fontSize: '10px' }}>
                {isArabic ? "طريقة الاسترداد" : "Refund Method"}
              </div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: 'white',
                padding: '2px 4px',
                fontWeight: 'bold',
                fontSize: '9px',
                color: 'black',
                border: '1px solid black'
              }}>
                <CreditCard style={{ width: '8px', height: '8px' }} />
                <span>{refund.refundMethod}</span>
              </div>
            </div>
            
            {/* Refund Reason */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '4px',
              border: '1px solid black'
            }}>
              <div style={{ 
                color: 'black', 
                fontWeight: '500', 
                fontSize: '10px',
                marginBottom: '3px' 
              }}>
                {isArabic ? "سبب الاسترداد" : "Reason for Refund"}
              </div>
              <div style={{ 
                backgroundColor: 'white',
                padding: '3px',
                fontSize: '9px',
                color: 'black',
                fontWeight: '500',
                border: '1px solid black',
                lineHeight: '1.2'
              }}>
                {refund.refundReason}
              </div>
            </div>
            
            {/* Staff Notes */}
            {refund.staffNotes && (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '4px',
                border: '1px solid black'
              }}>
                <div style={{ 
                  color: 'black', 
                  fontWeight: '500', 
                  fontSize: '10px',
                  marginBottom: '3px' 
                }}>
                  {isArabic ? "ملاحظات" : "Notes"}
                </div>
                <div style={{ 
                  backgroundColor: 'white',
                  padding: '3px',
                  fontSize: '9px',
                  color: 'black',
                  fontStyle: 'italic',
                  border: '1px solid black',
                  lineHeight: '1.2'
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
          padding: '6px',
          border: '2px solid black',
          marginBottom: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '10px',
            color: 'black'
          }}>
            <span>{isArabic ? "المبلغ الأصلي" : "Original Amount"}:</span>
            <span style={{ fontWeight: 'bold', color: 'black' }}>{refund.originalTotal.toFixed(3)} KWD</span>
          </div>
          
          <div style={{ 
            height: '1px', 
            backgroundColor: 'black', 
            margin: '4px 0'
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
              gap: '3px',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '11px'
            }}>
              <CircleDollarSign style={{ width: '10px', height: '10px' }} />
              <span>{isArabic ? "مبلغ الاسترداد" : "Refund Amount"}:</span>
            </div>
            <div style={{ 
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'black',
              backgroundColor: 'white',
              padding: '2px 6px',
              border: '2px solid black'
            }}>
              {refund.refundAmount.toFixed(3)} KWD
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            backgroundColor: 'white',
            color: 'black',
            padding: '4px 8px',
            fontWeight: 'bold',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: '2px solid black'
          }}>
            <CheckCircle style={{ width: '10px', height: '10px' }} />
            <span>{isArabic ? "تم الاسترداد" : "Refunded"}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ 
        borderTop: '1px solid black',
        padding: '6px',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '9px',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '3px'
        }}>
          {isArabic
            ? "شكراً لاختياركم نظارات المعين. يسعدنا خدمتكم دائماً!"
            : "Thank you for choosing Moein Optical. We're always delighted to serve you!"}
        </p>
        <div style={{ 
          fontSize: '8px',
          color: 'black'
        }}>
          {format(new Date(), 'yyyy-MM-dd')}
        </div>
        <div style={{ marginTop: '3px', fontSize: '10px' }}>
          {'- '.repeat(10)}
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
            color: black !important;
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
          }
          
          .thermal-receipt {
            font-family: ${isArabic ? 'Zain, sans-serif' : 'Yrsa, serif'} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            font-size: 10px !important;
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
          
          /* Reduce logo size for printing */
          .thermal-receipt img {
            max-height: 7mm !important;
            width: auto !important;
          }
          
          /* Force background colors to print */
          .bg-black, [style*="background: black"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-color: black !important;
            color: white !important;
          }
          
          /* Ensure white text remains visible on black backgrounds */
          .text-white, [style*="color: white"] {
            color: white !important;
          }
          
          /* Reduce overall size to fit thermal paper */
          html, body, #refund-receipt {
            width: 80mm !important;
            max-width: 80mm !important;
          }
        }
        `}
      </style>
    </div>
  );
};
