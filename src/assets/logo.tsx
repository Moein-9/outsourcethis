
import React from "react";

export const MoenLogo: React.FC<{ 
  className?: string; 
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ 
  className = "w-auto h-12", 
  onClick,
  style
}) => {
  return (
    <img 
      src="/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png" 
      alt="Moen Optician" 
      className={className}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        maxHeight: '8mm', // Limit height for thermal receipts
        ...style 
      }}
    />
  );
};

export const MoenLogoGreen: React.FC<{ 
  className?: string; 
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ 
  className = "w-auto h-12", 
  onClick,
  style
}) => {
  return (
    <img 
      src="/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png" 
      alt="Moen Optician" 
      className={className}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        maxHeight: '8mm', // Limit height for thermal receipts
        ...style 
      }}
    />
  );
};

export const MoenLogoBlack: React.FC<{ 
  className?: string; 
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ 
  className = "w-auto h-12", 
  onClick,
  style
}) => {
  return (
    <img 
      src="/lovable-uploads/d0902afc-d6a5-486b-9107-68104dfd2a68.png" 
      alt="Moen Optician" 
      className={className}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        maxHeight: '8mm', // Limit height for thermal receipts
        ...style 
      }}
    />
  );
};

// Updated store information based on invoice details with both addresses
export const storeInfo = {
  name: "Moen Optician",
  addresses: [
    {
      title: {
        en: "Al Arbid Gallery Mall",
        ar: "مجمع العربيد جاليري"
      },
      street: {
        en: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
        ar: "شارع حبيب مناور، الفروانية، الكويت"
      },
      phone: "24748201"
    },
    {
      title: {
        en: "Al-Somait Plaza",
        ar: "مجمع الصميط بلازا"
      },
      street: {
        en: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
        ar: "شارع حبيب مناور، الفروانية، الكويت"
      },
      phone: "24759016"
    }
  ]
};

export const formatStoreAddress = (language: string = 'en', includePhone: boolean = true) => {
  const isArabic = language === 'ar';
  
  return storeInfo.addresses.map((address, index) => {
    const titleText = `${address.title[isArabic ? 'ar' : 'en']} | ${address.title[isArabic ? 'en' : 'ar']}`;
    const streetText = `${address.street[isArabic ? 'ar' : 'en']}`;
    const phoneText = includePhone ? `Tel | هاتف: ${address.phone}` : '';
    
    return {
      title: titleText,
      street: streetText,
      phone: phoneText
    };
  });
};
