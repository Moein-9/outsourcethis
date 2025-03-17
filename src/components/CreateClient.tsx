import React, { useState, useEffect } from "react";
import { usePatientStore } from "@/store/patientStore";
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

export const CreateClient: React.FC = () => {
  const addPatient = usePatientStore((state) => state.addPatient);
  
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
      { value: 1, text: "يناير" },
      { value: 2, text: "فبراير" },
      { value: 3, text: "مارس" },
      { value: 4, text: "أبريل" },
      { value: 5, text: "مايو" },
      { value: 6, text: "يونيو" },
      { value: 7, text: "يوليو" },
      { value: 8, text: "أغسطس" },
      { value: 9, text: "سبتمبر" },
      { value: 10, text: "أكتوبر" },
      { value: 11, text: "نوفمبر" },
      { value: 12, text: "ديسمبر" }
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
        title: "خطأ",
        description: "حقل الاسم مطلوب.",
        variant: "destructive"
      });
      return;
    }
    
    // Format DOB if available
    let dob = "";
    if (!noDob && dobDay && dobMonth && dobYear) {
      dob = `${dobDay}/${dobMonth}/${dobYear}`;
    }
    
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
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ بيانات العميل بنجاح."
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
  };
  
  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-4">إنشاء عميل</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right: Patient Information */}
        <div className="bg-card rounded-md p-4 border">
          <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
            المعلومات الشخصية
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم الكامل"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">الهاتف</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="رقم الهاتف"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">تاريخ الميلاد</Label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  id="dobDay"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                  disabled={noDob}
                >
                  <option value="" disabled>اليوم</option>
                  {generateDayOptions()}
                </select>
                <select
                  id="dobMonth"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  disabled={noDob}
                >
                  <option value="" disabled>الشهر</option>
                  {generateMonthOptions()}
                </select>
                <select
                  id="dobYear"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  disabled={noDob}
                >
                  <option value="" disabled>السنة</option>
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
                  لم يشارك العميل بتاريخ الميلاد
                </Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ملاحظات أو تفضيلات العميل"
              />
            </div>
          </div>
        </div>
        
        {/* Left: RX Table */}
        <div className="bg-card rounded-md p-4 border">
          <div className="text-lg font-semibold text-primary pb-2 mb-4 border-b border-primary">
            وصفات النظارات
          </div>
          
          <div className="mb-4">
            <Label htmlFor="rxDate">تاريخ الوصفة الطبية</Label>
            <div className="mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-right ${!rxDate ? "text-muted-foreground" : ""}`}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {rxDate ? format(rxDate, "PPP") : "اختر تاريخ الوصفة"}
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
                  <th className="text-center border border-border bg-muted p-2">OD (يمين)</th>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={sphOD}
                      onChange={(e) => setSphOD(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generateSphOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={cylOD}
                      onChange={(e) => setCylOD(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generateCylOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={axisOD}
                      onChange={(e) => setAxisOD(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generateAxisOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={addOD}
                      onChange={(e) => setAddOD(e.target.value)}
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
                      value={sphOS}
                      onChange={(e) => setSphOS(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generateSphOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={cylOS}
                      onChange={(e) => setCylOS(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generateCylOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={axisOS}
                      onChange={(e) => setAxisOS(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generateAxisOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1">
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={addOS}
                      onChange={(e) => setAddOS(e.target.value)}
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
                      value={pdRight}
                      onChange={(e) => setPdRight(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generatePdOptions()}
                    </select>
                  </td>
                  <td className="border border-border p-1" colSpan={2}>
                    <select
                      className="w-full p-1 rounded-md border-input bg-background"
                      value={pdLeft}
                      onChange={(e) => setPdLeft(e.target.value)}
                    >
                      <option value="" disabled>اختر...</option>
                      {generatePdOptions()}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Button 
        className="mt-6" 
        onClick={handleSubmit}
      >
        حفظ ومتابعة
      </Button>
    </div>
  );
};
