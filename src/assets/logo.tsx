
import React from "react";

export const MoenLogo: React.FC<{ className?: string; onClick?: () => void }> = ({ 
  className = "w-auto h-12", 
  onClick 
}) => {
  return (
    <img 
      src="/lovable-uploads/41d720a7-f9c6-4e2e-ad9b-1bf22f7969a1.png" 
      alt="Moen Optician" 
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export const MoenLogoGreen: React.FC<{ className?: string; onClick?: () => void }> = ({ 
  className = "w-auto h-12", 
  onClick 
}) => {
  return (
    <img 
      src="/lovable-uploads/41d720a7-f9c6-4e2e-ad9b-1bf22f7969a1.png" 
      alt="Moen Optician" 
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export const MoenLogoBlack: React.FC<{ className?: string; onClick?: () => void }> = ({ 
  className = "w-auto h-12", 
  onClick 
}) => {
  return (
    <img 
      src="/lovable-uploads/41d720a7-f9c6-4e2e-ad9b-1bf22f7969a1.png" 
      alt="Moen Optician" 
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export const storeInfo = {
  name: "Moen Optician",
  address: "al-somait plaza, Habeeb Munawer St, Al Farwaniyah",
  phone: "2475 9016"
};
