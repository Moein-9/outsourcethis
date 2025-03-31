
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
import { PatientNote, RxData, usePatientStore, ContactLensRx } from "@/store/patientStore";
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
  CheckCircle2,
  MessageSquare,
  Clock,
  Contact
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { toast } from "@/components/ui/use-toast";
import { useLanguageStore } from "@/store/languageStore";
import { RxLanguageDialog } from "./RxReceiptPrint";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientRxManagerProps {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  currentRx: RxData;
  rxHistory?: RxData[];
  notes?: string;
  patientNotes?: PatientNote[];
  onRxPrintRequest: (language?: 'en' | 'ar') => void;
  contactLensRx?: ContactLensRx;
  contactLensRxHistory?: ContactLensRx[];
}

export const PatientRxManager: React.FC<PatientRxManagerProps> = ({ 
  patientId,
  patientName,
  patientPhone,
  currentRx,
  rxHistory = [],
  notes,
  patientNotes = [],
  onRxPrintRequest,
  contactLensRx,
  contactLensRxHistory = []
}) => {
  const { updatePatientRx, getPatientById, addPatientNote, updatePatientContactLensRx } = usePatientStore();
  const { t, language } = useLanguageStore();
  const [isNewRxOpen, setIsNewRxOpen] = useState(false);
  const [isNewContactLensRxOpen, setIsNewContactLensRxOpen] = useState(false);
  const [rxTab, setRxTab] = useState<"glasses" | "contacts">("glasses");
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
  const [newContactLensRx, setNewContactLensRx] = useState<ContactLensRx>({
    rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
    leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
    createdAt: new Date().toISOString()
  });
  const [viewRxDetails, setViewRxDetails] = useState<RxData | null>(null);
  const [viewContactLensRxDetails, setViewContactLensRxDetails] = useState<ContactLensRx | null>(null);
  const [isViewRxOpen, setIsViewRxOpen] = useState(false);
  const [isViewContactLensRxOpen, setIsViewContactLensRxOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  
  const [localCurrentRx, setLocalCurrentRx] = useState(currentRx);
  const [localRxHistory, setLocalRxHistory] = useState(rxHistory);
  const [localPatientNotes, setLocalPatientNotes] = useState(patientNotes);
  const [localContactLensRx, setLocalContactLensRx] = useState(contactLensRx);
  const [localContactLensRxHistory, setLocalContactLensRxHistory] = useState(contactLensRxHistory);
  const [newNote, setNewNote] = useState("");
  
  useEffect(() => {
    setLocalCurrentRx(currentRx);
    setLocalRxHistory(rxHistory);
    setLocalPatientNotes(patientNotes);
    setLocalContactLensRx(contactLensRx);
    setLocalContactLensRxHistory(contactLensRxHistory);
  }, [currentRx, rxHistory, patientNotes, contactLensRx, contactLensRxHistory]);

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

  const handleContactLensRxChange = (eye: "rightEye" | "leftEye", field: "sphere" | "cylinder" | "axis" | "bc" | "dia", value: string) => {
    setNewContactLensRx(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value
      }
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

    const timestampedNewRx = {
      ...newRx,
      createdAt: new Date().toISOString()
    };

    updatePatientRx(patientId, timestampedNewRx);
    
    setLocalRxHistory(prev => [
      { ...localCurrentRx, createdAt: localCurrentRx.createdAt || new Date().toISOString() },
      ...prev
    ]);
    
    setLocalCurrentRx(timestampedNewRx);

    toast({
      title: t("success"),
      description: t("successMessage"),
    });

    setIsNewRxOpen(false);
    
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

  const handleSaveNewContactLensRx = () => {
    if (!newContactLensRx.rightEye.sphere || newContactLensRx.rightEye.sphere === "-" || 
        !newContactLensRx.leftEye.sphere || newContactLensRx.leftEye.sphere === "-") {
      toast({
        title: t("dataError"),
        description: t("fillAllRequiredFields"),
        variant: "destructive"
      });
      return;
    }

    const timestampedNewContactLensRx = {
      ...newContactLensRx,
      createdAt: new Date().toISOString()
    };

    updatePatientContactLensRx(patientId, timestampedNewContactLensRx);
    
    if (localContactLensRx) {
      setLocalContactLensRxHistory(prev => [
        { ...localContactLensRx, createdAt: localContactLensRx.createdAt || new Date().toISOString() },
        ...prev
      ]);
    }
    
    setLocalContactLensRx(timestampedNewContactLensRx);

    toast({
      title: t("success"),
      description: t("successMessage"),
    });

    setIsNewContactLensRxOpen(false);
    
    setNewContactLensRx({
      rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
      leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "-" },
      createdAt: new Date().toISOString()
    });
  };

  const handleViewRx = (rx: RxData) => {
    setViewRxDetails(rx);
    setIsViewRxOpen(true);
  };

  const handleViewContactLensRx = (rx: ContactLensRx) => {
    setViewContactLensRxDetails(rx);
    setIsViewContactLensRxOpen(true);
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

  const generateBcOptions = () => {
    const options = [];
    for (let i = 8.0; i <= 9.5; i += 0.1) {
      const formatted = i.toFixed(1);
      options.push(
        <option key={`bc-${formatted}`} value={formatted}>
          {formatted}
        </option>
      );
    }
    return options;
  };

  const generateDiaOptions = () => {
    const options = [];
    for (let i = 13.0; i <= 15.0; i += 0.1) {
      const formatted = i.toFixed(1);
      options.push(
        <option key={`dia-${formatted}`} value={formatted}>
          {formatted}
        </option>
      );
    }
    return options;
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: t("error"),
        description: t("noteCannotBeEmpty"),
        variant: "destructive"
      });
      return;
    }

    addPatientNote(patientId, newNote);
    
    // Update local state to show the new note immediately
    const newPatientNote = {
      id: `note-${Date.now()}`,
      text: newNote,
      createdAt: new Date().toISOString()
    };
    
    setLocalPatientNotes(prev => [...prev, newPatientNote]);
    setNewNote("");
    
    toast({
      title: t("success"),
      description: t("noteAddedSuccessfully")
    });
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
          <Button 
            size="sm" 
            onClick={() => rxTab === "glasses" ? setIsNewRxOpen(true) : setIsNewContactLensRxOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {rxTab === "glasses" ? t("newRx") : t("newContactLensRx") || "New Contact Lens Rx"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Tabs for RX types */}
          <Tabs value={rxTab} onValueChange={(value) => setRxTab(value as "glasses" | "contacts")}>
            <TabsList className="w-full">
              <TabsTrigger 
                value="glasses" 
                className="w-1/2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700"
              >
                <Glasses className="h-4 w-4 mr-2" />
                {t("glassesPrescription") || "Glasses Prescription"}
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="w-1/2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                {t("contactLensPrescription") || "Contact Lens Prescription"}
              </TabsTrigger>
            </TabsList>

            {/* Glasses Prescription Content */}
            <TabsContent value="glasses">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-800 flex items-center gap-2">
                    <Glasses className="h-5 w-5 text-blue-600" />
                    {t("currentRx")}
                  </h4>
                  <Badge className="bg-blue-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {localCurrentRx.createdAt ? formatDate(localCurrentRx.createdAt) : language === 'ar' ? 'تاريخ غير متوفر' : 'Date not available'}
                  </Badge>
                </div>
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
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

                {/* RX History Section */}
                <div className="mt-6">
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
              </div>
            </TabsContent>

            {/* Contact Lenses Prescription Content */}
            <TabsContent value="contacts">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green-800 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    {t("currentContactLensRx") || "Current Contact Lens RX"}
                  </h4>
                  <Badge className="bg-green-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {localContactLensRx?.createdAt ? formatDate(localContactLensRx.createdAt) : language === 'ar' ? 'تاريخ غير متوفر' : 'Date not available'}
                  </Badge>
                </div>
                
                {localContactLensRx ? (
                  <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                    <Table className="ltr">
                      <TableHeader className="bg-green-100">
                        <TableRow>
                          <TableHead className="text-green-800"></TableHead>
                          <TableHead className="text-green-800">Sphere</TableHead>
                          <TableHead className="text-green-800">Cylinder</TableHead>
                          <TableHead className="text-green-800">Axis</TableHead>
                          <TableHead className="text-green-800">BC</TableHead>
                          <TableHead className="text-green-800">DIA</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium bg-green-50/50">{t("rightEye")} (OD)</TableCell>
                          <TableCell>{localContactLensRx.rightEye.sphere || "-"}</TableCell>
                          <TableCell>{localContactLensRx.rightEye.cylinder || "-"}</TableCell>
                          <TableCell>{localContactLensRx.rightEye.axis || "-"}</TableCell>
                          <TableCell>{localContactLensRx.rightEye.bc || "-"}</TableCell>
                          <TableCell>{localContactLensRx.rightEye.dia || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium bg-green-50/50">{t("leftEye")} (OS)</TableCell>
                          <TableCell>{localContactLensRx.leftEye.sphere || "-"}</TableCell>
                          <TableCell>{localContactLensRx.leftEye.cylinder || "-"}</TableCell>
                          <TableCell>{localContactLensRx.leftEye.axis || "-"}</TableCell>
                          <TableCell>{localContactLensRx.leftEye.bc || "-"}</TableCell>
                          <TableCell>{localContactLensRx.leftEye.dia || "-"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-6 border rounded-md bg-white">
                    <Eye className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1 text-gray-600">{t("noContactLensRx") || "No Contact Lens Prescription"}</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      {t("noContactLensRxDescription") || "This patient doesn't have any contact lens prescriptions yet."}
                    </p>
                  </div>
                )}

                {/* Contact Lens History Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700 flex items-center gap-2">
                      <History className="h-5 w-5 text-green-600" />
                      {t("contactLensRxHistory") || "Contact Lens Rx History"}
                    </h4>
                  </div>
                  {localContactLensRxHistory && localContactLensRxHistory.length > 0 ? (
                    <div className="rounded-md border overflow-hidden shadow-sm">
                      <Table className="ltr">
                        <TableHeader className="bg-green-50">
                          <TableRow>
                            <TableHead className="text-green-800">{t("date")}</TableHead>
                            <TableHead className="text-green-800">{t("rightEye")} (OD)</TableHead>
                            <TableHead className="text-green-800">{t("leftEye")} (OS)</TableHead>
                            <TableHead className="text-green-800 text-right">{t("actions")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {localContactLensRxHistory.map((rx, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? "bg-green-50/30" : "bg-white"}>
                              <TableCell className="font-medium">{formatDate(rx.createdAt)}</TableCell>
                              <TableCell className="text-sm">
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">SPH:</span> {rx.rightEye.sphere || "-"}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">CYL:</span> {rx.rightEye.cylinder || "-"}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">AXIS:</span> {rx.rightEye.axis || "-"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">SPH:</span> {rx.leftEye.sphere || "-"}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">CYL:</span> {rx.leftEye.cylinder || "-"}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium mr-1">AXIS:</span> {rx.leftEye.axis || "-"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => handleViewContactLensRx(rx)}
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
                      <h3 className="text-lg font-medium mb-1 text-gray-600">{t("noPreviousContactLensRx") || "No Previous Contact Lens Rx"}</h3>
                      <p className="text-sm text-gray-500 max-w-md mx-auto">
                        {t("noPreviousContactLensRxDescription") || "This patient doesn't have any previous contact lens prescriptions."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Patient Notes Section */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-purple-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                {t("patientNotes")}
              </h4>
            </div>
            
            <div className="space-y-4">
              {/* Add New Note */}
              <div className="bg-white p-3 rounded-md shadow-sm border border-purple-100">
                <Label htmlFor="newNote" className={`mb-2 ${textAlignClass} block text-purple-700`}>{t("addNewNote")}</Label>
                <div className="flex gap-2">
                  <Textarea 
                    id="newNote" 
                    value={newNote} 
                    onChange={(e) => setNewNote(e.target.value)} 
                    placeholder={t("enterNoteAboutPatient")}
                    className={`min-h-[80px] flex-1 ${textAlignClass}`}
                  />
                  <Button 
                    className="self-end bg-purple-600 hover:bg-purple-700" 
                    onClick={handleAddNote}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("addNote")}
                  </Button>
                </div>
              </div>
              
              {/* Notes List */}
              <div className="bg-white rounded-md shadow-sm border border-purple-100">
                {localPatientNotes && localPatientNotes.length > 0 ? (
                  <div className="divide-y divide-purple-100">
                    {localPatientNotes.map((note) => (
                      <div key={note.id} className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <div className={`text-sm text-gray-500 flex items-center ${textAlignClass}`}>
                            <Clock className="inline-block h-3.5 w-3.5 mr-1 text-purple-400" />
                            {formatDate(note.createdAt)}
                          </div>
                        </div>
                        <p className={`text-gray-800 whitespace-pre-wrap ${textAlignClass}`}>{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50">
                    <FileText className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1 text-gray-600">{t("noNotes")}</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      {t("addNotesToTrackInfo")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Care Tips Section */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 text-green-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
              {rxTab === "glasses" ? t("glassesCareTips") : t("contactLensCareTips") || "Contact Lens Care Tips"}
            </h4>
            <ul className={`space-y-3 pl-1 ${dirClass}`}>
              {rxTab === "glasses" ? (
                <>
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
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{t("contactTip1") || "Always wash hands thoroughly before handling contact lenses."}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{t("contactTip2") || "Replace lenses as prescribed and never sleep with them unless approved by your eye doctor."}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{t("contactTip3") || "Use only recommended solution for cleaning and storing lenses."}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{t("contactTip4") || "If you experience any discomfort or redness, remove lenses and consult your eye care professional."}</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </CardContent>

      {/* Dialog components */}
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

      <Dialog open={isNewContactLensRxOpen} onOpenChange={setIsNewContactLensRxOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("addNewContactLensRx") || "Add New Contact Lens RX"}</DialogTitle>
            <DialogDescription>
              {t("addNewContactLensRxFor") || "Add new contact lens prescription for"} {patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-6">
                  <h3 className="text-lg font-medium text-green-800 mb-2">{t("contactLensPrescription") || "Contact Lens Prescription"}</h3>
                </div>
                
                <div className="lg:col-span-1">
                  <Label className="block mb-1">{t("rightEye")}</Label>
                  <div className="h-10 flex items-center justify-center font-semibold bg-green-100 rounded border border-green-200">
                    OD 
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="sphereRightEye" className="block mb-1">SPH</Label>
                  <select
                    id="sphereRightEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.rightEye.sphere}
                    onChange={(e) => handleContactLensRxChange("rightEye", "sphere", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateSphOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="cylinderRightEye" className="block mb-1">CYL</Label>
                  <select
                    id="cylinderRightEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.rightEye.cylinder}
                    onChange={(e) => handleContactLensRxChange("rightEye", "cylinder", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateCylOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="axisRightEye" className="block mb-1">AXIS</Label>
                  <select
                    id="axisRightEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.rightEye.axis}
                    onChange={(e) => handleContactLensRxChange("rightEye", "axis", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateAxisOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="bcRightEye" className="block mb-1">BC</Label>
                  <select
                    id="bcRightEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.rightEye.bc}
                    onChange={(e) => handleContactLensRxChange("rightEye", "bc", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateBcOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label htmlFor="diaRightEye" className="block mb-1">DIA</Label>
                  <select
                    id="diaRightEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.rightEye.dia}
                    onChange={(e) => handleContactLensRxChange("rightEye", "dia", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateDiaOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <Label className="block mb-1">{t("leftEye")}</Label>
                  <div className="h-10 flex items-center justify-center font-semibold bg-green-100 rounded border border-green-200">
                    OS
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="sphereLeftEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.leftEye.sphere}
                    onChange={(e) => handleContactLensRxChange("leftEye", "sphere", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateSphOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="cylinderLeftEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.leftEye.cylinder}
                    onChange={(e) => handleContactLensRxChange("leftEye", "cylinder", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateCylOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="axisLeftEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.leftEye.axis}
                    onChange={(e) => handleContactLensRxChange("leftEye", "axis", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateAxisOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="bcLeftEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.leftEye.bc}
                    onChange={(e) => handleContactLensRxChange("leftEye", "bc", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateBcOptions()}
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <select
                    id="diaLeftEye"
                    className="w-full h-10 rounded-md border border-green-200 bg-white px-3 py-2 ltr"
                    value={newContactLensRx.leftEye.dia}
                    onChange={(e) => handleContactLensRxChange("leftEye", "dia", e.target.value)}
                    dir="ltr"
                  >
                    <option value="-" disabled>{t("choose")}</option>
                    {generateDiaOptions()}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewContactLensRxOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveNewContactLensRx} className="bg-green-600 hover:bg-green-700">
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Dialog open={isViewContactLensRxOpen} onOpenChange={setIsViewContactLensRxOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("viewContactLensPrescription") || "View Contact Lens Prescription"}</DialogTitle>
            <DialogDescription>
              {viewContactLensRxDetails?.createdAt && formatDate(viewContactLensRxDetails.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {viewContactLensRxDetails && (
            <div className="py-4">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200 mb-4">
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                  <Table className="ltr">
                    <TableHeader className="bg-green-100">
                      <TableRow>
                        <TableHead className="text-green-800"></TableHead>
                        <TableHead className="text-green-800">Sphere</TableHead>
                        <TableHead className="text-green-800">Cylinder</TableHead>
                        <TableHead className="text-green-800">Axis</TableHead>
                        <TableHead className="text-green-800">BC</TableHead>
                        <TableHead className="text-green-800">DIA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium bg-green-50/50">{t("rightEye")} (OD)</TableCell>
                        <TableCell>{viewContactLensRxDetails.rightEye.sphere || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.rightEye.cylinder || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.rightEye.axis || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.rightEye.bc || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.rightEye.dia || "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium bg-green-50/50">{t("leftEye")} (OS)</TableCell>
                        <TableCell>{viewContactLensRxDetails.leftEye.sphere || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.leftEye.cylinder || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.leftEye.axis || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.leftEye.bc || "-"}</TableCell>
                        <TableCell>{viewContactLensRxDetails.leftEye.dia || "-"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewContactLensRxOpen(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RxLanguageDialog
        isOpen={isLanguageDialogOpen}
        onClose={() => setIsLanguageDialogOpen(false)}
        onSelect={handleLanguageSelection}
      />
    </Card>
  );
};
