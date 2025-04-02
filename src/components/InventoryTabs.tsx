
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LensTypeManager } from "@/components/LensTypeManager";
import { LensCoatingManager } from "@/components/LensCoatingManager";
import { LensThicknessManager } from "@/components/LensThicknessManager";
import { FrameInventory } from "@/components/FrameInventory";
import { ContactLensInventory } from "@/components/ContactLensInventory";
import { ServiceManager } from "@/components/ServiceManager";
import { Glasses, Contact, Layers, Paintbrush, Ruler, Wrench } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export const InventoryTabs: React.FC = () => {
  const { t, language } = useLanguageStore();
  const directionClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <Tabs defaultValue="frames" className="w-full" dir={directionClass}>
      <TabsList className="mb-6 w-full justify-start overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 p-1.5 rounded-lg border border-gray-200 shadow-sm">
        <TabsTrigger 
          value="frames" 
          className="data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Glasses className="w-4 h-4" />
          <span>{t('frames')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="contactLenses" 
          className="data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Contact className="w-4 h-4" />
          <span>{t('contactLenses')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lensTypes" 
          className="data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Layers className="w-4 h-4" />
          <span>{t('lensTypes')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lensCoatings" 
          className="data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Paintbrush className="w-4 h-4" />
          <span>{t('lensCoatings')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lensThicknesses" 
          className="data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Ruler className="w-4 h-4" />
          <span>{t('lensThicknesses')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="services" 
          className="data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Wrench className="w-4 h-4" />
          <span>{t('services')}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="frames" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-bold mb-4 text-blue-800 flex items-center gap-2 ${textAlignClass}`}>
            <Glasses className="w-5 h-5" />
            {t('frameManagement')}
          </h3>
          <FrameInventory />
        </div>
      </TabsContent>
      
      <TabsContent value="contactLenses" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-bold mb-4 text-amber-800 flex items-center gap-2 ${textAlignClass}`}>
            <Contact className="w-5 h-5" />
            {t('contactLensManagement')}
          </h3>
          <ContactLensInventory />
        </div>
      </TabsContent>
      
      <TabsContent value="lensTypes" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-bold mb-4 text-purple-800 flex items-center gap-2 ${textAlignClass}`}>
            <Layers className="w-5 h-5" />
            {t('lensTypes')}
          </h3>
          <LensTypeManager />
        </div>
      </TabsContent>
      
      <TabsContent value="lensCoatings" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-bold mb-4 text-teal-800 flex items-center gap-2 ${textAlignClass}`}>
            <Paintbrush className="w-5 h-5" />
            {t('lensCoatings')}
          </h3>
          <LensCoatingManager />
        </div>
      </TabsContent>
      
      <TabsContent value="lensThicknesses" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-bold mb-4 text-green-800 flex items-center gap-2 ${textAlignClass}`}>
            <Ruler className="w-5 h-5" />
            {t('lensThicknesses')}
          </h3>
          <LensThicknessManager />
        </div>
      </TabsContent>
      
      <TabsContent value="services" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className={`text-lg font-bold mb-4 text-indigo-800 flex items-center gap-2 ${textAlignClass}`}>
            <Wrench className="w-5 h-5" />
            {t('serviceManagement')}
          </h3>
          <ServiceManager />
        </div>
      </TabsContent>
    </Tabs>
  );
};
