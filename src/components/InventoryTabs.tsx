
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LensTypeManager } from "@/components/LensTypeManager";
import { LensCoatingManager } from "@/components/LensCoatingManager";
import { FrameInventory } from "@/components/FrameInventory";
import { ContactLensInventory } from "@/components/ContactLensInventory";

export const InventoryTabs: React.FC = () => {
  return (
    <Tabs defaultValue="frames" className="w-full">
      <TabsList className="mb-4 w-full justify-start overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-lg">
        <TabsTrigger value="frames" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">الإطارات</TabsTrigger>
        <TabsTrigger value="contactLenses" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">العدسات اللاصقة</TabsTrigger>
        <TabsTrigger value="lensTypes" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">أنواع العدسات</TabsTrigger>
        <TabsTrigger value="lensCoatings" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">طلاءات العدسات</TabsTrigger>
      </TabsList>
      
      <TabsContent value="frames" className="mt-0">
        <div className="bg-muted/50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-blue-800">إدارة الإطارات</h3>
          <FrameInventory />
        </div>
      </TabsContent>
      
      <TabsContent value="contactLenses" className="mt-0">
        <div className="bg-muted/50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-green-800">إدارة العدسات اللاصقة</h3>
          <ContactLensInventory />
        </div>
      </TabsContent>
      
      <TabsContent value="lensTypes" className="mt-0">
        <div className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gradient-to-b from-purple-50 to-white">
          <LensTypeManager />
        </div>
      </TabsContent>
      
      <TabsContent value="lensCoatings" className="mt-0">
        <div className="p-4 rounded-lg border border-gray-200 shadow-sm bg-gradient-to-b from-amber-50 to-white">
          <LensCoatingManager />
        </div>
      </TabsContent>
    </Tabs>
  );
};
