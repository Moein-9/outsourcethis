
import React from "react";
import { format, parseISO, differenceInYears } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/store/languageStore";
import { Patient } from "@/store/patientStore";
import { Invoice } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Phone, 
  Calendar, 
  Clock, 
  BadgeDollarSign, 
  FileBarChart, 
  Receipt 
} from "lucide-react";

interface PatientProfileInfoProps {
  patient: Patient;
  invoices: Invoice[];
  onPrintPrescription: () => void;
}

export const PatientProfileInfo: React.FC<PatientProfileInfoProps> = ({
  patient,
  invoices,
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
  
  const getPatientAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return language === 'ar' ? "غير معروف" : "Unknown";
    const age = differenceInYears(new Date(), new Date(dateOfBirth));
    return age;
  };
  
  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
        <CardTitle className="text-lg text-primary">
          {language === 'ar' ? "البيانات الشخصية" : "Personal Information"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-24 w-24 mb-3">
            {/* Use optional chaining for avatar since it doesn't exist on Patient type */}
            <AvatarImage src={(patient as any).avatar} alt={patient.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
              {patient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold">{patient.name}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <Phone className={`h-5 w-5 text-primary mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
            <div>
              <div className="text-sm text-muted-foreground">{t('phoneNumber')}</div>
              <div dir="ltr" className="text-right">{patient.phone}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Calendar className={`h-5 w-5 text-primary mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
            <div>
              <div className="text-sm text-muted-foreground">{t('dateOfBirth')}</div>
              <div>{formatDate(patient.dob)}</div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {getPatientAge(patient.dob)} {language === 'ar' ? "سنة" : "years"}
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className={`h-5 w-5 text-primary mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
            <div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? "تاريخ التسجيل" : "Registration Date"}
              </div>
              <div>{formatDate(patient.createdAt)}</div>
            </div>
          </div>

          <div className="flex items-start">
            <BadgeDollarSign className={`h-5 w-5 text-green-500 mt-0.5 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
            <div>
              <div className="text-sm text-muted-foreground">
                {language === 'ar' ? "إجمالي المعاملات" : "Total Transactions"}
              </div>
              <div className="font-semibold text-green-600">
                {invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(3)} {t('kwd')}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <FileBarChart className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-amber-500`} />
            {language === 'ar' ? "تقرير العميل" : "Client Report"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onPrintPrescription}
          >
            <Receipt className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-blue-500`} />
            {language === 'ar' ? "طباعة الوصفة الطبية" : "Print Prescription"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
