
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryTabsProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const InventoryTabs: React.FC<InventoryTabsProps> = ({ 
  defaultValue, 
  onValueChange, 
  children 
}) => {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="frames">Frames</TabsTrigger>
        <TabsTrigger value="lenses">Lenses</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
