
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
import { ContactLensRx, ContactLensRxHistoryItem, usePatientStore } from "@/store/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { enUS } from "date-fns/locale/en-US";
import { 
  AlertCircle, 
  FileText, 
  Eye,
  History, 
  Printer, 
  Plus,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import { AddContactLensRxDialog } from "./AddContactLensRxDialog";

interface PatientContactLensRxManagerProps {
  patientId: string;
  patientName: string;
  currentContactLensRx?: ContactLensRx;
  contactLensRxHistory?: ContactLensRxHistoryItem[];
}

export const PatientContactLensRxManager: React.FC<PatientContactLensRxManagerProps> = ({ 
  patientId,
  patientName,
  currentContactLensRx,
  contactLensRxHistory = []
}) => {
  const { updateContactLensRx } = usePatientStore();
  const { t, language } = useLanguageStore();
  const [isNewRxOpen, setIsNewRxOpen] = useState(false);
  const [viewRxDetails, setViewRxDetails] = useState<ContactLensRx | null>(null);
  const [isViewRxOpen, setIsViewRxOpen] = useState(false);
  
  const [localCurrentRx, setLocalCurrentRx] = useState(currentContactLensRx);
  const [localRxHistory, setLocalRxHistory] = useState(contactLensRxHistory);

  useEffect(() => {
    setLocalCurrentRx(currentContactLensRx);
    setLocalRxHistory(contactLensRxHistory);
  }, [currentContactLensRx, contactLensRxHistory]);

  const handleSaveNewRx = (newRx: ContactLensRx) => {
    updateContactLensRx(patientId, newRx);
    
    // Update local state
    if (localCurrentRx) {
      setLocalRxHistory(prev => [
        { ...localCurrentRx, createdAt: localCurrentRx.createdAt || new Date().toISOString() },
        ...prev
      ]);
    }
    
    setLocalCurrentRx(newRx);

    toast(t("success"), {
      description: t("successMessage")
    });

    setIsNewRxOpen(false);
  };

  const handleViewRx = (rx: ContactLensRx) => {
    setViewRxDetails(rx);
    setIsViewRxOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return language === 'ar' ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  // If no contact lens prescription exists, show a simplified UI
  if (!localCurrentRx) {
    return (
      <Card className="mt-6 border-purple-200">
        <CardHeader className="pb-2 flex flex-row justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
              <Eye className="h-5 w-5" />
              {t("contactLensPrescription")}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsNewRxOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-1.5" />
              {t("addContactLensRx")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-center py-6 border rounded-md bg-gray-50">
            <FileText className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-1 text-gray-600">{t("noContactLensRx")}</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {t("noContactLensRxDescription")}
            </p>
          </div>
        </CardContent>

        <AddContactLensRxDialog
          isOpen={isNewRxOpen}
          onClose={() => setIsNewRxOpen(false)}
          onSave={handleSaveNewRx}
        />
      </Card>
    );
  }

  return (
    <Card className="mt-6 border-purple-200">
      <CardHeader className="pb-2 flex flex-row justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
        <div>
          <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
            <Eye className="h-5 w-5" />
            {t("contactLensPrescription")}
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsNewRxOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-1.5" />
            {t("newContactLensRx")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Current Contact Lens RX Section */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-purple-800 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                {t("currentContactLensRx")}
              </h4>
              <Badge className="bg-purple-500">
                <Calendar className="h-3 w-3 mr-1" />
                {localCurrentRx.createdAt ? formatDate(localCurrentRx.createdAt) : language === 'ar' ? 'تاريخ غير متوفر' : 'Date not available'}
              </Badge>
            </div>
            <div className="overflow-x-auto bg-white rounded-md shadow-sm">
              <Table className="ltr">
                <TableHeader className="bg-purple-100">
                  <TableRow>
                    <TableHead className="text-purple-800"></TableHead>
                    <TableHead className="text-purple-800">Sphere</TableHead>
                    <TableHead className="text-purple-800">Cylinder</TableHead>
                    <TableHead className="text-purple-800">Axis</TableHead>
                    <TableHead className="text-purple-800">BC</TableHead>
                    <TableHead className="text-purple-800">DIA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium bg-blue-50/50">{t("rightEye")} (OD)</TableCell>
                    <TableCell>{localCurrentRx.rightEye.sphere || "-"}</TableCell>
                    <TableCell>{localCurrentRx.rightEye.cylinder || "-"}</TableCell>
                    <TableCell>{localCurrentRx.rightEye.axis || "-"}</TableCell>
                    <TableCell>{localCurrentRx.rightEye.bc || "-"}</TableCell>
                    <TableCell>{localCurrentRx.rightEye.dia || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium bg-rose-50/50">{t("leftEye")} (OS)</TableCell>
                    <TableCell>{localCurrentRx.leftEye.sphere || "-"}</TableCell>
                    <TableCell>{localCurrentRx.leftEye.cylinder || "-"}</TableCell>
                    <TableCell>{localCurrentRx.leftEye.axis || "-"}</TableCell>
                    <TableCell>{localCurrentRx.leftEye.bc || "-"}</TableCell>
                    <TableCell>{localCurrentRx.leftEye.dia || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Contact Lens RX History Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <History className="h-5 w-5 text-amber-600" />
                {t("contactLensRxHistory")}
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
                              <span className="font-medium mr-1">SPH:</span> {rx.rightEye.sphere || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">CYL:</span> {rx.rightEye.cylinder || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">AXIS:</span> {rx.rightEye.axis || "-"}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium mr-1">BC:</span> {rx.rightEye.bc || "-"}
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
                            <div className="flex items-center">
                              <span className="font-medium mr-1">BC:</span> {rx.leftEye.bc || "-"}
                            </div>
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
                <h3 className="text-lg font-medium mb-1 text-gray-600">{t("noContactLensRxHistory")}</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  {t("noContactLensRxHistoryDescription")}
                </p>
              </div>
            )}
          </div>

          {/* Care Tips Section */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium mb-3 text-green-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-green-600" />
              {t("contactLensCareTips")}
            </h4>
            <ul className={`space-y-3 pl-1 ${dirClass}`}>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("contactLensTip1") || "Wash hands thoroughly before handling contact lenses"}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("contactLensTip2") || "Clean and disinfect your contact lenses daily"}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("contactLensTip3") || "Never use tap water on your contact lenses"}</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span>{t("contactLensTip4") || "Replace your contact lens case every three months"}</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>

      {/* Dialog components */}
      <AddContactLensRxDialog
        isOpen={isNewRxOpen}
        onClose={() => setIsNewRxOpen(false)}
        onSave={handleSaveNewRx}
      />

      <Dialog open={isViewRxOpen} onOpenChange={setIsViewRxOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("viewContactLensPrescription")}</DialogTitle>
            <DialogDescription>
              {viewRxDetails?.createdAt && formatDate(viewRxDetails.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {viewRxDetails && (
            <div className="py-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200 mb-4">
                <div className="overflow-x-auto bg-white rounded-md shadow-sm">
                  <Table className="ltr">
                    <TableHeader className="bg-purple-100">
                      <TableRow>
                        <TableHead className="text-purple-800"></TableHead>
                        <TableHead className="text-purple-800">Sphere</TableHead>
                        <TableHead className="text-purple-800">Cylinder</TableHead>
                        <TableHead className="text-purple-800">Axis</TableHead>
                        <TableHead className="text-purple-800">BC</TableHead>
                        <TableHead className="text-purple-800">DIA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium bg-blue-50/50">{t("rightEye")} (OD)</TableCell>
                        <TableCell>{viewRxDetails.rightEye.sphere || "-"}</TableCell>
                        <TableCell>{viewRxDetails.rightEye.cylinder || "-"}</TableCell>
                        <TableCell>{viewRxDetails.rightEye.axis || "-"}</TableCell>
                        <TableCell>{viewRxDetails.rightEye.bc || "-"}</TableCell>
                        <TableCell>{viewRxDetails.rightEye.dia || "-"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium bg-rose-50/50">{t("leftEye")} (OS)</TableCell>
                        <TableCell>{viewRxDetails.leftEye.sphere || "-"}</TableCell>
                        <TableCell>{viewRxDetails.leftEye.cylinder || "-"}</TableCell>
                        <TableCell>{viewRxDetails.leftEye.axis || "-"}</TableCell>
                        <TableCell>{viewRxDetails.leftEye.bc || "-"}</TableCell>
                        <TableCell>{viewRxDetails.leftEye.dia || "-"}</TableCell>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
