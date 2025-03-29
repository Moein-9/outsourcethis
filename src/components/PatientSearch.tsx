
import React, { useState, useEffect, useCallback } from "react";
import { usePatientStore, Patient, RxData } from "@/store/patientStore";
import { useInvoiceStore, Invoice, WorkOrder as InvoiceWorkOrder } from "@/store/invoiceStore";
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
import { WorkOrder as InventoryWorkOrder } from "@/types/inventory";

interface PatientWithMeta extends Patient {
  dateOfBirth: string;
  lastVisit?: string;
  avatar?: string;
}

export const PatientSearch: React.FC = () => {
  const { patients, searchPatients, updatePatientRx } = usePatientStore();
  const { invoices, workOrders, getInvoicesByPatientId, getWorkOrdersByPatientId, updateInvoice, updateWorkOrder } = useInvoiceStore();
  const { language } = useLanguageStore();
  
  const [searchResults, setSearchResults] = useState<PatientWithMeta[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMeta | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<InvoiceWorkOrder[]>([]);
  
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [editWorkOrderDialogOpen, setEditWorkOrderDialogOpen] = useState(false);
  const [currentWorkOrder, setCurrentWorkOrder] = useState<InventoryWorkOrder | null>(null);
  
  const [isAddRxDialogOpen, setIsAddRxDialogOpen] = useState(false);
  const [editTimestamp, setEditTimestamp] = useState<string | null>(null);
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
    
    console.log("[PatientSearch] Updated invoices:", patientInvoices.length);
    console.log("[PatientSearch] Updated work orders:", invoiceWorkOrders.length);
    
    setPatientInvoices(patientInvoices);
    setPatientWorkOrders(invoiceWorkOrders);
  }, [getInvoicesByPatientId, getWorkOrdersByPatientId]);
  
  const handlePatientSelect = (patient: PatientWithMeta) => {
    setSelectedPatient(patient);
    refreshPatientData(patient.patientId);
    setIsProfileOpen(true);
  };
  
  // Create a custom type for the internal work order that has all the needed properties
  interface ExtendedWorkOrder extends InvoiceWorkOrder {
    frameBrand?: string;
    frameModel?: string;
    frameColor?: string;
    frameSize?: string;
    framePrice?: number;
    lensPrice?: number;
    coating?: string;
    coatingPrice?: number;
    discount?: number;
    total?: number;
    isPaid?: boolean;
  }
  
  const convertToInventoryWorkOrder = (workOrder: InvoiceWorkOrder): InventoryWorkOrder => {
    // Cast to ExtendedWorkOrder to avoid TypeScript errors
    const extendedWorkOrder = workOrder as ExtendedWorkOrder;
    
    // Create a lensType that is compatible with InventoryWorkOrder
    let lensTypeValue: string | { name: string; price: number };
    
    if (typeof extendedWorkOrder.lensType === 'object' && extendedWorkOrder.lensType !== null) {
      lensTypeValue = extendedWorkOrder.lensType;
    } else {
      lensTypeValue = {
        name: String(extendedWorkOrder.lensType || ''),
        price: extendedWorkOrder.lensPrice || 0
      };
    }
    
    return {
      id: extendedWorkOrder.id,
      patientId: extendedWorkOrder.patientId,
      workOrderId: extendedWorkOrder.id, // Use id as workOrderId
      invoiceId: extendedWorkOrder.id,
      createdAt: extendedWorkOrder.createdAt || new Date().toISOString(),
      frameBrand: extendedWorkOrder.frameBrand || '',
      frameModel: extendedWorkOrder.frameModel || '',
      frameColor: extendedWorkOrder.frameColor || '',
      frameSize: extendedWorkOrder.frameSize || '',
      framePrice: extendedWorkOrder.framePrice || 0,
      lensType: lensTypeValue,
      lensPrice: extendedWorkOrder.lensPrice || 0,
      coating: extendedWorkOrder.coating || '',
      coatingPrice: extendedWorkOrder.coatingPrice || 0,
      discount: extendedWorkOrder.discount || 0,
      total: extendedWorkOrder.total || 0,
      isPaid: extendedWorkOrder.isPaid || false,
      isPickedUp: extendedWorkOrder.isPickedUp,
      pickedUpAt: extendedWorkOrder.pickedUpAt,
      lastEditedAt: extendedWorkOrder.lastEditedAt,
      editHistory: extendedWorkOrder.editHistory,
      isRefunded: extendedWorkOrder.isRefunded,
      refundDate: extendedWorkOrder.refundDate,
      contactLenses: extendedWorkOrder.contactLenses,
      contactLensRx: extendedWorkOrder.contactLensRx
    };
  };
  
  const handleEditWorkOrder = (workOrder: InvoiceWorkOrder) => {
    const inventoryWorkOrder = convertToInventoryWorkOrder(workOrder);
    
    setCurrentWorkOrder(inventoryWorkOrder);
    setEditWorkOrderDialogOpen(true);
  };
  
  const handleSaveWorkOrder = (updatedWorkOrder: InventoryWorkOrder) => {
    // Set the edit timestamp for UI refresh
    const now = new Date().toISOString();
    setEditTimestamp(now);
    
    // Convert lensType to string or object for invoice update
    const lensTypeForInvoice = typeof updatedWorkOrder.lensType === 'object' 
      ? updatedWorkOrder.lensType.name 
      : updatedWorkOrder.lensType;
    
    // First, update the local work order state
    if (updatedWorkOrder.id) {
      // Convert to InvoiceWorkOrder type before updating
      const invoiceWorkOrderUpdate: InvoiceWorkOrder = {
        id: updatedWorkOrder.id,
        patientId: updatedWorkOrder.patientId,
        createdAt: updatedWorkOrder.createdAt,
        lensType: typeof updatedWorkOrder.lensType === 'object' 
          ? updatedWorkOrder.lensType 
          : { name: String(updatedWorkOrder.lensType), price: updatedWorkOrder.lensPrice },
        isPickedUp: updatedWorkOrder.isPickedUp,
        pickedUpAt: updatedWorkOrder.pickedUpAt,
        lastEditedAt: now,
        editHistory: updatedWorkOrder.editHistory,
        isRefunded: updatedWorkOrder.isRefunded,
        refundDate: updatedWorkOrder.refundDate,
        contactLenses: updatedWorkOrder.contactLenses,
        contactLensRx: updatedWorkOrder.contactLensRx
      };
      
      // Add the extended properties to the work order update
      const extendedWorkOrderUpdate = invoiceWorkOrderUpdate as ExtendedWorkOrder;
      extendedWorkOrderUpdate.frameBrand = updatedWorkOrder.frameBrand;
      extendedWorkOrderUpdate.frameModel = updatedWorkOrder.frameModel;
      extendedWorkOrderUpdate.frameColor = updatedWorkOrder.frameColor;
      extendedWorkOrderUpdate.frameSize = updatedWorkOrder.frameSize;
      extendedWorkOrderUpdate.framePrice = updatedWorkOrder.framePrice;
      extendedWorkOrderUpdate.lensPrice = updatedWorkOrder.lensPrice;
      extendedWorkOrderUpdate.coating = updatedWorkOrder.coating;
      extendedWorkOrderUpdate.coatingPrice = updatedWorkOrder.coatingPrice;
      extendedWorkOrderUpdate.discount = updatedWorkOrder.discount;
      extendedWorkOrderUpdate.total = updatedWorkOrder.total;
      extendedWorkOrderUpdate.isPaid = updatedWorkOrder.isPaid;
      
      // Update the work order in our store
      if (typeof updateWorkOrder === 'function') {
        updateWorkOrder(extendedWorkOrderUpdate);
      }
      
      // Find the existing invoice to update
      const existingInvoice = patientInvoices.find(i => i.workOrderId === updatedWorkOrder.id);
      
      // Create an invoice copy to update the invoice
      const invoiceToUpdate: Invoice = {
        invoiceId: updatedWorkOrder.invoiceId || updatedWorkOrder.id,
        workOrderId: updatedWorkOrder.id,
        lastEditedAt: now,
        frameBrand: updatedWorkOrder.frameBrand,
        frameModel: updatedWorkOrder.frameModel,
        frameColor: updatedWorkOrder.frameColor,
        frameSize: updatedWorkOrder.frameSize,
        framePrice: updatedWorkOrder.framePrice,
        lensType: lensTypeForInvoice,
        lensPrice: updatedWorkOrder.lensPrice,
        coating: updatedWorkOrder.coating,
        coatingPrice: updatedWorkOrder.coatingPrice,
        discount: updatedWorkOrder.discount,
        total: updatedWorkOrder.total,
        editHistory: updatedWorkOrder.editHistory,
        
        // Required fields from Invoice type that might not be in the updated work order
        patientName: existingInvoice?.patientName || 'Unknown',
        patientPhone: existingInvoice?.patientPhone || '',
        patientId: updatedWorkOrder.patientId,
        paymentMethod: existingInvoice?.paymentMethod || 'Cash',
        deposit: existingInvoice?.deposit || 0,
        remaining: existingInvoice?.remaining || 0,
        isPaid: updatedWorkOrder.isPaid || existingInvoice?.isPaid || false,
        createdAt: existingInvoice?.createdAt || updatedWorkOrder.createdAt
      };
      
      // Update the invoice in the store
      updateInvoice(invoiceToUpdate);
      
      // Trigger an immediate refresh
      setRefreshTrigger(prev => prev + 1);
      
      // Show success message
      toast.success(language === 'ar' ? "تم تحديث أمر العمل بنجاح" : "Work order updated successfully");
    }
    
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
  
  // Effect to refresh data after edits
  useEffect(() => {
    if (editTimestamp && selectedPatient) {
      // Refresh data after a short delay to ensure store has updated
      const timer = setTimeout(() => {
        refreshPatientData(selectedPatient.patientId);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [editTimestamp, selectedPatient, refreshPatientData]);
  
  // Effect to refresh data when refresh trigger changes
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
                    key={`transactions-${refreshTrigger}`}
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

      {currentWorkOrder && (
        <EditWorkOrderDialog
          isOpen={editWorkOrderDialogOpen}
          onClose={() => setEditWorkOrderDialogOpen(false)}
          workOrder={currentWorkOrder}
          onSave={handleSaveWorkOrder}
        />
      )}
      
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
