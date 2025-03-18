
import React from "react";

export const MoenLogo: React.FC<{ className?: string; onClick?: () => void }> = ({ 
  className = "w-auto h-12", 
  onClick 
}) => {
  return (
    <img 
      src="/lovable-uploads/65134e9d-139c-462c-a2ad-648373fd57e0.png" 
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
      src="/lovable-uploads/65134e9d-139c-462c-a2ad-648373fd57e0.png" 
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
      src="/lovable-uploads/65134e9d-139c-462c-a2ad-648373fd57e0.png" 
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
