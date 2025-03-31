
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkOrderPrint } from "./WorkOrderPrint";
import { useLanguageStore } from '@/store/languageStore';
import { useStoreLocation } from '@/store/storeLocationStore';
import { LocationSelector } from './LocationSelector';
import { PrintService } from '@/utils/PrintService';
import { Invoice } from '@/store/invoiceStore';
import { Printer, AlertTriangle } from "lucide-react";

interface WorkOrderPrintSelectorProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  contactLenses?: any[];
  contactLensRx?: any;
  thermalOnly?: boolean;
  trigger?: React.ReactNode;
  locationId?: string;
}

export const WorkOrderPrintSelector: React.FC<WorkOrderPrintSelectorProps> = ({
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx,
  thermalOnly = false,
  trigger,
  locationId
}) => {
  const { t, language } = useLanguageStore();
  const { selectedLocation } = useStoreLocation();
  const [open, setOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [activeTab, setActiveTab] = useState('thermal');
  const [printLocation, setPrintLocation] = useState(locationId || selectedLocation);
  
  const handleLocationSelect = (locationId: string) => {
    setPrintLocation(locationId);
  };
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Get the content to print based on active tab
    const elementId = activeTab === 'thermal' ? 'work-order-print' : 'prescription-content';
    
    // Clone the DOM element to manipulate it for printing
    const contentElement = document.getElementById(elementId);
    
    if (!contentElement) {
      console.error(`[WorkOrderPrintSelector] Element with ID '${elementId}' not found`);
      setIsPrinting(false);
      return;
    }
    
    // Create a cloned document for printing
    const clonedContent = contentElement.cloneNode(true) as HTMLElement;
    
    // Remove UI elements that shouldn't be printed
    const uiElementsToRemove = clonedContent.querySelectorAll('.hide-print');
    uiElementsToRemove.forEach(el => {
      el.parentNode?.removeChild(el);
    });
    
    // Set up print options
    const printOptions = {
      pageTitle: activeTab === 'thermal' ? 'Work Order' : 'Prescription',
      printBackground: true
    };
    
    // Use the PrintService to handle the printing
    PrintService.printElement(clonedContent, printOptions, () => {
      setIsPrinting(false);
      setOpen(false);
    });
  };
  
  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-1">
      <Printer className="h-4 w-4" />
      {t('printWorkOrder')}
    </Button>
  );
  
  const content = (
    <div className="print-selector">
      <DialogHeader>
        <DialogTitle className="text-center">
          {t('printOptions')}
        </DialogTitle>
      </DialogHeader>
      
      <div className="print-location-selector my-4">
        <LocationSelector 
          mini={false}
          className="w-full"
          onSelect={handleLocationSelect}
        />
      </div>
      
      <Tabs defaultValue="thermal" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="thermal">{t('thermalReceipt')}</TabsTrigger>
          {!thermalOnly && (
            <TabsTrigger value="prescription">{t('prescriptionSheet')}</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="thermal" className="p-0">
          <div className="preview-container max-h-[70vh] overflow-auto p-4 border rounded-md bg-gray-50">
            <WorkOrderPrint
              invoice={invoice}
              patientName={patientName}
              patientPhone={patientPhone}
              rx={rx}
              lensType={lensType}
              coating={coating}
              frame={frame}
              contactLenses={contactLenses}
              contactLensRx={contactLensRx}
              locationId={printLocation}
            />
          </div>
        </TabsContent>
        
        {!thermalOnly && (
          <TabsContent value="prescription" className="p-0">
            <div className="preview-container max-h-[70vh] overflow-auto p-4 border rounded-md bg-gray-50">
              <div id="prescription-content" className="bg-white p-6 rounded shadow-sm w-[210mm] mx-auto">
                {/* Prescription content will go here */}
                <div className="flex items-center justify-center p-8 border-2 border-dashed">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mr-2" />
                  <span>{t('prescriptionTemplateNotAvailable')}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      <div className="flex justify-end mt-4">
        <Button onClick={handlePrint} disabled={isPrinting} className="gap-2">
          <Printer className="h-4 w-4" />
          {isPrinting ? t('printing') : t('print')}
        </Button>
      </div>
    </div>
  );
  
  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          {content}
        </DialogContent>
      </Dialog>
    );
  }
  
  // If no trigger is provided, just display the content (for programmatic use)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        {content}
      </DialogContent>
    </Dialog>
  );
};
