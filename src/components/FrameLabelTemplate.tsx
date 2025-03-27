
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, AlertCircle, Check } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { MoenLogo, storeInfo } from '@/assets/logo';

interface FrameLabelTemplateProps {
  onPrintError?: (errorMessage: string) => void;
}

export const FrameLabelTemplate: React.FC<FrameLabelTemplateProps> = ({
  onPrintError
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Sample data (in a real app, this would come from props or a form)
  const [frameData, setFrameData] = useState({
    brand: 'Ray-Ban',
    model: 'Wayfarer',
    color: 'Black',
    size: '54-18-145',
    price: 45.500,
    rx: {
      sphereOD: '-2.00',
      cylOD: '-0.75',
      axisOD: '180',
      addOD: '+2.00',
      sphereOS: '-2.25',
      cylOS: '-0.50',
      axisOS: '175',
      addOS: '+2.00',
      pd: '64',
    }
  });
  
  const handlePrint = () => {
    setIsPrinting(true);
    try {
      const label = document.getElementById('frame-label-content');
      
      if (!label) {
        throw new Error('Could not find label element');
      }
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window. Please check if pop-ups are blocked.');
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Frame Label</title>
            <style>
              @media print {
                @page {
                  size: 60mm 25mm;
                  margin: 0;
                  padding: 0;
                }
                
                body {
                  margin: 0;
                  padding: 0;
                  width: 60mm;
                  height: 25mm;
                }
                
                .frame-label {
                  width: 60mm !important;
                  height: 25mm !important;
                  page-break-inside: avoid;
                  overflow: hidden;
                  margin: 0;
                  padding: 0;
                }

                .bg-black {
                  background-color: black !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
                
                .text-white {
                  color: white !important;
                }
              }
              
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
              }
              
              .bg-black {
                background-color: black;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="frame-label">
              ${label.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.setTimeout(function() {
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      toast.success(t('printingStarted'));
    } catch (error) {
      console.error('Print error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown print error';
      toast.error(t('printingFailed'));
      onPrintError && onPrintError(errorMessage);
    } finally {
      setIsPrinting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-center">
        <Card className="border border-gray-300 p-0 overflow-hidden">
          <CardContent className="p-0">
            <div 
              id="frame-label-content"
              dir={isRtl ? "rtl" : "ltr"}
              className="frame-label flex flex-col bg-white text-black"
              style={{ 
                width: '60mm',
                height: '25mm',
                fontSize: '8px',
                fontFamily: 'Arial, sans-serif',
                padding: '1mm',
                position: 'relative'
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <MoenLogo className="h-3 w-auto mr-1" />
                  <span className="font-bold" style={{ fontSize: '7px' }}>{storeInfo.name}</span>
                </div>
                <div className="text-right text-[6px] font-medium">
                  {frameData.rx.pd && `PD: ${frameData.rx.pd}`}
                </div>
              </div>
              
              <div className="flex flex-1 justify-between mt-0.5">
                <div className="w-3/5 pr-1">
                  <div className="text-[7px] font-bold">{frameData.brand} {frameData.model}</div>
                  <div className="text-[6px] flex gap-1">
                    <span>{frameData.color}</span>
                    <span>{frameData.size}</span>
                  </div>
                  <div className="text-[6px] font-bold mt-0.5">{frameData.price.toFixed(3)} KWD</div>
                </div>
                
                <div className="w-2/5 text-[5px]">
                  <table className="w-full border-collapse" style={{ direction: 'ltr' }}>
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="p-0.5 text-center"></th>
                        <th className="p-0.5 text-center">SPH</th>
                        <th className="p-0.5 text-center">CYL</th>
                        <th className="p-0.5 text-center">AX</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-black p-0.5 font-bold">R</td>
                        <td className="p-0.5 text-center">{frameData.rx.sphereOD}</td>
                        <td className="p-0.5 text-center">{frameData.rx.cylOD}</td>
                        <td className="p-0.5 text-center">{frameData.rx.axisOD}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-0.5 font-bold">L</td>
                        <td className="p-0.5 text-center">{frameData.rx.sphereOS}</td>
                        <td className="p-0.5 text-center">{frameData.rx.cylOS}</td>
                        <td className="p-0.5 text-center">{frameData.rx.axisOS}</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  {frameData.rx.addOD && (
                    <div className="mt-0.5 text-center font-medium">
                      ADD: {frameData.rx.addOD}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          onClick={handlePrint}
          disabled={isPrinting}
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          {isPrinting ? t('printing') : t('printLabel')}
        </Button>
      </div>
    </div>
  );
};
