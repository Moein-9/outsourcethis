
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LensTypeManager } from "@/components/LensTypeManager";
import { LensCoatingManager } from "@/components/LensCoatingManager";
import { LensThicknessManager } from "@/components/LensThicknessManager";
import { FrameInventory } from "@/components/FrameInventory";
import { ContactLensInventory } from "@/components/ContactLensInventory";
import { Glasses, Contact, Layers, Paintbrush, Ruler } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export const InventoryTabs: React.FC = () => {
  const { t } = useLanguageStore();

  return (
    <Tabs defaultValue="frames" className="w-full">
      <TabsList className="mb-6 w-full justify-start overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 p-1.5 rounded-lg border border-gray-200 shadow-sm">
        <TabsTrigger 
          value="frames" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Glasses className="w-4 h-4" />
          <span>{t('frames')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="contactLenses" 
          className="data-[state=active]:bg-amber-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Contact className="w-4 h-4" />
          <span>{t('contactLenses')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lensTypes" 
          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Layers className="w-4 h-4" />
          <span>{t('lensTypes')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lensCoatings" 
          className="data-[state=active]:bg-teal-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Paintbrush className="w-4 h-4" />
          <span>{t('lensCoatings')}</span>
        </TabsTrigger>
        <TabsTrigger 
          value="lensThicknesses" 
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center gap-2 py-2.5 px-4"
        >
          <Ruler className="w-4 h-4" />
          <span>{t('lensThicknesses')}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="frames" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-blue-800 flex items-center gap-2">
            <Glasses className="w-5 h-5" />
            {t('frameManagement')}
          </h3>
          <FrameInventory />
        </div>
      </TabsContent>
      
      <TabsContent value="contactLenses" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-amber-800 flex items-center gap-2">
            <Contact className="w-5 h-5" />
            {t('contactLensManagement')}
          </h3>
          <ContactLensInventory />
        </div>
      </TabsContent>
      
      <TabsContent value="lensTypes" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-purple-800 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            {t('lensTypes')}
          </h3>
          <LensTypeManager />
        </div>
      </TabsContent>
      
      <TabsContent value="lensCoatings" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-teal-800 flex items-center gap-2">
            <Paintbrush className="w-5 h-5" />
            {t('lensCoatings')}
          </h3>
          <LensCoatingManager />
        </div>
      </TabsContent>
      
      <TabsContent value="lensThicknesses" className="mt-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-green-800 flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            {t('lensThicknesses')}
          </h3>
          <LensThicknessManager />
        </div>
      </TabsContent>
    </Tabs>
  );
};
