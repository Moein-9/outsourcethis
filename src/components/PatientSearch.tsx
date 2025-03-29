
import React, { useState } from "react";
import { usePatientStore, Patient, RxData } from "@/store/patientStore";
import { useInvoiceStore, Invoice } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { printRxReceipt } from "./RxReceiptPrint";
import { PatientNotes } from "./PatientNotes";
import { PatientSearchForm } from "./PatientSearchForm";
import { PatientSearchResults } from "./PatientSearchResults";
import { PatientProfileInfo } from "./PatientProfileInfo";
import { PatientPrescriptionDisplay } from "./PatientPrescriptionDisplay";
import { PatientTransactions } from "./PatientTransactions";
import { EditWorkOrderDialog } from "./EditWorkOrderDialog";
import { AddRxDialog } from "./AddRxDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { WorkOrder } from "@/types/inventory";

interface PatientWithMeta extends Patient {
  dateOfBirth: string;
  lastVisit?: string;
  avatar?: string;
}

export const PatientSearch: React.FC = () => {
  const { patients, searchPatients, updatePatientRx } = usePatientStore();
  const { invoices, workOrders, getInvoicesByPatientId, getWorkOrdersByPatientId } = useInvoiceStore();
  const { language } = useLanguageStore();
  
  const [searchResults, setSearchResults] = useState<PatientWithMeta[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMeta | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<WorkOrder[]>([]);
  
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [editWorkOrderDialogOpen, setEditWorkOrderDialogOpen] = useState(false);
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder | null>(null);
  
  const [isAddRxDialogOpen, setIsAddRxDialogOpen] = useState(false);
  
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
  
  const handlePatientSelect = (patient: PatientWithMeta) => {
    setSelectedPatient(patient);
    
    const patientInvoices = getInvoicesByPatientId(patient.patientId);
    const patientWorkOrders = getWorkOrdersByPatientId(patient.patientId);
    
    setPatientInvoices(patientInvoices);
    setPatientWorkOrders(patientWorkOrders);
    
    setIsProfileOpen(true);
  };
  
  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    // Make sure all required properties are present
    const completeWorkOrder: WorkOrder = {
      ...workOrder,
      id: workOrder.id || '', // Ensure id is present
      framePrice: workOrder.framePrice || 0,
      lensPrice: workOrder.lensPrice || 0,
      coatingPrice: workOrder.coatingPrice || 0,
      discount: workOrder.discount || 0,
      total: workOrder.total || 0
    };
    
    setCurrentWorkOrder(completeWorkOrder);
    setEditWorkOrderDialogOpen(true);
  };
  
  const handleSaveWorkOrder = (updatedWorkOrder: WorkOrder) => {
    toast.success(language === 'ar' ? "تم تحديث أمر العمل بنجاح" : "Work order updated successfully");
    setEditWorkOrderDialogOpen(false);
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
                    <Button 
                      onClick={() => setIsAddRxDialogOpen(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      size="sm"
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                      {language === 'ar' ? "إضافة وصفة جديدة" : "Add New RX"}
                    </Button>
                  </div>
                  
                  <PatientPrescriptionDisplay 
                    rx={selectedPatient.rx}
                    rxHistory={selectedPatient.rxHistory}
                    onPrintPrescription={() => setIsLanguageDialogOpen(true)}
                  />
                  
                  <PatientTransactions 
                    workOrders={patientWorkOrders}
                    invoices={patientInvoices}
                    patient={selectedPatient}
                    onEditWorkOrder={handleEditWorkOrder}
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

      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
        <DialogContent className="max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? "اختر لغة الطباعة" : "Select Print Language"}</DialogTitle>
            <DialogDescription>
              {language === 'ar' ? "الرجاء اختيار لغة طباعة الوصفة الطبية" : "Please select the language for printing the prescription"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" onClick={() => handleLanguageSelection('en')}>
              <img src="/placeholdr.svg" alt="" className="w-5 h-5 mr-2" />
              English
            </Button>
            <Button variant="outline" onClick={() => handleLanguageSelection('ar')}>
              <img src="/placeholdr.svg" alt="" className="w-5 h-5 ml-2" />
              العربية
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EditWorkOrderDialog
        isOpen={editWorkOrderDialogOpen}
        onClose={() => setEditWorkOrderDialogOpen(false)}
        workOrder={currentWorkOrder || {
          id: '',
          framePrice: 0,
          lensPrice: 0,
          coatingPrice: 0,
          discount: 0,
          total: 0
        } as WorkOrder}
        onSave={handleSaveWorkOrder}
      />
      
      {selectedPatient && (
        <AddRxDialog 
          isOpen={isAddRxDialogOpen}
          onClose={() => setIsAddRxDialogOpen(false)}
          onSave={handleSaveRx}
          initialRx={selectedPatient.rx}
        />
      )}
    </div>
  );
};
