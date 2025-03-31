
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

// Updated store information with two locations
export const storeLocations = [
  {
    id: "al-somait",
    name: "Moen Optician",
    nameAr: "نظارات المعين",
    address: {
      en: "Al-Somait Plaza, Habeeb Munawer Street, Al Farwaniyah, Kuwait",
      ar: "مجمع الصميط بلازا، شارع حبيب مناور، الفروانية، الكويت"
    },
    phone: "24759016",
    title: {
      en: "Al-Somait Plaza",
      ar: "مجمع الصميط بلازا"
    }
  },
  {
    id: "al-arbid",
    name: "Moen Optician",
    nameAr: "نظارات المعين",
    address: {
      en: "Al Arbid Gallery Mall, Habeeb Munawer Street, Al Farwaniyah, Kuwait",
      ar: "مجمع العربيد جاليري، شارع حبيب مناور، الفروانية، الكويت"
    },
    phone: "24748201",
    title: {
      en: "Al Arbid Gallery Mall",
      ar: "مجمع العربيد جاليري"
    }
  }
];

// For backward compatibility
export const storeInfo = {
  name: "Moen Optician",
  address: storeLocations[0].address.en,
  phone: storeLocations[0].phone
};
