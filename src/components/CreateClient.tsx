
import React, { useState, useEffect } from "react";
import { usePatientStore, ContactLensRx } from "@/store/patientStore";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactLensForm } from "@/components/ContactLensForm";
import { useLanguageStore } from "@/store/languageStore";

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
  const [notes, setNotes] = useState("");
  const [rxDate, setRxDate] = useState<Date | undefined>(new Date());
  
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
  
  // Contact lens RX state
  const [contactLensRx, setContactLensRx] = useState<ContactLensRx>({
    rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
    leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" }
  });
  
  // Generate options for select elements
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
        notes,
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
        notes,
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
    setNotes("");
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
    setContactLensRx({
      rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
      leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" }
    });
  };
  
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4">{t("createClientTitle")}</h2>
      
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
          {/* Left: Patient Information - Switched from right to left */}
          <div className="order-2 md:order-2 bg-card rounded-md p-4 border">
            <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
              {t("personalInfo")}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("fullName")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phoneNumber")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">{t("dateOfBirth")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    id="dobDay"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    disabled={noDob}
                  >
                    <option value="" disabled>{t("day")}</option>
                    {generateDayOptions()}
                  </select>
                  <select
                    id="dobMonth"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    disabled={noDob}
                  >
                    <option value="" disabled>{t("month")}</option>
                    {generateMonthOptions()}
                  </select>
                  <select
                    id="dobYear"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    disabled={noDob}
                  >
                    <option value="" disabled>{t("year")}</option>
                    {generateYearOptions()}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse mt-2">
                  <Checkbox 
                    id="noDobCheck" 
                    checked={noDob} 
                    onCheckedChange={(checked) => setNoDob(checked === true)} 
                  />
                  <Label 
                    htmlFor="noDobCheck" 
                    className="font-normal text-sm"
                  >
                    {t("clientDidntShareDOB")}
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">{t("notes")}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("clientNotesPreferences")}
                />
              </div>
            </div>
          </div>
          
          {/* Right: Prescription Content - Switched from left to right */}
          <div className="order-1 md:order-1">
            <TabsContent value="glasses" className="mt-0 p-0">
              <div className="bg-card rounded-md p-4 border">
                <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
                  {t("glassesPrescription")}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="rxDate">{t("prescriptionDate")}</Label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
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
                        <th className="text-center border border-border bg-muted p-2">OD ({t("right")})</th>
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
                            className="w-full p-1 rounded-md border-input bg-background"
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
                      </tr>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2">OS ({t("left")})</th>
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
                            className="w-full p-1 rounded-md border-input bg-background"
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
                      </tr>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2">PD</th>
                        <td className="border border-border p-1" colSpan={2}>
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={pdRight}
                            onChange={(e) => setPdRight(e.target.value)}
                          >
                            <option value="" disabled>{t("choose")}</option>
                            {generatePdOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1" colSpan={2}>
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
              </div>
            </TabsContent>
            
            <TabsContent value="contactLenses" className="mt-0 p-0">
              <div className="bg-card rounded-md p-4 border">
                <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
                  {t("contactLensPrescription")}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="contactRxDate">{t("prescriptionDate")}</Label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
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
