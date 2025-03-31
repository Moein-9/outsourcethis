
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

// Store locations with full information in both languages
export const storeLocations = [
  {
    id: "somait",
    name: "Al-Somait Plaza | مجمع الصميط بلازا",
    nameEn: "Al-Somait Plaza",
    nameAr: "مجمع الصميط بلازا",
    addressEn: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
    addressAr: "شارع حبيب مناور، الفروانية، الكويت",
    phone: "24759016",
    isDefault: true
  },
  {
    id: "arbid",
    name: "Al Arbid Gallery Mall | مجمع العربيد جاليري",
    nameEn: "Al Arbid Gallery Mall",
    nameAr: "مجمع العربيد جاليري",
    addressEn: "Habeeb Munawer Street, Al Farwaniyah, Kuwait",
    addressAr: "شارع حبيب مناور، الفروانية، الكويت",
    phone: "24748201",
    isDefault: false
  }
];

// For backward compatibility
export const storeInfo = {
  name: "Moen Optician",
  address: storeLocations[0].addressEn,
  phone: storeLocations[0].phone
};
