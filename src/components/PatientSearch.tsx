import React, { useState, useEffect } from "react";
import { usePatientStore, Patient } from "@/store/patientStore";
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
  Mail,
  Calendar,
  Clock,
  AlertCircle
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
import { ar } from "date-fns/locale";

// Create an extended Patient type that includes all the properties we need
interface PatientWithMeta extends Patient {
  patientId: string; // This will map to the 'id' property we're using
  dateOfBirth: string;
  gender: string;
  lastVisit?: string;
  civilId?: string;
  vip?: boolean;
  avatar?: string;
  email?: string;
  createdAt: string;
}

export const PatientSearch: React.FC = () => {
  const { patients, searchPatients } = usePatientStore();
  const { invoices, workOrders, getInvoicesByPatientId, getWorkOrdersByPatientId } = useInvoiceStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PatientWithMeta[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithMeta | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Filters
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [visitDateFilter, setVisitDateFilter] = useState<string>("");
  
  // Patient profile data
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<WorkOrder[]>([]);
  
  // For transaction history tabs
  const [activeTransactionTab, setActiveTransactionTab] = useState<"active" | "completed">("active");
  
  const filterByAge = (patients: PatientWithMeta[], ageRange: string) => {
    if (!ageRange) return patients;
    
    const today = new Date();
    
    switch (ageRange) {
      case "child":
        return patients.filter(patient => {
          if (!patient.dateOfBirth) return false;
          const age = differenceInYears(today, new Date(patient.dateOfBirth));
          return age < 18;
        });
      case "adult":
        return patients.filter(patient => {
          if (!patient.dateOfBirth) return false;
          const age = differenceInYears(today, new Date(patient.dateOfBirth));
          return age >= 18 && age < 60;
        });
      case "senior":
        return patients.filter(patient => {
          if (!patient.dateOfBirth) return false;
          const age = differenceInYears(today, new Date(patient.dateOfBirth));
          return age >= 60;
        });
      default:
        return patients;
    }
  };
  
  const filterByGender = (patients: PatientWithMeta[], gender: string) => {
    if (!gender) return patients;
    return patients.filter(patient => patient.gender === gender);
  };
  
  const filterByVisitDate = (patients: PatientWithMeta[], dateFilter: string) => {
    if (!dateFilter) return patients;
    
    return patients;
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("الرجاء إدخال مصطلح البحث");
      return;
    }
    
    // For demonstration, we'll convert Patient[] to PatientWithMeta[]
    // In a real app, this data would come from the backend
    const results = searchPatients(searchTerm).map(patient => {
      return {
        ...patient,
        dateOfBirth: patient.dob, // Map dob to dateOfBirth 
        gender: Math.random() > 0.5 ? 'male' : 'female', // Mock gender
        lastVisit: new Date(Date.now() - Math.random() * 10000000000).toISOString(), // Mock last visit
        vip: Math.random() > 0.8, // 20% chance of being VIP
        civilId: Math.floor(Math.random() * 10000000000).toString(), // Mock civil ID
        email: `${patient.name.toLowerCase().replace(/\s/g, '.')}@example.com`, // Mock email
        createdAt: patient.createdAt // Map createdAt to createdAt
      } as PatientWithMeta;
    });
    
    let filteredResults = results;
    filteredResults = filterByAge(filteredResults, ageFilter);
    filteredResults = filterByGender(filteredResults, genderFilter);
    filteredResults = filterByVisitDate(filteredResults, visitDateFilter);
    
    setSearchResults(filteredResults);
    setShowResults(true);
    
    if (filteredResults.length === 0) {
      toast.info("لم يتم العثور على نتائج مطابقة");
    }
  };
  
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
    setAgeFilter("");
    setGenderFilter("");
    setVisitDateFilter("");
  };
  
  const handlePatientSelect = (patient: PatientWithMeta) => {
    setSelectedPatient(patient);
    
    // Get patient's invoices and work orders
    const patientInvoices = getInvoicesByPatientId(patient.patientId);
    const patientWorkOrders = getWorkOrdersByPatientId(patient.patientId);
    
    setPatientInvoices(patientInvoices);
    setPatientWorkOrders(patientWorkOrders);
    
    setIsProfileOpen(true);
  };
  
  const getPatientAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "غير معروف";
    const age = differenceInYears(new Date(), new Date(dateOfBirth));
    return age;
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "تاريخ غير متوفر";
    try {
      return format(parseISO(dateString), "PPP", { locale: ar });
    } catch (error) {
      return "تاريخ غير صالح";
    }
  };
  
  const getActiveWorkOrders = (workOrders: WorkOrder[], invoices: Invoice[]) => {
    const invoicedOrderIds = invoices.map(inv => inv.workOrderId);
    return workOrders.filter(wo => !invoicedOrderIds.includes(wo.id));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserSearch className="h-5 w-5 text-primary" />
            بحث عن عميل
          </CardTitle>
          <CardDescription>
            ابحث عن العملاء بواسطة الاسم، رقم الهاتف، أو أي معلومات شخصية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن عميل..."
                  className="pr-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="shrink-0">
                  <Search className="h-4 w-4 ml-1" />
                  بحث
                </Button>
                <Button variant="outline" onClick={clearSearch} className="shrink-0">
                  مسح
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="ageFilter" className="whitespace-nowrap">الفئة العمرية:</Label>
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger id="ageFilter" className="w-[140px]">
                    <SelectValue placeholder="جميع الأعمار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الأعمار</SelectItem>
                    <SelectItem value="child">أطفال (&lt; 18)</SelectItem>
                    <SelectItem value="adult">بالغين (18-60)</SelectItem>
                    <SelectItem value="senior">كبار السن (60+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="genderFilter" className="whitespace-nowrap">الجنس:</Label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger id="genderFilter" className="w-[140px]">
                    <SelectValue placeholder="الجميع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">الجميع</SelectItem>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="visitDateFilter" className="whitespace-nowrap">تاريخ الزيارة:</Label>
                <Select value={visitDateFilter} onValueChange={setVisitDateFilter}>
                  <SelectTrigger id="visitDateFilter" className="w-[140px]">
                    <SelectValue placeholder="جميع الزيارات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الزيارات</SelectItem>
                    <SelectItem value="last_week">الأسبوع الماضي</SelectItem>
                    <SelectItem value="last_month">الشهر الماضي</SelectItem>
                    <SelectItem value="last_year">السنة الماضية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="icon" className="ml-auto">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showResults && (
        <Card className="mb-6 border-amber-200 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">نتائج البحث</CardTitle>
            <CardDescription>
              تم العثور على {searchResults.length} عميل
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchResults.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>تاريخ الميلاد</TableHead>
                      <TableHead>العمر</TableHead>
                      <TableHead>الجنس</TableHead>
                      <TableHead>آخر زيارة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
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
                        <TableCell>{patient.gender === 'male' ? 'ذكر' : 'أنثى'}</TableCell>
                        <TableCell>
                          {patient.lastVisit ? formatDate(patient.lastVisit) : 'لا توجد زيارات'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <Eye className="h-4 w-4 ml-2" />
                            ملف العميل
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
                <h3 className="text-lg font-medium mb-1">لا توجد نتائج</h3>
                <p className="text-muted-foreground mb-4">
                  لم يتم العثور على نتائج مطابقة لمعايير البحث. جرب استخدام كلمات بحث مختلفة.
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
                <DialogTitle className="text-xl">ملف العميل</DialogTitle>
                <DialogDescription>
                  تفاصيل بيانات العميل وسجل المعاملات
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">البيانات الشخصية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center mb-4">
                        <Avatar className="h-24 w-24 mb-3">
                          <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                          <AvatarFallback className="text-2xl bg-primary/10">
                            {selectedPatient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                        <Badge variant={selectedPatient.vip ? "default" : "outline"} className="mt-1">
                          {selectedPatient.vip ? "عميل VIP" : "عميل عادي"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-muted-foreground mt-0.5 ml-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">الرقم المدني</div>
                            <div>{selectedPatient.civilId || "غير متوفر"}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5 ml-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">رقم الهاتف</div>
                            <div dir="ltr" className="text-right">{selectedPatient.phone}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5 ml-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">البريد الإلكتروني</div>
                            <div dir="ltr" className="text-right">{selectedPatient.email || "غير متوفر"}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 ml-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">تاريخ الميلاد</div>
                            <div>{formatDate(selectedPatient.dateOfBirth)}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {getPatientAge(selectedPatient.dateOfBirth)} سنة
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5 ml-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">تاريخ التسجيل</div>
                            <div>{formatDate(selectedPatient.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">سجل المعاملات</CardTitle>
                      <CardDescription>
                        أوامر العمل والفواتير الخاصة بالعميل
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs 
                        defaultValue="active" 
                        value={activeTransactionTab}
                        onValueChange={(v) => setActiveTransactionTab(v as "active" | "completed")}
                        className="w-full"
                      >
                        <TabsList className="w-full mb-4 grid grid-cols-2">
                          <TabsTrigger value="active">أوامر عمل نشطة</TabsTrigger>
                          <TabsTrigger value="completed">المعاملات المكتملة</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="active" className="mt-0">
                          <div className="mb-4">
                            <h3 className="text-md font-medium mb-2 flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              أوامر العمل قيد التنفيذ
                            </h3>
                            
                            {getActiveWorkOrders(patientWorkOrders, patientInvoices).length > 0 ? (
                              <div className="rounded-md border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12">#</TableHead>
                                      <TableHead>رقم الطلب</TableHead>
                                      <TableHead>نوع العدسة</TableHead>
                                      <TableHead>تاريخ الطلب</TableHead>
                                      <TableHead>الحالة</TableHead>
                                      <TableHead className="text-right">الإجراءات</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getActiveWorkOrders(patientWorkOrders, patientInvoices).map((workOrder, index) => (
                                      <TableRow key={workOrder.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>WO-{workOrder.id.substring(0, 8)}</TableCell>
                                        <TableCell>{workOrder.lensType?.name || '-'}</TableCell>
                                        <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                                        <TableCell>
                                          <Badge className="bg-yellow-500">قيد التنفيذ</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm">
                                              <Eye className="h-3.5 w-3.5 ml-1" />
                                              عرض
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Printer className="h-3.5 w-3.5 ml-1" />
                                              طباعة
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-md bg-muted/20">
                                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <h3 className="text-lg font-medium mb-1">لا توجد أوامر عمل نشطة</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  لا يوجد أوامر عمل نشطة لهذا العميل حالياً.
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="completed" className="mt-0">
                          <div className="mb-4">
                            <h3 className="text-md font-medium mb-2 flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4 text-green-500" />
                              الفواتير المكتملة
                            </h3>
                            
                            {patientInvoices.length > 0 ? (
                              <div className="rounded-md border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12">#</TableHead>
                                      <TableHead>رقم الفاتورة</TableHead>
                                      <TableHead>المبلغ</TableHead>
                                      <TableHead>تاريخ الفاتورة</TableHead>
                                      <TableHead>الحالة</TableHead>
                                      <TableHead className="text-right">الإجراءات</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {patientInvoices.map((invoice, index) => (
                                      <TableRow key={invoice.invoiceId}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>INV-{invoice.invoiceId.substring(0, 8)}</TableCell>
                                        <TableCell>{invoice.total.toFixed(3)} KWD</TableCell>
                                        <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                                        <TableCell>
                                          <Badge className={
                                            invoice.isPaid
                                              ? 'bg-green-500' 
                                              : invoice.deposit > 0
                                                ? 'bg-amber-500' 
                                                : 'bg-red-500'
                                          }>
                                            {invoice.isPaid
                                              ? 'مدفوعة' 
                                              : invoice.deposit > 0
                                                ? 'مدفوعة جزئيًا' 
                                                : 'غير مدفوعة'
                                            }
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm">
                                              <Eye className="h-3.5 w-3.5 ml-1" />
                                              عرض
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Printer className="h-3.5 w-3.5 ml-1" />
                                              طباعة
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-md bg-muted/20">
                                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <h3 className="text-lg font-medium mb-1">لا توجد فواتير</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  لا يوجد فواتير مكتملة لهذا العميل حالياً.
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h3 className="text-md font-medium mb-2 flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4 text-blue-500" />
                              أوامر العمل المكتملة
                            </h3>
                            
                            {patientWorkOrders.filter(wo => {
                              const invoicedOrderIds = patientInvoices.map(inv => inv.workOrderId);
                              return invoicedOrderIds.includes(wo.id);
                            }).length > 0 ? (
                              <div className="rounded-md border overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12">#</TableHead>
                                      <TableHead>رقم الطلب</TableHead>
                                      <TableHead>نوع العدسة</TableHead>
                                      <TableHead>تاريخ الطلب</TableHead>
                                      <TableHead>الحالة</TableHead>
                                      <TableHead className="text-right">الإجراءات</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {patientWorkOrders.filter(wo => {
                                      const invoicedOrderIds = patientInvoices.map(inv => inv.workOrderId);
                                      return invoicedOrderIds.includes(wo.id);
                                    }).map((workOrder, index) => (
                                      <TableRow key={workOrder.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>WO-{workOrder.id.substring(0, 8)}</TableCell>
                                        <TableCell>{workOrder.lensType?.name || '-'}</TableCell>
                                        <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                                        <TableCell>
                                          <Badge className="bg-blue-500">مكتمل</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm">
                                              <Eye className="h-3.5 w-3.5 ml-1" />
                                              عرض
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Printer className="h-3.5 w-3.5 ml-1" />
                                              طباعة
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-md bg-muted/20">
                                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                                <h3 className="text-lg font-medium mb-1">لا توجد أوامر عمل مكتملة</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                  لا يوجد أوامر عمل مكتملة لهذا العميل حالياً.
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">الوصفة الطبية وتعليمات العناية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">الوصفة الطبية الحالية</h4>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead></TableHead>
                                  <TableHead>Sphere</TableHead>
                                  <TableHead>Cylinder</TableHead>
                                  <TableHead>Axis</TableHead>
                                  <TableHead>Add</TableHead>
                                  <TableHead>PD</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">العين اليمنى (OD)</TableCell>
                                  <TableCell>{selectedPatient.rx?.sphereOD || "+2.00"}</TableCell>
                                  <TableCell>{selectedPatient.rx?.cylOD || "-0.50"}</TableCell>
                                  <TableCell>{selectedPatient.rx?.axisOD || "180"}</TableCell>
                                  <TableCell>{selectedPatient.rx?.addOD || "+1.00"}</TableCell>
                                  <TableCell rowSpan={2}>{selectedPatient.rx?.pdRight || "62"}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">العين اليسرى (OS)</TableCell>
                                  <TableCell>{selectedPatient.rx?.sphereOS || "+2.25"}</TableCell>
                                  <TableCell>{selectedPatient.rx?.cylOS || "-0.75"}</TableCell>
                                  <TableCell>{selectedPatient.rx?.axisOS || "175"}</TableCell>
                                  <TableCell>{selectedPatient.rx?.addOS || "+1.00"}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">تعليمات العناية بالنظارة</h4>
                          <ul className="text-gray-700 list-disc list-inside space-y-1">
                            <li>يجب تنظيف العدسات بانتظام بمنظف خاص</li>
                            <li>تجنب ملامسة العدسات للماء الساخن</li>
                            <li>استخدم حافظة نظارات عند عدم الاستخدام</li>
                            <li>راجع الطبيب كل 6-12 شهر</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                  إغلاق
                </Button>
                <Button>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة ملف العميل
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
