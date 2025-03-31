
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

// Updated store information based on provided details
export const storeLocations = {
  alArbid: {
    id: "alArbid",
    nameEn: "Al Arbid Gallery Mall",
    nameAr: "مجمع العربيد جاليري",
    addressEn: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
    addressAr: "شارع حبيب مناور، الفروانية، الكويت",
    phone: "24748201",
    default: false
  },
  alSomait: {
    id: "alSomait",
    nameEn: "Al-Somait Plaza",
    nameAr: "مجمع الصميط بلازا",
    addressEn: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
    addressAr: "شارع حبيب مناور، الفروانية، الكويت",
    phone: "24759016",
    default: true
  }
};

// Legacy storeInfo for backward compatibility
export const storeInfo = {
  name: "Moen Optician",
  address: storeLocations.alSomait.addressEn,
  phone: storeLocations.alSomait.phone
};

// Helper function to get store info by location ID and language
export const getStoreInfo = (locationId = "alSomait", language = "en") => {
  const location = storeLocations[locationId as keyof typeof storeLocations] || storeLocations.alSomait;
  
  return {
    name: "Moen Optician",
    location: language === 'ar' ? location.nameAr : location.nameEn,
    address: language === 'ar' ? location.addressAr : location.addressEn,
    phone: location.phone,
    fullAddress: language === 'ar'
      ? `${location.nameAr}\n${location.addressAr}\nهاتف: ${location.phone}`
      : `${location.nameEn}\n${location.addressEn}\nTel: ${location.phone}`
  };
};

// Get default location ID
export const getDefaultLocationId = () => {
  for (const key in storeLocations) {
    if (storeLocations[key as keyof typeof storeLocations].default) {
      return storeLocations[key as keyof typeof storeLocations].id;
    }
  }
  return "alSomait"; // Fallback to Al-Somait if no default is found
};
