
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PatientRxManager } from "@/components/PatientRxManager";
import { usePatientStore } from "@/store/patientStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { printRxReceipt } from "@/components/RxReceiptPrint";

const RxManager: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientId = searchParams.get("patientId");
  const { getPatientById } = usePatientStore();
  const { t } = useLanguageStore();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (patientId) {
      const patientData = getPatientById(patientId);
      if (patientData) {
        setPatient(patientData);
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [patientId, getPatientById, navigate]);

  const handlePrintRequest = (language?: 'en' | 'ar') => {
    if (!patient) return;
    
    printRxReceipt({
      patientName: patient.name,
      patientPhone: patient.phone,
      rx: patient.rx,
      forcedLanguage: language
    });
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
          <h1 className="text-2xl font-semibold">{t("prescriptionManagement")}</h1>
        </div>
      </div>

      {patient && (
        <PatientRxManager
          patientId={patient.patientId}
          patientName={patient.name}
          patientPhone={patient.phone}
          currentRx={patient.rx}
          rxHistory={patient.rxHistory || []}
          notes={patient.notes}
          patientNotes={patient.patientNotes || []}
          onRxPrintRequest={handlePrintRequest}
        />
      )}
    </div>
  );
};

export default RxManager;
