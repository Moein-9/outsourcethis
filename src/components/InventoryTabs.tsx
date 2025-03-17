
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LensTypeManager } from "@/components/LensTypeManager";
import { LensCoatingManager } from "@/components/LensCoatingManager";

export const InventoryTabs: React.FC = () => {
  return (
    <Tabs defaultValue="frames" className="w-full">
      <TabsList className="mb-4 w-full justify-start overflow-x-auto">
        <TabsTrigger value="frames">الإطارات</TabsTrigger>
        <TabsTrigger value="contactLenses">العدسات اللاصقة</TabsTrigger>
        <TabsTrigger value="lensTypes">أنواع العدسات</TabsTrigger>
        <TabsTrigger value="lensCoatings">طلاءات العدسات</TabsTrigger>
      </TabsList>
      
      <TabsContent value="frames" className="mt-0">
        {/* Current frame inventory content will be here */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">إدارة الإطارات</h3>
          <p>محتوى إدارة الإطارات الحالي</p>
        </div>
      </TabsContent>
      
      <TabsContent value="contactLenses" className="mt-0">
        {/* Current contact lens inventory content will be here */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">إدارة العدسات اللاصقة</h3>
          <p>محتوى إدارة العدسات اللاصقة الحالي</p>
        </div>
      </TabsContent>
      
      <TabsContent value="lensTypes" className="mt-0">
        <LensTypeManager />
      </TabsContent>
      
      <TabsContent value="lensCoatings" className="mt-0">
        <LensCoatingManager />
      </TabsContent>
    </Tabs>
  );
};
