
import React from 'react';
import { Glasses, Contact, Receipt } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

interface ProductDetailsDisplayProps {
  invoice: {
    invoiceType?: string;
    frameBrand?: string;
    frameModel?: string;
    frameColor?: string;
    lensType?: string;
    coating?: string;
    thickness?: string;
    contactLensItems?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
  };
}

export const ProductDetailsDisplay: React.FC<ProductDetailsDisplayProps> = ({ invoice }) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const textAlign = isRtl ? 'text-right' : 'text-left';
  
  const isGlasses = invoice.invoiceType === 'glasses';
  const isContactLens = invoice.invoiceType === 'contacts';
  
  return (
    <div className={`bg-white border border-gray-200 rounded-md p-4 ${textAlign}`}>
      <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700 mb-3">
        {isGlasses ? <Glasses className="h-4 w-4" /> : <Contact className="h-4 w-4" />}
        {isGlasses ? t('glassesDetails') : t('contactLensDetails')}
      </h3>
      
      {isGlasses && (
        <div className="space-y-2">
          {invoice.frameBrand && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{t('frameBrand')}:</div>
              <div className="text-sm font-medium">{invoice.frameBrand}</div>
            </div>
          )}
          
          {invoice.frameModel && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{t('frameModel')}:</div>
              <div className="text-sm font-medium">{invoice.frameModel}</div>
            </div>
          )}
          
          {invoice.frameColor && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{t('frameColor')}:</div>
              <div className="text-sm font-medium">{invoice.frameColor}</div>
            </div>
          )}
          
          {invoice.lensType && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{t('lensType')}:</div>
              <div className="text-sm font-medium">{invoice.lensType}</div>
            </div>
          )}
          
          {invoice.coating && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{t('coating')}:</div>
              <div className="text-sm font-medium">{invoice.coating}</div>
            </div>
          )}
          
          {invoice.thickness && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">{t('thickness')}:</div>
              <div className="text-sm font-medium">{invoice.thickness}</div>
            </div>
          )}
        </div>
      )}
      
      {isContactLens && invoice.contactLensItems && invoice.contactLensItems.length > 0 && (
        <div className="space-y-2">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-1 px-2 text-left">{t('item')}</th>
                <th className="py-1 px-2 text-center">{t('quantity')}</th>
                <th className="py-1 px-2 text-right">{t('price')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.contactLensItems.map((item, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-1.5 px-2">{item.name}</td>
                  <td className="py-1.5 px-2 text-center">{item.quantity || 1}</td>
                  <td className="py-1.5 px-2 text-right">{item.price.toFixed(3)} KWD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!isGlasses && !isContactLens && (
        <div className="flex items-center justify-center py-4">
          <Receipt className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-500">{t('noProductDetails')}</span>
        </div>
      )}
    </div>
  );
};
