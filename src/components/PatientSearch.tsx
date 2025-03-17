
import React, { useState } from "react";
import { usePatientStore, PatientNote, RxHistoryItem } from "@/store/patientStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient, RxData } from "@/store/patientStore";
import { Invoice } from "@/store/invoiceStore";
import { CalendarIcon, Save, Eye, Plus, FileText, History } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export const PatientSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [activeRxTab, setActiveRxTab] = useState("current");
  const [rxDate, setRxDate] = useState<Date | undefined>(new Date());
  
  // New RX form state
  const [newRx, setNewRx] = useState<Partial<RxData>>({
    sphereOD: "",
    cylOD: "",
    axisOD: "",
    addOD: "",
    sphereOS: "",
    cylOS: "",
    axisOS: "",
    addOS: "",
    pdRight: "",
    pdLeft: ""
  });
  
  const { patients, searchPatients, updatePatient, updatePatientRx, addPatientNote } = usePatientStore();
  const { invoices } = useInvoiceStore();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = searchPatients(searchTerm);
    setSearchResults(results);
    setShowResults(true);
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowResults(false);
  };

  const getPatientInvoices = (): Invoice[] => {
    if (!selectedPatient) return [];
    return invoices.filter(invoice => invoice.patientId === selectedPatient.patientId);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${month}(${date.getMonth() + 1})-${day}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const handleRxInputChange = (field: keyof RxData, value: string) => {
    setNewRx(prev => ({ ...prev, [field]: value }));
  };

  const submitNewRx = () => {
    if (!selectedPatient) return;
    
    // Validate that essential fields are filled
    const requiredFields = ["sphereOD", "cylOD", "axisOD", "sphereOS", "cylOS", "axisOS"];
    const missingFields = requiredFields.filter(field => !newRx[field as keyof RxData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "تحذير",
        description: "يرجى ملء جميع الحقول المطلوبة للوصفة الطبية",
        variant: "destructive"
      });
      return;
    }
    
    if (!rxDate) {
      toast({
        title: "تحذير",
        description: "يرجى تحديد تاريخ الوصفة الطبية",
        variant: "destructive"
      });
      return;
    }

    // Create the new RX with timestamp
    const newRxWithDate: RxData = {
      sphereOD: newRx.sphereOD || "",
      cylOD: newRx.cylOD || "",
      axisOD: newRx.axisOD || "",
      addOD: newRx.addOD || "",
      sphereOS: newRx.sphereOS || "",
      cylOS: newRx.cylOS || "",
      axisOS: newRx.axisOS || "",
      addOS: newRx.addOS || "",
      pdRight: newRx.pdRight || "",
      pdLeft: newRx.pdLeft || "",
      createdAt: rxDate.toISOString()
    };
    
    // Update patient RX in the store
    updatePatientRx(selectedPatient.patientId, newRxWithDate);
    
    // Update local state
    const updatedPatient = {
      ...selectedPatient,
      rx: newRxWithDate,
      rxHistory: selectedPatient.rx && Object.values(selectedPatient.rx).some(v => v)
        ? [{ ...selectedPatient.rx, createdAt: selectedPatient.rx.createdAt || new Date().toISOString() }, ...(selectedPatient.rxHistory || [])]
        : selectedPatient.rxHistory
    };
    
    setSelectedPatient(updatedPatient);
    
    // Reset form
    setNewRx({
      sphereOD: "",
      cylOD: "",
      axisOD: "",
      addOD: "",
      sphereOS: "",
      cylOS: "",
      axisOS: "",
      addOS: "",
      pdRight: "",
      pdLeft: ""
    });
    setRxDate(new Date());
    
    // Switch to current tab to show the new RX
    setActiveRxTab("current");
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الوصفة الطبية الجديدة بنجاح",
    });
  };
  
  const saveNote = () => {
    if (!selectedPatient || !noteText.trim()) {
      toast({
        title: "تحذير",
        description: "يرجى كتابة ملاحظة قبل الحفظ",
        variant: "destructive"
      });
      return;
    }
    
    // Add the note to the patient's record
    addPatientNote(selectedPatient.patientId, noteText);
    
    // Update local state
    if (selectedPatient.patientNotes) {
      const newNote: PatientNote = {
        id: `note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString()
      };
      
      setSelectedPatient({
        ...selectedPatient,
        patientNotes: [...selectedPatient.patientNotes, newNote]
      });
    } else {
      const newNote: PatientNote = {
        id: `note-${Date.now()}`,
        text: noteText,
        createdAt: new Date().toISOString()
      };
      
      setSelectedPatient({
        ...selectedPatient,
        patientNotes: [newNote]
      });
    }
    
    // Clear the input
    setNoteText("");
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الملاحظة بنجاح",
    });
  };

  const renderRxTable = (rx: RxData) => {
    return (
      <div className="overflow-x-auto">
        {rx.createdAt && (
          <div className="text-center mb-2 p-2 bg-amber-100 rounded">
            <span className="font-bold">تاريخ الوصفة:</span> {formatDate(rx.createdAt)}
          </div>
        )}
        <table className="w-full border-collapse mb-2 ltr">
          <thead>
            <tr className="bg-sky-100">
              <th className="border border-gray-300 p-2">العين</th>
              <th className="border border-gray-300 p-2">Sphere</th>
              <th className="border border-gray-300 p-2">Cyl</th>
              <th className="border border-gray-300 p-2">Axis</th>
              <th className="border border-gray-300 p-2">Add</th>
              <th className="border border-gray-300 p-2">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 font-bold">OD (يمين)</td>
              <td className="border border-gray-300 p-2">{rx.sphereOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.cylOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.axisOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.addOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.pdRight || "—"}</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 p-2 font-bold">OS (يسار)</td>
              <td className="border border-gray-300 p-2">{rx.sphereOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.cylOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.axisOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.addOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.pdLeft || "—"}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 mb-4 text-center">
          <Button variant="outline">
            طباعة الوصفة
          </Button>
        </div>
      </div>
    );
  };

  const renderRxInputForm = () => {
    // Generate options for sphere values (-10.00 to +10.00 in 0.25 steps)
    const sphereOptions = [];
    for (let i = -10; i <= 10; i += 0.25) {
      sphereOptions.push(i.toFixed(2));
    }
    
    // Generate options for cylinder values (-6.00 to 0 in 0.25 steps)
    const cylOptions = [];
    for (let i = -6; i <= 0; i += 0.25) {
      cylOptions.push(i.toFixed(2));
    }
    
    // Generate options for axis values (0 to 180 in steps of 5)
    const axisOptions = [];
    for (let i = 0; i <= 180; i += 5) {
      axisOptions.push(i.toString());
    }
    
    // Generate options for add values (0.00 to 3.00 in 0.25 steps)
    const addOptions = [];
    for (let i = 0; i <= 3; i += 0.25) {
      addOptions.push(i.toFixed(2));
    }
    
    // Generate options for PD values (50 to 70 in 0.5 steps)
    const pdOptions = [];
    for (let i = 50; i <= 70; i += 0.5) {
      pdOptions.push(i.toFixed(1));
    }

    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <Plus size={18} /> إضافة وصفة جديدة
        </h3>
        
        <div className="mb-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Label htmlFor="rxDate" className="font-bold">تاريخ الوصفة:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[240px] justify-start text-right font-normal ${!rxDate ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {rxDate ? format(rxDate, "PPP") : "اختر تاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={rxDate}
                  onSelect={setRxDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-bold mb-2 bg-amber-100 p-2 rounded">العين اليمنى (OD)</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="sphereOD">Sphere</Label>
                <Select value={newRx.sphereOD} onValueChange={(value) => handleRxInputChange('sphereOD', value)}>
                  <SelectTrigger id="sphereOD">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {sphereOptions.map(opt => (
                      <SelectItem key={`sph-od-${opt}`} value={opt}>
                        {Number(opt) >= 0 ? `+${opt}` : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cylOD">Cylinder</Label>
                <Select value={newRx.cylOD} onValueChange={(value) => handleRxInputChange('cylOD', value)}>
                  <SelectTrigger id="cylOD">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {cylOptions.map(opt => (
                      <SelectItem key={`cyl-od-${opt}`} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="axisOD">Axis</Label>
                <Select value={newRx.axisOD} onValueChange={(value) => handleRxInputChange('axisOD', value)}>
                  <SelectTrigger id="axisOD">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {axisOptions.map(opt => (
                      <SelectItem key={`axis-od-${opt}`} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="addOD">Add</Label>
                <Select value={newRx.addOD} onValueChange={(value) => handleRxInputChange('addOD', value)}>
                  <SelectTrigger id="addOD">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {addOptions.map(opt => (
                      <SelectItem key={`add-od-${opt}`} value={opt}>
                        {Number(opt) === 0 ? "0.00" : `+${opt}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="pdRight">PD</Label>
                <Select value={newRx.pdRight} onValueChange={(value) => handleRxInputChange('pdRight', value)}>
                  <SelectTrigger id="pdRight">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {pdOptions.map(opt => (
                      <SelectItem key={`pd-right-${opt}`} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-2 bg-amber-100 p-2 rounded">العين اليسرى (OS)</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="sphereOS">Sphere</Label>
                <Select value={newRx.sphereOS} onValueChange={(value) => handleRxInputChange('sphereOS', value)}>
                  <SelectTrigger id="sphereOS">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {sphereOptions.map(opt => (
                      <SelectItem key={`sph-os-${opt}`} value={opt}>
                        {Number(opt) >= 0 ? `+${opt}` : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cylOS">Cylinder</Label>
                <Select value={newRx.cylOS} onValueChange={(value) => handleRxInputChange('cylOS', value)}>
                  <SelectTrigger id="cylOS">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {cylOptions.map(opt => (
                      <SelectItem key={`cyl-os-${opt}`} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="axisOS">Axis</Label>
                <Select value={newRx.axisOS} onValueChange={(value) => handleRxInputChange('axisOS', value)}>
                  <SelectTrigger id="axisOS">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {axisOptions.map(opt => (
                      <SelectItem key={`axis-os-${opt}`} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="addOS">Add</Label>
                <Select value={newRx.addOS} onValueChange={(value) => handleRxInputChange('addOS', value)}>
                  <SelectTrigger id="addOS">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {addOptions.map(opt => (
                      <SelectItem key={`add-os-${opt}`} value={opt}>
                        {Number(opt) === 0 ? "0.00" : `+${opt}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="pdLeft">PD</Label>
                <Select value={newRx.pdLeft} onValueChange={(value) => handleRxInputChange('pdLeft', value)}>
                  <SelectTrigger id="pdLeft">
                    <SelectValue placeholder="اختر قيمة" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96">
                    <SelectItem value="">-- اختر --</SelectItem>
                    {pdOptions.map(opt => (
                      <SelectItem key={`pd-left-${opt}`} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Button onClick={submitNewRx} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> حفظ الوصفة الجديدة
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-primary mb-4">بحث عن عميل</h2>
      
      {/* Search Box */}
      <div className="mb-4 flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <Input 
          placeholder="ابحث بالاسم أو رقم الهاتف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-2/3"
        />
        <Button onClick={handleSearch}>بحث</Button>
      </div>
      
      {/* Search Results */}
      {showResults && (
        <Card className="mb-6 border-amber-200 shadow-md">
          <CardHeader className="bg-amber-50">
            <CardTitle>نتائج البحث</CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <p>لم يتم العثور على نتائج</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((patient) => (
                  <div 
                    key={patient.patientId}
                    className="p-3 border rounded hover:bg-amber-50 cursor-pointer transition-colors"
                    onClick={() => selectPatient(patient)}
                  >
                    {patient.name} - {patient.phone}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Patient Details */}
      {selectedPatient && (
        <div className="space-y-6">
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} /> معلومات المريض
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>الاسم:</strong> {selectedPatient.name}</div>
                <div><strong>الهاتف:</strong> {selectedPatient.phone}</div>
                <div><strong>تاريخ الميلاد:</strong> {selectedPatient.dob || "غير متوفر"}</div>
                <div><strong>رقم المريض:</strong> {selectedPatient.patientId}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* RX Data */}
          <Card className="border-green-200 shadow-md">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} /> الوصفة الطبية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current" value={activeRxTab} onValueChange={setActiveRxTab}>
                <TabsList className="mb-4 bg-green-100">
                  <TabsTrigger value="current" className="flex items-center gap-1">
                    <Eye size={14} /> الوصفة الحالية
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <History size={14} /> سجل الوصفات
                  </TabsTrigger>
                  <TabsTrigger value="new" className="flex items-center gap-1">
                    <Plus size={14} /> إضافة وصفة جديدة
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="current">
                  {selectedPatient.rx && Object.values(selectedPatient.rx).some(v => v) ? (
                    renderRxTable(selectedPatient.rx)
                  ) : (
                    <p className="text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                      لا يوجد وصفة طبية حالية لهذا المريض
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="history">
                  {selectedPatient.rxHistory && selectedPatient.rxHistory.length > 0 ? (
                    <div className="space-y-6">
                      {selectedPatient.rxHistory.map((rx, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {renderRxTable(rx)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                      لا يوجد سجل وصفات سابقة لهذا المريض
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="new">
                  {renderRxInputForm()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Transactions */}
          <Card className="border-purple-200 shadow-md">
            <CardHeader className="bg-purple-50">
              <CardTitle>سجل المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              {getPatientInvoices().length === 0 ? (
                <p className="text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                  لا يوجد معاملات لهذا المريض
                </p>
              ) : (
                <div className="space-y-4">
                  {getPatientInvoices().map((invoice) => (
                    <div key={invoice.invoiceId} className="border rounded p-4 hover:bg-purple-50 transition-colors">
                      <div className="font-bold mb-1">فاتورة: {invoice.invoiceId}</div>
                      <div className="mb-2 bg-purple-100 inline-block px-2 py-1 rounded">{formatDate(invoice.createdAt)}</div>
                      <div className="mb-2">
                        <div><strong>إطار:</strong> {invoice.frameBrand} {invoice.frameModel && `(${invoice.frameModel}, ${invoice.frameColor})`}</div>
                        <div><strong>عدسة:</strong> {invoice.lensType} ({invoice.lensPrice} د.ك)</div>
                        <div><strong>طلاء:</strong> {invoice.coating} ({invoice.coatingPrice} د.ك)</div>
                      </div>
                      <div className="text-xl font-bold text-primary mb-1">المجموع: {invoice.total} د.ك</div>
                      <div className="mb-2">
                        <span><strong>الخصم:</strong> {invoice.discount} د.ك</span>
                        <span className="mr-4"><strong>الدفعة:</strong> {invoice.deposit} د.ك</span>
                      </div>
                      <Button variant="outline">طباعة الفاتورة</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Notes */}
          <Card className="border-orange-200 shadow-md">
            <CardHeader className="bg-orange-50">
              <CardTitle>الملاحظات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="أضف ملاحظة جديدة..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={saveNote} className="flex items-center gap-2">
                  <Save size={16} /> حفظ الملاحظة
                </Button>
                
                <div className="border-t pt-4 mt-4">
                  {selectedPatient.patientNotes && selectedPatient.patientNotes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPatient.patientNotes.map((note) => (
                        <div key={note.id} className="p-3 border rounded bg-orange-50">
                          <div className="text-sm text-gray-500 mb-1">{formatDate(note.createdAt)}</div>
                          <p>{note.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    selectedPatient.notes ? (
                      <div className="p-4 border rounded bg-orange-50">{selectedPatient.notes}</div>
                    ) : (
                      <p className="text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                        لا يوجد ملاحظات
                      </p>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
