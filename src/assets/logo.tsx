
import React from "react";

export const MoenLogo: React.FC<{ className?: string; onClick?: () => void }> = ({ 
  className = "w-auto h-12", 
  onClick 
}) => {
  return (
    <img 
      src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" 
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
      src="/lovable-uploads/268d32e7-5d4a-4f77-bda8-2566232a44ab.png" 
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
      src="/lovable-uploads/90a547db-d744-4e5e-96e0-2b17500d03be.png" 
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
