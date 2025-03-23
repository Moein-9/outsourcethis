
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
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-6">
      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-xl">
        <CardTitle className="text-xl flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          {language === 'ar' ? "الوصفة الطبية" : "Prescription Information"}
        </CardTitle>
        <CardDescription className="text-indigo-100">
          {language === 'ar' ? "بيانات الوصفة الطبية للنظارات" : "Glasses prescription information"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-none bg-gradient-to-r from-indigo-50 to-blue-50 p-0 h-12">
            <TabsTrigger 
              value="current" 
              className="rounded-none border-b-2 border-transparent text-gray-600 h-full data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-white data-[state=active]:shadow-none transition-all"
            >
              {language === 'ar' ? "الوصفة الحالية" : "Current Prescription"}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="rounded-none border-b-2 border-transparent text-gray-600 h-full data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-white data-[state=active]:shadow-none transition-all"
            >
              {language === 'ar' ? "سجل الوصفات" : "Prescription History"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-0 p-5">
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-indigo-100">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 flex justify-between items-center">
                <h3 className="font-medium text-indigo-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {language === 'ar' ? "الوصفة الحالية" : "Current Prescription"}
                </h3>
                <div className="text-sm text-indigo-600 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {rx.createdAt ? formatDate(rx.createdAt) : (language === 'ar' ? "تاريخ غير متوفر" : "Date not available")}
                </div>
              </div>
              
              <Table forceDirection="ltr">
                <TableHeader className="bg-gradient-to-r from-indigo-600 to-blue-600">
                  <TableRow>
                    <TableHead className="text-white font-bold text-base"></TableHead>
                    <TableHead className="text-white font-bold text-base">SPH</TableHead>
                    <TableHead className="text-white font-bold text-base">CYL</TableHead>
                    <TableHead className="text-white font-bold text-base">AXIS</TableHead>
                    <TableHead className="text-white font-bold text-base">ADD</TableHead>
                    <TableHead className="text-white font-bold text-base">PD</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:bg-blue-100/70 transition-colors">
                    <TableCell className="font-medium text-blue-800 border-r border-blue-200 bg-blue-100/50">
                      {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                    </TableCell>
                    <TableCell className="border-r border-blue-100 font-medium">{rx.sphereOD || '-'}</TableCell>
                    <TableCell className="border-r border-blue-100 font-medium">{rx.cylOD || '-'}</TableCell>
                    <TableCell className="border-r border-blue-100 font-medium">{rx.axisOD || '-'}</TableCell>
                    <TableCell className="border-r border-blue-100 font-medium">{rx.addOD || '-'}</TableCell>
                    <TableCell className="font-medium">{rx.pdRight || '-'}</TableCell>
                  </TableRow>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 hover:bg-purple-100/70 transition-colors">
                    <TableCell className="font-medium text-purple-800 border-r border-purple-200 bg-purple-100/50">
                      {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                    </TableCell>
                    <TableCell className="border-r border-purple-100 font-medium">{rx.sphereOS || '-'}</TableCell>
                    <TableCell className="border-r border-purple-100 font-medium">{rx.cylOS || '-'}</TableCell>
                    <TableCell className="border-r border-purple-100 font-medium">{rx.axisOS || '-'}</TableCell>
                    <TableCell className="border-r border-purple-100 font-medium">{rx.addOS || '-'}</TableCell>
                    <TableCell className="font-medium">{rx.pdLeft || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-lg border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all shadow-sm"
                onClick={onPrintPrescription}
              >
                <Printer className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-indigo-600`} />
                {language === 'ar' ? "طباعة الوصفة" : "Print Prescription"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 p-5">
            {rxHistory && rxHistory.length > 0 ? (
              <div className="space-y-4">
                {rxHistory.map((historyItem, index) => (
                  <div key={index} className="border border-indigo-100 rounded-xl overflow-hidden shadow-md">
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-3 flex justify-between items-center">
                      <div className="font-medium text-indigo-800 flex items-center gap-2">
                        <History className="h-4 w-4 text-indigo-600" />
                        {language === 'ar' ? "تاريخ:" : "Date:"}
                      </div>
                      <div className="text-indigo-700 font-medium">
                        {formatDate(historyItem.createdAt)}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg text-indigo-600 hover:bg-indigo-100 border-indigo-200"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                    <Table forceDirection="ltr">
                      <TableHeader className="bg-gradient-to-r from-purple-600 to-indigo-600">
                        <TableRow>
                          <TableHead className="text-white font-bold"></TableHead>
                          <TableHead className="text-white font-bold">SPH</TableHead>
                          <TableHead className="text-white font-bold">CYL</TableHead>
                          <TableHead className="text-white font-bold">AXIS</TableHead>
                          <TableHead className="text-white font-bold">ADD</TableHead>
                          <TableHead className="text-white font-bold">PD</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:bg-indigo-100/70 transition-colors">
                          <TableCell className="font-medium text-indigo-800 border-r border-indigo-200 bg-indigo-100/50">
                            {language === 'ar' ? "العين اليمنى (OD)" : "Right Eye (OD)"}
                          </TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium">{historyItem.sphereOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium">{historyItem.cylOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium">{historyItem.axisOD || '-'}</TableCell>
                          <TableCell className="border-r border-indigo-100 font-medium">{historyItem.addOD || '-'}</TableCell>
                          <TableCell className="font-medium">{historyItem.pdRight || '-'}</TableCell>
                        </TableRow>
                        <TableRow className="bg-white hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium text-purple-800 border-r border-purple-200 bg-purple-50/50">
                            {language === 'ar' ? "العين اليسرى (OS)" : "Left Eye (OS)"}
                          </TableCell>
                          <TableCell className="border-r border-purple-100 font-medium">{historyItem.sphereOS || '-'}</TableCell>
                          <TableCell className="border-r border-purple-100 font-medium">{historyItem.cylOS || '-'}</TableCell>
                          <TableCell className="border-r border-purple-100 font-medium">{historyItem.axisOS || '-'}</TableCell>
                          <TableCell className="border-r border-purple-100 font-medium">{historyItem.addOS || '-'}</TableCell>
                          <TableCell className="font-medium">{historyItem.pdLeft || '-'}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-xl bg-gradient-to-r from-gray-50 to-indigo-50/20">
                <FileText className="h-16 w-16 mx-auto text-indigo-300 mb-4 opacity-70" />
                <h3 className="text-xl font-medium mb-2 text-indigo-700">
                  {language === 'ar' ? "لا يوجد سجل وصفات سابقة" : "No Prescription History"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-gray-600">
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
