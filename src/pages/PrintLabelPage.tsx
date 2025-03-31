
import React, { useState } from 'react';
import { FrameLabelTemplate } from '@/components/FrameLabelTemplate';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { AlertCircle, Printer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguageStore } from '@/store/languageStore';
import { LocationSelector } from '@/components/LocationSelector';

const PrintLabelPage: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [printError, setPrintError] = useState<string | null>(null);
  
  const handlePrintError = (errorMessage: string) => {
    console.error(`[PrintLabelPage] Print error: ${errorMessage}`);
    setPrintError(errorMessage);
  };
  
  const clearPrintError = () => {
    setPrintError(null);
  };
  
  const isRtl = language === 'ar';
  
  return (
    <Layout 
      activeSection="print-labels" 
      onNavigate={() => {}}
    >
      <div className={`container mx-auto py-6 ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isRtl ? "طباعة ملصقات الإطارات" : "Frame Label Printing"}
          </h1>
          
          <div className="flex gap-2">
            <LocationSelector mini className="h-9" />
            <Button variant="secondary" size="sm" className="gap-2" onClick={() => window.location.reload()}>
              <Printer className="h-4 w-4" />
              {isRtl ? "تحديث صفحة الطباعة" : "Refresh Print Page"}
            </Button>
          </div>
        </div>
        
        {printError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{isRtl ? "خطأ في الطباعة" : "Printing Error"}</AlertTitle>
            <AlertDescription>
              {printError}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={clearPrintError}
                >
                  {isRtl ? "تجاهل" : "Dismiss"}
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    clearPrintError();
                    window.location.reload();
                  }}
                >
                  {isRtl ? "إعادة المحاولة" : "Retry"}
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
