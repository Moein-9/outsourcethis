
import React from 'react';
import { useLanguageStore } from '@/store/languageStore';

interface CustomWorkOrderReceiptProps {
  workOrder: any;
  invoice?: any;
  patient?: any;
  isPrintable?: boolean;
}

export const CustomWorkOrderReceipt: React.FC<CustomWorkOrderReceiptProps> = ({
  workOrder,
  invoice,
  patient,
  isPrintable = false
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  // Determine if this is a contact lens order
  const isContactLens = workOrder?.isContactLens === true || 
                        workOrder?.contactLenses?.length > 0 || 
                        invoice?.contactLensItems?.length > 0 ||
                        invoice?.invoiceType === 'contacts';
  
  console.log("CustomWorkOrderReceipt - Is contact lens order:", isContactLens);
  console.log("CustomWorkOrderReceipt - Contact lens RX:", workOrder?.contactLensRx);
  
  // Get the appropriate RX data
  let rxData = workOrder?.rx || patient?.rx || {};
  let contactLensRx = workOrder?.contactLensRx || invoice?.contactLensRx || patient?.contactLensRx;
  
  // Determine which contact lens items to display
  const contactLensItems = workOrder?.contactLenses || invoice?.contactLensItems || [];

  return (
    <div className={`print-receipt ${isPrintable ? 'print:block' : ''} ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Logo and header section */}
      <div className="flex flex-col items-center mb-2 text-center">
        <div className="text-center w-full">
          <h2 className="text-base font-bold mb-1">{t('workOrder')}</h2>
          <div className="text-xs mb-1">
            {isContactLens ? t('contactLensOrder') : t('glassesOrder')}
          </div>
          <div className="text-xs">
            ORDER #{workOrder.id || 'NEW'}
          </div>
        </div>
      </div>
      
      {/* Customer information */}
      <div className="border-b border-gray-300 pb-2 mb-2">
        <div className="text-center font-bold text-sm mb-1">{t('clientInformation')}</div>
        <div className="flex justify-between text-xs">
          <span className="font-semibold">{t('clientName')}</span>
          <span>{patient?.name || workOrder?.patientName || invoice?.patientName || t('anonymous')}</span>
        </div>
        {(patient?.phone || workOrder?.patientPhone || invoice?.patientPhone) && (
          <div className="flex justify-between text-xs">
            <span className="font-semibold">{t('clientPhone')}</span>
            <span dir="ltr">{patient?.phone || workOrder?.patientPhone || invoice?.patientPhone}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="font-semibold">{t('date')}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* For contact lens orders, show contact lens prescription */}
      {isContactLens && contactLensRx && (
        <div className="border rounded p-1 mb-2 bg-gray-50">
          <div className="text-center font-bold text-sm mb-1">{t('contactLensRx')}</div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-1 py-1">{t('eye')}</th>
                <th className="border px-1 py-1">SPH</th>
                <th className="border px-1 py-1">CYL</th>
                <th className="border px-1 py-1">AXIS</th>
                <th className="border px-1 py-1">BC</th>
                <th className="border px-1 py-1">DIA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-1 py-1 font-bold">{t('rightEyeAbbr')}</td>
                <td className="border px-1 py-1">{contactLensRx.rightEye?.sphere || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.rightEye?.cylinder || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.rightEye?.axis || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.rightEye?.bc || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.rightEye?.dia || "-"}</td>
              </tr>
              <tr>
                <td className="border px-1 py-1 font-bold">{t('leftEyeAbbr')}</td>
                <td className="border px-1 py-1">{contactLensRx.leftEye?.sphere || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.leftEye?.cylinder || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.leftEye?.axis || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.leftEye?.bc || "-"}</td>
                <td className="border px-1 py-1">{contactLensRx.leftEye?.dia || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* For glasses orders, show glasses prescription */}
      {!isContactLens && rxData && (
        <div className="border rounded p-1 mb-2 bg-gray-50">
          <div className="text-center font-bold text-sm mb-1">{t('rx')}</div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-1 py-1">{t('eye')}</th>
                <th className="border px-1 py-1">SPH</th>
                <th className="border px-1 py-1">CYL</th>
                <th className="border px-1 py-1">AXIS</th>
                <th className="border px-1 py-1">ADD</th>
                <th className="border px-1 py-1">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-1 py-1 font-bold">{t('rightEyeAbbr')}</td>
                <td className="border px-1 py-1">{rxData.sphereOD || "-"}</td>
                <td className="border px-1 py-1">{rxData.cylOD || "-"}</td>
                <td className="border px-1 py-1">{rxData.axisOD || "-"}</td>
                <td className="border px-1 py-1">{rxData.addOD || rxData.add || "-"}</td>
                <td className="border px-1 py-1">{rxData.pdRight || "-"}</td>
              </tr>
              <tr>
                <td className="border px-1 py-1 font-bold">{t('leftEyeAbbr')}</td>
                <td className="border px-1 py-1">{rxData.sphereOS || "-"}</td>
                <td className="border px-1 py-1">{rxData.cylOS || "-"}</td>
                <td className="border px-1 py-1">{rxData.axisOS || "-"}</td>
                <td className="border px-1 py-1">{rxData.addOS || rxData.add || "-"}</td>
                <td className="border px-1 py-1">{rxData.pdLeft || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {/* Products section */}
      <div className="border-t border-b border-gray-300 py-2 mb-2">
        <div className="text-center font-bold text-sm mb-1">{t('products')}</div>
        
        {/* Contact lens products */}
        {isContactLens && contactLensItems.length > 0 && (
          <div className="space-y-1">
            {contactLensItems.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-xs border-b border-dotted pb-1">
                <div className="flex-1">
                  <div className="font-semibold">{item.brand} {item.type}</div>
                  {item.qty > 1 && <div className="text-2xs">{t('quantity')}: {item.qty}</div>}
                </div>
                <div className="text-right">
                  {(item.price * (item.qty || 1)).toFixed(3)} {t('kwd')}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Glass lens type and coating */}
        {!isContactLens && (
          <div className="space-y-1">
            {workOrder.lensType && (
              <div className="flex justify-between text-xs">
                <div className="font-semibold">{t('lensType')}</div>
                <div>{workOrder.lensType?.name || workOrder.lensType}</div>
              </div>
            )}
            
            {invoice?.coating && (
              <div className="flex justify-between text-xs">
                <div className="font-semibold">{t('coating')}</div>
                <div>{invoice.coating}</div>
              </div>
            )}
            
            {invoice?.thickness && (
              <div className="flex justify-between text-xs">
                <div className="font-semibold">{t('thickness')}</div>
                <div>{invoice.thickness}</div>
              </div>
            )}
            
            {/* Frame information */}
            {(invoice?.frameBrand || workOrder?.frameBrand) && (
              <div className="mt-2 pt-1 border-t border-dotted">
                <div className="flex justify-between text-xs">
                  <div className="font-semibold">{t('frameBrand')}</div>
                  <div>{invoice?.frameBrand || workOrder?.frameBrand}</div>
                </div>
                
                {(invoice?.frameModel || workOrder?.frameModel) && (
                  <div className="flex justify-between text-xs">
                    <div className="font-semibold">{t('frameModel')}</div>
                    <div>{invoice?.frameModel || workOrder?.frameModel}</div>
                  </div>
                )}
                
                {(invoice?.frameColor || workOrder?.frameColor) && (
                  <div className="flex justify-between text-xs">
                    <div className="font-semibold">{t('frameColor')}</div>
                    <div>{invoice?.frameColor || workOrder?.frameColor}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Payment information */}
      <div className="mb-2">
        <div className="text-center font-bold text-sm mb-1">{t('payment')}</div>
        
        <div className="flex justify-between text-xs">
          <span className="font-semibold">{t('total')}</span>
          <span>
            {workOrder.total || invoice?.total || 0} {t('kwd')}
          </span>
        </div>
        
        {(workOrder.discount || invoice?.discount) > 0 && (
          <div className="flex justify-between text-xs">
            <span className="font-semibold">{t('discount')}</span>
            <span>
              {workOrder.discount || invoice?.discount || 0} {t('kwd')}
            </span>
          </div>
        )}
        
        {(invoice?.deposit || 0) > 0 && (
          <div className="flex justify-between text-xs">
            <span className="font-semibold">{t('deposit')}</span>
            <span>
              {invoice?.deposit || 0} {t('kwd')}
            </span>
          </div>
        )}
        
        {invoice && (
          <div className="flex justify-between text-xs font-bold border-t border-dotted mt-1 pt-1">
            <span>{t('remaining')}</span>
            <span>
              {invoice.remaining || 0} {t('kwd')}
            </span>
          </div>
        )}
        
        <div className="mt-2 text-center text-xs">
          {workOrder.isPaid || invoice?.isPaid ? (
            <div className="bg-black text-white py-1 px-2 rounded">
              {t('paidInFull')}
            </div>
          ) : (
            <div className="border border-black py-1 px-2 rounded">
              {t('partiallyPaid')}
            </div>
          )}
        </div>
      </div>
      
      {/* Notes section */}
      <div className="mb-2">
        <div className="text-xs mb-1">{t('notes')}:</div>
        <div className="border border-gray-300 min-h-[40px] p-1 text-xs">
          {workOrder.notes || ""}
        </div>
      </div>
      
      {/* Footer */}
      <div className="text-center text-xs mt-4 mb-2">
        {isRtl ? 'شكراً لثقتكم بنا' : 'Thank you for your business'}
      </div>
    </div>
  );
};
