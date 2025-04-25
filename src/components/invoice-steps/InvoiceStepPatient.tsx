import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceForm } from "./InvoiceFormContext";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactLensForm } from "@/components/ContactLensForm";
import { 
  User, Search, Glasses, Eye, EyeOff, ScrollText, Wrench
} from "lucide-react";
import * as patientService from "@/services/patientService";
import { Patient } from "@/integrations/supabase/schema";

interface InvoiceStepPatientProps {
  invoiceType: "glasses" | "contacts" | "exam" | "repair";
  onInvoiceTypeChange: (type: "glasses" | "contacts" | "exam" | "repair") => void;
}

export const InvoiceStepPatient: React.FC<InvoiceStepPatientProps> = ({ 
  invoiceType, 
  onInvoiceTypeChange 
}) => {
  const { t, language } = useLanguageStore();
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
  const [skipPatient, setSkipPatient] = useState(getValues('skipPatient'));
  const [manualName, setManualName] = useState(getValues('patientName'));
  const [manualPhone, setManualPhone] = useState(getValues('patientPhone'));
  const [showMissingRxWarning, setShowMissingRxWarning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    cylinderAxisError: false
  });
  
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  const handlePatientSearch = async () => {
    if (!patientSearch.trim()) {
      toast({
        title: t('error'),
        description: t('phoneSearchError'),
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await patientService.searchPatients(patientSearch);
      setPatientSearchResults(results);
      
      if (results.length === 0) {
        toast({
          description: t('noClientsFound'),
        });
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast({
        title: t('error'),
        description: t('searchError'),
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const selectPatient = async (patient: Patient) => {
    setIsSearching(true);
    
    try {
      // Fetch complete patient data including prescriptions
      const patientData = await patientService.getPatientById(patient.id);
      
      if (!patientData) {
        toast({
          title: t('error'),
          description: t('errorLoadingPatient'),
          variant: "destructive"
        });
        return;
      }
      
      setCurrentPatient({
        patientId: patient.id,
        name: patient.full_name,
        phone: patient.phone_number,
        // Format the prescriptions for the invoice form
        rx: patientData.glassesPrescriptions.length > 0 ? {
          sphereOD: patientData.glassesPrescriptions[0].od_sph || '',
          cylOD: patientData.glassesPrescriptions[0].od_cyl || '',
          axisOD: patientData.glassesPrescriptions[0].od_axis || '',
          addOD: patientData.glassesPrescriptions[0].od_add || '',
          pdRight: patientData.glassesPrescriptions[0].od_pd || '',
          sphereOS: patientData.glassesPrescriptions[0].os_sph || '',
          cylOS: patientData.glassesPrescriptions[0].os_cyl || '',
          axisOS: patientData.glassesPrescriptions[0].os_axis || '',
          addOS: patientData.glassesPrescriptions[0].os_add || '',
          pdLeft: patientData.glassesPrescriptions[0].os_pd || ''
        } : undefined,
        contactLensRx: patientData.contactLensPrescriptions.length > 0 ? {
          rightEye: {
            sphere: patientData.contactLensPrescriptions[0].od_sphere || '',
            cylinder: patientData.contactLensPrescriptions[0].od_cylinder || '',
            axis: patientData.contactLensPrescriptions[0].od_axis || '',
            bc: patientData.contactLensPrescriptions[0].od_base_curve || '',
            dia: patientData.contactLensPrescriptions[0].od_diameter || '14.2'
          },
          leftEye: {
            sphere: patientData.contactLensPrescriptions[0].os_sphere || '',
            cylinder: patientData.contactLensPrescriptions[0].os_cylinder || '',
            axis: patientData.contactLensPrescriptions[0].os_axis || '',
            bc: patientData.contactLensPrescriptions[0].os_base_curve || '',
            dia: patientData.contactLensPrescriptions[0].os_diameter || '14.2'
          }
        } : undefined
      });
      
      setPatientSearchResults([]);
      setRxVisible(true);
      
      setValue('patientId', patient.id);
      setValue('patientName', patient.full_name);
      setValue('patientPhone', patient.phone_number);
      
      // Set RX values if available
      if (patientData.glassesPrescriptions.length > 0) {
        const latestRx = patientData.glassesPrescriptions[0];
        setValue('rx', {
          sphereOD: latestRx.od_sph || '',
          cylOD: latestRx.od_cyl || '',
          axisOD: latestRx.od_axis || '',
          addOD: latestRx.od_add || '',
          pdRight: latestRx.od_pd || '',
          sphereOS: latestRx.os_sph || '',
          cylOS: latestRx.os_cyl || '',
          axisOS: latestRx.os_axis || '',
          addOS: latestRx.os_add || '',
          pdLeft: latestRx.os_pd || ''
        });
      }
      
      // Set contact lens RX values if available
      if (patientData.contactLensPrescriptions.length > 0) {
        const latestContactLensRx = patientData.contactLensPrescriptions[0];
        setValue('contactLensRx', {
          rightEye: {
            sphere: latestContactLensRx.od_sphere || '',
            cylinder: latestContactLensRx.od_cylinder || '',
            axis: latestContactLensRx.od_axis || '',
            bc: latestContactLensRx.od_base_curve || '',
            dia: latestContactLensRx.od_diameter || '14.2'
          },
          leftEye: {
            sphere: latestContactLensRx.os_sphere || '',
            cylinder: latestContactLensRx.os_cylinder || '',
            axis: latestContactLensRx.os_axis || '',
            bc: latestContactLensRx.os_base_curve || '',
            dia: latestContactLensRx.os_diameter || '14.2'
          }
        });
        setShowMissingRxWarning(false);
      } else {
        setValue('contactLensRx', {
          rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" },
          leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" }
        });
        setShowMissingRxWarning(invoiceType === "contacts");
      }
      
    } catch (error) {
      console.error("Error selecting patient:", error);
      toast({
        title: t('error'),
        description: t('errorLoadingPatient'),
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSkipPatientChange = (checked: boolean) => {
    setSkipPatient(checked);
    setValue('skipPatient', checked);
    
    if (checked) {
      setCurrentPatient(null);
      setValue('patientId', "");
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

  useEffect(() => {
    if (currentPatient && invoiceType === "contacts" && !currentPatient.contactLensRx) {
      setShowMissingRxWarning(true);
    } else {
      setShowMissingRxWarning(false);
    }
  }, [invoiceType, currentPatient]);

  const currentContactLensRx = getValues<any>('contactLensRx') || {
    rightEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" },
    leftEye: { sphere: "-", cylinder: "-", axis: "-", bc: "-", dia: "14.2" }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs 
        value={invoiceType} 
        onValueChange={(v) => {
          onInvoiceTypeChange(v as "glasses" | "contacts" | "exam" | "repair");
          setValue('invoiceType', v as "glasses" | "contacts" | "exam" | "repair");
          if (v === "contacts" && currentPatient && !currentPatient.contactLensRx) {
            setShowMissingRxWarning(true);
          } else {
            setShowMissingRxWarning(false);
          }
        }}
        className="w-auto mb-6"
      >
        <TabsList className="p-1 bg-primary/10 border border-primary/20 rounded-lg shadow-sm text-base">
          <TabsTrigger 
            value="glasses" 
            className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <Glasses className="w-5 h-5" />
            {t('glasses')}
          </TabsTrigger>
          <TabsTrigger 
            value="contacts" 
            className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            <Eye className="w-5 h-5" />
            {t('contacts')}
          </TabsTrigger>
          <TabsTrigger 
            value="exam" 
            className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white"
          >
            <ScrollText className="w-5 h-5" />
            {language === 'ar' ? 'فحص العين' : 'Eye Exam'}
          </TabsTrigger>
          <TabsTrigger 
            value="repair" 
            className="flex items-center gap-2 px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white"
          >
            <Wrench className="w-5 h-5" />
            {language === 'ar' ? 'إصلاح' : 'Repair'}
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
              onCheckedChange={(checked) => handleSkipPatientChange(checked as boolean)} 
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
                  <Button 
                    onClick={handlePatientSearch} 
                    className="gap-1"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        {t('search')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {patientSearchResults.length > 0 && (
                <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                  {patientSearchResults.map((patient) => (
                    <div 
                      key={patient.id}
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => selectPatient(patient)}
                    >
                      <div className={`font-medium ${textAlignClass}`}>{patient.full_name}</div>
                      <div className={`text-sm text-muted-foreground ${textAlignClass}`}>{patient.phone_number}</div>
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
                  
                  {(invoiceType === "glasses" || invoiceType === "contacts") && (
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
                  )}
                  
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
                        rxData={currentContactLensRx}
                        onChange={handleContactLensRxChange}
                        showMissingRxWarning={showMissingRxWarning}
                        readOnly={true}
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
                value={manualName as string}
                onChange={handleManualNameChange}
                className={textAlignClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualPhone" className={`text-muted-foreground block ${textAlignClass}`}>{t('clientPhone')} ({t('optional')}):</Label>
              <Input
                id="manualPhone"
                value={manualPhone as string}
                onChange={handleManualPhoneChange}
                className={textAlignClass}
              />
            </div>
            
            {invoiceType === "contacts" && (
              <ContactLensForm 
                rxData={currentContactLensRx}
                onChange={handleContactLensRxChange}
                readOnly={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
