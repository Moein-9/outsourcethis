
import React from "react";
import { Patient } from "@/store/patientStore";
import { PatientRxManager } from "./PatientRxManager";
import { printRxReceipt } from "./RxReceiptPrint";

interface PatientRxSectionProps {
  patient: Patient;
}

export const PatientRxSection: React.FC<PatientRxSectionProps> = ({ patient }) => {
  // Format the RX data to ensure no dash values in ADD fields
  const formattedRx = React.useMemo(() => {
    if (!patient.rx) return undefined;
    
    const rx = { ...patient.rx };
    // Replace dashes with empty strings for ADD values
    if (rx.addOD === '-') rx.addOD = '';
    if (rx.addOS === '-') rx.addOS = '';
    
    return rx;
  }, [patient.rx]);

  const handlePrintRx = (language?: 'en' | 'ar') => {
    printRxReceipt({
      patientName: patient.name,
      patientPhone: patient.phone,
      rx: formattedRx || patient.rx,
      forcedLanguage: language
    });
  };

  return (
    <PatientRxManager
      patientId={patient.patientId}
      patientName={patient.name}
      patientPhone={patient.phone}
      currentRx={formattedRx || patient.rx}
      rxHistory={patient.rxHistory}
      patientNotes={patient.patientNotes}
      onRxPrintRequest={handlePrintRx}
      contactLensRx={patient.contactLensRx}
      contactLensRxHistory={patient.contactLensRxHistory}
    />
  );
};
