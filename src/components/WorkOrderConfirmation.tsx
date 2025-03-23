
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useLanguageStore } from '@/store/languageStore';
import { Printer, FileText, Save, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CustomPrintWorkOrderButton } from './CustomPrintWorkOrderButton';

interface WorkOrderConfirmationProps {
  previewInvoice: any;
  currentPatient: any;
  manualName: string;
  manualPhone: string;
  handleSaveInvoice: () => void;
  handlePrintInvoice: () => void;
  invoiceCreated: boolean;
  createdInvoiceId?: string;
  createdWorkOrderId?: string;
  onNotesChange: (notes: string) => void;
  notes: string;
}

export const WorkOrderConfirmation: React.FC<WorkOrderConfirmationProps> = ({
  previewInvoice,
  currentPatient,
  manualName,
  manualPhone,
  handleSaveInvoice,
  handlePrintInvoice,
  invoiceCreated,
  createdInvoiceId,
  createdWorkOrderId,
  onNotesChange,
  notes
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';
  
  const [isSaving, setIsSaving] = useState(false);
  
  const saveWithAnimation = () => {
    setIsSaving(true);
    
    // Update the notes in the parent component
    if (notes) {
      console.log("Saving work order with notes:", notes);
      onNotesChange(notes);
    }
    
    // Execute the save function
    handleSaveInvoice();
    
    // Reset the loading state after a delay
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: t('success'),
        description: t('invoiceSavedSuccess'),
      });
    }, 800);
  };
  
  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg font-semibold text-primary flex items-center gap-2 ${textAlignClass}`}>
          <FileText className="w-5 h-5" />
          {invoiceCreated ? t('workOrderSaved') : t('saveWorkOrder')}
        </CardTitle>
        <CardDescription className={textAlignClass}>
          {invoiceCreated 
            ? t('workOrderSavedDescription') 
            : t('provideNotesBeforeSaving')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {invoiceCreated ? (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">{t('successTitle')}</AlertTitle>
            <AlertDescription className="text-green-600">
              <p>{t('invoiceCreated')}: <span className="font-bold">{createdInvoiceId}</span></p>
              <p>{t('workOrderCreated')}: <span className="font-bold">{createdWorkOrderId}</span></p>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="work-order-notes" className={`block text-sm font-medium text-gray-700 ${textAlignClass}`}>
                {t('specialInstructions')}:
              </label>
              <Textarea
                id="work-order-notes"
                placeholder={t('enterSpecialInstructions')}
                className={`resize-none min-h-[100px] ${textAlignClass}`}
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
              />
              <p className={`text-xs text-muted-foreground ${textAlignClass}`}>
                {t('notesWillAppearOnWorkOrder')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-wrap gap-2">
        {!invoiceCreated ? (
          <Button 
            className="w-full sm:w-auto flex items-center gap-2 bg-primary"
            onClick={saveWithAnimation}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('saveAndPrint')}
              </>
            )}
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none flex items-center gap-2"
              onClick={handlePrintInvoice}
            >
              <Printer className="h-4 w-4" />
              {t('printInvoice')}
            </Button>
            
            <CustomPrintWorkOrderButton 
              workOrder={{
                id: createdWorkOrderId,
                ...previewInvoice,
                notes
              }}
              invoice={previewInvoice}
              patient={currentPatient || { name: manualName, phone: manualPhone }}
              className="flex-1 sm:flex-none flex items-center gap-2"
              variant="default"
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
};
