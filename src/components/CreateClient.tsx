
import React, { useState, useEffect } from "react";
import { usePatientStore, ContactLensRx } from "@/store/patientStore";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MessageSquare, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLensForm } from "@/components/ContactLensForm";
import { useLanguageStore } from "@/store/languageStore";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { printRxReceipt } from "@/components/RxReceiptPrint";

export const CreateClient: React.FC = () => {
  const addPatient = usePatientStore((state) => state.addPatient);
  const { t, language } = useLanguageStore();
  
  const [activeTab, setActiveTab] = useState<"glasses" | "contactLenses">("glasses");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [noDob, setNoDob] = useState(false);
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [rxDate, setRxDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  
  const [sphOD, setSphOD] = useState("");
  const [cylOD, setCylOD] = useState("");
  const [axisOD, setAxisOD] = useState("");
  const [addOD, setAddOD] = useState("");
  const [sphOS, setSphOS] = useState("");
  const [cylOS, setCylOS] = useState("");
  const [axisOS, setAxisOS] = useState("");
  const [addOS, setAddOS] = useState("");
  const [pdRight, setPdRight] = useState("");
  const [pdLeft, setPdLeft] = useState("");
  
  const [contactLensRx, setContactLensRx] = useState<ContactLensRx>({
    rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
    leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" }
  });
  
  const [validationErrors, setValidationErrors] = useState({
    rightEye: { cylinderAxisError: false },
    leftEye: { cylinderAxisError: false }
  });
  
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [savedPatient, setSavedPatient] = useState<any>(null);
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  const hasValidationErrors = validationErrors.rightEye.cylinderAxisError || 
                              validationErrors.leftEye.cylinderAxisError;
  
  useEffect(() => {
    validateCylinderAxis('rightEye', cylOD, axisOD);
    validateCylinderAxis('leftEye', cylOS, axisOS);
  }, [cylOD, axisOD, cylOS, axisOS]);
  
  const validateCylinderAxis = (eye: 'rightEye' | 'leftEye', cylinder: string, axis: string) => {
    const hasCylinder = cylinder !== "";
    const hasAxis = axis !== "";
    
    setValidationErrors(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        cylinderAxisError: hasCylinder && !hasAxis
      }
    }));
  };
  
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
  
  const generateDayOptions = () => {
    const options = [];
    for (let i = 1; i <= 31; i++) {
      options.push(
        <option key={`day-${i}`} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };
  
  const generateMonthOptions = () => {
    const months = [
      { value: 1, text: t("january") },
      { value: 2, text: t("february") },
      { value: 3, text: t("march") },
      { value: 4, text: t("april") },
      { value: 5, text: t("may") },
      { value: 6, text: t("june") },
      { value: 7, text: t("july") },
      { value: 8, text: t("august") },
      { value: 9, text: t("september") },
      { value: 10, text: t("october") },
      { value: 11, text: t("november") },
      { value: 12, text: t("december") }
    ];
    
    return months.map(month => (
      <option key={`month-${month.value}`} value={month.value}>
        {month.text}
      </option>
    ));
  };
  
  const generateYearOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1930; i--) {
      options.push(
        <option key={`year-${i}`} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: t("error"),
        description: t("requiredField"),
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === "glasses" && hasValidationErrors) {
      toast({
        title: t("error"),
        description: t("axisValidationError") || "The AXIS values you've inserted are not correct! If CYL value is provided, AXIS value is required.",
        variant: "destructive"
      });
      return;
    }
    
    let dob = "";
    if (!noDob && dobDay && dobMonth && dobYear) {
      dob = `${dobDay}/${dobMonth}/${dobYear}`;
    }
    
    let patientData;
    
    if (activeTab === "glasses") {
      patientData = {
        name,
        phone,
        dob,
        notes: notes.trim(),
        patientNotes: [],
        rx: {
          sphereOD: sphOD,
          cylOD,
          axisOD,
          addOD,
          sphereOS: sphOS,
          cylOS,
          axisOS,
          addOS,
          pdRight,
          pdLeft,
          createdAt: rxDate ? rxDate.toISOString() : new Date().toISOString()
        }
      };
    } else {
      patientData = {
        name,
        phone,
        dob,
        notes: notes.trim(),
        patientNotes: [],
        rx: {
          sphereOD: "-",
          cylOD: "-",
          axisOD: "-",
          addOD: "-",
          sphereOS: "-",
          cylOS: "-",
          axisOS: "-",
          addOS: "-",
          pdRight: "-",
          pdLeft: "-"
        },
        contactLensRx: {
          ...contactLensRx,
          createdAt: rxDate ? rxDate.toISOString() : new Date().toISOString()
        }
      };
    }
    
    addPatient(patientData);
    setSavedPatient(patientData);
    
    toast({
      title: t("success"),
      description: t("successMessage")
    });
    
    setShowPrintDialog(true);
    
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setNoDob(false);
    setDobDay("");
    setDobMonth("");
    setDobYear("");
    setSphOD("");
    setCylOD("");
    setAxisOD("");
    setAddOD("");
    setSphOS("");
    setCylOS("");
    setAxisOS("");
    setAddOS("");
    setPdRight("");
    setPdLeft("");
    setRxDate(new Date());
    setNotes("");
    setContactLensRx({
      rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
      leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" }
    });
    setValidationErrors({
      rightEye: { cylinderAxisError: false },
      leftEye: { cylinderAxisError: false }
    });
  };

  const handlePrintRx = () => {
    console.log("handlePrintRx called, savedPatient:", savedPatient);
    if (savedPatient) {
      if (activeTab === "glasses") {
        setShowPrintDialog(false);
        // Need to add a delay to ensure the dialog is fully closed
        // before opening the next one
        setTimeout(() => {
          setShowLanguageDialog(true); 
        }, 100);
      } else {
        setShowPrintDialog(false);
      }
    }
  };

  const printRxWithLanguage = (printLanguage: 'en' | 'ar') => {
    console.log("Printing RX with language:", printLanguage, "for patient:", savedPatient?.name);
    if (savedPatient) {
      printRxReceipt({
        patientName: savedPatient.name,
        patientPhone: savedPatient.phone,
        rx: savedPatient.rx,
        forcedLanguage: printLanguage
      });
    }
    setShowLanguageDialog(false);
  };

  // Generate options functions
  const validateCylinderAxis = (eye: 'rightEye' | 'leftEye', cylinder: string, axis: string) => {
    const hasCylinder = cylinder !== "";
    const hasAxis = axis !== "";
    
    setValidationErrors(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        cylinderAxisError: hasCylinder && !hasAxis
      }
    }));
  };
  
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
  
  const generateDayOptions = () => {
    const options = [];
    for (let i = 1; i <= 31; i++) {
      options.push(
        <option key={`day-${i}`} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };
  
  const generateMonthOptions = () => {
    const months = [
      { value: 1, text: t("january") },
      { value: 2, text: t("february") },
      { value: 3, text: t("march") },
      { value: 4, text: t("april") },
      { value: 5, text: t("may") },
      { value: 6, text: t("june") },
      { value: 7, text: t("july") },
      { value: 8, text: t("august") },
      { value: 9, text: t("september") },
      { value: 10, text: t("october") },
      { value: 11, text: t("november") },
      { value: 12, text: t("december") }
    ];
    
    return months.map(month => (
      <option key={`month-${month.value}`} value={month.value}>
        {month.text}
      </option>
    ));
  };
  
  const generateYearOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1930; i--) {
      options.push(
        <option key={`year-${i}`} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className={`space-y-6 ${dirClass}`}>
      <h2 className={`text-2xl font-bold mb-4 ${textAlignClass}`}>{t("createClientTitle")}</h2>
      
      <Tabs defaultValue="glasses" value={activeTab} onValueChange={(value) => setActiveTab(value as "glasses" | "contactLenses")}>
        <TabsList className="mb-6 w-full md:w-auto bg-slate-100 border-slate-200 p-1 shadow-md">
          <TabsTrigger 
            value="glasses" 
            className="px-8 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t("prescriptionGlasses")}
          </TabsTrigger>
          <TabsTrigger 
            value="contactLenses" 
            className="px-8 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {t("contactLensesTab")}
          </TabsTrigger>
        </TabsList>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-md p-4 border">
            <div className={`text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary ${textAlignClass}`}>
              {t("personalInfo")}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={textAlignClass}>{t("name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("fullName")}
                  className={textAlignClass}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className={textAlignClass}>{t("phone")}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phoneNumber")}
                  className={textAlignClass}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob" className={textAlignClass}>{t("dateOfBirth")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    id="dobDay"
                    className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${textAlignClass}`}
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    disabled={noDob}
                  >
                    <option value="" disabled>{t("day")}</option>
                    {generateDayOptions()}
                  </select>
                  <select
                    id="dobMonth"
                    className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${textAlignClass}`}
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    disabled={noDob}
                  >
                    <option value="" disabled>{t("month")}</option>
                    {generateMonthOptions()}
                  </select>
                  <select
                    id="dobYear"
                    className={`h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${textAlignClass}`}
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    disabled={noDob}
                  >
                    <option value="" disabled>{t("year")}</option>
                    {generateYearOptions()}
                  </select>
                </div>
                
                <div className={`flex items-center space-x-2 ${language === 'ar' ? 'space-x-reverse' : ''} mt-2`}>
                  <Checkbox 
                    id="noDobCheck" 
                    checked={noDob} 
                    onCheckedChange={(checked) => setNoDob(checked === true)} 
                  />
                  <Label 
                    htmlFor="noDobCheck" 
                    className={`font-normal text-sm ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                  >
                    {t("clientDidntShareDOB")}
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="notes" 
                  className={`flex items-center gap-1 ${textAlignClass}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  {t("notes")}
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("notesPlaceholder") || "Add notes about this client..."}
                  className={textAlignClass}
                  dir="auto"
                />
              </div>
            </div>
          </div>
          
          <div>
            <TabsContent value="glasses" className="mt-0 p-0">
              <div className="bg-card rounded-md p-4 border">
                <div className={`text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary ${textAlignClass}`}>
                  {t("glassesPrescription")}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="rxDate" className={textAlignClass}>{t("prescriptionDate")}</Label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {rxDate ? format(rxDate, "PPP") : t("choosePrescriptionDate")}
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
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2"></th>
                        <th className="text-center border border-border bg-muted p-2">SPH</th>
                        <th className="text-center border border-border bg-muted p-2">CYL</th>
                        <th className="text-center border border-border bg-muted p-2">AXIS</th>
                        <th className="text-center border border-border bg-muted p-2">ADD</th>
                        <th className="text-center border border-border bg-muted p-2">PD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2">{t("rightEye")} (OD)</th>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={sphOD}
                            onChange={(e) => setSphOD(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateSphOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={cylOD}
                            onChange={(e) => setCylOD(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateCylOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className={`w-full p-1 rounded-md ${validationErrors.rightEye.cylinderAxisError ? 'border-red-500 bg-red-50' : 'border-input bg-background'}`}
                            value={axisOD}
                            onChange={(e) => setAxisOD(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateAxisOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={addOD}
                            onChange={(e) => setAddOD(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateAddOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={pdRight}
                            onChange={(e) => setPdRight(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generatePdOptions()}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2">{t("leftEye")} (OS)</th>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={sphOS}
                            onChange={(e) => setSphOS(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateSphOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={cylOS}
                            onChange={(e) => setCylOS(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateCylOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className={`w-full p-1 rounded-md ${validationErrors.leftEye.cylinderAxisError ? 'border-red-500 bg-red-50' : 'border-input bg-background'}`}
                            value={axisOS}
                            onChange={(e) => setAxisOS(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateAxisOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={addOS}
                            onChange={(e) => setAddOS(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generateAddOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={pdLeft}
                            onChange={(e) => setPdLeft(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generatePdOptions()}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {hasValidationErrors && (
                  <div className="p-3 mt-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700 text-sm">
                      {t("axisValidationError") || "The AXIS values you've inserted are not correct! If CYL value is provided, AXIS value is required."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="contactLenses" className="mt-0 p-0">
              <div className="bg-card rounded-md p-4 border">
                <div className={`text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary ${textAlignClass}`}>
                  {t("contactLensPrescription")}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="contactRxDate" className={textAlignClass}>{t("prescriptionDate")}</Label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {rxDate ? format(rxDate, "PPP") : t("choosePrescriptionDate")}
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
                
                <ContactLensForm 
                  rxData={contactLensRx} 
                  onChange={setContactLensRx}
                />
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      <Button 
        className="mt-6" 
        onClick={handleSubmit}
        disabled={activeTab === "glasses" && hasValidationErrors}
      >
        {t("saveAndContinue")}
      </Button>

      {/* The first dialog for asking if user wants to print */}
      <AlertDialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <AlertDialogContent className={dirClass}>
          <AlertDialogHeader>
            <AlertDialogTitle className={textAlignClass}>
              {language === 'ar' ? 'طباعة الوصفة الطبية' : 'Print Prescription'}
            </AlertDialogTitle>
            <AlertDialogDescription className={textAlignClass}>
              {language === 'ar' 
                ? 'هل تريد طباعة الوصفة الطبية الآن؟'
                : 'Do you want to print the RX now?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={`${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <AlertDialogCancel>
              {language === 'ar' ? 'لا' : 'No'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePrintRx}>
              {language === 'ar' ? 'نعم، اطبع الآن' : 'Yes, Print Now'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* The second dialog for language selection */}
      <AlertDialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <AlertDialogContent className={dirClass}>
          <AlertDialogHeader>
            <AlertDialogTitle className={textAlignClass}>
              {language === 'ar' ? 'اختر لغة الطباعة' : 'Select Print Language'}
            </AlertDialogTitle>
            <AlertDialogDescription className={textAlignClass}>
              {language === 'ar' 
                ? 'اختر اللغة التي ترغب في طباعة الوصفة الطبية بها'
                : 'Choose the language you want to print the prescription in'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center gap-4 py-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => printRxWithLanguage('en')}
            >
              English
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => printRxWithLanguage('ar')}
            >
              العربية
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className={language === 'ar' ? 'mr-auto' : 'ml-auto'}>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
