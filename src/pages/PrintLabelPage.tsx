
import React, { useState } from 'react';
import { FrameLabelTemplate } from '@/components/FrameLabelTemplate';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AlertCircle, Printer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguageStore } from '@/store/languageStore';

const PrintLabelPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [printError, setPrintError] = useState<string | null>(null);
  
  const handlePrintError = (errorMessage: string) => {
    console.error(`[PrintLabelPage] Print error: ${errorMessage}`);
    setPrintError(errorMessage);
  };
  
  const clearPrintError = () => {
    setPrintError(null);
  };
  
  return (
    <Layout 
      activeSection="print-labels" 
      onNavigate={() => {}}
    >
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Frame Label Printing</h1>
          
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => window.location.reload()}>
              <Printer className="h-4 w-4" />
              {t('refreshPrintPage')}
            </Button>
          </div>
        </div>
        
        {printError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Printing Error</AlertTitle>
            <AlertDescription>
              {printError}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={clearPrintError}
                >
                  Dismiss
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    clearPrintError();
                    window.location.reload();
                  }}
                >
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-white p-4 rounded-lg shadow">
          <FrameLabelTemplate onPrintError={handlePrintError} />
        </div>
      </div>
    </Layout>
  );
};

export default PrintLabelPage;
