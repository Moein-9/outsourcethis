import React, { useState, useRef } from "react";
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
import { CalendarIcon, Save, Eye, Plus, FileText, History, Printer, Download, Share2 } from "lucide-react";
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
  const printableRxRef = useRef<HTMLDivElement>(null);
  
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
      
      // Include time in the formatted date
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${month}(${date.getMonth() + 1})-${day}-${year} ${hours}:${minutes}`;
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
    const requiredFields = ["sphereOD", "sphereOS"];
    const missingFields = requiredFields.filter(field => !newRx[field as keyof RxData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "تحذير",
        description: "يرجى ملء حقول Sphere على الأقل للوصفة الطبية",
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
          <Button variant="outline" onClick={() => printRx(rx)} className="flex items-center gap-2 hover:bg-sky-100 transition-colors">
            <Printer size={16} className="text-blue-600" />
            طباعة الوصفة
          </Button>
        </div>
      </div>
    );
  };

  const printRx = (rx: RxData) => {
    // Create a printable version and print it
    const printContent = document.createElement('div');
    printContent.innerHTML = printableRxRef.current?.innerHTML || '';
    
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    
    window.print();
    
    // Restore the page after printing
    document.body.innerHTML = originalContents;
    window.location.reload();
    
    toast({
      title: "طباعة",
      description: "تمت طباعة الوصفة الطبية بنجاح",
    });
  };

  const renderRxInputForm = () => {
    // Generate options for select elements (same as in CreateClient.tsx)
    const generateSphOptions = () => {
      const options = [];
      for (let i = 10; i >= -10; i -= 0.25) {
        const formatted = i >= 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
        options.push(
          <option key={`sph-${i}`} value={formatted}>
            {formatted}
          </option>
        );
      }
      return options;
    };
    
    const generateCylOptions = () => {
      const options = [];
      for (let i = 0; i >= -6; i -= 0.25) {
        const formatted = i.toFixed(2);
        options.push(
          <option key={`cyl-${i}`} value={formatted}>
            {formatted}
          </option>
        );
      }
      return options;
    };
    
    const generateAxisOptions = () => {
      const options = [];
      for (let i = 0; i <= 180; i += 1) {
        options.push(
          <option key={`axis-${i}`} value={i}>
            {i}
          </option>
        );
      }
      return options;
    };
    
    const generateAddOptions = () => {
      const options = [];
      for (let i = 0; i <= 3; i += 0.25) {
        const formatted = i === 0 ? "0.00" : `+${i.toFixed(2)}`;
        options.push(
          <option key={`add-${i}`} value={formatted}>
            {formatted}
          </option>
        );
      }
      return options;
    };
    
    const generatePdOptions = () => {
      const options = [];
      for (let i = 40; i <= 80; i += 1) {
        options.push(
          <option key={`pd-${i}`} value={i}>
            {i}
          </option>
        );
      }
      return options;
    };

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
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={rxDate}
                  onSelect={setRxDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse ltr">
            <thead>
              <tr>
                <th className="text-center border border-border bg-muted p-2"></th>
                <th className="text-center border border-border bg-muted p-2">SPH</th>
                <th className="text-center border border-border bg-muted p-2">CYL</th>
                <th className="text-center border border-border bg-muted p-2">AXIS</th>
                <th className="text-center border border-border bg-muted p-2">ADD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="text-center border border-border bg-muted p-2">OD (يمين)</th>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.sphereOD}
                    onChange={(e) => handleRxInputChange('sphereOD', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateSphOptions()}
                  </select>
                </td>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.cylOD}
                    onChange={(e) => handleRxInputChange('cylOD', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateCylOptions()}
                  </select>
                </td>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.axisOD}
                    onChange={(e) => handleRxInputChange('axisOD', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAxisOptions()}
                  </select>
                </td>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.addOD}
                    onChange={(e) => handleRxInputChange('addOD', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAddOptions()}
                  </select>
                </td>
              </tr>
              <tr>
                <th className="text-center border border-border bg-muted p-2">OS (يسار)</th>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.sphereOS}
                    onChange={(e) => handleRxInputChange('sphereOS', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateSphOptions()}
                  </select>
                </td>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.cylOS}
                    onChange={(e) => handleRxInputChange('cylOS', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateCylOptions()}
                  </select>
                </td>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.axisOS}
                    onChange={(e) => handleRxInputChange('axisOS', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAxisOptions()}
                  </select>
                </td>
                <td className="border border-border p-1">
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.addOS}
                    onChange={(e) => handleRxInputChange('addOS', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAddOptions()}
                  </select>
                </td>
              </tr>
              <tr>
                <th className="text-center border border-border bg-muted p-2">PD</th>
                <td className="border border-border p-1" colSpan={2}>
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.pdRight}
                    onChange={(e) => handleRxInputChange('pdRight', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generatePdOptions()}
                  </select>
                </td>
                <td className="border border-border p-1" colSpan={2}>
                  <select
                    className="w-full p-1 rounded-md border-input bg-background"
                    value={newRx.pdLeft}
                    onChange={(e) => handleRxInputChange('pdLeft', e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generatePdOptions()}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="text-center mt-6">
          <Button onClick={submitNewRx} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> حفظ الوصفة الجديدة
          </Button>
        </div>
      </div>
    );
  };

  const PrintableRx = ({ rx, patient }: { rx: RxData, patient: Patient }) => {
    return (
      <div className="hidden">
        <div ref={printableRxRef} className="p-8 max-w-3xl mx-auto bg-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">وصفة طبية للنظارات</h1>
              <p className="text-gray-500">بتاريخ: {formatDate(rx.createdAt || new Date().toISOString())}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-xl font-bold text-blue-600 gap-2">
                <FileText size={24} />
                OPTIX
              </div>
              <p className="text-gray-500">مركز النظارات المتخصص</p>
            </div>
          </div>
          
          {/* Patient Info */}
          <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              <Eye size={20} /> معلومات المريض
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div><strong className="text-gray-700">الاسم:</strong> {patient.name}</div>
              <div><strong className="text-gray-700">رقم المريض:</strong> {patient.patientId}</div>
              <div><strong className="text-gray-700">تاريخ الميلاد:</strong> {patient.dob || "غير متوفر"}</div>
              <div><strong className="text-gray-700">الهاتف:</strong> {patient.phone}</div>
            </div>
          </div>
          
          {/* RX Data */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <FileText size={20} /> معلومات الوصفة الطبية
            </h2>
            <table className="w-full border-collapse rounded overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-start">العين</th>
                  <th className="p-3 text-center">Sphere</th>
                  <th className="p-3 text-center">Cyl</th>
                  <th className="p-3 text-center">Axis</th>
                  <th className="p-3 text-center">Add</th>
                  <th className="p-3 text-center">PD</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50 border-b">
                  <td className="p-3 font-bold border text-blue-700">OD (يمين)</td>
                  <td className="p-3 text-center border">{rx.sphereOD || "—"}</td>
                  <td className="p-3 text-center border">{rx.cylOD || "—"}</td>
                  <td className="p-3 text-center border">{rx.axisOD || "—"}</td>
                  <td className="p-3 text-center border">{rx.addOD || "—"}</td>
                  <td className="p-3 text-center border">{rx.pdRight || "—"}</td>
                </tr>
                <tr className="bg-white">
                  <td className="p-3 font-bold border text-blue-700">OS (يسار)</td>
                  <td className="p-3 text-center border">{rx.sphereOS || "—"}</td>
                  <td className="p-3 text-center border">{rx.cylOS || "—"}</td>
                  <td className="p-3 text-center border">{rx.axisOS || "—"}</td>
                  <td className="p-3 text-center border">{rx.addOS || "—"}</td>
                  <td className="p-3 text-center border">{rx.pdLeft || "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Additional Information */}
          <div className="mb-8 grid grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                <Share2 size={16} /> نصائح للاستخدام
              </h3>
              <ul className="text-gray-700 list-disc list-inside space-y-1">
                <li>يجب تنظيف العدسات بانتظام بمنظف خاص</li>
                <li>تجنب ملامسة العدسات للماء الساخن</li>
                <li>استخدم حافظة نظارات عند ع��م الاستخدام</li>
                <li>راجع الطبيب كل 6-12 شهر</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                <Download size={16} /> معلومات إضافية
              </h3>
              <p className="text-gray-700">
                هذه الوصفة صالحة لمدة سنة واحدة من تاريخ الإصدار.
                <br />
                للاستفسارات يرجى الاتصال على: 12345678
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-4 border-t text-center text-gray-500">
            <p>© {new Date().getFullYear()} مركز OPTIX للنظارات - جميع الحقوق محفوظة</p>
            <p className="mt-1">الكويت - شارع التحرير، مبنى 123</p>
          </div>
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
                    <>
                      {renderRxTable(selectedPatient.rx)}
                      {/* Add PrintableRx component */}
                      <PrintableRx rx={selectedPatient.rx} patient={selectedPatient} />
                    </>
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
                          {/* Add PrintableRx component for each historical RX */}
                          <PrintableRx rx={rx} patient={selectedPatient} />
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
                
                {/* Original notes from patient creation */}
                {selectedPatient.notes && (
                  <div className="mt-4 p-3 border rounded bg-yellow-50">
                    <div className="font-bold text-sm mb-1">ملاحظات عند الإنشاء:</div>
                    <p>{selectedPatient.notes}</p>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="font-bold mb-2">ملاحظات إضافية:</div>
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
                    <p className="text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
                      لا يوجد ملاحظات إضافية
                    </p>
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
