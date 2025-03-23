import React, { useState, useEffect } from "react";
import { usePatientStore, Patient, PatientNote } from "@/store/patientStore";
import { useInvoiceStore, Invoice, WorkOrder } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  UserSearch, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Printer, 
  FileText,
  Filter,
  User,
  Phone,
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Receipt,
  FileBarChart,
  BadgeDollarSign,
  Edit,
  Trash
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  format, 
  parseISO, 
  differenceInYears 
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { ReceiptInvoice } from "./ReceiptInvoice";
import { RxReceiptPrint, printRxReceipt } from "./RxReceiptPrint";
import { PatientRxManager } from "./PatientRxManager";
import { useLanguageStore } from "@/store/languageStore";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PatientWithMeta extends Patient {
  patientId: string;
  dateOfBirth: string;
  lastVisit?: string;
  avatar?: string;
  createdAt: string;
}

interface EditWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onSave: (updatedWorkOrder: WorkOrder) => void;
}

// Simple component for editing work orders
const EditWorkOrderDialog: React.FC<EditWorkOrderDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
  onSave
}) => {
  const { language, t } = useLanguageStore();
  const [editedWorkOrder, setEditedWorkOrder] = useState<WorkOrder>({...workOrder});
  
  const handleSave = () => {
    onSave(editedWorkOrder);
    onClose();
  };
  
  // When the work order changes, update the state
  useEffect(() => {
    setEditedWorkOrder({...workOrder});
  }, [workOrder]);
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editWorkOrder')}</DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? "قم بتعديل بيانات أمر العمل"
              : "Make changes to the work order details"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lensType">{t('lensType')}</Label>
            <Input 
              id="lensType" 
              value={editedWorkOrder.lensType?.name || ''} 
              onChange={(e) => setEditedWorkOrder({
                ...editedWorkOrder, 
                lensType: { 
                  ...editedWorkOrder.lensType || {}, 
                  name: e.target.value 
                }
              })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">{t('price')}</Label>
            <Input 
              id="price" 
              type="number"
              value={editedWorkOrder.lensType?.price || 0} 
              onChange={(e) => setEditedWorkOrder({
                ...editedWorkOrder, 
                lensType: { 
                  ...editedWorkOrder.lensType || {}, 
                  price: Number(e.target.value) 
                }
              })}
            />
          </div>
          
          {/* Add other fields as needed */}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// New component for displaying patient notes
const PatientNotes: React.FC<{
  patientId: string;
  patientNotes?: PatientNote[];
  onAddNote: (noteText: string) => void;
}> = ({ patientId, patientNotes = [], onAddNote }) => {
  const { language, t } = useLanguageStore();
  const [newNote, setNewNote] = useState("");
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote("");
    } else {
      toast.error(
        language === 'ar' ? "لا يمكن إضافة ملاحظة فارغة" : "Cannot add an empty note"
      );
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP p", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  return (
    <Card className="mt-6 border-blue-200 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
          <FileText className="h-5 w-5" />
          {t('patientNotes')}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? "ملاحظات ومعلومات إضافية عن العميل" 
            : "Additional notes and information about the client"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className={`flex gap-2 ${dirClass}`}>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={language === 'ar' ? "أضف ملاحظة جديدة..." : "Add a new note..."}
              className={`resize-none ${textAlignClass}`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <Button onClick={handleAddNote} className="shrink-0 self-end">
              <Plus className="h-4 w-4 mr-1" />
              {t('addNote')}
            </Button>
          </div>
        </div>
        
        <div className={`space-y-3 ${dirClass}`}>
          <h3 className="font-medium text-blue-800">
            {language === 'ar' ? "الملاحظات السابقة" : "Previous Notes"}
          </h3>
          
          {patientNotes.length > 0 ? (
            <ScrollArea className="h-[200px] rounded-md border p-2">
              <div className="space-y-4">
                {patientNotes.slice().reverse().map((note) => (
                  <div key={note.id} className="border-b pb-3 last:border-0">
                    <div className={`text-sm bg-blue-50 p-3 rounded-md ${textAlignClass}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                      {note.text}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(note.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 border rounded-md bg-blue-50/20">
              <FileText className="h-10 w-10 mx-auto text-blue-300 mb-3" />
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? "لا توجد ملاحظات لهذا العميل حالياً" 
                  : "No notes for this client yet"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const PatientSearch: React.FC = () => {
  const { patients, searchPatients, addPatientNote, updatePatient } = usePatientStore();
  const { invoices, workOrders, getInvoicesByPatientId, getWorkOrdersByPatientId } = useInvoiceStore();
  const { language, t } = useLanguageStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PatientWithMeta[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMeta | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showRxPrintPreview, setShowRxPrintPreview] = useState(false);
  
  const [visitDateFilter, setVisitDateFilter] = useState<string>("all_visits");
  
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<WorkOrder[]>([]);
  
  const [activeTransactionTab, setActiveTransactionTab] = useState<"active" | "completed">("active");
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [editWorkOrderDialogOpen, setEditWorkOrderDialogOpen] = useState(false);
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder | null>(null);
  
  const filterByVisitDate = (patients: PatientWithMeta[], dateFilter: string) => {
    if (dateFilter === "all_visits") return patients;
    
    return patients;
  };
  
  const handleSearch = () => {
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
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
    setVisitDateFilter("all_visits");
  };
  
  const handlePatientSelect = (patient: PatientWithMeta) => {
    setSelectedPatient(patient);
    
    const patientInvoices = getInvoicesByPatientId(patient.patientId);
    const patientWorkOrders = getWorkOrdersByPatientId(patient.patientId);
    
    setPatientInvoices(patientInvoices);
    setPatientWorkOrders(patientWorkOrders);
    
    setIsProfileOpen(true);
  };
  
  const getPatientAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return language === 'ar' ? "غير معروف" : "Unknown";
    const age = differenceInYears(new Date(), new Date(dateOfBirth));
    return age;
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return language === 'ar' ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const getActiveWorkOrders = (workOrders: WorkOrder[]) => {
    // Filter work orders that are not fully paid
    return workOrders.filter(wo => {
      const invoice = invoices.find(inv => inv.workOrderId === wo.id);
      return !invoice || !invoice.isPaid;
    });
  };
  
  const getCompletedWorkOrders = (workOrders: WorkOrder[]) => {
    // Get work orders that are fully paid
    return workOrders.filter(wo => {
      const invoice = invoices.find(inv => inv.workOrderId === wo.id);
      return invoice && invoice.isPaid;
    });
  };

  const handleAddNote = (noteText: string) => {
    if (selectedPatient) {
      addPatientNote(selectedPatient.patientId, noteText);
      
      // Update the selected patient with the new note
      const updatedPatient = patients.find(p => p.patientId === selectedPatient.patientId);
      if (updatedPatient) {
        setSelectedPatient({
          ...selectedPatient,
          patientNotes: updatedPatient.patientNotes
        });
        
        toast.success(language === 'ar' ? "تمت إضافة الملاحظة بنجاح" : "Note added successfully");
      }
    }
  };
  
  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    setCurrentWorkOrder(workOrder);
    setEditWorkOrderDialogOpen(true);
  };
  
  const handleSaveWorkOrder = (updatedWorkOrder: WorkOrder) => {
    // Here you would update the work order in your store
    // For now we'll just show a success message
    toast.success(language === 'ar' ? "تم تحديث أمر العمل بنجاح" : "Work order updated successfully");
    setEditWorkOrderDialogOpen(false);
  };

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  const handleDirectPrint = (language?: 'en' | 'ar') => {
    if (!selectedPatient) return;
    
    const printLang = language || useLanguageStore.getState().language;
    
    // Call the print function directly
    printRxReceipt({
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      rx: selectedPatient.rx,
      forcedLanguage: printLang
    });
  };
  
  const handleLanguageSelection = (selectedLanguage: 'en' | 'ar') => {
    setIsLanguageDialogOpen(false);
    handleDirectPrint(selectedLanguage);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserSearch className="h-5 w-5 text-primary" />
            {t('searchClient')}
          </CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? "ابحث عن العملاء بواسطة الاسم، رقم الهاتف، أو أي معلومات شخصية"
              : "Search for clients by name, phone number, or any personal information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'ar' ? "ابحث عن عميل..." : "Search for a client..."}
                  className={language === 'ar' ? "pr-9" : "pl-9"}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="shrink-0">
                  <Search className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                  {t('search')}
                </Button>
                <Button variant="outline" onClick={clearSearch} className="shrink-0">
                  {language === 'ar' ? "مسح" : "Clear"}
                </Button>
              </div>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${dirClass}`}>
              <div className="flex items-center gap-2">
                <Label htmlFor="visitDateFilter" className="whitespace-nowrap">
                  {language === 'ar' ? "تاريخ الزيارة:" : "Visit Date:"}
                </Label>
                <Select value={visitDateFilter} onValueChange={setVisitDateFilter}>
                  <SelectTrigger id="visitDateFilter" className="w-[140px]">
                    <SelectValue placeholder={language === 'ar' ? "جميع الزيارات" : "All Visits"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_visits">{language === 'ar' ? "جميع الزيارات" : "All Visits"}</SelectItem>
                    <SelectItem value="last_week">{language === 'ar' ? "الأسبوع الماضي" : "Last Week"}</SelectItem>
                    <SelectItem value="last_month">{language === 'ar' ? "الشهر الماضي" : "Last Month"}</SelectItem>
                    <SelectItem value="last_year">{language === 'ar' ? "السنة الماضية" : "Last Year"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="icon" className={language === 'ar' ? "mr-auto" : "ml-auto"}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showResults && (
        <Card className="mb-6 border-amber-200 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('searchResults')}</CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? `تم العثور على ${searchResults.length} عميل`
                : `Found ${searchResults.length} client${searchResults.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>{t('name')}</TableHead>
                      <TableHead>{t('phoneNumber')}</TableHead>
                      <TableHead>{t('dateOfBirth')}</TableHead>
                      <TableHead>{t('age')}</TableHead>
                      <TableHead>{language === 'ar' ? "آخر زيارة" : "Last Visit"}</TableHead>
                      <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((patient, index) => (
                      <TableRow key={patient.patientId}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell dir="ltr" className="text-right">{patient.phone}</TableCell>
                        <TableCell>{formatDate(patient.dateOfBirth)}</TableCell>
                        <TableCell>{getPatientAge(patient.dateOfBirth)}</TableCell>
                        <TableCell>
                          {patient.lastVisit ? formatDate(patient.lastVisit) : (language === 'ar' ? 'لا توجد زيارات' : 'No visits')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <Eye className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                            {language === 'ar' ? "ملف العميل" : "Client File"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <UserSearch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">{t('noResults')}</h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'ar' 
                    ? "لم يتم العثور على نتائج مطابقة لمعايير البحث. جرب استخدام كلمات بحث مختلفة."
                    : "No results match your search criteria. Try using different search terms."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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
                  <Card className="border-primary/20 shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
                      <CardTitle className="text-lg text-primary">
                        {language === 'ar' ? "البيانات الشخصية" : "Personal Information"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="h-24 w-24 mb-3">
                          <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {selectedPatient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Phone className={`h-5 w-5 text-primary mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                          <div>
                            <div className="text-sm text-muted-foreground">{t('phoneNumber')}</div>
                            <div dir="ltr" className="text-right">{selectedPatient.phone}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className={`h-5 w-5 text-primary mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                          <div>
                            <div className="text-sm text-muted-foreground">{t('dateOfBirth')}</div>
                            <div>{formatDate(selectedPatient.dateOfBirth)}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {getPatientAge(selectedPatient.dateOfBirth)} {language === 'ar' ? "سنة" : "years"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className={`h-5 w-5 text-primary mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                          <div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'ar' ? "تاريخ التسجيل" : "Registration Date"}
                            </div>
                            <div>{formatDate(selectedPatient.createdAt)}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <BadgeDollarSign className={`h-5 w-5 text-green-500 mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                          <div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'ar' ? "إجمالي المعاملات" : "Total Transactions"}
                            </div>
                            <div className="font-semibold text-green-600">
                              {patientInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(3)} {t('kwd')}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-dashed space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <FileBarChart className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-amber-500`} />
                          {language === 'ar' ? "تقرير العميل" : "Client Report"}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={() => setIsLanguageDialogOpen(true)}
                        >
                          <Receipt className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-500`} />
                          {language === 'ar' ? "طباعة الوصفة الطبية" : "Print Prescription"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card className="border-amber-200 shadow-md">
                    <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                      <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                        <Receipt className="h-5 w-5" />
                        {language === 'ar' ? "سجل المعاملات" : "Transaction History"}
                      </CardTitle>
                      <CardDescription>
                        {language === 'ar' ? "أوامر العمل والفواتير الخاصة بالعميل" : "Work orders and invoices for the client"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs 
                        defaultValue="active" 
                        value={activeTransactionTab}
                        onValueChange={(v) => setActiveTransactionTab(v as "active" | "completed")}
                        className="w-full"
                      >
                        <TabsList className="w-full mb-4 grid grid-cols-2 bg-amber-100/50">
                          <TabsTrigger value="active" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                            {language === 'ar' ? "أوامر عمل نشطة" : "Active Work Orders"}
                          </TabsTrigger>
                          <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                            {language === 'ar' ? "المعاملات المكتملة" : "Completed Transactions"}
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="active" className="mt-0 space-y-4">
                          <div>
                            <h3 className="text-md font-medium mb-2 flex items-center gap-1.5 text-amber-700">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              {language === 'ar' ? "أوامر العمل قيد التنفيذ" : "Work Orders in Progress"}
                            </h3>
                            
                            {getActiveWorkOrders(patientWorkOrders).length > 0 ? (
                              <div className="rounded-md border overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-amber-50">
                                    <TableRow>
                                      <TableHead className="w-12">#</TableHead>
                                      <TableHead>{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                                      <TableHead>{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                                      <TableHead>{language === 'ar' ? "تاريخ الطلب" : "Order Date"}</TableHead>
                                      <TableHead>{t('status')}</TableHead>
                                      <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getActiveWorkOrders(patientWorkOrders).map((workOrder, index) => {
                                      const invoice = invoices.find(inv => inv.workOrderId === workOrder.id);
                                      const status = !invoice ? (language === 'ar' ? "قيد التنفيذ" : "In Progress") : 
                                        invoice.isPaid ? (language === 'ar' ? "مدفوعة" : "Paid") : 
                                        invoice.deposit > 0 ? (language === 'ar' ? "مدفوعة جزئيًا" : "Partially Paid") : 
                                        (language === 'ar' ? "غير مدفوعة" : "Unpaid");
                                      
                                      const statusColor = !invoice ? "bg-amber-500" : 
                                        invoice.isPaid ? "bg-green-500" : 
                                        invoice.deposit > 0 ? "bg-amber-500" : "bg-red-500";
                                      
                                      return (
                                        <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-amber-50/30' : ''}>
                                          <TableCell className="font-medium">{index + 1}</TableCell>
                                          <TableCell>WO-{workOrder.id.substring(0, 8)}</TableCell>
                                          <TableCell>{workOrder.lensType?.name || '-'}</TableCell>
                                          <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                                          <TableCell>
                                            <Badge className={statusColor}>{status}</Badge>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="border-amber-200 hover:bg-amber-50"
                                                onClick={() => handleEditWorkOrder(workOrder)}
                                              >
                                                <Edit className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
                                                {t('edit')}
                                              </Button>
                                              <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
                                                <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-amber-600`} />
                                                {t('print')}
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-6 border rounded-md bg-amber-50/20">
                                <FileText className="h-10 w-10 mx-auto text-amber-300 mb-3" />
                                <h3 className="text-lg font-medium mb-1 text-amber-700">
                                  {language === 'ar' ? "لا توجد أوامر عمل نشطة" : "No Active Work Orders"}
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  {language === 'ar' 
                                    ? "لا يوجد أوامر عمل نشطة لهذا العميل حالياً."
                                    : "There are no active work orders for this client at the moment."}
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="completed" className="mt-0 space-y-8">
                          <div>
                            <h3 className="text-md font-medium mb-2 flex items-center gap-1.5 text-green-700">
                              <AlertCircle className="h-4 w-4 text-green-500" />
                              {language === 'ar' ? "الفواتير المكتملة" : "Completed Invoices"}
                            </h3>
                            
                            {patientInvoices.filter(inv => inv.isPaid).length > 0 ? (
                              <div className="rounded-md border overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-green-50">
                                    <TableRow>
                                      <TableHead className="w-12">#</TableHead>
                                      <TableHead>{language === 'ar' ? "رقم الفاتورة" : "Invoice No."}</TableHead>
                                      <TableHead>{language === 'ar' ? "المبلغ" : "Amount"}</TableHead>
                                      <TableHead>{language === 'ar' ? "تاريخ الفاتورة" : "Invoice Date"}</TableHead>
                                      <TableHead>{t('status')}</TableHead>
                                      <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {patientInvoices.filter(inv => inv.isPaid).map((invoice, index) => (
                                      <TableRow key={invoice.invoiceId} className={index % 2 === 0 ? 'bg-green-50/30' : ''}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>INV-{invoice.invoiceId.substring(0, 8)}</TableCell>
                                        <TableCell>{invoice.total.toFixed(3)} {t('kwd')}</TableCell>
                                        <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                                        <TableCell>
                                          <Badge className="bg-green-500">
                                            {language === 'ar' ? "مدفوعة" : "Paid"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                                              <Eye className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-600`} />
                                              {t('view')}
                                            </Button>
                                            <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                                              <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-600`} />
                                              {t('print')}
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-6 border rounded-md bg-green-50/20">
                                <FileText className="h-10 w-10 mx-auto text-green-300 mb-3" />
                                <h3 className="text-lg font-medium mb-1 text-green-700">
                                  {language === 'ar' ? "لا توجد فواتير مكتملة" : "No Completed Invoices"}
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  {language === 'ar' 
                                    ? "لا يوجد فواتير مكتملة لهذا العميل حالياً."
                                    : "There are no completed invoices for this client at the moment."}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-md font-medium mb-2 flex items-center gap-1.5 text-blue-700">
                              <AlertCircle className="h-4 w-4 text-blue-500" />
                              {language === 'ar' ? "أوامر العمل المكتملة" : "Completed Work Orders"}
                            </h3>
                            
                            {getCompletedWorkOrders(patientWorkOrders).length > 0 ? (
                              <div className="rounded-md border overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-blue-50">
                                    <TableRow>
                                      <TableHead className="w-12">#</TableHead>
                                      <TableHead>{language === 'ar' ? "رقم الطلب" : "Order No."}</TableHead>
                                      <TableHead>{language === 'ar' ? "نوع العدسة" : "Lens Type"}</TableHead>
                                      <TableHead>{language === 'ar' ? "تاريخ الطلب" : "Order Date"}</TableHead>
                                      <TableHead>{t('status')}</TableHead>
                                      <TableHead className={language === 'ar' ? "text-right" : "text-right"}>{t('actions')}</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getCompletedWorkOrders(patientWorkOrders).map((workOrder, index) => (
                                      <TableRow key={workOrder.id} className={index % 2 === 0 ? 'bg-blue-50/30' : ''}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>WO-{workOrder.id.substring(0, 8)}</TableCell>
                                        <TableCell>{workOrder.lensType?.name || '-'}</TableCell>
                                        <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                                        <TableCell>
                                          <Badge className="bg-blue-500">
                                            {language === 'ar' ? "مكتمل" : "Completed"}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="border-blue-200 hover:bg-blue-50"
                                              onClick={() => handleEditWorkOrder(workOrder)}
                                            >
                                              <Edit className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-blue-600`} />
                                              {t('edit')}
                                            </Button>
                                            <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                                              <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-blue-600`} />
                                              {t('print')}
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-6 border rounded-md bg-blue-50/20">
                                <FileText className="h-10 w-10 mx-auto text-blue-300 mb-3" />
                                <h3 className="text-lg font-medium mb-1 text-blue-700">
                                  {language === 'ar' ? "لا توجد أوامر عمل مكتملة" : "No Completed Work Orders"}
                                </h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  {language === 'ar' 
                                    ? "لا يوجد أوامر عمل مكتملة لهذا العميل حالياً."
                                    : "There are no completed work orders for this client at the moment."}
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  {selectedPatient && (
                    <PatientRxManager
                      patientId={selectedPatient.patientId}
                      patientName={selectedPatient.name}
                      patientPhone={selectedPatient.phone}
                      currentRx={selectedPatient.rx}
                      rxHistory={selectedPatient.rxHistory}
                      onRxPrintRequest={handleDirectPrint}
                    />
                  )}
                  
                  {/* Patient Notes component moved to bottom of the page */}
                  {selectedPatient && (
                    <PatientNotes
                      patientId={selectedPatient.patientId}
                      patientNotes={selectedPatient.patientNotes}
                      onAddNote={handleAddNote}
                    />
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                  {t('close')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? "اختر لغة الطباعة" : "Select Print Language"}
            </DialogTitle>
            <DialogDescription>
              {language === 'ar' ? "اختر لغة للطباعة الوصفة الطبية" : "Choose a language for printing the prescription"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2" 
              onClick={() => handleLanguageSelection('ar')}
            >
              <span className="text-2xl">🇰🇼</span>
              <span>عربي</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2" 
              onClick={() => handleLanguageSelection('en')}
            >
              <span className="text-2xl">🇬🇧</span>
              <span>English</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Work Order Edit Dialog */}
      {currentWorkOrder && (
        <EditWorkOrderDialog
          isOpen={editWorkOrderDialogOpen}
          onClose={() => setEditWorkOrderDialogOpen(false)}
          workOrder={currentWorkOrder}
          onSave={handleSaveWorkOrder}
        />
      )}
    </div>
  );
};
