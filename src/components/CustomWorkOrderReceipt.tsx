
import React from 'react';
import { format } from 'date-fns';
import { useLanguageStore } from '@/store/languageStore';
import { MoenLogo, storeInfo } from '@/assets/logo';
import { ContactLensItem } from './ContactLensSelector';
import { Contact, User, Phone, Calendar, Eye, Ruler, Glasses, DollarSign } from 'lucide-react';

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
  const { language, t } = useLanguageStore();
  const dirClass = language === 'ar' ? 'rtl text-right' : 'ltr text-left';
  
  const patientName = patient?.name || invoice?.patientName || workOrder?.patientName || 'Customer';
  const patientPhone = patient?.phone || invoice?.patientPhone || workOrder?.patientPhone || '';
  
  // Get prescription data from multiple possible sources with fallbacks
  const rxData = workOrder?.rx || invoice?.rx || patient?.rx || {
    sphereOD: '',
    cylOD: '',
    axisOD: '',
    addOD: '',
    pdOD: '',
    sphereOS: '',
    cylOS: '',
    axisOS: '',
    addOS: '',
    pdOS: '',
    pd: ''
  };
  
  console.log('WorkOrder RX data in receipt:', rxData);
  
  // Get contact lens prescription data
  const contactLensRxData = workOrder?.contactLensRx || invoice?.contactLensRx || patient?.contactLensRx;
  
  // Get lens data
  const lensType = workOrder?.lensType?.name || invoice?.lensType;
  const coating = invoice?.coating;
  
  // Get frame data
  const frameBrand = invoice?.frameBrand;
  const frameModel = invoice?.frameModel;
  const frameColor = invoice?.frameColor;
  
  // Get contact lens items
  const contactLensItems = workOrder?.contactLenses || invoice?.contactLensItems || [];
  
  // Determine if this is a contact lens order
  const isContactLens = contactLensItems && contactLensItems.length > 0;
  
  // Get payment information for remaining balance highlight
  const total = invoice?.total || 0;
  const deposit = invoice?.deposit || 0;
  const remainingBalance = total - deposit;
  const hasRemainingBalance = remainingBalance > 0;
  
  const orderDate = workOrder?.createdAt ? new Date(workOrder.createdAt) : new Date();
  const formattedDate = format(orderDate, 'dd/MM/yyyy');
  
  return (
    <div className={`thermal-receipt text-xs p-2 ${dirClass}`}>
      {/* Logo and Store Info */}
      <div className="text-center mb-3">
        <MoenLogo className="mx-auto h-8 mb-1" />
        <p className="font-bold">{storeInfo.name}</p>
        <p className="text-[0.6rem]">{storeInfo.address}</p>
        <p className="text-[0.6rem]">{t('phone')}: {storeInfo.phone}</p>
      </div>
      
      {/* Work Order Header */}
      <div className="bg-black text-white py-0.5 text-center rounded text-xs font-bold mb-2">
        {language === 'ar' ? "أمر عمل | WORK ORDER" : "WORK ORDER | أمر عمل"}
      </div>
      
      <div className="text-center mb-2">
        <p className="font-bold">{t('orderNumber')}: {workOrder?.id}</p>
        <p className="text-[0.6rem] flex items-center justify-center gap-1">
          <Calendar className="w-3 h-3" /> {formattedDate}
        </p>
      </div>
      
      {/* Patient Info */}
      <div className="border-t border-dashed pt-1 mb-2">
        <div className="font-bold border-b mb-1">{t('patientInfo')}</div>
        <div className="flex items-center gap-1 mb-0.5">
          <User className="w-3 h-3 shrink-0" />
          <span className="font-semibold">{t('name')}:</span>
          <span className="ml-1">{patientName}</span>
        </div>
        {patientPhone && (
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3 shrink-0" />
            <span className="font-semibold">{t('phone')}:</span>
            <span className="ml-1">{patientPhone}</span>
          </div>
        )}
      </div>
      
      {/* Remaining Payment - Red Highlight */}
      {hasRemainingBalance && invoice && (
        <div className="bg-red-100 border border-red-500 text-red-700 rounded p-1 mb-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span className="font-bold">{t('remainingPayment')}:</span>
            <span className="font-bold">{remainingBalance.toFixed(2)}</span>
          </div>
        </div>
      )}
      
      {/* Glasses Prescription */}
      {rxData && (
        <div className="border-t border-dashed pt-1 mb-2">
          <div className="font-bold border-b mb-1 flex items-center gap-1">
            <Eye className="w-3 h-3" /> {t('glassesRx')}
          </div>
          
          <table className="w-full border-collapse text-[0.6rem]" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-1 py-0.5">Eye</th>
                <th className="border border-gray-400 px-1 py-0.5">SPH</th>
                <th className="border border-gray-400 px-1 py-0.5">CYL</th>
                <th className="border border-gray-400 px-1 py-0.5">AXIS</th>
                <th className="border border-gray-400 px-1 py-0.5">ADD</th>
                <th className="border border-gray-400 px-1 py-0.5">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-1 py-0.5 font-semibold">OD</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.sphereOD || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.cylOD || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.axisOD || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.addOD || rxData.add || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.pdOD || rxData.pdRight || (rxData.pd ? rxData.pd/2 : "—")}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-1 py-0.5 font-semibold">OS</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.sphereOS || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.cylOS || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.axisOS || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.addOS || rxData.add || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{rxData.pdOS || rxData.pdLeft || (rxData.pd ? rxData.pd/2 : "—")}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between mt-0.5 text-[0.6rem]">
            <span>OD = {language === 'ar' ? "اليمين" : "Right"}</span>
            <span>OS = {language === 'ar' ? "اليسار" : "Left"}</span>
          </div>
        </div>
      )}
      
      {/* Contact Lens Prescription */}
      {contactLensRxData && (
        <div className="border-t border-dashed pt-1 mb-2">
          <div className="font-bold border-b mb-1 flex items-center gap-1">
            <Contact className="w-3 h-3" /> {t('contactLensRx')}
          </div>
          
          <table className="w-full border-collapse text-[0.6rem]" style={{ direction: 'ltr' }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-1 py-0.5">Eye</th>
                <th className="border border-gray-400 px-1 py-0.5">SPH</th>
                <th className="border border-gray-400 px-1 py-0.5">CYL</th>
                <th className="border border-gray-400 px-1 py-0.5">AXIS</th>
                <th className="border border-gray-400 px-1 py-0.5">BC</th>
                <th className="border border-gray-400 px-1 py-0.5">DIA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-1 py-0.5 font-semibold">R</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.rightEye?.sphere || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.rightEye?.cylinder || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.rightEye?.axis || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.rightEye?.bc || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.rightEye?.dia || "—"}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-1 py-0.5 font-semibold">L</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.leftEye?.sphere || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.leftEye?.cylinder || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.leftEye?.axis || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.leftEye?.bc || "—"}</td>
                <td className="border border-gray-400 px-1 py-0.5">{contactLensRxData?.leftEye?.dia || "—"}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between mt-0.5 text-[0.6rem]">
            <span>R = {language === 'ar' ? "اليمين" : "Right"}</span>
            <span>L = {language === 'ar' ? "اليسار" : "Left"}</span>
          </div>
        </div>
      )}
      
      {/* Product Info */}
      <div className="border-t border-dashed pt-1 mb-2">
        <div className="font-bold border-b mb-1">{t('productInfo')}</div>
        
        {isContactLens ? (
          <div>
            <div className="font-semibold mt-1 mb-0.5 flex items-center gap-1">
              <Contact className="w-3 h-3" /> {t('contactLenses')}:
            </div>
            {contactLensItems.map((lens: ContactLensItem, index: number) => (
              <div key={index} className="mb-0.5 pl-3">
                • {lens.brand} {lens.type} {lens.qty > 1 ? `(${lens.qty})` : ''}
              </div>
            ))}
          </div>
        ) : (
          <div>
            {lensType && (
              <div className="flex gap-1 mb-0.5">
                <span className="font-semibold flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> {t('lensType')}:
                </span>
                <span>{lensType}</span>
              </div>
            )}
            
            {coating && (
              <div className="flex gap-1 mb-0.5">
                <span className="font-semibold">{t('coating')}:</span>
                <span>{coating}</span>
              </div>
            )}
            
            {frameBrand && (
              <div>
                <div className="font-semibold mt-1 mb-0.5 flex items-center gap-1">
                  <Glasses className="w-3 h-3" /> {t('frame')}:
                </div>
                <div className="pl-3 mb-0.5">• {frameBrand} {frameModel}</div>
                {frameColor && <div className="pl-3">• {t('color')}: {frameColor}</div>}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center text-[0.6rem] mt-3 pt-1 border-t border-dashed">
        <p>{t('thankYou')}</p>
        <p>{storeInfo.name} - {t('phone')}: {storeInfo.phone}</p>
      </div>
    </div>
  );
};
