
import React from "react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/store/languageStore";
import { RxData, RxHistoryItem } from "@/store/patientStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Printer, FileText, Receipt } from "lucide-react";

interface PatientPrescriptionDisplayProps {
  rx: RxData;
  rxHistory?: RxHistoryItem[];
  onPrintPrescription: () => void;
}

export const PatientPrescriptionDisplay: React.FC<PatientPrescriptionDisplayProps> = ({
  rx,
  rxHistory,
  onPrintPrescription
}) => {
  const { language, t } = useLanguageStore();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return language === 'ar' ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PPP", { locale: language === 'ar' ? ar : enUS });
    } catch (error) {
      return language === 'ar' ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  return (
    <Card className="border-blue-200 shadow-md mb-6 overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
          <Receipt className="h-5 w-5" />
          {language === 'ar' ? "الوصفة الطبية" : "Prescription Information"}
        </CardTitle>
        <CardDescription>
          {language === 'ar' ? "بيانات الوصفة الطبية للنظارات" : "Glasses prescription information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-2 bg-blue-100/50">
            <TabsTrigger value="current" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              {language === 'ar' ? "الوصفة الحالية" : "Current Prescription"}
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
              {language === 'ar' ? "سجل الوصفات" : "Prescription History"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-0">
            <div className="rounded-lg border overflow-hidden shadow-sm">
              <Table forceDirection="ltr">
                <TableHeader className="bg-gradient-to-r from-blue-600 to-blue-500">
                  <TableRow>
                    <TableHead className="text-white font-bold"></TableHead>
                    <TableHead className="text-white font-bold">SPH</TableHead>
                    <TableHead className="text-white font-bold">CYL</TableHead>
                    <TableHead className="text-white font-bold">AXIS</TableHead>
                    <TableHead className="text-white font-bold">ADD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-gradient-to-r from-blue-100/70 to-blue-50/70 hover:bg-blue-100/50">
                    <TableCell className="font-medium text-blue-800 border-r border-blue-200">
                      {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                    </TableCell>
                    <TableCell className="border-r border-blue-200">{rx.sphereOD || '-'}</TableCell>
                    <TableCell className="border-r border-blue-200">{rx.cylOD || '-'}</TableCell>
                    <TableCell className="border-r border-blue-200">{rx.axisOD || '-'}</TableCell>
                    <TableCell>{rx.addOD || '-'}</TableCell>
                  </TableRow>
                  <TableRow className="bg-white hover:bg-blue-50/30">
                    <TableCell className="font-medium text-blue-800 border-r border-blue-200">
                      {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                    </TableCell>
                    <TableCell className="border-r border-blue-200">{rx.sphereOS || '-'}</TableCell>
                    <TableCell className="border-r border-blue-200">{rx.cylOS || '-'}</TableCell>
                    <TableCell className="border-r border-blue-200">{rx.axisOS || '-'}</TableCell>
                    <TableCell>{rx.addOS || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <Label className="text-blue-700 font-medium">
                  {language === 'ar' ? "المسافة بين حدقتي العين (PD)" : "Pupillary Distance (PD)"}
                </Label>
                <div className="flex items-center gap-1 mt-1">
                  <div className="text-sm font-medium text-blue-600">{language === 'ar' ? "يمين:" : "Right:"}</div>
                  <div className="bg-white px-2 py-1 rounded border border-blue-200">{rx.pdRight || '-'}</div>
                  <div className="text-sm font-medium mx-2 text-blue-600">{language === 'ar' ? "يسار:" : "Left:"}</div>
                  <div className="bg-white px-2 py-1 rounded border border-blue-200">{rx.pdLeft || '-'}</div>
                </div>
              </div>
              
              <div className="text-right flex items-end justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
                  onClick={onPrintPrescription}
                >
                  <Printer className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-600`} />
                  {language === 'ar' ? "طباعة الوصفة" : "Print Prescription"}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            {rxHistory && rxHistory.length > 0 ? (
              <div className="space-y-4">
                {rxHistory.map((historyItem, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-indigo-100 to-indigo-50 px-4 py-2 flex justify-between items-center">
                      <div className="font-medium text-indigo-800">
                        {language === 'ar' ? "تاريخ:" : "Date:"} {formatDate(historyItem.createdAt)}
                      </div>
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-100">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                    <Table forceDirection="ltr">
                      <TableHeader className="bg-gradient-to-r from-indigo-600 to-indigo-500">
                        <TableRow>
                          <TableHead className="text-white font-bold"></TableHead>
                          <TableHead className="text-white font-bold">SPH</TableHead>
                          <TableHead className="text-white font-bold">CYL</TableHead>
                          <TableHead className="text-white font-bold">AXIS</TableHead>
                          <TableHead className="text-white font-bold">ADD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-gradient-to-r from-indigo-100/70 to-indigo-50/70 hover:bg-indigo-100/50">
                          <TableCell className="font-medium text-indigo-800 border-r border-indigo-200">
                            {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                          </TableCell>
                          <TableCell className="border-r border-indigo-200">{historyItem.sphereOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-200">{historyItem.cylOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-200">{historyItem.axisOD || '-'}</TableCell>
                          <TableCell>{historyItem.addOD || '-'}</TableCell>
                        </TableRow>
                        <TableRow className="bg-white hover:bg-indigo-50/30">
                          <TableCell className="font-medium text-indigo-800 border-r border-indigo-200">
                            {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                          </TableCell>
                          <TableCell className="border-r border-indigo-200">{historyItem.sphereOS || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-200">{historyItem.cylOS || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-200">{historyItem.axisOS || '-'}</TableCell>
                          <TableCell>{historyItem.addOS || '-'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-indigo-50/20">
                <FileText className="h-10 w-10 mx-auto text-indigo-300 mb-3" />
                <h3 className="text-lg font-medium mb-1 text-indigo-700">
                  {language === 'ar' ? "لا يوجد سجل وصفات سابقة" : "No Prescription History"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {language === 'ar' 
                    ? "لا يوجد سجل وصفات طبية سابقة لهذا العميل."
                    : "There is no prescription history for this client."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
