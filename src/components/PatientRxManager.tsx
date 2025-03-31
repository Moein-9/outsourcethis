import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
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
import { PatientNote, RxData, usePatientStore, ContactLensRx, RxHistoryItem, ContactLensRxHistoryItem } from "@/store/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, History, Eye, Glasses, Languages, Plus, Save, Trash2, X, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrorHighlight } from "./FormErrorHighlight";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguageStore } from "@/store/languageStore";

type PatientRxManagerProps = {
  patientId: string;
  patientName: string;
  patientPhone?: string;
  currentRx: RxData;
  rxHistory?: RxHistoryItem[];
  contactLensRx?: ContactLensRx;
  contactLensRxHistory?: ContactLensRxHistoryItem[];
  notes?: string;
  patientNotes?: PatientNote[];
  onRxPrintRequest: (language?: 'en' | 'ar', type?: 'glasses' | 'contacts') => void;
  onClose?: () => void;
  isOpen?: boolean;
};

export const PatientRxManager: React.FC<PatientRxManagerProps> = ({
  patientId,
  patientName,
  patientPhone,
  currentRx,
  rxHistory = [],
  contactLensRx,
  contactLensRxHistory = [],
  notes,
  patientNotes = [],
  onRxPrintRequest,
  onClose,
  isOpen = false,
}) => {
  const { updatePatientRx, updateContactLensRx, addPatientNote, deletePatientNote } = usePatientStore();
  const { language, setLanguage, t } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [rxErrors, setRxErrors] = useState<Record<string, string>>({});
  const [contactLensRxErrors, setContactLensRxErrors] = useState<Record<string, string>>({});
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  
  const [localCurrentRx, setLocalCurrentRx] = useState(currentRx);
  const [localRxHistory, setLocalRxHistory] = useState<RxHistoryItem[]>(rxHistory);
  const [localPatientNotes, setLocalPatientNotes] = useState(patientNotes);
  const [newNote, setNewNote] = useState("");
  
  const [localContactLensRx, setLocalContactLensRx] = useState(contactLensRx || {
    rightEye: { sphere: "", cylinder: "", axis: "", bc: "", dia: "" },
    leftEye: { sphere: "", cylinder: "", axis: "", bc: "", dia: "" }
  });
  
  const [localContactLensRxHistory, setLocalContactLensRxHistory] = 
    useState<ContactLensRxHistoryItem[]>(contactLensRxHistory);
  
  const handleRxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalCurrentRx(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleContactLensRxChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, eye: 'rightEye' | 'leftEye') => {
    const { name, value } = e.target;
    setLocalContactLensRx(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [name]: value
      }
    }));
  };
  
  const validateRx = (rx: RxData): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!rx.sphereOD) errors.sphereOD = t("required");
    if (!rx.sphereOS) errors.sphereOS = t("required");
    return errors;
  };
  
  const validateContactLensRx = (rx: ContactLensRx): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!rx.rightEye.sphere) errors['rightEye.sphere'] = t("required");
    if (!rx.leftEye.sphere) errors['leftEye.sphere'] = t("required");
    return errors;
  };
  
  const handleSaveRx = () => {
    // Validate the prescription data
    const errors = validateRx(localCurrentRx);
    setRxErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Add a timestamp to the new rx
    const timestampedNewRx = {
      ...localCurrentRx,
      updatedAt: new Date().toISOString()
    };
    
    // Update the patient's rx in the store
    updatePatientRx(patientId, timestampedNewRx);
    
    setLocalRxHistory(prev => [
      { ...localCurrentRx, createdAt: localCurrentRx.createdAt || new Date().toISOString() } as RxHistoryItem,
      ...prev
    ]);
    
    // Exit edit mode
    setIsEditMode(false);
  };
  
  const handleSaveContactLensRx = () => {
    // Validate the contact lens prescription data
    const errors = validateContactLensRx(localContactLensRx);
    setContactLensRxErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    // Add a timestamp to the new contact lens rx
    const timestampedNewRx = {
      ...localContactLensRx,
      updatedAt: new Date().toISOString()
    };
    
    // Update the patient's contact lens rx in the store
    updateContactLensRx(patientId, timestampedNewRx);
    
    // Add current to history
    setLocalContactLensRxHistory(prev => [
      { ...localContactLensRx, createdAt: localContactLensRx.createdAt || new Date().toISOString() } as ContactLensRxHistoryItem,
      ...prev
    ]);
    
    // Exit edit mode
    setIsEditMode(false);
  };
  
  useEffect(() => {
    if (!isOpen) return;
    setLocalCurrentRx(currentRx);
  }, [currentRx, isOpen]);
  
  const formatDate = (date: string) => {
    try {
      const parsedDate = parseISO(date);
      return format(parsedDate, "PPP", { locale: isRtl ? ar : enUS });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };
  
  const handleAddNote = async () => {
    if (newNote.trim() === "") return;
    
    const note = {
      id: Date.now().toString(),
      text: newNote,
      createdAt: new Date().toISOString(),
    };
    
    addPatientNote(patientId, note);
    setLocalPatientNotes(prev => [...prev, note]);
    setNewNote("");
  };
  
  const handleDeleteNote = async (noteId: string) => {
    deletePatientNote(patientId, noteId);
    setLocalPatientNotes(prev => prev.filter(note => note.id !== noteId));
  };
  
  const renderNotes = () => {
    return localPatientNotes.map((note) => (
      <div key={note.id} className="flex items-start justify-between p-2 border rounded-md mb-2 bg-gray-50">
        <div>
          <div className="text-sm text-gray-800">{note.text}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(note.createdAt)}
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("noteDeleteConfirmation")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ));
  };
  
  useEffect(() => {
    setLocalCurrentRx(currentRx);
    setLocalRxHistory(rxHistory.map(rx => ({
      ...rx,
      createdAt: rx.createdAt || new Date().toISOString()
    })) as RxHistoryItem[]);
    
    setLocalContactLensRx(contactLensRx || {
      rightEye: { sphere: "", cylinder: "", axis: "", bc: "", dia: "" },
      leftEye: { sphere: "", cylinder: "", axis: "", bc: "", dia: "" }
    });
    
    setLocalContactLensRxHistory(contactLensRxHistory.map(rx => ({
      ...rx,
      createdAt: rx.createdAt || new Date().toISOString()
    })) as ContactLensRxHistoryItem[]);
    
    setLocalPatientNotes(patientNotes);
  }, [currentRx, rxHistory, contactLensRx, contactLensRxHistory, patientNotes]);
  
  const RxDisplay = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("glassesPrescription")}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRxPrintRequest(language, 'glasses')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("print")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(true)}
              disabled={isEditMode}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t("edit")}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("eye")}</TableHead>
              <TableHead>{t("sphere")}</TableHead>
              <TableHead>{t("cylinder")}</TableHead>
              <TableHead>{t("axis")}</TableHead>
              <TableHead>{t("add")}</TableHead>
              <TableHead>{t("pd")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t("rightEye")}</TableCell>
              <TableCell>{localCurrentRx.sphereOD}</TableCell>
              <TableCell>{localCurrentRx.cylOD}</TableCell>
              <TableCell>{localCurrentRx.axisOD}</TableCell>
              <TableCell>{localCurrentRx.addOD || localCurrentRx.add}</TableCell>
              <TableCell>{localCurrentRx.pdRight || localCurrentRx.pdOD || localCurrentRx.pd}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("leftEye")}</TableCell>
              <TableCell>{localCurrentRx.sphereOS}</TableCell>
              <TableCell>{localCurrentRx.cylOS}</TableCell>
              <TableCell>{localCurrentRx.axisOS}</TableCell>
              <TableCell>{localCurrentRx.addOS || localCurrentRx.add}</TableCell>
              <TableCell>{localCurrentRx.pdLeft || localCurrentRx.pdOS || localCurrentRx.pd}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
  
  const ContactLensRxDisplay = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("contactLensPrescription")}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRxPrintRequest(language, 'contacts')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("print")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(true)}
              disabled={isEditMode}
            >
              <Eye className="h-4 w-4 mr-2" />
              {t("edit")}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("eye")}</TableHead>
              <TableHead>{t("sphere")}</TableHead>
              <TableHead>{t("cylinder")}</TableHead>
              <TableHead>{t("axis")}</TableHead>
              <TableHead>BC</TableHead>
              <TableHead>DIA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{t("rightEye")}</TableCell>
              <TableCell>{localContactLensRx.rightEye.sphere}</TableCell>
              <TableCell>{localContactLensRx.rightEye.cylinder}</TableCell>
              <TableCell>{localContactLensRx.rightEye.axis}</TableCell>
              <TableCell>{localContactLensRx.rightEye.bc}</TableCell>
              <TableCell>{localContactLensRx.rightEye.dia}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("leftEye")}</TableCell>
              <TableCell>{localContactLensRx.leftEye.sphere}</TableCell>
              <TableCell>{localContactLensRx.leftEye.cylinder}</TableCell>
              <TableCell>{localContactLensRx.leftEye.axis}</TableCell>
              <TableCell>{localContactLensRx.leftEye.bc}</TableCell>
              <TableCell>{localContactLensRx.leftEye.dia}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
  
  const RxEditForm = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("editGlassesPrescription")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="sphereOD">{t("rightEyeSphere")}</Label>
            <Input
              type="text"
              id="sphereOD"
              name="sphereOD"
              value={localCurrentRx.sphereOD || ""}
              onChange={handleRxChange}
            />
            {rxErrors.sphereOD && (
              <FormErrorHighlight message={rxErrors.sphereOD} />
            )}
          </div>
          <div>
            <Label htmlFor="cylOD">{t("rightEyeCylinder")}</Label>
            <Input
              type="text"
              id="cylOD"
              name="cylOD"
              value={localCurrentRx.cylOD || ""}
              onChange={handleRxChange}
            />
          </div>
          <div>
            <Label htmlFor="axisOD">{t("rightEyeAxis")}</Label>
            <Input
              type="text"
              id="axisOD"
              name="axisOD"
              value={localCurrentRx.axisOD || ""}
              onChange={handleRxChange}
            />
          </div>
          <div>
            <Label htmlFor="addOD">{t("rightEyeAdd")}</Label>
            <Input
              type="text"
              id="addOD"
              name="addOD"
              value={localCurrentRx.addOD || localCurrentRx.add || ""}
              onChange={handleRxChange}
            />
          </div>
          <div>
            <Label htmlFor="pdRight">{t("rightEyePD")}</Label>
            <Input
              type="text"
              id="pdRight"
              name="pdRight"
              value={localCurrentRx.pdRight || localCurrentRx.pdOD || localCurrentRx.pd || ""}
              onChange={handleRxChange}
            />
          </div>
          
          <div>
            <Label htmlFor="sphereOS">{t("leftEyeSphere")}</Label>
            <Input
              type="text"
              id="sphereOS"
              name="sphereOS"
              value={localCurrentRx.sphereOS || ""}
              onChange={handleRxChange}
            />
            {rxErrors.sphereOS && (
              <FormErrorHighlight message={rxErrors.sphereOS} />
            )}
          </div>
          <div>
            <Label htmlFor="cylOS">{t("leftEyeCylinder")}</Label>
            <Input
              type="text"
              id="cylOS"
              name="cylOS"
              value={localCurrentRx.cylOS || ""}
              onChange={handleRxChange}
            />
          </div>
          <div>
            <Label htmlFor="axisOS">{t("leftEyeAxis")}</Label>
            <Input
              type="text"
              id="axisOS"
              name="axisOS"
              value={localCurrentRx.axisOS || ""}
              onChange={handleRxChange}
            />
          </div>
          <div>
            <Label htmlFor="addOS">{t("leftEyeAdd")}</Label>
            <Input
              type="text"
              id="addOS"
              name="addOS"
              value={localCurrentRx.addOS || localCurrentRx.add || ""}
              onChange={handleRxChange}
            />
          </div>
          <div>
            <Label htmlFor="pdLeft">{t("leftEyePD")}</Label>
            <Input
              type="text"
              id="pdLeft"
              name="pdLeft"
              value={localCurrentRx.pdLeft || localCurrentRx.pdOS || localCurrentRx.pd || ""}
              onChange={handleRxChange}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={() => setIsEditMode(false)}
            className="mr-2"
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSaveRx}>{t("save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
  
  const ContactLensRxEditForm = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("editContactLensPrescription")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="sphereOD">{t("rightEyeSphere")}</Label>
            <Input
              type="text"
              id="sphereOD"
              name="sphere"
              value={localContactLensRx.rightEye.sphere || ""}
              onChange={(e) => handleContactLensRxChange(e, 'rightEye')}
            />
            {contactLensRxErrors['rightEye.sphere'] && (
              <FormErrorHighlight message={contactLensRxErrors['rightEye.sphere']} />
            )}
          </div>
          <div>
            <Label htmlFor="cylinderOD">{t("rightEyeCylinder")}</Label>
            <Input
              type="text"
              id="cylinderOD"
              name="cylinder"
              value={localContactLensRx.rightEye.cylinder || ""}
              onChange={(e) => handleContactLensRxChange(e, 'rightEye')}
            />
          </div>
          <div>
            <Label htmlFor="axisOD">{t("rightEyeAxis")}</Label>
            <Input
              type="text"
              id="axisOD"
              name="axis"
              value={localContactLensRx.rightEye.axis || ""}
              onChange={(e) => handleContactLensRxChange(e, 'rightEye')}
            />
          </div>
          <div>
            <Label htmlFor="bcOD">BC</Label>
            <Input
              type="text"
              id="bcOD"
              name="bc"
              value={localContactLensRx.rightEye.bc || ""}
              onChange={(e) => handleContactLensRxChange(e, 'rightEye')}
            />
          </div>
          <div>
            <Label htmlFor="diaOD">DIA</Label>
            <Input
              type="text"
              id="diaOD"
              name="dia"
              value={localContactLensRx.rightEye.dia || ""}
              onChange={(e) => handleContactLensRxChange(e, 'rightEye')}
            />
          </div>
          
          <div>
            <Label htmlFor="sphereOS">{t("leftEyeSphere")}</Label>
            <Input
              type="text"
              id="sphereOS"
              name="sphere"
              value={localContactLensRx.leftEye.sphere || ""}
              onChange={(e) => handleContactLensRxChange(e, 'leftEye')}
            />
            {contactLensRxErrors['leftEye.sphere'] && (
              <FormErrorHighlight message={contactLensRxErrors['leftEye.sphere']} />
            )}
          </div>
          <div>
            <Label htmlFor="cylinderOS">{t("leftEyeCylinder")}</Label>
            <Input
              type="text"
              id="cylinderOS"
              name="cylinder"
              value={localContactLensRx.leftEye.cylinder || ""}
              onChange={(e) => handleContactLensRxChange(e, 'leftEye')}
            />
          </div>
          <div>
            <Label htmlFor="axisOS">{t("leftEyeAxis")}</Label>
            <Input
              type="text"
              id="axisOS"
              name="axis"
              value={localContactLensRx.leftEye.axis || ""}
              onChange={(e) => handleContactLensRxChange(e, 'leftEye')}
            />
          </div>
          <div>
            <Label htmlFor="bcOS">BC</Label>
            <Input
              type="text"
              id="bcOS"
              name="bc"
              value={localContactLensRx.leftEye.bc || ""}
              onChange={(e) => handleContactLensRxChange(e, 'leftEye')}
            />
          </div>
          <div>
            <Label htmlFor="diaOS">DIA</Label>
            <Input
              type="text"
              id="diaOS"
              name="dia"
              value={localContactLensRx.leftEye.dia || ""}
              onChange={(e) => handleContactLensRxChange(e, 'leftEye')}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={() => setIsEditMode(false)}
            className="mr-2"
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSaveContactLensRx}>{t("save")}</Button>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>
            {t("managePatientRx")} - {patientName}
          </DialogTitle>
          <DialogDescription>
            {t("managePatientRxDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t("patientInformation")}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Languages className="w-4 h-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setLanguage('en')}>
                      English
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setLanguage('ar')}>
                      العربية
                    </Button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-sm font-medium">{t("name")}:</span>
                    <span className="text-sm">{patientName}</span>
                  </div>
                  {patientPhone && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium">{t("phone")}:</span>
                      <span className="text-sm">{patientPhone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {isEditMode ? (
            <>
              <RxEditForm />
              <ContactLensRxEditForm />
            </>
          ) : (
            <>
              <RxDisplay />
              <ContactLensRxDisplay />
            </>
          )}
          
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("patientNotes")}</h3>
              <Button variant="outline" size="sm" onClick={handleAddNote}>
                <Plus className="h-4 w-4 mr-2" />
                {t("addNote")}
              </Button>
            </div>
            <div className="mt-2">
              <Textarea
                placeholder={t("enterNote")}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="mt-2">{renderNotes()}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{t("rxHistory")}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("sphereOD")}</TableHead>
                  <TableHead>{t("sphereOS")}</TableHead>
                  <TableHead>{t("cylinderOD")}</TableHead>
                  <TableHead>{t("cylinderOS")}</TableHead>
                  <TableHead>{t("axisOD")}</TableHead>
                  <TableHead>{t("axisOS")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localRxHistory.map((rx, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(rx.createdAt)}</TableCell>
                    <TableCell>{rx.sphereOD}</TableCell>
                    <TableCell>{rx.sphereOS}</TableCell>
                    <TableCell>{rx.cylOD}</TableCell>
                    <TableCell>{rx.cylOS}</TableCell>
                    <TableCell>{rx.axisOD}</TableCell>
                    <TableCell>{rx.axisOS}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{t("contactLensRxHistory")}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("sphereOD")}</TableHead>
                  <TableHead>{t("sphereOS")}</TableHead>
                  <TableHead>{t("cylinderOD")}</TableHead>
                  <TableHead>{t("cylinderOS")}</TableHead>
                  <TableHead>{t("axisOD")}</TableHead>
                  <TableHead>{t("axisOS")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localContactLensRxHistory.map((rx, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(rx.createdAt)}</TableCell>
                    <TableCell>{rx.rightEye.sphere}</TableCell>
                    <TableCell>{rx.leftEye.sphere}</TableCell>
                    <TableCell>{rx.rightEye.cylinder}</TableCell>
                    <TableCell>{rx.leftEye.cylinder}</TableCell>
                    <TableCell>{rx.rightEye.axis}</TableCell>
                    <TableCell>{rx.leftEye.axis}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
