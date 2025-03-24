
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { FrameDetails } from "./FrameDetails";
import { LensDetails } from "./LensDetails";
import { CoatingDetails } from "./CoatingDetails";

interface ProductSectionProps {
  frameData: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  lensType: string;
  lensName: string;
  lensPrice: number;
  coating: string;
  coatingName: string;
  coatingPrice: number;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  frameData,
  lensType,
  lensName,
  lensPrice,
  coating,
  coatingName,
  coatingPrice
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className="mb-3">
      <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
        {isRtl 
          ? "تفاصيل المنتج | Product Details" 
          : "Product Details | تفاصيل المنتج"}
      </div>
      
      <div className="space-y-2 text-sm px-2">
        {/* Frame Details */}
        <FrameDetails frameData={frameData} />
        
        {/* Lens Details */}
        <LensDetails 
          lensType={lensType} 
          lensName={lensName} 
          lensPrice={lensPrice} 
        />
        
        {/* Coating Details */}
        <CoatingDetails 
          coating={coating} 
          coatingName={coatingName} 
          coatingPrice={coatingPrice} 
        />
      </div>
    </div>
  );
};
