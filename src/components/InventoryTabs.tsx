
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrameInventory } from "@/components/FrameInventory";
import { ContactLensInventory } from "@/components/ContactLensInventory";
import { LensTypeManager } from "@/components/LensTypeManager";
import { LensCoatingManager } from "@/components/LensCoatingManager";
import { LensThicknessManager } from "@/components/LensThicknessManager";
import { LensCombinationManager } from "@/components/LensCombinationManager";
import { ServiceManager } from "@/components/ServiceManager";
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseSyncManager } from "@/components/DatabaseSyncManager";
import { InventoryInitializer } from "@/components/InventoryInitializer";

export const InventoryTabs = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      <InventoryInitializer />

      <div className="mb-6">
        <DatabaseSyncManager />
      </div>

      <Tabs defaultValue="frames">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="contactLenses">Contact Lenses</TabsTrigger>
          <TabsTrigger value="lensTypes">Lens Types</TabsTrigger>
          <TabsTrigger value="coatings">Coatings</TabsTrigger>
          <TabsTrigger value="thicknesses">Thicknesses</TabsTrigger>
          <TabsTrigger value="pricing">Lens Pricing</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            <TabsContent value="frames">
              <FrameInventory />
            </TabsContent>
            <TabsContent value="contactLenses">
              <ContactLensInventory />
            </TabsContent>
            <TabsContent value="lensTypes">
              <LensTypeManager />
            </TabsContent>
            <TabsContent value="coatings">
              <LensCoatingManager />
            </TabsContent>
            <TabsContent value="thicknesses">
              <LensThicknessManager />
            </TabsContent>
            <TabsContent value="pricing">
              <LensCombinationManager />
            </TabsContent>
            <TabsContent value="services">
              <ServiceManager />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};
