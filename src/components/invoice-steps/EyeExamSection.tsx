
import React, { useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore, ServiceItem } from "@/store/inventoryStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollText, Check } from "lucide-react";
import { useInvoiceForm } from "./InvoiceFormContext";

interface EyeExamSectionProps {
  examService: ServiceItem | null;
}

export const EyeExamSection: React.FC<EyeExamSectionProps> = ({ examService }) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  const { updateServicePrice } = useInvoiceForm();

  // This effect will update the service price whenever the exam service changes
  useEffect(() => {
    if (examService) {
      updateServicePrice(examService.price);
    }
  }, [examService, updateServicePrice]);

  if (!examService) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/10">
            <CardTitle className={`text-lg flex items-center gap-2 ${textAlignClass}`}>
              <ScrollText className="w-5 h-5 text-primary" />
              {isRtl ? "فحص العين" : "Eye Exam"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center p-4">
              <p className="text-muted-foreground">
                {isRtl ? "لم يتم العثور على خدمة فحص العين" : "No eye exam service found"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/10">
          <CardTitle className={`text-lg flex items-center gap-2 ${textAlignClass}`}>
            <ScrollText className="w-5 h-5 text-primary" />
            {isRtl ? "فحص العين" : "Eye Exam"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-lg font-medium">
                <ScrollText className="w-5 h-5 text-primary" />
                {isRtl ? "فحص العين" : "Eye Exam"}
              </div>
              <div className="font-semibold text-lg">
                {examService.price.toFixed(3)} {isRtl ? 'د.ك' : 'KWD'}
              </div>
            </div>
            
            <p className={`mt-4 text-muted-foreground text-sm ${textAlignClass}`}>
              {isRtl 
                ? "خدمة فحص العين القياسية لتقييم صحة العين والرؤية." 
                : "Standard eye examination service to evaluate eye health and vision."}
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
              <Check className="w-4 h-4" />
              {isRtl ? "السعر: " : "Price: "} {examService.price.toFixed(3)} {isRtl ? 'د.ك' : 'KWD'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
