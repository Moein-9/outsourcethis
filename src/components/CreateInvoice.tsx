
import React, { useState, useEffect } from "react";
import { Eye, User, FileText, Frame as FrameIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LensSelector } from "@/components/LensSelector";
import { ContactLensForm } from "@/components/ContactLensForm";
import { usePatientStore, ContactLensRx } from "@/store/patientStore";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInventoryStore, LensType, LensCoating } from "@/store/inventoryStore";

const CreateInvoice: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"glasses" | "contactLenses">("glasses");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [frameOnly, setFrameOnly] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(null);
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(null);
  const [contactLensRx, setContactLensRx] = useState<ContactLensRx>({
    rightEye: {
      sphere: "-",
      cylinder: "-",
      axis: "-",
      bc: "-",
      dia: "-"
    },
    leftEye: {
      sphere: "-",
      cylinder: "-",
      axis: "-",
      bc: "-",
      dia: "-"
    }
  });

  const handleSearchClient = () => {
    if (!phoneNumber) {
      toast.error(language === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter a phone number");
      return;
    }
    
    // Simulate client search
    // In a real app, this would be an API call
    setTimeout(() => {
      // No client found for now - this is just a UI demo
      toast.error(language === "ar" ? "لم يتم العثور على عميل بهذا الرقم" : "No client found with this phone number");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <FileText className="h-6 w-6 text-amber-500" />
        <h2 className="text-2xl font-bold">{t("create_invoice_title")}</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                {t("client_info")}
                {!selectedClient && (
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md ml-2">
                    {t("no_client_file")}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">
                    {t("phone_number")}:
                  </label>
                  <div className="flex">
                    <Input 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={language === "ar" ? "رقم الهاتف..." : "Phone number..."}
                      className="rounded-r-none"
                    />
                    <Button onClick={handleSearchClient} className="rounded-l-none">
                      {t("search")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Products Section */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "glasses" | "contactLenses")}>
            <TabsList className="w-full">
              <TabsTrigger value="glasses" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                {t("glasses")}
              </TabsTrigger>
              <TabsTrigger value="contactLenses" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                {t("contact_lenses")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="glasses" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {t("medical_glasses")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="frameOnly" checked={frameOnly} onCheckedChange={(checked) => setFrameOnly(checked as boolean)} />
                      <label htmlFor="frameOnly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("frame_only")}
                      </label>
                    </div>
                  </div>
                  
                  {!frameOnly && (
                    <LensSelector 
                      onSelectLensType={setSelectedLensType}
                      onSelectCoating={setSelectedCoating}
                      skipLens={frameOnly}
                      onSkipLensChange={setFrameOnly}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FrameIcon className="h-5 w-5 text-amber-500" />
                    {t("frame")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder={t("search_brand_model_color_size")}
                        className="flex-1"
                      />
                      <Button variant="outline">
                        {t("search")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contactLenses" className="space-y-4 pt-4">
              <ContactLensForm 
                rxData={contactLensRx} 
                onChange={setContactLensRx}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Summary Section */}
        <div>
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                {t("invoice_summary")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold">{t("total")}:</span>
                  <span className="font-bold text-xl">{total.toFixed(2)} {language === "ar" ? "د.ك" : "KD"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
