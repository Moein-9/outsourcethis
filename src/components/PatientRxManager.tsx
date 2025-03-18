import React, { useState, useEffect } from "react";
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
import { enUS } from "date-fns/locale/en-US";
import { 
  AlertCircle, 
  FileText, 
  Glasses, 
  History, 
  Printer, 
  Eye,
  Plus,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { toast } from "@/components/ui/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { RxLanguageDialog } from "./RxReceiptPrint";

interface PatientRxManagerProps {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  currentRx: RxData;
  rxHistory?: RxData[];
  notes?: string;
  onRxPrintRequest: (language?: 'en' | 'ar') => void;
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
  const { updatePatientRx, getPatientById } = usePatientStore();
  const { t, language } = useLanguageStore();
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
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  
  // Local state to hold the latest patient data including updated Rx
  const [localCurrentRx, setLocalCurrentRx] = useState(currentRx);
  const [localRxHistory, setLocalRxHistory] = useState(rxHistory);
  
  // Update local state whenever props change
  useEffect(() => {
    setLocalCurrentRx(currentRx);
    setLocalRxHistory(rxHistory);
  }, [currentRx, rxHistory]);

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
    if (!newRx.sphereOD || !newRx.sphereOS || !newRx.pdRight || !newRx.pdLeft) {
      toast({
        title: t("dataError"),
        description: t("fillAllRequiredFields"),
        variant: "destructive"
      });
      return;
    }

    // Add timestamp to the new RX
    const timestampedNewRx = {
      ...newRx,
      createdAt: new Date().toISOString()
    };

    // Update the global store
    updatePatientRx(patientId, timestampedNewRx);
    
    // Update local state for immediate UI reflection
    // Move current Rx to history
    setLocalRxHistory(prev => [
      { ...localCurrentRx, createdAt: localCurrentRx.createdAt || new Date().toISOString() },
      ...prev
    ]);
    
    // Set new Rx as current
    setLocalCurrentRx(timestampedNewRx);

    toast({
      title: t("success"),
      description: t("successMessage"),
    });

    setIsNewRxOpen(false);
    
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
      pdLeft: "",
      createdAt: new Date().toISOString()
    });
  };

  const handleViewRx = (rx: RxData) => {
    setViewRxDetails(rx);
    setIsViewRxOpen(true);
  };

  const handlePrintRequest = () => {
    setIsLanguageDialogOpen(true);
  };

  const handleLanguageSelection = (selectedLanguage: 'en' | 'ar') => {
    setIsLanguageDialogOpen(false);
    onRxPrintRequest(selectedLanguage);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return language === 'ar' ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
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

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <Card className="mt-6 border-blue-200">
      <CardHeader className="pb-2 flex flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <div>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
            <Glasses className="h-5 w-5" />
            {t("rxAndCareInstructions")}
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrintRequest} className="border-blue-300 hover:bg-blue-50">
            <Printer className="h-4 w-4 mr-1.5" />
            {t("printPrescription")}
          </Button>
          <Button size="sm" onClick={() => setIsNewRxOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1.5" />
            {t("newRx")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-blue-800 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                {t("currentRx")}
              </h4>
              <Badge className="bg-green-500">
                <Calendar className="h-3 w-3 mr-1" />
                {localCurrentRx.createdAt ? formatDate(localCurrentRx.createdAt) : language === 'ar' ? 'تاريخ غير متوفر' : 'Date not available'}
              </Badge>
            </div>
            <div className="overflow-x-auto bg-white rounded-md shadow-sm">
              {/* Always left-to-right table regardless of language */}
              <Table className="ltr">
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
                    <TableCell className="font-medium bg-blue-50/50">{t("rightEye")} (OD)</TableCell>
                    <TableCell>{localCurrentRx?.sphereOD || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.cylOD || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.axisOD || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.addOD || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.pdRight || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-rose-50/50">{t("leftEye")} (OS)</TableCell>
                    <TableCell>{localCurrentRx?.sphereOS || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.cylOS || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.axisOS || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.addOS || "-"}</TableCell>
                    <TableCell>{localCurrentRx?.pdLeft || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <History className="h-5 w-5 text-amber-600" />
                {t("rxHistory")}
              </h4>
            </div>
            {localRxHistory && localRxHistory.length > 0 ? (
              <div className="rounded-md border overflow-hidden shadow-sm">
                <Table className="ltr">
                  <TableHeader className="bg-amber-50">
                    <TableRow>
                      <TableHead className="text-amber-800">{t("date")}</TableHead>
                      <TableHead className="text-amber-800">{t("rightEye")} (OD)</TableHead>
                      <TableHead className="text-amber-800">{t("leftEye")} (OS)</TableHead>
                      <TableHead className="text-amber-800">{t("pupillaryDistance")}</TableHead>
                      <TableHead className="text-amber-800 text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localRxHistory.map((rx, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-amber-50/30" : "bg-white"}>
                        <TableCell className="font-medium">{formatDate(rx.createdAt)}</TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium mr-1">SPH:</span> {rx.sphereOD || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">CYL:</span> {rx.cylOD || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">AXIS:</span> {rx.axisOD || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className="font-medium mr-1">SPH:</span> {rx.sphereOS || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">CYL:</span> {rx.cylOS || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">AXIS:</span> {rx.axisOS || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span><strong>{t("right")}:</strong> {rx.pdRight || "-"}</span>
                            <span><strong>{t("left")}:</strong> {rx.pdLeft || "-"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => handleViewRx(rx)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            {t("view")}
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
                <h3 className="text-lg font-medium mb-1 text-gray-600">{t("noPreviousRx")}</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {t("noPreviousRxDescription")}
                </p>
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 text-green-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
              {t("glassesCareTips")}
            </h4>
            <ul className={`space-y-3 pl-1 ${dirClass}`}>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("tip1")}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("tip2")}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("tip3")}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("tip4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>

      {/* New RX Dialog */}
      <Dialog open={isNewRxOpen} onOpenChange={setIsNewRxOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("addNewRx")}</DialogTitle>
            <DialogDescription>
              {t("addNewRxFor")} {patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">{t("glassesPrescription")}</h3>
                </div>
                
                <div className="lg:col-span-1">
                  <Label className="block mb-1">{t("rightEye")}</Label>
                  <div className="h-10 flex items-center justify-center font-semibold bg-blue-100 rounded border border-blue-200">
                    OD 
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="sphereOD" className="block mb-1">SPH</Label>
                  <select
                    id="sphereOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 ltr"
                    value={newRx.sphereOD}
                    onChange={(e) => handleRxInputChange("OD", "sphere", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateSphOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="cylOD" className="block mb-1">CYL</Label>
                  <select
                    id="cylOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 ltr"
                    value={newRx.cylOD}
                    onChange={(e) => handleRxInputChange("OD", "cyl", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateCylOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="axisOD" className="block mb-1">AXIS</Label>
                  <select
                    id="axisOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 ltr"
                    value={newRx.axisOD}
                    onChange={(e) => handleRxInputChange("OD", "axis", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateAxisOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="addOD" className="block mb-1">ADD</Label>
                  <select
                    id="addOD"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 ltr"
                    value={newRx.addOD}
                    onChange={(e) => handleRxInputChange("OD", "add", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateAddOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="pdRight" className="block mb-1">PD ({t("right")})</Label>
                  <select
                    id="pdRight"
                    className="w-full h-10 rounded-md border border-blue-200 bg-white px-3 py-2 ltr"
                    value={newRx.pdRight}
                    onChange={(e) => handlePdChange("Right", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generatePdOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label className="block mb-1">{t("leftEye")}</Label>
                  <div className="h-10 flex items-center justify-center font-semibold bg-rose-100 rounded border border-rose-200">
                    OS
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="sphereOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2 ltr"
                    value={newRx.sphereOS}
                    onChange={(e) => handleRxInputChange("OS", "sphere", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateSphOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="cylOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2 ltr"
                    value={newRx.cylOS}
                    onChange={(e) => handleRxInputChange("OS", "cyl", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateCylOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="axisOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2 ltr"
                    value={newRx.axisOS}
                    onChange={(e) => handleRxInputChange("OS", "axis", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateAxisOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="addOS"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2 ltr"
                    value={newRx.addOS}
                    onChange={(e) => handleRxInputChange("OS", "add", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generateAddOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="pdLeft" className="block mb-1">PD ({t("left")})</Label>
                  <select
                    id="pdLeft"
                    className="w-full h-10 rounded-md border border-rose-200 bg-white px-3 py-2 ltr"
                    value={newRx.pdLeft}
                    onChange={(e) => handlePdChange("Left", e.target.value)}
                    dir="ltr"
                  >
                    <option value="" disabled>{t("choose")}</option>
                    {generatePdOptions()}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRxOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveNewRx} className="bg-blue-600 hover:bg-blue-700">
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View RX Dialog */}
      <Dialog open={isViewRxOpen} onOpenChange={setIsViewRxOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("viewPrescription")}</DialogTitle>
            <DialogDescription>
              {viewRxDetails?.createdAt && formatDate(viewRxDetails.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {viewRxDetails && (
            <div className="py-4">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200 mb-4">
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                  <Table className="ltr">
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
                        <TableCell className="font-medium bg-amber-50/50">{t("rightEye")} (OD)</TableCell>
                        <TableCell>{viewRxDetails.sphereOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.cylOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.axisOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.addOD || "-"}</TableCell>
                        <TableCell>{viewRxDetails.pdRight || "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium bg-rose-50/50">{t("leftEye")} (OS)</TableCell>
                        <TableCell>{viewRxDetails.sphereOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.cylOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.axisOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.addOS || "-"}</TableCell>
                        <TableCell>{viewRxDetails.pdLeft || "-"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewRxOpen(false)}>
              {t("close")}
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-300 hover:bg-blue-50"
              onClick={() => {
                setIsViewRxOpen(false);
                handlePrintRequest();
              }}
            >
              <Printer className="h-4 w-4 mr-1.5" />
              {t("printPrescription")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Language selection dialog */}
      <RxLanguageDialog
        isOpen={isLanguageDialogOpen}
        onClose={() => setIsLanguageDialogOpen(false)}
        onSelect={handleLanguageSelection}
      />
    </Card>
  );
};
