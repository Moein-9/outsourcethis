
import React from "react";
import { format, parseISO, differenceInYears } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/store/languageStore";
import { Patient } from "@/store/patientStore";
import { Button } from "@/components/ui/button";
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
import { Eye, UserSearch } from "lucide-react";

interface PatientWithMeta extends Patient {
  lastVisit?: string;
  avatar?: string;
}

interface PatientSearchResultsProps {
  searchResults: PatientWithMeta[];
  onSelectPatient: (patient: PatientWithMeta) => void;
}

export const PatientSearchResults: React.FC<PatientSearchResultsProps> = ({
  searchResults,
  onSelectPatient
}) => {
  const { language, t } = useLanguageStore();
  const isRtl = language === 'ar';
  const dirClass = isRtl ? 'rtl' : 'ltr';
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return isRtl ? "تاريخ غير متوفر" : "Date not available";
    try {
      return format(parseISO(dateString), "PPP", { locale: isRtl ? ar : enUS });
    } catch (error) {
      return isRtl ? "تاريخ غير صالح" : "Invalid date";
    }
  };
  
  const getPatientAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return isRtl ? "غير معروف" : "Unknown";
    const age = differenceInYears(new Date(), new Date(dateOfBirth));
    return age;
  };
  
  return (
    <Card className={`mb-6 border-amber-200 shadow-md ${dirClass}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{isRtl ? "نتائج البحث" : "Search Results"}</CardTitle>
        <CardDescription>
          {isRtl 
            ? `تم العثور على ${searchResults.length} عميل`
            : `Found ${searchResults.length} client${searchResults.length !== 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {searchResults.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{isRtl ? "الاسم" : "Name"}</TableHead>
                  <TableHead>{isRtl ? "رقم الهاتف" : "Phone Number"}</TableHead>
                  <TableHead>{isRtl ? "تاريخ الميلاد" : "Date of Birth"}</TableHead>
                  <TableHead>{isRtl ? "العمر" : "Age"}</TableHead>
                  <TableHead>{isRtl ? "آخر زيارة" : "Last Visit"}</TableHead>
                  <TableHead className={isRtl ? "text-right" : "text-right"}>{isRtl ? "الإجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((patient, index) => (
                  <TableRow key={patient.patientId}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell dir="ltr" className="text-right">{patient.phone}</TableCell>
                    <TableCell>{formatDate(patient.dob)}</TableCell>
                    <TableCell>{getPatientAge(patient.dob)}</TableCell>
                    <TableCell>
                      {patient.lastVisit ? formatDate(patient.lastVisit) : (isRtl ? 'لا توجد زيارات' : 'No visits')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectPatient(patient)}
                      >
                        <Eye className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                        {isRtl ? "ملف العميل" : "Client File"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <UserSearch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-1">{isRtl ? "لا توجد نتائج" : "No Results"}</h3>
            <p className="text-muted-foreground mb-4">
              {isRtl 
                ? "لم يتم العثور على نتائج مطابقة لمعايير البحث. جرب استخدام كلمات بحث مختلفة."
                : "No results match your search criteria. Try using different search terms."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
