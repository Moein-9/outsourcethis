
import React from "react";
import { Patient } from "@/store/patientStore";
import { PatientRxManager } from "./PatientRxManager";
import { printRxReceipt } from "./RxReceiptPrint";

interface PatientRxSectionProps {
  patient: Patient;
}

export const PatientRxSection: React.FC<PatientRxSectionProps> = ({ patient }) => {
  const handlePrintRx = (language?: 'en' | 'ar') => {
    printRxReceipt({
      patientName: patient.name,
      patientPhone: patient.phone,
      rx: patient.rx,
      forcedLanguage: language
    });
  };

  return (
    <PatientRxManager
      patientId={patient.patientId}
      patientName={patient.name}
      patientPhone={patient.phone}
      currentRx={patient.rx}
      rxHistory={patient.rxHistory}
      patientNotes={patient.patientNotes}
      onRxPrintRequest={handlePrintRx}
      contactLensRx={patient.contactLensRx}
      contactLensRxHistory={patient.contactLensRxHistory}
    />
  );
};
