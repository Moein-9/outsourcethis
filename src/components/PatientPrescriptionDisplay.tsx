
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
import { Printer, FileText, Receipt, Eye, Clock, History } from "lucide-react";

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
    <Card className="border-0 shadow-md rounded-xl overflow-hidden mb-4">
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white rounded-t-xl">
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {language === 'ar' ? "الوصفة الطبية" : "Prescription Information"}
        </CardTitle>
        <CardDescription className="text-indigo-100 text-sm">
          {language === 'ar' ? "بيانات الوصفة الطبية للنظارات" : "Glasses prescription information"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none bg-gradient-to-r from-purple-50 to-indigo-50 p-0 h-10">
            <TabsTrigger 
              value="current" 
              className="rounded-none border-b-2 border-transparent text-gray-600 h-full data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 data-[state=active]:bg-white data-[state=active]:shadow-none transition-all"
            >
              {language === 'ar' ? "الوصفة الحالية" : "Current Prescription"}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent text-gray-600 h-full data-[state=active]:border-purple-600 data-[state=active]:text-purple-700 data-[state=active]:bg-white data-[state=active]:shadow-none transition-all"
            >
              {language === 'ar' ? "سجل الوصفات" : "Prescription History"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-0 p-3">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-purple-100">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-2 flex justify-between items-center">
                <h3 className="font-medium text-purple-700 flex items-center gap-1.5 text-sm">
                  <Eye className="h-3.5 w-3.5" />
                  {language === 'ar' ? "الوصفة الحالية" : "Current Prescription"}
                </h3>
                <div className="text-xs text-purple-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {rx.createdAt ? formatDate(rx.createdAt) : (language === 'ar' ? "تاريخ غير متوفر" : "Date not available")}
                </div>
              </div>
              
              <Table forceDirection="ltr" className="compact-table">
                <TableHeader className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
                  <TableRow>
                    <TableHead className="text-white font-bold text-sm p-2"></TableHead>
                    <TableHead className="text-white font-bold text-sm p-2">SPH</TableHead>
                    <TableHead className="text-white font-bold text-sm p-2">CYL</TableHead>
                    <TableHead className="text-white font-bold text-sm p-2">AXIS</TableHead>
                    <TableHead className="text-white font-bold text-sm p-2">ADD</TableHead>
                    <TableHead className="text-white font-bold text-sm p-2">PD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-gradient-to-r from-sky-50 to-teal-50 hover:bg-sky-100/70 transition-colors">
                    <TableCell className="font-medium text-teal-800 border-r border-teal-200 bg-teal-50/50 p-2">
                      {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                    </TableCell>
                    <TableCell className="border-r border-teal-100 font-medium p-2">{rx.sphereOD || '-'}</TableCell>
                    <TableCell className="border-r border-teal-100 font-medium p-2">{rx.cylOD || '-'}</TableCell>
                    <TableCell className="border-r border-teal-100 font-medium p-2">{rx.axisOD || '-'}</TableCell>
                    <TableCell className="border-r border-teal-100 font-medium p-2">{rx.addOD || '-'}</TableCell>
                    <TableCell className="font-medium p-2">{rx.pdRight || '-'}</TableCell>
                  </TableRow>
                  <TableRow className="bg-gradient-to-r from-fuchsia-50 to-pink-50 hover:bg-fuchsia-100/70 transition-colors">
                    <TableCell className="font-medium text-pink-800 border-r border-pink-200 bg-pink-50/50 p-2">
                      {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                    </TableCell>
                    <TableCell className="border-r border-pink-100 font-medium p-2">{rx.sphereOS || '-'}</TableCell>
                    <TableCell className="border-r border-pink-100 font-medium p-2">{rx.cylOS || '-'}</TableCell>
                    <TableCell className="border-r border-pink-100 font-medium p-2">{rx.axisOS || '-'}</TableCell>
                    <TableCell className="border-r border-pink-100 font-medium p-2">{rx.addOS || '-'}</TableCell>
                    <TableCell className="font-medium p-2">{rx.pdLeft || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-lg border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all shadow-sm"
                onClick={onPrintPrescription}
              >
                <Printer className={`h-3.5 w-3.5 ${language === 'ar' ? 'ml-1.5' : 'mr-1.5'} text-purple-600`} />
                {language === 'ar' ? "طباعة الوصفة" : "Print Prescription"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 p-3">
            {rxHistory && rxHistory.length > 0 ? (
              <div className="space-y-3">
                {rxHistory.map((historyItem, index) => (
                  <div key={index} className="border border-purple-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-2 flex justify-between items-center">
                      <div className="font-medium text-indigo-800 flex items-center gap-1.5 text-sm">
                        <History className="h-3.5 w-3.5 text-indigo-600" />
                        {language === 'ar' ? "تاريخ:" : "Date:"}
                      </div>
                      <div className="text-indigo-700 font-medium text-sm">
                        {formatDate(historyItem.createdAt)}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg text-indigo-600 hover:bg-indigo-100 border-indigo-200 h-7 w-7 p-0"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Table forceDirection="ltr" className="compact-table">
                      <TableHeader className="bg-gradient-to-r from-violet-600 to-purple-600">
                        <TableRow>
                          <TableHead className="text-white font-bold p-1.5 text-xs"></TableHead>
                          <TableHead className="text-white font-bold p-1.5 text-xs">SPH</TableHead>
                          <TableHead className="text-white font-bold p-1.5 text-xs">CYL</TableHead>
                          <TableHead className="text-white font-bold p-1.5 text-xs">AXIS</TableHead>
                          <TableHead className="text-white font-bold p-1.5 text-xs">ADD</TableHead>
                          <TableHead className="text-white font-bold p-1.5 text-xs">PD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-gradient-to-r from-indigo-50 to-violet-50 hover:bg-indigo-100/70 transition-colors">
                          <TableCell className="font-medium text-indigo-800 border-r border-indigo-200 bg-indigo-100/50 p-1.5 text-xs">
                            {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                          </TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium p-1.5 text-xs">{historyItem.sphereOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium p-1.5 text-xs">{historyItem.cylOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium p-1.5 text-xs">{historyItem.axisOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium p-1.5 text-xs">{historyItem.addOD || '-'}</TableCell>
                          <TableCell className="font-medium p-1.5 text-xs">{historyItem.pdRight || '-'}</TableCell>
                        </TableRow>
                        <TableRow className="bg-white hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium text-purple-800 border-r border-purple-200 bg-purple-50/50 p-1.5 text-xs">
                            {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                          </TableCell>
                          <TableCell className="border-r border-purple-100 font-medium p-1.5 text-xs">{historyItem.sphereOS || '-'}</TableCell>
                          <TableCell className="border-r border-purple-100 font-medium p-1.5 text-xs">{historyItem.cylOS || '-'}</TableCell>
                          <TableCell className="border-r border-purple-100 font-medium p-1.5 text-xs">{historyItem.axisOS || '-'}</TableCell>
                          <TableCell className="border-r border-purple-100 font-medium p-1.5 text-xs">{historyItem.addOS || '-'}</TableCell>
                          <TableCell className="font-medium p-1.5 text-xs">{historyItem.pdLeft || '-'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border rounded-xl bg-gradient-to-r from-gray-50 to-indigo-50/20">
                <FileText className="h-12 w-12 mx-auto text-indigo-300 mb-3 opacity-70" />
                <h3 className="text-lg font-medium mb-1 text-indigo-700">
                  {language === 'ar' ? "لا يوجد سجل وصفات سابقة" : "No Prescription History"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-gray-600 text-sm">
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
