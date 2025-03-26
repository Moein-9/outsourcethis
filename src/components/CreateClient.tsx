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
import { PrescriptionInput, generateSphereOptions, generateCylinderOptions, generateAxisOptions, generateAddOptions, generatePDOptions } from "@/components/PrescriptionInput";

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
  const [notes, setNotes] = useState(""); // State for notes
  
  // Rx states
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
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    rightEye: { cylinder: false, axis: false },
    leftEye: { cylinder: false, axis: false },
  });
  
  // Contact lens RX state
  const [contactLensRx, setContactLensRx] = useState<ContactLensRx>({
    rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
    leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" }
  });
  
  // Direction class based on language
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  // Validate CYL and AXIS relationship
  const validateCylAxis = () => {
    const rightHasCyl = cylOD !== "" && cylOD !== "0.00";
    const rightHasAxis = axisOD !== "";
    const leftHasCyl = cylOS !== "" && cylOS !== "0.00";
    const leftHasAxis = axisOS !== "";
    
    setValidationErrors({
      rightEye: {
        cylinder: rightHasCyl && !rightHasAxis, // Error if CYL but no AXIS
        axis: !rightHasCyl && rightHasAxis, // Error if AXIS but no CYL (unlikely but for completeness)
      },
      leftEye: {
        cylinder: leftHasCyl && !leftHasAxis, // Error if CYL but no AXIS
        axis: !leftHasCyl && leftHasAxis, // Error if AXIS but no CYL (unlikely but for completeness)
      }
    });
    
    return !(rightHasCyl && !rightHasAxis) && !(leftHasCyl && !leftHasAxis);
  };
  
  // Generate day options
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
  
  // Generate month options
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
  
  // Generate year options
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
    
    // Validate prescription if in glasses tab
    if (activeTab === "glasses") {
      if (!validateCylAxis()) {
        toast({
          title: t("error"),
          description: t("axisRequired"),
          variant: "destructive"
        });
        return;
      }
    }
    
    // Format DOB if available
    let dob = "";
    if (!noDob && dobDay && dobMonth && dobYear) {
      dob = `${dobDay}/${dobMonth}/${dobYear}`;
    }
    
    if (activeTab === "glasses") {
      const patientData = {
        name,
        phone,
        dob,
        notes: notes.trim(), // Include notes in patient data
        patientNotes: [], // Keep empty array
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
      
      addPatient(patientData);
    } else {
      // Add contact lens patient
      const patientData = {
        name,
        phone,
        dob,
        notes: notes.trim(), // Include notes in contact lens patient data
        patientNotes: [], // Keep empty array
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
      
      addPatient(patientData);
    }
    
    toast({
      title: t("success"),
      description: t("successMessage")
    });
    
    // Reset form
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
    setNotes(""); // Reset notes
    setContactLensRx({
      rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
      leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" }
    });
  };
  
  // Effect to validate prescription changes
  useEffect(() => {
    if (activeTab === "glasses") {
      validateCylAxis();
    }
  }, [cylOD, axisOD, cylOS, axisOS, activeTab]);

  const sphereOptions = generateSphereOptions();
  const cylinderOptions = generateCylinderOptions();
  const axisOptions = generateAxisOptions();
  const addOptions = generateAddOptions();
  const pdOptions = generatePDOptions();
  
  return (
    <div className={`py-4 ${dirClass}`}>
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
          {/* Left: Patient Information */}
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
              
              {/* Notes Field */}
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
          
          {/* Right: Prescription Content */}
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
                          <PrescriptionInput
                            type="sphere"
                            value={sphOD}
                            onChange={setSphOD}
                            options={sphereOptions}
                          />
                        </td>
                        <td className={`border border-border p-1 ${validationErrors.rightEye.cylinder ? 'bg-red-50' : ''}`}>
                          <PrescriptionInput
                            type="cylinder"
                            value={cylOD}
                            onChange={setCylOD}
                            options={cylinderOptions}
                            hasError={validationErrors.rightEye.cylinder}
                          />
                          {validationErrors.rightEye.cylinder && (
                            <div className="flex items-center text-xs text-red-600 mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {t("axisRequired")}
                            </div>
                          )}
                        </td>
                        <td className={`border border-border p-1 ${validationErrors.rightEye.cylinder ? 'bg-red-50' : ''}`}>
                          <PrescriptionInput
                            type="axis"
                            value={axisOD}
                            onChange={setAxisOD}
                            options={axisOptions}
                            hasError={validationErrors.rightEye.cylinder}
                          />
                        </td>
                        <td className="border border-border p-1">
                          <PrescriptionInput
                            type="add"
                            value={addOD}
                            onChange={setAddOD}
                            options={addOptions}
                          />
                        </td>
                        <td className="border border-border p-1">
                          <PrescriptionInput
                            type="pd"
                            value={pdRight}
                            onChange={setPdRight}
                            options={pdOptions}
                          />
                        </td>
                      </tr>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2">{t("leftEye")} (OS)</th>
                        <td className="border border-border p-1">
                          <PrescriptionInput
                            type="sphere"
                            value={sphOS}
                            onChange={setSphOS}
                            options={sphereOptions}
                          />
                        </td>
                        <td className={`border border-border p-1 ${validationErrors.leftEye.cylinder ? 'bg-red-50' : ''}`}>
                          <PrescriptionInput
                            type="cylinder"
                            value={cylOS}
                            onChange={setCylOS}
                            options={cylinderOptions}
                            hasError={validationErrors.leftEye.cylinder}
                          />
                          {validationErrors.leftEye.cylinder && (
                            <div className="flex items-center text-xs text-red-600 mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {t("axisRequired")}
                            </div>
                          )}
                        </td>
                        <td className={`border border-border p-1 ${validationErrors.leftEye.cylinder ? 'bg-red-50' : ''}`}>
                          <PrescriptionInput
                            type="axis"
                            value={axisOS}
                            onChange={setAxisOS}
                            options={axisOptions}
                            hasError={validationErrors.leftEye.cylinder}
                          />
                        </td>
                        <td className="border border-border p-1">
                          <PrescriptionInput
                            type="add"
                            value={addOS}
                            onChange={setAddOS}
                            options={addOptions}
                          />
                        </td>
                        <td className="border border-border p-1">
                          <PrescriptionInput
                            type="pd"
                            value={pdLeft}
                            onChange={setPdLeft}
                            options={pdOptions}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
      >
        {t("saveAndContinue")}
      </Button>
    </div>
  );
};
