import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrameInventoryContextDecorator } from "./FrameInventoryContextDecorator";
import { Contact } from "lucide-react";
import { InventoryTabs } from "./InventoryTabs";

export const Inventory = () => {
  const [selectedTab, setSelectedTab] = useState("frames");

  return (
    <div className="container mx-auto px-4 py-8">
      <InventoryTabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <TabsContent value="frames">
          <FrameInventoryContextDecorator />
        </TabsContent>
        
        <TabsContent value="lenses">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Lens Inventory</h2>
            <p className="text-gray-500">Lens inventory management coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts">
          <div className="p-8 text-center">
            <Contact className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Contact Lens Inventory</h2>
            <p className="text-gray-500">Contact lens inventory management coming soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="services">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <p className="text-gray-500">Service management coming soon</p>
          </div>
        </TabsContent>
      </InventoryTabs>
    </div>
  );
};
