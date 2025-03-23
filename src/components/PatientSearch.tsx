import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore, Patient } from "@/store/patientStore";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { printRxReceipt } from "./RxReceiptPrint";
import { PatientNotes } from "./PatientNotes";
import { PatientSearchForm } from "./PatientSearchForm";
import { PatientSearchResults } from "./PatientSearchResults";
import { PatientProfileInfo } from "./PatientProfileInfo";
import { PatientPrescriptionDisplay } from "./PatientPrescriptionDisplay";
import { PatientTransactions } from "./PatientTransactions";
import { EditWorkOrderDialog } from "./EditWorkOrderDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Check, ArrowRight } from "lucide-react";

interface PatientWithMeta extends Patient {
  dateOfBirth: string;
  lastVisit?: string;
  avatar?: string;
}

export const PatientSearch: React.FC = () => {
  const navigate = useNavigate();
  const { patients, searchPatients } = usePatientStore();
  const { 
    invoices, 
    workOrders, 
    getInvoicesByPatientId, 
    getWorkOrdersByPatientId,
    updateWorkOrder 
  } = useInvoiceStore();
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
  
  // Effect to refresh data when profile is open
  useEffect(() => {
    if (isProfileOpen && selectedPatient) {
      refreshPatientData(selectedPatient.patientId);
    }
  }, [isProfileOpen, invoices, workOrders]);
  
  const refreshPatientData = (patientId: string) => {
    const updatedInvoices = getInvoicesByPatientId(patientId);
    const updatedWorkOrders = getWorkOrdersByPatientId(patientId);
    
    setPatientInvoices(updatedInvoices);
    setPatientWorkOrders(updatedWorkOrders);
  };
  
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
    
    // Fetch fresh data from the store
    const patientInvoices = getInvoicesByPatientId(patient.patientId);
    const patientWorkOrders = getWorkOrdersByPatientId(patient.patientId);
    
    setPatientInvoices(patientInvoices);
    setPatientWorkOrders(patientWorkOrders);
    
    setIsProfileOpen(true);
  };
  
  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    if (selectedPatient) {
      navigate(`/invoice?patientId=${selectedPatient.patientId}&workOrderId=${workOrder.id}`);
      setIsProfileOpen(false);
    }
  };
  
  const handleMarkAsPickedUp = (workOrder: WorkOrder) => {
    try {
      const updatedWorkOrder = {
        ...workOrder,
        status: 'completed',
        pickedUpAt: new Date().toISOString()
      };
      
      // Update the work order in the store
      updateWorkOrder(updatedWorkOrder);
      
      // Refresh patient data to see the changes
      if (selectedPatient) {
        refreshPatientData(selectedPatient.patientId);
      }
      
      toast.success(language === 'ar' ? "تم تحديث حالة الطلب إلى: استلمه العميل" : "Order status updated to: Picked up by customer");
    } catch (error) {
      console.error("Error updating work order status:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء تحديث حالة الطلب" : "Error updating order status");
    }
  };
  
  const handleSaveWorkOrder = (updatedWorkOrder: WorkOrder) => {
    try {
      // Update the work order in the store
      updateWorkOrder(updatedWorkOrder);
      
      // Refresh patient data to see the changes
      if (selectedPatient) {
        refreshPatientData(selectedPatient.patientId);
      }
      
      toast.success(language === 'ar' ? "تم تحديث أمر العمل بنجاح" : "Work order updated successfully");
    } catch (error) {
      console.error("Error updating work order:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء تحديث أمر العمل" : "Error updating work order");
    }
    
    setEditWorkOrderDialogOpen(false);
  };
  
  const handleAddNewRx = () => {
    if (selectedPatient) {
      navigate(`/rx-manager?patientId=${selectedPatient.patientId}`);
      setIsProfileOpen(false);
    }
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{language === 'ar' ? "ملف العميل" : "Client Profile"}</DialogTitle>
                <DialogDescription>
                  {language === 'ar' ? "تفاصيل بيانات العميل وسجل المعاملات" : "Client details and transaction history"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <PatientProfileInfo 
                    patient={selectedPatient} 
                    invoices={patientInvoices}
                    onPrintPrescription={() => setIsLanguageDialogOpen(true)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <PatientPrescriptionDisplay 
                      rx={selectedPatient.rx}
                      rxHistory={selectedPatient.rxHistory}
                      onPrintPrescription={() => setIsLanguageDialogOpen(true)}
                    />
                    <Button 
                      variant="outline" 
                      className="h-8 gap-1 absolute top-4 right-4"
                      onClick={handleAddNewRx}
                    >
                      <Plus className="h-4 w-4" />
                      {language === 'ar' ? "وصفة طبية جديدة" : "New RX"}
                    </Button>
                  </div>
                  
                  <PatientTransactions 
                    workOrders={patientWorkOrders}
                    invoices={patientInvoices}
                    onEditWorkOrder={handleEditWorkOrder}
                    onMarkAsPickedUp={handleMarkAsPickedUp}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? "اختر لغة الطباعة" : "Select Print Language"}</DialogTitle>
            <DialogDescription>
              {language === 'ar' ? "الرجاء اختيار لغة طباعة الوصفة الطبية" : "Please select the language for printing the prescription"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" onClick={() => handleDirectPrint('en')}>
              <img src="/placeholdr.svg" alt="" className="w-5 h-5 mr-2" />
              English
            </Button>
            <Button variant="outline" onClick={() => handleDirectPrint('ar')}>
              <img src="/placeholdr.svg" alt="" className="w-5 h-5 ml-2" />
              العربية
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EditWorkOrderDialog
        isOpen={editWorkOrderDialogOpen}
        onClose={() => setEditWorkOrderDialogOpen(false)}
        workOrder={currentWorkOrder || {} as WorkOrder}
        onSave={handleSaveWorkOrder}
      />
    </div>
  );
};
