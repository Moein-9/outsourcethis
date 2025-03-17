import React, { useState } from "react";
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
  Calendar,
  Clock,
  AlertCircle,
  Plus
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
import { ReceiptInvoice } from "./ReceiptInvoice";

interface PatientWithMeta extends Patient {
  patientId: string;
  dateOfBirth: string;
  lastVisit?: string;
  vip?: boolean;
  avatar?: string;
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
  const [showRxPrintPreview, setShowRxPrintPreview] = useState(false);
  
  const [visitDateFilter, setVisitDateFilter] = useState<string>("all_visits");
  
  const [patientInvoices, setPatientInvoices] = useState<Invoice[]>([]);
  const [patientWorkOrders, setPatientWorkOrders] = useState<WorkOrder[]>([]);
  
  const [activeTransactionTab, setActiveTransactionTab] = useState<"active" | "completed">("active");
  
  const filterByVisitDate = (patients: PatientWithMeta[], dateFilter: string) => {
    if (dateFilter === "all_visits") return patients;
    
    return patients;
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("الرجاء إدخال مصطلح البحث");
      return;
    }
    
    const results = searchPatients(searchTerm).map(patient => {
      return {
        ...patient,
        dateOfBirth: patient.dob,
        lastVisit: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        vip: Math.random() > 0.8,
        createdAt: patient.createdAt
      } as PatientWithMeta;
    });
    
    let filteredResults = results;
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
                <Label htmlFor="visitDateFilter" className="whitespace-nowrap">تاريخ الزيارة:</Label>
                <Select value={visitDateFilter} onValueChange={setVisitDateFilter}>
                  <SelectTrigger id="visitDateFilter" className="w-[140px]">
                    <SelectValue placeholder="جميع الزيارات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_visits">جميع الزيارات</SelectItem>
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
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5 ml-3" />
                          <div>
                            <div className="text-sm text-muted-foreground">رقم الهاتف</div>
                            <div dir="ltr" className="text-right">{selectedPatient.phone}</div>
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
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">الوصفة الطبية وتعليمات العناية</CardTitle>
                        <CardDescription>الوصفات السابقة والنظارات أو العدسات اللاصقة</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowRxPrintPreview(true)}>
                          <Printer className="h-4 w-4 ml-2" />
                          طباعة الوصفة
                        </Button>
                        <Button size="sm">
                          <Plus className="h-4 w-4 ml-2" />
                          وصفة جديدة
                        </Button>
                      </div>
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
                          <h4 className="font-medium mb-2">تاريخ الوصفات الطبية</h4>
                          {selectedPatient.rxHistory && selectedPatient.rxHistory.length > 0 ? (
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>التاريخ</TableHead>
                                    <TableHead>ODسفير</TableHead>
                                    <TableHead>ODسلندر</TableHead>
                                    <TableHead>OSسفير</TableHead>
                                    <TableHead>OSسلندر</TableHead>
                                    <TableHead>الإجراءات</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedPatient.rxHistory.map((rx, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{formatDate(rx.createdAt)}</TableCell>
                                      <TableCell>{rx.sphereOD}</TableCell>
                                      <TableCell>{rx.cylOD} / {rx.axisOD}</TableCell>
                                      <TableCell>{rx.sphereOS}</TableCell>
                                      <TableCell>{rx.cylOS} / {rx.axisOS}</TableCell>
                                      <TableCell>
                                        <Button variant="ghost" size="sm">
                                          <Eye className="h-3.5 w-3.5 ml-1" />
                                          عرض
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              لا يوجد سجل وصفات طبية سابقة
                            </p>
                          )}
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
      
      <Dialog open={showRxPrintPreview} onOpenChange={setShowRxPrintPreview}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">معاينة الوصفة الطبية</DialogTitle>
                <DialogDescription>
                  معاينة قبل الطباعة
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="w-full bg-white p-6 rounded-lg border shadow print:shadow-none">
                  <div id="rx-receipt" className="print:w-[80mm]">
                    <ReceiptInvoice 
                      invoice={{
                        invoiceId: `RX-${Date.now().toString().substring(6)}`,
                        patientId: selectedPatient.patientId,
                        patientName: selectedPatient.name,
                        patientPhone: selectedPatient.phone,
                        lensType: 'وصفة طبية',
                        lensPrice: 0,
                        framePrice: 0,
                        coatingPrice: 0,
                        frameBrand: '',
                        frameModel: '',
                        frameColor: '',
                        coating: '',
                        discount: 0,
                        total: 0,
                        deposit: 0,
                        remaining: 0,
                        isPaid: true,
                        paymentMethod: '',
                        createdAt: new Date().toISOString(),
                        payments: []
                      }}
                      isPrintable={true}
                    />
                    
                    <div className="mt-4 p-4 border-t border-dashed">
                      <h3 className="text-center font-bold mb-3">وصفة النظارات الطبية</h3>
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 p-1 text-sm"></th>
                            <th className="border border-gray-300 p-1 text-sm">SPH</th>
                            <th className="border border-gray-300 p-1 text-sm">CYL</th>
                            <th className="border border-gray-300 p-1 text-sm">AXIS</th>
                            <th className="border border-gray-300 p-1 text-sm">ADD</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-1 text-sm font-medium">OD (اليمنى)</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.sphereOD}</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.cylOD}</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.axisOD}</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.addOD}</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-1 text-sm font-medium">OS (اليسرى)</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.sphereOS}</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.cylOS}</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.axisOS}</td>
                            <td className="border border-gray-300 p-1 text-sm">{selectedPatient.rx?.addOS}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="font-medium">PD: </span>
                        <span>{selectedPatient.rx?.pdRight} - {selectedPatient.rx?.pdLeft}</span>
                      </div>
                      
                      <div className="mt-4 text-sm text-center">
                        <p className="font-medium">ملاحظات:</p>
                        <p>{selectedPatient.notes || 'لا توجد ملاحظات'}</p>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
                        <p>هذه الوصفة صالحة لمدة 6 أشهر من تاريخ الإصدار</p>
                        <p>تاريخ الإصدار: {format(new Date(), 'yyyy/MM/dd')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRxPrintPreview(false)}>
                  إغلاق
                </Button>
                <Button onClick={() => {
                  window.print();
                }}>
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة الوصفة
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
