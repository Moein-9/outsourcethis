
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
import { useLanguage } from "@/contexts/LanguageContext";

export const CreateClient: React.FC = () => {
  const { t, language } = useLanguage();
  const addPatient = usePatientStore((state) => state.addPatient);
  
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
      { value: 1, text: language === 'en' ? "January" : "يناير" },
      { value: 2, text: language === 'en' ? "February" : "فبراير" },
      { value: 3, text: language === 'en' ? "March" : "مارس" },
      { value: 4, text: language === 'en' ? "April" : "أبريل" },
      { value: 5, text: language === 'en' ? "May" : "مايو" },
      { value: 6, text: language === 'en' ? "June" : "يونيو" },
      { value: 7, text: language === 'en' ? "July" : "يوليو" },
      { value: 8, text: language === 'en' ? "August" : "أغسطس" },
      { value: 9, text: language === 'en' ? "September" : "سبتمبر" },
      { value: 10, text: language === 'en' ? "October" : "أكتوبر" },
      { value: 11, text: language === 'en' ? "November" : "نوفمبر" },
      { value: 12, text: language === 'en' ? "December" : "ديسمبر" }
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
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' ? "Name field is required." : "حقل الاسم مطلوب.",
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
      title: language === 'en' ? "Saved" : "تم الحفظ",
      description: language === 'en' ? "Client data saved successfully." : "تم حفظ بيانات العميل بنجاح."
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
      <h2 className="text-2xl font-bold mb-4">{t("create_client")}</h2>
      
      <Tabs defaultValue="glasses" value={activeTab} onValueChange={(value) => setActiveTab(value as "glasses" | "contactLenses")}>
        <TabsList className="mb-6 w-full md:w-auto bg-slate-100 border-slate-200 p-1 shadow-md">
          <TabsTrigger 
            value="glasses" 
            className="px-8 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {language === 'en' ? "Prescription Glasses" : "نظارات طبية"}
          </TabsTrigger>
          <TabsTrigger 
            value="contactLenses" 
            className="px-8 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {language === 'en' ? "Contact Lenses" : "عدسات لاصقة"}
          </TabsTrigger>
        </TabsList>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Patient Information - Switched from right to left */}
          <div className="order-2 md:order-2 bg-card rounded-md p-4 border">
            <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
              {t("personal_information")}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("full_name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("phone_number")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">{t("birth_date")}</Label>
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
                    {t("client_didnt_share_birthdate")}
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">{t("notes")}</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("client_notes")}
                />
              </div>
            </div>
          </div>
          
          {/* Right: Prescription Content - Switched from left to right */}
          <div className="order-1 md:order-1">
            <TabsContent value="glasses" className="mt-0 p-0">
              <div className="bg-card rounded-md p-4 border">
                <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
                  {language === 'en' ? "Glasses Prescription" : "وصفات النظارات"}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="rxDate">{language === 'en' ? "Prescription Date" : "تاريخ الوصفة الطبية"}</Label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {rxDate ? format(rxDate, "PPP") : (language === 'en' ? "Select prescription date" : "اختر تاريخ الوصفة")}
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
                        <th className="text-center border border-border bg-muted p-2">
                          {language === 'en' ? "OD (Right)" : "OD (يمين)"}
                        </th>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={sphOD}
                            onChange={(e) => setSphOD(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateSphOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={cylOD}
                            onChange={(e) => setCylOD(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateCylOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={axisOD}
                            onChange={(e) => setAxisOD(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateAxisOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={addOD}
                            onChange={(e) => setAddOD(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateAddOptions()}
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th className="text-center border border-border bg-muted p-2">
                          {language === 'en' ? "OS (Left)" : "OS (يسار)"}
                        </th>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={sphOS}
                            onChange={(e) => setSphOS(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateSphOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={cylOS}
                            onChange={(e) => setCylOS(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateCylOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={axisOS}
                            onChange={(e) => setAxisOS(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generateAxisOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1">
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={addOS}
                            onChange={(e) => setAddOS(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
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
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
                            {generatePdOptions()}
                          </select>
                        </td>
                        <td className="border border-border p-1" colSpan={2}>
                          <select
                            className="w-full p-1 rounded-md border-input bg-background"
                            value={pdLeft}
                            onChange={(e) => setPdLeft(e.target.value)}
                          >
                            <option value="" disabled>{language === 'en' ? "Select..." : "اختر..."}</option>
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
                  {language === 'en' ? "Contact Lens Prescription" : "وصفات العدسات اللاصقة"}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="contactRxDate">{language === 'en' ? "Prescription Date" : "تاريخ الوصفة الطبية"}</Label>
                  <div className="mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {rxDate ? format(rxDate, "PPP") : (language === 'en' ? "Select prescription date" : "اختر تاريخ الوصفة")}
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
        {language === 'en' ? "Save and Continue" : "حفظ ومتابعة"}
      </Button>
    </div>
  );
};
