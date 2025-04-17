import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollText, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExamService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface EyeExamSectionProps {
  onServiceSelect?: (service: ExamService) => void;
  selectedServiceId?: string;
}

export const EyeExamSection: React.FC<EyeExamSectionProps> = ({
  onServiceSelect,
  selectedServiceId,
}) => {
  const { language, t } = useLanguageStore();
  const isRtl = language === "ar";
  const textAlignClass = language === "ar" ? "text-right" : "text-left";

  const [examServices, setExamServices] = useState<ExamService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find the selected service or use the first available one
  const selectedService = selectedServiceId
    ? examServices.find((service) => service.id === selectedServiceId)
    : examServices[0] || null;

  // Fetch eye exam services from Supabase
  useEffect(() => {
    const fetchExamServices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // @ts-ignore - Tables exist at runtime but not in TypeScript definitions
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("category", "exam")
          .order("price", { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedServices: ExamService[] = data.map((service) => ({
            id: service.id,
            name: service.name,
            description: service.description || "",
            price: service.price,
            category: service.category,
          }));

          setExamServices(formattedServices);

          // If we have a service and onServiceSelect is provided, call it with the first service
          if (
            formattedServices.length > 0 &&
            onServiceSelect &&
            !selectedServiceId
          ) {
            onServiceSelect(formattedServices[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching eye exam services:", err);
        setError(
          isRtl
            ? "حدث خطأ أثناء تحميل خدمات فحص العين"
            : "Error loading eye exam services"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamServices();
  }, [isRtl, onServiceSelect, selectedServiceId]);

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/10">
          <CardTitle
            className={`text-lg flex items-center gap-2 ${textAlignClass}`}
          >
            <ScrollText className="w-5 h-5 text-primary" />
            {isRtl ? "فحص العين" : "Eye Exam"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin mr-2" />
            <p>{isRtl ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/10">
          <CardTitle
            className={`text-lg flex items-center gap-2 ${textAlignClass}`}
          >
            <ScrollText className="w-5 h-5 text-primary" />
            {isRtl ? "فحص العين" : "Eye Exam"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center p-4 text-red-500">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (examServices.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/10">
          <CardTitle
            className={`text-lg flex items-center gap-2 ${textAlignClass}`}
          >
            <ScrollText className="w-5 h-5 text-primary" />
            {isRtl ? "فحص العين" : "Eye Exam"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center p-4">
            <p className="text-muted-foreground">
              {isRtl
                ? "لم يتم العثور على خدمة فحص العين"
                : "No eye exam services found"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/10">
          <CardTitle
            className={`text-lg flex items-center gap-2 ${textAlignClass}`}
          >
            <ScrollText className="w-5 h-5 text-primary" />
            {isRtl ? "فحص العين" : "Eye Exam"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {examServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 bg-muted/20 rounded-lg mb-3 cursor-pointer border-2 transition-all
                ${
                  selectedService?.id === service.id
                    ? "border-primary/50 bg-primary/5"
                    : "border-transparent hover:border-primary/20"
                }
              `}
              onClick={() => onServiceSelect?.(service)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-lg font-medium">
                  {selectedService?.id === service.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                  {service.name}
                </div>
                <div className="font-semibold text-lg">
                  {service.price.toFixed(3)} {isRtl ? "د.ك" : "KWD"}
                </div>
              </div>

              {service.description && (
                <p
                  className={`mt-2 text-muted-foreground text-sm ${textAlignClass}`}
                >
                  {service.description}
                </p>
              )}
            </div>
          ))}

          {selectedService && (
            <div className="mt-6 flex items-center justify-center">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
                <Check className="w-4 h-4" />
                {isRtl ? "السعر: " : "Price: "}{" "}
                {selectedService.price.toFixed(3)} {isRtl ? "د.ك" : "KWD"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
