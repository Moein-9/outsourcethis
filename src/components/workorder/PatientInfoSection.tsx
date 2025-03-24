
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { User, Phone, Calendar } from "lucide-react";

interface PatientInfoSectionProps {
  patientName: string;
  patientPhone?: string;
}

export const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({
  patientName,
  patientPhone,
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className="mb-3">
      <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
        {isRtl 
          ? "معلومات المريض | Patient Information" 
          : "Patient Information | معلومات المريض"}
      </div>
      
      <div className="space-y-1 text-sm px-3">
        <div className="flex justify-between items-center">
          <span className="font-bold flex items-center gap-1">
            <User className="h-3.5 w-3.5" /> {t("customer")}:
          </span>
          <span className="font-medium">{patientName}</span>
        </div>
        
        {patientPhone && (
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {t("phone")}:
            </span>
            <span>{patientPhone}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="font-bold flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {t("date")}:
          </span>
          <span>{format(new Date(), 'dd/MM/yyyy')}</span>
        </div>
      </div>
    </div>
  );
};
