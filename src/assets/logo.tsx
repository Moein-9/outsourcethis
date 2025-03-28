
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

// Updated store information based on invoice details
export const storeInfo = {
  name: "Moen Optician",
  address: "al-somait plaza, Habeeb Munawer St, Al Farwaniyah",
  phone: "2475 9016"
};
