
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
import { PatientRxDialog } from "./PatientRxDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, 
  Check, 
  ArrowRight, 
  Edit, 
  CheckCircle2, 
  Printer,
  User
} from "lucide-react";

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
    updateWorkOrder,
    addWorkOrder
  } = useInvoiceStore();
  const { language, t } = useLanguageStore();
  
  const [searchResults, setSearchResults] = useState<PatientWithMeta[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMeta | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<WorkOrder[]>([]);
  
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isRxDialogOpen, setIsRxDialogOpen] = useState(false);
  
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
      toast({
        title: t("error"),
        description: t("pleaseEnterSearchTerm"),
        variant: "destructive"
      });
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
      toast({
        title: t("info"),
        description: t("noResultsFound")
      });
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
    if (selectedPatient) {
      navigate(`/invoice?patientId=${selectedPatient.patientId}&workOrderId=${workOrder.id}`);
      setIsProfileOpen(false);
    }
  };
  
  const handleMarkAsPickedUp = (workOrder: WorkOrder) => {
    try {
      const updatedWorkOrder: WorkOrder = {
        ...workOrder,
        status: 'completed' as 'completed',
        pickedUpAt: new Date().toISOString()
      };
      
      updateWorkOrder(updatedWorkOrder);
      
      if (selectedPatient) {
        refreshPatientData(selectedPatient.patientId);
      }
      
      toast({
        title: t("success"),
        description: t("orderMarkedAsPickedUp")
      });
    } catch (error) {
      console.error("Error updating work order status:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingOrderStatus"),
        variant: "destructive"
      });
    }
  };
  
  const handleAddNewRx = () => {
    if (selectedPatient) {
      setIsRxDialogOpen(true);
    }
  };
  
  const handleRxPrintRequest = (language?: 'en' | 'ar') => {
    if (!selectedPatient) return;
    
    const langToPrint = language || useLanguageStore.getState().language;
    
    printRxReceipt({
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      rx: selectedPatient.rx,
      forcedLanguage: langToPrint
    });
  };
  
  const handlePatientDataRefresh = () => {
    if (selectedPatient) {
      // Refresh the patient data to reflect RX changes
      const refreshedPatient = searchPatients(selectedPatient.patientId, true)[0];
      if (refreshedPatient) {
        setSelectedPatient({
          ...refreshedPatient,
          dateOfBirth: refreshedPatient.dob,
          lastVisit: selectedPatient.lastVisit,
        } as PatientWithMeta);
      }
    }
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
                <DialogTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {selectedPatient.name}
                </DialogTitle>
                <DialogDescription>
                  {t("patientProfileAndHistory")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <PatientProfileInfo 
                    patient={selectedPatient} 
                    invoices={patientInvoices}
                    onPrintPrescription={() => handleRxPrintRequest()}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {t("prescription")}
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          className="h-8 gap-1"
                          onClick={handleAddNewRx}
                        >
                          <Plus className="h-4 w-4" />
                          {t("newRx")}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <PatientPrescriptionDisplay 
                        rx={selectedPatient.rx}
                        rxHistory={selectedPatient.rxHistory}
                        onPrintPrescription={() => handleRxPrintRequest()}
                      />
                    </CardContent>
                  </Card>
                  
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

      {selectedPatient && (
        <PatientRxDialog
          open={isRxDialogOpen}
          onOpenChange={setIsRxDialogOpen}
          patientId={selectedPatient.patientId}
          currentRx={selectedPatient.rx}
          onRxSaved={handlePatientDataRefresh}
        />
      )}
    </div>
  );
};
