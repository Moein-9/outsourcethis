
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

// Updated store information with multiple locations
export const storeLocations = {
  alArbid: {
    id: "alArbid",
    name: "Moen Optician", 
    nameEn: "Moen Optician",
    nameAr: "نظارات المعين",
    locationEn: "Al Arbid Gallery Mall",
    locationAr: "مجمع العربيد جاليري",
    addressEn: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
    addressAr: "شارع حبيب مناور، الفروانية، الكويت",
    phone: "24748201",
    phoneFormatted: "2474 8201"
  },
  alSomait: {
    id: "alSomait",
    name: "Moen Optician",
    nameEn: "Moen Optician",
    nameAr: "نظارات المعين",
    locationEn: "Al-Somait Plaza",
    locationAr: "مجمع الصميط بلازا",
    addressEn: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
    addressAr: "شارع حبيب مناور، الفروانية، الكويت",
    phone: "24759016",
    phoneFormatted: "2475 9016"
  }
};

// Default store information (for backward compatibility)
export const storeInfo = {
  name: "Moen Optician",
  address: storeLocations.alSomait.locationEn + ", " + storeLocations.alSomait.addressEn,
  phone: storeLocations.alSomait.phoneFormatted
};

// Function to get store information based on language and location
export const getStoreInfo = (locationId = "alSomait", language = "en") => {
  const location = storeLocations[locationId as keyof typeof storeLocations] || storeLocations.alSomait;
  
  if (language === "ar") {
    return {
      name: location.nameAr,
      location: location.locationAr,
      address: location.addressAr,
      phone: location.phone,
      phoneFormatted: location.phoneFormatted
    };
  }
  
  return {
    name: location.nameEn,
    location: location.locationEn,
    address: location.addressEn,
    phone: location.phone,
    phoneFormatted: location.phoneFormatted
  };
};
