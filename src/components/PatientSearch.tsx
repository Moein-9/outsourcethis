
import React, { useState } from "react";
import { usePatientStore } from "@/store/patientStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Patient, RxData } from "@/store/patientStore";
import { Invoice } from "@/store/invoiceStore";

interface PatientNote {
  text: string;
  createdAt: string;
}

export const PatientSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [noteText, setNoteText] = useState("");
  
  const { patients, searchPatients } = usePatientStore();
  const { invoices } = useInvoiceStore();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = searchPatients(searchTerm);
    setSearchResults(results);
    setShowResults(true);
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowResults(false);
  };

  const getPatientInvoices = (): Invoice[] => {
    if (!selectedPatient) return [];
    return invoices.filter(invoice => invoice.patientId === selectedPatient.patientId);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${month}(${date.getMonth() + 1})-${day}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const renderRxTable = (rx: RxData) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-2 ltr">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-2">العين</th>
              <th className="border border-gray-300 bg-gray-100 p-2">Sphere</th>
              <th className="border border-gray-300 bg-gray-100 p-2">Cyl</th>
              <th className="border border-gray-300 bg-gray-100 p-2">Axis</th>
              <th className="border border-gray-300 bg-gray-100 p-2">Add</th>
              <th className="border border-gray-300 bg-gray-100 p-2">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">OD (يمين)</td>
              <td className="border border-gray-300 p-2">{rx.sphereOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.cylOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.axisOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.addOD || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.pdRight || "—"}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">OS (يسار)</td>
              <td className="border border-gray-300 p-2">{rx.sphereOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.cylOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.axisOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.addOS || "—"}</td>
              <td className="border border-gray-300 p-2">{rx.pdLeft || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-primary mb-4">بحث عن عميل</h2>
      
      {/* Search Box */}
      <div className="mb-4 flex items-center gap-2">
        <Input 
          placeholder="ابحث بالاسم أو رقم الهاتف"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-2/3"
        />
        <Button onClick={handleSearch}>بحث</Button>
      </div>
      
      {/* Search Results */}
      {showResults && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>نتائج البحث</CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <p>لم يتم العثور على نتائج</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((patient) => (
                  <div 
                    key={patient.patientId}
                    className="p-3 border rounded hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => selectPatient(patient)}
                  >
                    {patient.name} - {patient.phone}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Patient Details */}
      {selectedPatient && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المريض</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>الاسم:</strong> {selectedPatient.name}</div>
                <div><strong>الهاتف:</strong> {selectedPatient.phone}</div>
                <div><strong>تاريخ الميلاد:</strong> {selectedPatient.dob || "غير متوفر"}</div>
                <div><strong>رقم المريض:</strong> {selectedPatient.patientId}</div>
              </div>
            </CardContent>
          </Card>
          
          {/* RX Data */}
          <Card>
            <CardHeader>
              <CardTitle>الوصفة الطبية</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current">
                <TabsList className="mb-4">
                  <TabsTrigger value="current">الوصفة الحالية</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                  {selectedPatient.rx ? (
                    <div>
                      {renderRxTable(selectedPatient.rx)}
                      <Button variant="outline">
                        طباعة الوصفة
                      </Button>
                    </div>
                  ) : (
                    <p>لا يوجد وصفة طبية لهذا المريض</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>سجل المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              {getPatientInvoices().length === 0 ? (
                <p>لا يوجد معاملات لهذا المريض</p>
              ) : (
                <div className="space-y-4">
                  {getPatientInvoices().map((invoice) => (
                    <div key={invoice.invoiceId} className="border rounded p-4">
                      <div className="font-bold mb-1">فاتورة: {invoice.invoiceId}</div>
                      <div className="mb-2">{formatDate(invoice.createdAt)}</div>
                      <div className="mb-2">
                        <div><strong>إطار:</strong> {invoice.frameBrand} {invoice.frameModel && `(${invoice.frameModel}, ${invoice.frameColor})`}</div>
                        <div><strong>عدسة:</strong> {invoice.lensType} ({invoice.lensPrice} د.ك)</div>
                        <div><strong>طلاء:</strong> {invoice.coating} ({invoice.coatingPrice} د.ك)</div>
                      </div>
                      <div className="text-xl font-bold text-primary mb-1">المجموع: {invoice.total} د.ك</div>
                      <div className="mb-2">
                        <span><strong>الخصم:</strong> {invoice.discount} د.ك</span>
                        <span className="mr-4"><strong>الدفعة:</strong> {invoice.deposit} د.ك</span>
                      </div>
                      <Button variant="outline">طباعة الفاتورة</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>الملاحظات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="أضف ملاحظة جديدة..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="mb-2"
                />
                <Button>حفظ الملاحظة</Button>
                
                <div className="border-t pt-4 mt-4">
                  {selectedPatient.notes ? (
                    <div className="p-2 border rounded">{selectedPatient.notes}</div>
                  ) : (
                    <p>لا يوجد ملاحظات</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
