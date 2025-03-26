
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePatientForm } from "./CreatePatientForm";
import { useLanguageStore } from "@/store/languageStore";

export const CreateClient = () => {
  const { language } = useLanguageStore();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'ar' ? 'إنشاء عميل جديد' : 'Create New Client'}
      </h1>
      
      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="patient" className="flex-1">
            {language === 'ar' ? 'مريض' : 'Patient'}
          </TabsTrigger>
          <TabsTrigger value="business" className="flex-1">
            {language === 'ar' ? 'شركة' : 'Business'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient" className="space-y-6">
          <CreatePatientForm />
        </TabsContent>
        
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'إضافة شركة جديدة' : 'Add New Business'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'ميزة إضافة الشركات قيد التطوير حالياً.' 
                  : 'Business client feature is currently under development.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
