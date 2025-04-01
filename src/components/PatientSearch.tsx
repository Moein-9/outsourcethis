import React, { useState, useEffect, useCallback } from "react";
import { usePatientStore, Patient, RxData, ContactLensRx } from "@/store/patientStore";
import { useInvoiceStore, Invoice, WorkOrder as InvoiceWorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { printRxReceipt, RxLanguageDialog } from "./RxReceiptPrint";
import { PatientNotes } from "./PatientNotes";
import { PatientSearchForm } from "./PatientSearchForm";
import { PatientSearchResults } from "./PatientSearchResults";
import { PatientProfileInfo } from "./PatientProfileInfo";
import { PatientPrescriptionDisplay } from "./PatientPrescriptionDisplay";
import { PatientTransactions } from "./PatientTransactions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle, Eye } from "lucide-react";
import { AddRxDialog } from "./AddRxDialog";
import { AddContactLensRxDialog } from "./AddContactLensRxDialog";

interface PatientWithMeta extends Patient {
  dateOfBirth: string;
  lastVisit?: string;
  avatar?: string;
}

export const PatientSearch: React.FC = () => {
  const { patients, searchPatients, updatePatientRx, updateContactLensRx } = usePatientStore();
  const { 
    invoices, 
    workOrders, 
    getInvoicesByPatientId, 
    getWorkOrdersByPatientId,
    getArchivedInvoicesByPatientId,
    getArchivedWorkOrdersByPatientId
  } = useInvoiceStore();
  const { language } = useLanguageStore();
  
  const [searchResults, setSearchResults] = useState<PatientWithMeta[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMeta | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<InvoiceWorkOrder[]>([]);
  const [archivedInvoices, setArchivedInvoices] = useState<Invoice[]>([]);
  const [archivedWorkOrders, setArchivedWorkOrders] = useState<InvoiceWorkOrder[]>([]);
  
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isAddRxDialogOpen, setIsAddRxDialogOpen] = useState(false);
  const [isAddContactLensRxDialogOpen, setIsAddContactLensRxDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const filterByVisitDate = (patients: PatientWithMeta[], dateFilter: string) => {
    if (dateFilter === "all_visits") return patients;
    
    return patients;
  };
  
  const handleSearch = (searchTerm: string, visitDateFilter: string) => {
    if (!searchTerm.trim()) {
      toast.error(language === 'ar' ? "الرجاء إدخال مصطلح البحث" : "Please enter a search term");
      return;
    }
    
    const results = searchPatients(searchTerm).map(patient => {
      return {
        ...patient,
        dateOfBirth: patient.dob,
        lastVisit: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        createdAt: patient.createdAt
      } as PatientWithMeta;
    });
    
    let filteredResults = results;
    filteredResults = filterByVisitDate(filteredResults, visitDateFilter);
    
    setSearchResults(filteredResults);
    setShowResults(true);
    
    if (filteredResults.length === 0) {
      toast.info(language === 'ar' ? "لم يتم العثور على نتائج مطابقة" : "No matching results found");
    }
  };
  
  const clearSearch = () => {
    setSearchResults([]);
    setShowResults(false);
  };
  
  const refreshPatientData = useCallback((patientId: string) => {
    console.log("[PatientSearch] Refreshing patient data for ID:", patientId);
    const patientInvoices = getInvoicesByPatientId(patientId);
    const invoiceWorkOrders = getWorkOrdersByPatientId(patientId);
    const archivedInvs = getArchivedInvoicesByPatientId(patientId);
    const archivedWOs = getArchivedWorkOrdersByPatientId(patientId);
    
    console.log("[PatientSearch] Updated invoices:", patientInvoices.length);
    console.log("[PatientSearch] Updated work orders:", invoiceWorkOrders.length);
    console.log("[PatientSearch] Archived invoices:", archivedInvs.length);
    console.log("[PatientSearch] Archived work orders:", archivedWOs.length);
    
    setPatientInvoices(patientInvoices);
    setPatientWorkOrders(invoiceWorkOrders);
    setArchivedInvoices(archivedInvs);
    setArchivedWorkOrders(archivedWOs);
  }, [getInvoicesByPatientId, getWorkOrdersByPatientId, getArchivedInvoicesByPatientId, getArchivedWorkOrdersByPatientId]);
  
  const handlePatientSelect = (patient: PatientWithMeta) => {
    setSelectedPatient(patient);
    refreshPatientData(patient.patientId);
    setIsProfileOpen(true);
  };
  
  const handleDirectPrint = (printLanguage?: 'en' | 'ar') => {
    if (!selectedPatient) return;
    
    const langToPrint = printLanguage || useLanguageStore.getState().language;
    
    printRxReceipt({
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      rx: selectedPatient.rx,
      forcedLanguage: langToPrint
    });
  };

  const handleContactLensPrint = (printLanguage?: 'en' | 'ar') => {
    if (!selectedPatient || !selectedPatient.contactLensRx) return;
    
    const langToPrint = printLanguage || useLanguageStore.getState().language;
    
    printRxReceipt({
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      rx: selectedPatient.rx,
      contactLensRx: selectedPatient.contactLensRx,
      printContactLens: true,
      forcedLanguage: langToPrint
    });
  };
  
  const handleLanguageSelection = (selectedLanguage: 'en' | 'ar') => {
    setIsLanguageDialogOpen(false);
    handleDirectPrint(selectedLanguage);
  };
  
  const handleSaveRx = (rxData: RxData) => {
    if (!selectedPatient) return;
    
    updatePatientRx(selectedPatient.patientId, rxData);
    
    setSelectedPatient(prev => {
      if (!prev) return null;
      return {
        ...prev,
        rx: rxData,
        rxHistory: [
          ...(prev.rxHistory || []),
          { ...prev.rx, createdAt: new Date().toISOString() }
        ]
      };
    });
    
    toast.success(language === 'ar' ? "تم إضافة الوصفة الطبية بنجاح" : "Prescription added successfully");
  };

  const handleSaveContactLensRx = (rxData: ContactLensRx) => {
    if (!selectedPatient) return;
    
    updateContactLensRx(selectedPatient.patientId, rxData);
    
    setSelectedPatient(prev => {
      if (!prev) return null;
      return {
        ...prev,
        contactLensRx: rxData,
        contactLensRxHistory: [
          ...(prev.contactLensRxHistory || []),
          { ...(prev.contactLensRx || {
            rightEye: { sphere: "", cylinder: "", axis: "", bc: "", dia: "" },
            leftEye: { sphere: "", cylinder: "", axis: "", bc: "", dia: "" }
          }), createdAt: new Date().toISOString() }
        ]
      };
    });
    
    toast.success(language === 'ar' ? "تم إضافة وصفة العدسات اللاصقة بنجاح" : "Contact lens prescription added successfully");
  };
  
  useEffect(() => {
    if (refreshTrigger > 0 && selectedPatient) {
      refreshPatientData(selectedPatient.patientId);
    }
  }, [refreshTrigger, selectedPatient, refreshPatientData]);
  
  return (
    <div className="space-y-6">
      <PatientSearchForm 
        onSearch={handleSearch} 
        onClear={clearSearch} 
      />
      
      {showResults && (
        <PatientSearchResults 
          searchResults={searchResults} 
          onSelectPatient={handlePatientSelect} 
        />
      )}
      
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-[90vw] max-h-[90vh] overflow-y-auto p-4 lg:p-6">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{language === 'ar' ? "ملف العميل" : "Client Profile"}</DialogTitle>
                <DialogDescription>
                  {language === 'ar' ? "تفاصيل بيانات العميل وسجل المعاملات" : "Client details and transaction history"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 py-4">
                <div className="md:col-span-1">
                  <PatientProfileInfo 
                    patient={selectedPatient} 
                    invoices={patientInvoices}
                    onPrintPrescription={() => setIsLanguageDialogOpen(true)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-medium text-indigo-700">
                      {language === 'ar' ? "الوصفة الطبية" : "Prescription"}
                    </h3>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsAddRxDialogOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        size="sm"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                        {language === 'ar' ? "إضافة وصفة نظارات" : "Add Glasses RX"}
                      </Button>
                      <Button 
                        onClick={() => setIsAddContactLensRxDialogOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        {language === 'ar' ? "إضافة وصفة عدسات" : "Add Contact Lens RX"}
                      </Button>
                    </div>
                  </div>
                  
                  <PatientPrescriptionDisplay 
                    rx={selectedPatient.rx}
                    rxHistory={selectedPatient.rxHistory}
                    contactLensRx={selectedPatient.contactLensRx}
                    contactLensRxHistory={selectedPatient.contactLensRxHistory}
                    onPrintPrescription={() => setIsLanguageDialogOpen(true)}
                    onPrintContactLensPrescription={handleContactLensPrint}
                  />
                  
                  <PatientTransactions 
                    key={`transactions-${refreshTrigger}`}
                    workOrders={patientWorkOrders}
                    invoices={patientInvoices}
                    patient={selectedPatient}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <PatientNotes patientId={selectedPatient.patientId} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <RxLanguageDialog
        isOpen={isLanguageDialogOpen}
        onClose={() => setIsLanguageDialogOpen(false)}
        onSelect={handleLanguageSelection}
      />
      
      {selectedPatient && (
        <>
          <AddRxDialog 
            isOpen={isAddRxDialogOpen}
            onClose={() => setIsAddRxDialogOpen(false)}
            onSave={handleSaveRx}
            initialRx={selectedPatient.rx}
          />
          
          <AddContactLensRxDialog 
            isOpen={isAddContactLensRxDialogOpen}
            onClose={() => setIsAddContactLensRxDialogOpen(false)}
            onSave={handleSaveContactLensRx}
            initialRx={selectedPatient.contactLensRx}
          />
        </>
      )}
    </div>
  );
};
