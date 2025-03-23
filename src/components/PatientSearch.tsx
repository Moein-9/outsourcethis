
import React, { useState } from "react";
import { usePatientStore, Patient, RxData } from "@/store/patientStore";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  // Add New RX state
  const [isAddRxDialogOpen, setIsAddRxDialogOpen] = useState(false);
  const [newRx, setNewRx] = useState<RxData>({
    sphereOD: "",
    cylOD: "",
    axisOD: "",
    addOD: "",
    sphereOS: "",
    cylOS: "",
    axisOS: "",
    addOS: "",
    pdRight: "",
    pdLeft: "",
  });
  
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
    setCurrentWorkOrder(workOrder);
    setEditWorkOrderDialogOpen(true);
  };
  
  const handleSaveWorkOrder = (updatedWorkOrder: WorkOrder) => {
    toast.success(language === 'ar' ? "تم تحديث أمر العمل بنجاح" : "Work order updated successfully");
    setEditWorkOrderDialogOpen(false);
  };
  
  const handleDirectPrint = (printLanguage?: string) => {
    if (!selectedPatient) return;
    
    const langToPrint = printLanguage || language;
    
    printRxReceipt({
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      rx: selectedPatient.rx,
      forcedLanguage: langToPrint as 'en' | 'ar'
    });
  };
  
  const handleLanguageSelection = (selectedLanguage: 'en' | 'ar') => {
    setIsLanguageDialogOpen(false);
    handleDirectPrint(selectedLanguage);
  };
  
  // Add New RX handlers
  const handleOpenAddRxDialog = () => {
    if (!selectedPatient) return;
    
    // Initialize with current RX values
    setNewRx({
      sphereOD: selectedPatient.rx.sphereOD || "",
      cylOD: selectedPatient.rx.cylOD || "",
      axisOD: selectedPatient.rx.axisOD || "",
      addOD: selectedPatient.rx.addOD || "",
      sphereOS: selectedPatient.rx.sphereOS || "",
      cylOS: selectedPatient.rx.cylOS || "",
      axisOS: selectedPatient.rx.axisOS || "",
      addOS: selectedPatient.rx.addOS || "",
      pdRight: selectedPatient.rx.pdRight || "",
      pdLeft: selectedPatient.rx.pdLeft || "",
    });
    
    setIsAddRxDialogOpen(true);
  };
  
  const handleSaveRx = () => {
    if (!selectedPatient) return;
    
    // Update the patient's RX
    updatePatientRx(selectedPatient.patientId, newRx);
    
    // Update local state to reflect changes immediately
    setSelectedPatient({
      ...selectedPatient,
      rx: newRx,
    });
    
    toast.success(language === 'ar' ? "تم تحديث الوصفة الطبية بنجاح" : "Prescription updated successfully");
    setIsAddRxDialogOpen(false);
  };
  
  // Helper for generating sphere/cylinder options
  const generateDiopterOptions = () => {
    const options = [];
    
    // Negative values from -10.00 to -0.25 in steps of 0.25
    for (let i = -10; i < 0; i += 0.25) {
      options.push(i.toFixed(2));
    }
    
    // Zero
    options.push("0.00");
    
    // Positive values from +0.25 to +10.00 in steps of 0.25
    for (let i = 0.25; i <= 10; i += 0.25) {
      options.push(`+${i.toFixed(2)}`);
    }
    
    return options;
  };
  
  // Helper for generating axis options
  const generateAxisOptions = () => {
    const options = [];
    
    // Axis from 1 to 180 in steps of 1
    for (let i = 1; i <= 180; i++) {
      options.push(i.toString());
    }
    
    return options;
  };
  
  // Helper for generating add options
  const generateAddOptions = () => {
    const options = ["none"];
    
    // Add from +0.25 to +4.00 in steps of 0.25
    for (let i = 0.25; i <= 4; i += 0.25) {
      options.push(`+${i.toFixed(2)}`);
    }
    
    return options;
  };
  
  // Helper for generating PD options
  const generatePdOptions = () => {
    const options = [];
    
    // PD from 50 to 80 in steps of 0.5
    for (let i = 50; i <= 80; i += 0.5) {
      options.push(i.toFixed(1));
    }
    
    return options;
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {language === 'ar' ? "الوصفة الطبية" : "Prescription"}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleOpenAddRxDialog}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {language === 'ar' ? "وصفة طبية جديدة" : "Add New RX"}
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
        <DialogContent className="max-w-md">
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
        workOrder={currentWorkOrder || {} as WorkOrder}
        onSave={handleSaveWorkOrder}
      />
      
      {/* Add New RX Dialog */}
      <Dialog open={isAddRxDialogOpen} onOpenChange={setIsAddRxDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? "وصفة طبية جديدة" : "Add New RX"}</DialogTitle>
            <DialogDescription>
              {language === 'ar' ? "أدخل تفاصيل الوصفة الطبية الجديدة" : "Enter the new prescription details"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Right Eye (OD) */}
              <div className="space-y-4">
                <h3 className="font-medium">
                  {language === 'ar' ? "العين اليمنى" : "Right Eye (OD)"}
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">SPH</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.sphereOD}
                        onValueChange={(value) => setNewRx({ ...newRx, sphereOD: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateDiopterOptions().map((value) => (
                            <SelectItem key={`sph-od-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">CYL</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.cylOD}
                        onValueChange={(value) => setNewRx({ ...newRx, cylOD: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateDiopterOptions().map((value) => (
                            <SelectItem key={`cyl-od-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">AXIS</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.axisOD}
                        onValueChange={(value) => setNewRx({ ...newRx, axisOD: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAxisOptions().map((value) => (
                            <SelectItem key={`axis-od-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">ADD</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.addOD || "none"}
                        onValueChange={(value) => setNewRx({ ...newRx, addOD: value === "none" ? "" : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAddOptions().map((value) => (
                            <SelectItem key={`add-od-${value}`} value={value}>
                              {value === "none" ? "None" : value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">PD</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.pdRight}
                        onValueChange={(value) => setNewRx({ ...newRx, pdRight: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generatePdOptions().map((value) => (
                            <SelectItem key={`pd-od-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Left Eye (OS) */}
              <div className="space-y-4">
                <h3 className="font-medium">
                  {language === 'ar' ? "العين اليسرى" : "Left Eye (OS)"}
                </h3>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">SPH</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.sphereOS}
                        onValueChange={(value) => setNewRx({ ...newRx, sphereOS: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateDiopterOptions().map((value) => (
                            <SelectItem key={`sph-os-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">CYL</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.cylOS}
                        onValueChange={(value) => setNewRx({ ...newRx, cylOS: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateDiopterOptions().map((value) => (
                            <SelectItem key={`cyl-os-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">AXIS</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.axisOS}
                        onValueChange={(value) => setNewRx({ ...newRx, axisOS: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAxisOptions().map((value) => (
                            <SelectItem key={`axis-os-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">ADD</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.addOS || "none"}
                        onValueChange={(value) => setNewRx({ ...newRx, addOS: value === "none" ? "" : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateAddOptions().map((value) => (
                            <SelectItem key={`add-os-${value}`} value={value}>
                              {value === "none" ? "None" : value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 items-center">
                    <Label className="text-right">PD</Label>
                    <div className="col-span-3">
                      <Select
                        value={newRx.pdLeft}
                        onValueChange={(value) => setNewRx({ ...newRx, pdLeft: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {generatePdOptions().map((value) => (
                            <SelectItem key={`pd-os-${value}`} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRxDialogOpen(false)}>
              {language === 'ar' ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleSaveRx}>
              <Save className="h-4 w-4 mr-1" />
              {language === 'ar' ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
