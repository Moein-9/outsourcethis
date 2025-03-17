
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { RxData, usePatientStore } from "@/store/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  AlertCircle, 
  FileText, 
  Glasses, 
  History, 
  Printer, 
  Eye,
  Plus,
  Calendar,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { toast } from "@/components/ui/use-toast";

interface PatientRxManagerProps {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  currentRx: RxData;
  rxHistory?: RxData[];
  notes?: string;
  onRxPrintRequest: () => void;
}

export const PatientRxManager: React.FC<PatientRxManagerProps> = ({ 
  patientId,
  patientName,
  patientPhone,
  currentRx,
  rxHistory = [],
  notes,
  onRxPrintRequest
}) => {
  const { updatePatientRx } = usePatientStore();
  const [isNewRxOpen, setIsNewRxOpen] = useState(false);
  const [newRx, setNewRx] = useState<RxData>({
    sphereOD: "",
    cylOD: "",
    axisOD: "",
    addOD: "",
    sphereOS: "",
    cylOS: "",
    axisOS: "",
    addOS: "",
    pdRight: "",
    pdLeft: "",
    createdAt: new Date().toISOString()
  });
  const [viewRxDetails, setViewRxDetails] = useState<RxData | null>(null);
  const [isViewRxOpen, setIsViewRxOpen] = useState(false);

  const handleRxInputChange = (eye: "OD" | "OS", field: "sphere" | "cyl" | "axis" | "add", value: string) => {
    if (eye === "OD") {
      setNewRx(prev => ({
        ...prev,
        [`sphere${eye}`]: field === "sphere" ? value : prev.sphereOD,
        [`cyl${eye}`]: field === "cyl" ? value : prev.cylOD,
        [`axis${eye}`]: field === "axis" ? value : prev.axisOD,
        [`add${eye}`]: field === "add" ? value : prev.addOD,
      }));
    } else {
      setNewRx(prev => ({
        ...prev,
        [`sphere${eye}`]: field === "sphere" ? value : prev.sphereOS,
        [`cyl${eye}`]: field === "cyl" ? value : prev.cylOS,
        [`axis${eye}`]: field === "axis" ? value : prev.axisOS,
        [`add${eye}`]: field === "add" ? value : prev.addOS,
      }));
    }
  };

  const handlePdChange = (eye: "Right" | "Left", value: string) => {
    setNewRx(prev => ({
      ...prev,
      [`pd${eye}`]: value
    }));
  };

  const handleSaveNewRx = () => {
    // Validate all fields are filled
    if (!newRx.sphereOD || !newRx.sphereOS || !newRx.pdRight || !newRx.pdLeft) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // Update the patient's RX
    updatePatientRx(patientId, {
      ...newRx,
      createdAt: new Date().toISOString()
    });

    toast({
      title: "تم الحفظ",
      description: "تم حفظ الوصفة الطبية بنجاح",
    });

    setIsNewRxOpen(false);
  };

  const handleViewRx = (rx: RxData) => {
    setViewRxDetails(rx);
    setIsViewRxOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "تاريخ غير متوفر";
    try {
      return format(parseISO(dateString), "PPP", { locale: ar });
    } catch (error) {
      return "تاريخ غير صالح";
    }
  };

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

  return (
    <Card className="mt-6 border-blue-200">
      <CardHeader className="pb-2 flex flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
            <Glasses className="h-5 w-5" />
            الوصفة الطبية وتعليمات العناية
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRxPrintRequest} className="border-blue-300 hover:bg-blue-50">
            <Printer className="h-4 w-4 ml-2 text-blue-600" />
            طباعة الوصفة
          </Button>
          <Button size="sm" onClick={() => setIsNewRxOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 ml-2" />
            وصفة جديدة
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-800 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                الوصفة الطبية الحالية
              </h4>
              <Badge className="bg-green-500">
                <Calendar className="h-3 w-3 mr-1" />
                {currentRx.createdAt ? formatDate(currentRx.createdAt) : 'تاريخ غير متوفر'}
              </Badge>
            </div>
            <div className="overflow-x-auto bg-white rounded-md shadow-sm">
              <Table>
                <TableHeader className="bg-blue-100">
                  <TableRow>
                    <TableHead className="text-blue-800"></TableHead>
                    <TableHead className="text-blue-800">Sphere</TableHead>
                    <TableHead className="text-blue-800">Cylinder</TableHead>
                    <TableHead className="text-blue-800">Axis</TableHead>
                    <TableHead className="text-blue-800">Add</TableHead>
                    <TableHead className="text-blue-800">PD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium bg-blue-50/50">العين اليمنى (OD)</TableCell>
                    <TableCell>{currentRx?.sphereOD || "-"}</TableCell>
                    <TableCell>{currentRx?.cylOD || "-"}</TableCell>
                    <TableCell>{currentRx?.axisOD || "-"}</TableCell>
                    <TableCell>{currentRx?.addOD || "-"}</TableCell>
                    <TableCell rowSpan={2}>{currentRx?.pdRight || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-rose-50/50">العين اليسرى (OS)</TableCell>
                    <TableCell>{currentRx?.sphereOS || "-"}</TableCell>
                    <TableCell>{currentRx?.cylOS || "-"}</TableCell>
                    <TableCell>{currentRx?.axisOS || "-"}</TableCell>
                    <TableCell>{currentRx?.addOS || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <History className="h-5 w-5 text-amber-600" />
                تاريخ الوصفات الطبية
              </h4>
            </div>
            {rxHistory && rxHistory.length > 0 ? (
              <div className="rounded-md border overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-amber-50">
                    <TableRow>
                      <TableHead className="text-amber-800">التاريخ</TableHead>
                      <TableHead className="text-amber-800">العين اليمنى (OD)</TableHead>
                      <TableHead className="text-amber-800">العين اليسرى (OS)</TableHead>
                      <TableHead className="text-amber-800">PD</TableHead>
                      <TableHead className="text-right text-amber-800">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rxHistory.map((rx, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-amber-50/30" : "bg-white"}>
                        <TableCell className="font-medium">{formatDate(rx.createdAt)}</TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium ml-1">SPH:</span> {rx.sphereOD || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium ml-1">CYL:</span> {rx.cylOD || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium ml-1">AXIS:</span> {rx.axisOD || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium ml-1">SPH:</span> {rx.sphereOS || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium ml-1">CYL:</span> {rx.cylOS || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium ml-1">AXIS:</span> {rx.axisOS || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{rx.pdRight} - {rx.pdLeft}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => handleViewRx(rx)}
                          >
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
              <div className="text-center py-6 border rounded-md bg-gray-50">
                <FileText className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium mb-1 text-gray-600">لا يوجد سجل وصفات طبية سابقة</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  لم يتم تسجيل أي وصفات طبية سابقة لهذا المريض
                </p>
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 text-green-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
              تعليمات العناية بالنظارة
            </h4>
            <ul className="text-gray-700 list-disc list-inside space-y-2 pl-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 ml-2 flex-shrink-0" />
                <span>يجب تنظيف العدسات بانتظام بمنظف خاص</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 ml-2 flex-shrink-0" />
                <span>تجنب ملامسة العدسات للماء الساخن</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 ml-2 flex-shrink-0" />
                <span>استخدم حافظة نظارات عند عدم الاستخدام</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 ml-2 flex-shrink-0" />
                <span>راجع الطبيب كل 6-12 شهر</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>

      {/* New RX Dialog */}
      <Dialog open={isNewRxOpen} onOpenChange={setIsNewRxOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">إضافة وصفة طبية جديدة</DialogTitle>
            <DialogDescription>
              أدخل بيانات الوصفة الطبية الجديدة للمريض {patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">وصفة النظارات الطبية</h3>
                </div>
                
                <div className="lg:col-span-1">
                  <Label className="block mb-1">العين</Label>
                  <div className="h-10 flex items-center justify-center font-semibold bg-blue-100 rounded border border-blue-200">
                    OD (اليمنى)
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="sphereOD" className="block mb-1">SPH</Label>
                  <select
                    id="sphereOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2"
                    value={newRx.sphereOD}
                    onChange={(e) => handleRxInputChange("OD", "sphere", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateSphOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="cylOD" className="block mb-1">CYL</Label>
                  <select
                    id="cylOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2"
                    value={newRx.cylOD}
                    onChange={(e) => handleRxInputChange("OD", "cyl", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateCylOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="axisOD" className="block mb-1">AXIS</Label>
                  <select
                    id="axisOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2"
                    value={newRx.axisOD}
                    onChange={(e) => handleRxInputChange("OD", "axis", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAxisOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="addOD" className="block mb-1">ADD</Label>
                  <select
                    id="addOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2"
                    value={newRx.addOD}
                    onChange={(e) => handleRxInputChange("OD", "add", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAddOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="pdRight" className="block mb-1">PD</Label>
                  <select
                    id="pdRight"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2"
                    value={newRx.pdRight}
                    onChange={(e) => handlePdChange("Right", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generatePdOptions()}
                  </select>
                </div>
                
                {/* Left Eye Row */}
                <div className="lg:col-span-1">
                  <div className="h-10 flex items-center justify-center font-semibold bg-rose-100 rounded border border-rose-200">
                    OS (اليسرى)
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="sphereOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2"
                    value={newRx.sphereOS}
                    onChange={(e) => handleRxInputChange("OS", "sphere", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateSphOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="cylOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2"
                    value={newRx.cylOS}
                    onChange={(e) => handleRxInputChange("OS", "cyl", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateCylOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="axisOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2"
                    value={newRx.axisOS}
                    onChange={(e) => handleRxInputChange("OS", "axis", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAxisOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="addOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2"
                    value={newRx.addOS}
                    onChange={(e) => handleRxInputChange("OS", "add", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generateAddOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="pdLeft"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2"
                    value={newRx.pdLeft}
                    onChange={(e) => handlePdChange("Left", e.target.value)}
                  >
                    <option value="" disabled>اختر...</option>
                    {generatePdOptions()}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRxOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveNewRx} className="bg-blue-600 hover:bg-blue-700">
              حفظ الوصفة الجديدة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View RX Details Dialog */}
      <Dialog open={isViewRxOpen} onOpenChange={setIsViewRxOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">تفاصيل الوصفة الطبية</DialogTitle>
            <DialogDescription>
              {viewRxDetails?.createdAt && formatDate(viewRxDetails.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {viewRxDetails && (
            <div className="py-4">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 mb-4">
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                  <Table>
                    <TableHeader className="bg-amber-100">
                      <TableRow>
                        <TableHead className="text-amber-800"></TableHead>
                        <TableHead className="text-amber-800">Sphere</TableHead>
                        <TableHead className="text-amber-800">Cylinder</TableHead>
                        <TableHead className="text-amber-800">Axis</TableHead>
                        <TableHead className="text-amber-800">Add</TableHead>
                        <TableHead className="text-amber-800">PD</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium bg-amber-50/50">العين اليمنى (OD)</TableCell>
                        <TableCell>{viewRxDetails.sphereOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.cylOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.axisOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.addOD || "-"}</TableCell>
                        <TableCell rowSpan={2}>{viewRxDetails.pdRight || "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium bg-rose-50/50">العين اليسرى (OS)</TableCell>
                        <TableCell>{viewRxDetails.sphereOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.cylOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.axisOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.addOS || "-"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewRxOpen(false)}>
              إغلاق
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-300 hover:bg-blue-50"
              onClick={() => {
                setIsViewRxOpen(false);
                onRxPrintRequest();
              }}
            >
              <Printer className="h-4 w-4 ml-2 text-blue-600" />
              طباعة الوصفة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
