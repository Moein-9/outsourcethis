import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { usePatientStore } from "@/store/patientStore";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactLensForm } from "@/components/ContactLensForm";
import { 
  User, Search, Glasses, Eye, EyeOff
} from "lucide-react";

interface InvoiceStepPatientProps {
  invoiceType: "glasses" | "contacts";
  onInvoiceTypeChange: (type: "glasses" | "contacts") => void;
}

export const InvoiceStepPatient: React.FC<InvoiceStepPatientProps> = ({ 
  invoiceType, 
  onInvoiceTypeChange 
}) => {
  const { t, language } = useLanguageStore();
  const searchPatients = usePatientStore((state) => state.searchPatients);
  const {
    getValues,
    setValue,
    patientSearchResults,
    setPatientSearchResults,
    currentPatient,
    setCurrentPatient
  } = useInvoiceForm();
  
  const [patientSearch, setPatientSearch] = useState("");
  const [rxVisible, setRxVisible] = useState(false);
  const [skipPatient, setSkipPatient] = useState(getValues<boolean>('skipPatient'));
  const [manualName, setManualName] = useState(getValues<string>('patientName'));
  const [manualPhone, setManualPhone] = useState(getValues<string>('patientPhone'));
  const [showMissingRxWarning, setShowMissingRxWarning] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    cylinderAxisError: false
  });
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const handlePatientSearch = () => {
    if (!patientSearch.trim()) {
      toast({
        title: t('error'),
        description: t('phoneSearchError'),
        variant: "destructive"
      });
      return;
    }
    
    const results = searchPatients(patientSearch);
    setPatientSearchResults(results);
    
    if (results.length === 0) {
      toast({
        description: t('noClientsFound'),
      });
    }
  };
  
  const selectPatient = (patient: ReturnType<typeof searchPatients>[0]) => {
    setCurrentPatient(patient);
    setPatientSearchResults([]);
    setRxVisible(true);
    
    setValue('patientId', patient.patientId);
    setValue('patientName', patient.name);
    setValue('patientPhone', patient.phone);
    setValue('rx', patient.rx);
    
    if (invoiceType === "contacts") {
      if (patient.contactLensRx) {
        setValue('contactLensRx', patient.contactLensRx);
        setShowMissingRxWarning(false);
      } else {
        setShowMissingRxWarning(true);
      }
    }
  };
  
  const handleSkipPatientChange = (checked: boolean) => {
    setSkipPatient(checked);
    setValue('skipPatient', checked);
    
    if (checked) {
      setCurrentPatient(null);
      setValue('patientId', undefined);
    }
  };
  
  const handleManualNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualName(e.target.value);
    setValue('patientName', e.target.value);
  };
  
  const handleManualPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualPhone(e.target.value);
    setValue('patientPhone', e.target.value);
  };
  
  const handleContactLensRxChange = (rxData: any) => {
    setValue('contactLensRx', rxData);
    
    let hasError = false;
    
    if (rxData.rightEye.cylinder !== "-" && rxData.rightEye.axis === "-") {
      hasError = true;
    }
    
    if (rxData.leftEye.cylinder !== "-" && rxData.leftEye.axis === "-") {
      hasError = true;
    }
    
    setValidationErrors({
      cylinderAxisError: hasError
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs 
        value={invoiceType} 
        onValueChange={(v) => {
          onInvoiceTypeChange(v as "glasses" | "contacts");
          setValue('invoiceType', v);
        }}
        className="w-auto mb-6"
      >
        <TabsList className="p-1 bg-primary/10 border border-primary/20 rounded-lg shadow-sm text-base">
          <TabsTrigger 
            value="glasses" 
            className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Glasses className="w-5 h-5" />
            {t('glasses')}
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            <Eye className="w-5 h-5" />
            {t('contacts')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="border rounded-lg p-5 bg-card shadow-sm">
        <div className="flex justify-between items-center border-b border-primary/30 pb-3 mb-4">
          <h3 className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
            <User className="w-5 h-5" />
            {t('clientSection')}
          </h3>
          <div className={`flex items-center ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
            <Checkbox 
              id="skipPatientCheck" 
              checked={skipPatient} 
              onCheckedChange={(checked) => handleSkipPatientChange(checked === true)} 
            />
            <Label 
              htmlFor="skipPatientCheck" 
              className={`font-normal text-sm ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
            >
              {t('noClientFile')}
            </Label>
          </div>
        </div>
        
        {!skipPatient ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientSearch" className={`text-muted-foreground block ${textAlignClass}`}>{t('phoneColon')}</Label>
                <div className={`flex ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
                  <Input
                    id="patientSearch"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder={t('typeToSearch')}
                    className={`flex-1 ${textAlignClass}`}
                  />
                  <Button onClick={handlePatientSearch} className="gap-1">
                    <Search className="w-4 h-4" />
                    {t('search')}
                  </Button>
                </div>
              </div>
              
              {patientSearchResults.length > 0 && (
                <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                  {patientSearchResults.map((patient) => (
                    <div 
                      key={patient.patientId}
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => selectPatient(patient)}
                    >
                      <div className={`font-medium ${textAlignClass}`}>{patient.name}</div>
                      <div className={`text-sm text-muted-foreground ${textAlignClass}`}>{patient.phone}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {currentPatient && (
                <div className="mt-4">
                  <div className="border-2 border-primary/20 rounded-lg p-4 bg-primary/5">
                    <div className={`flex justify-between mb-2 ${textAlignClass}`}>
                      <span className="font-semibold">{t('clientName')}:</span>
                      <span>{currentPatient.name}</span>
                    </div>
                    <div className={`flex justify-between mb-2 ${textAlignClass}`}>
                      <span className="font-semibold">{t('clientPhone')}:</span>
                      <span dir="ltr">{currentPatient.phone}</span>
                    </div>
                    <div className={`flex justify-between ${textAlignClass}`}>
                      <span className="font-semibold">{t('patientID')}:</span>
                      <span>{currentPatient.patientId || "N/A"}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="mt-3 w-full" 
                    onClick={() => setRxVisible(!rxVisible)}
                  >
                    {rxVisible ? (
                      <>
                        <EyeOff className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {t('hideRx')}
                      </>
                    ) : (
                      <>
                        <Eye className={`w-4 h-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                        {t('showRx')}
                      </>
                    )}
                  </Button>
                  
                  {rxVisible && invoiceType === "glasses" && currentPatient.rx && (
                    <div className="p-3 mt-3 bg-white border rounded-lg">
                      <table className="w-full border-collapse ltr">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="p-2 border text-center">{t('eye')}</th>
                            <th className="p-2 border text-center">SPH</th>
                            <th className="p-2 border text-center">CYL</th>
                            <th className="p-2 border text-center">AXIS</th>
                            <th className="p-2 border text-center">ADD</th>
                            <th className="p-2 border text-center">PD</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border font-bold text-center">{t('rightEyeAbbr')}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.sphereOD || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.cylOD || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.axisOD || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.addOD || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.pdRight || "—"}</td>
                          </tr>
                          <tr>
                            <td className="p-2 border font-bold text-center">{t('leftEyeAbbr')}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.sphereOS || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.cylOS || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.axisOS || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.addOS || "—"}</td>
                            <td className="p-2 border text-center">{currentPatient.rx.pdLeft || "—"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {rxVisible && invoiceType === "contacts" && (
                    <div className="mt-3">
                      <ContactLensForm 
                        rxData={getValues<any>('contactLensRx') || {
                          rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" },
                          leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" }
                        }}
                        onChange={handleContactLensRxChange}
                        showMissingRxWarning={showMissingRxWarning}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manualName" className={`text-muted-foreground block ${textAlignClass}`}>{t('clientName')} ({t('optional')}):</Label>
              <Input
                id="manualName"
                value={manualName}
                onChange={handleManualNameChange}
                className={textAlignClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualPhone" className={`text-muted-foreground block ${textAlignClass}`}>{t('clientPhone')} ({t('optional')}):</Label>
              <Input
                id="manualPhone"
                value={manualPhone}
                onChange={handleManualPhoneChange}
                className={textAlignClass}
              />
            </div>
            
            {invoiceType === "contacts" && (
              <ContactLensForm 
                rxData={getValues<any>('contactLensRx') || {
                  rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" },
                  leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" }
                }}
                onChange={handleContactLensRxChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
