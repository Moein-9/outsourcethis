import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollText, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  // Add internal selection state as fallback
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedServiceId || null
  );

  // Find the selected service or use the first available one
  const selectedService = selectedServiceId
    ? examServices.find((service) => service.id === selectedServiceId)
    : examServices.find((service) => service.id === internalSelectedId) || null;

  // Handle service selection with better debugging
  const handleServiceSelect = (service: ExamService) => {
    console.log("Service selected:", service);

    // Update internal state first
    setInternalSelectedId(service.id);

    // Then call parent callback if available
    if (onServiceSelect) {
      console.log("Calling parent onServiceSelect with:", service);

      // Make sure to use the exact field names that InvoiceStepSummary expects
      // Based on the InvoiceStepSummary.tsx file, it expects:
      // - serviceId
      // - serviceName
      // - serviceDescription
      // - servicePrice

      // The parent component should update these form fields
      onServiceSelect({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
      });

      // Add direct form update debug message
      console.log(
        "Form should update fields: serviceId, serviceName, serviceDescription, servicePrice"
      );
      console.log("with values:", {
        serviceId: service.id,
        serviceName: service.name,
        serviceDescription: service.description,
        servicePrice: service.price,
      });

      // Optional: If the parent has a useForm setValue function
      // Sample code (uncomment if your parent component exposes setValue):
      // if (setValue) {
      //   setValue('serviceId', service.id);
      //   setValue('serviceName', service.name);
      //   setValue('serviceDescription', service.description);
      //   setValue('servicePrice', service.price);
      // }
    } else {
      console.log("Warning: onServiceSelect prop is not provided");
      console.log(
        "Form fields will NOT be updated: serviceId, serviceName, serviceDescription, servicePrice"
      );

      // Show a subtle toast as feedback that service was selected
      toast.success(
        isRtl ? `تم اختيار: ${service.name}` : `Selected: ${service.name}`
      );
    }
  };

  // Update internal state when prop changes
  useEffect(() => {
    if (selectedServiceId) {
      setInternalSelectedId(selectedServiceId);
    }
  }, [selectedServiceId]);

  // Fetch eye exam services from Supabase
  useEffect(() => {
    // Add ref to track if component is mounted to prevent multiple fetches
    let isMounted = true;

    const fetchExamServices = async () => {
      if (!isMounted) return;

      // Only fetch if we don't already have services
      if (examServices.length > 0) return;

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

        if (data && isMounted) {
          const formattedServices: ExamService[] = data.map((service) => ({
            id: service.id,
            name: service.name,
            description: service.description || "",
            price: service.price,
            category: service.category,
          }));

          setExamServices(formattedServices);
          console.log("Loaded exam services:", formattedServices);

          // If we have a service and no selection yet, auto-select the first one
          if (
            formattedServices.length > 0 &&
            !internalSelectedId &&
            !selectedServiceId &&
            isMounted
          ) {
            console.log("Auto-selecting first service:", formattedServices[0]);
            setInternalSelectedId(formattedServices[0].id);

            if (onServiceSelect) {
              onServiceSelect(formattedServices[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching eye exam services:", err);
        if (isMounted) {
          setError(
            isRtl
              ? "حدث خطأ أثناء تحميل خدمات فحص العين"
              : "Error loading eye exam services"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExamServices();

    // Cleanup function
    return () => {
      isMounted = false;
    };

    // Include examServices.length in the dependency array to prevent unnecessary fetches
  }, [isRtl, selectedServiceId, internalSelectedId, examServices.length]);

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
          {examServices.map((service) => {
            // Determine if this service is selected (either by parent or internally)
            const isSelected =
              selectedServiceId === service.id ||
              (!selectedServiceId && internalSelectedId === service.id);

            return (
              <div
                key={service.id}
                className={`p-4 bg-muted/20 rounded-lg mb-3 cursor-pointer border-2 transition-all
                  ${
                    isSelected
                      ? "border-primary/50 bg-primary/5"
                      : "border-transparent hover:border-primary/20"
                  }
                `}
                onClick={() => handleServiceSelect(service)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
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
            );
          })}

          {(selectedService ||
            examServices.find((s) => s.id === internalSelectedId)) && (
            <div className="mt-6 flex items-center justify-center">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2">
                <Check className="w-4 h-4" />
                {isRtl ? "السعر: " : "Price: "}{" "}
                {(
                  selectedService ||
                  examServices.find((s) => s.id === internalSelectedId)
                )?.price.toFixed(3)}{" "}
                {isRtl ? "د.ك" : "KWD"}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
