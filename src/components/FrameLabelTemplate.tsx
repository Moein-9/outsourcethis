
import React, { useState, useEffect, CSSProperties } from 'react';
import { toast } from '@/hooks/use-toast';
import QRCodeReact from 'qrcode.react';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button";
import { useInventoryStore, FrameItem } from '@/store/inventoryStore';
import { Check, AlertTriangle } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { PrintService } from '@/utils/PrintService';

interface FrameLabelTemplateProps {
  onPrintError?: (errorMessage: string) => void;
}

/**
 * Custom hook for frame label printing functionality
 */
export const usePrintLabel = (onError?: (message: string) => void) => {
  const { frames } = useInventoryStore();
  const { t } = useLanguageStore();
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Generate QR code as data URL
  const generateQRCodeDataURL = (text: string): Promise<string> => {
    return QRCode.toDataURL(text, {
      width: 200,
      height: 200,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H', // High error correction capability
    });
  };
  
  // Function to print a single frame label by ID
  const printSingleLabel = async (frameId: string) => {
    const frame = frames.find(f => f.frameId === frameId);
    
    if (!frame) {
      const errorMsg = t('frameNotFound');
      toast({
        title: t('error'),
        description: errorMsg,
        variant: "destructive"
      });
      if (onError) onError(errorMsg);
      return;
    }
    
    try {
      setIsPrinting(true);
      console.log(`[LabelPrinting] Starting single label print for frame ${frameId}`);
      
      const qrCodeDataURL = await generateQRCodeDataURL(frame.frameId);
      const labelContent = createFrameLabelContent(frame, qrCodeDataURL);
      const htmlDocument = PrintService.prepareLabelDocument(labelContent);
      
      console.log("[LabelPrinting] Generated QR code data URL length:", qrCodeDataURL.length);
      
      PrintService.printHtml(htmlDocument, 'label', () => {
        console.log(`[LabelPrinting] Print process completed for frame ${frameId}`);
        setIsPrinting(false);
        toast({
          title: t('success'),
          description: t('labelPrintedSuccessfully')
        });
      });
    } catch (error) {
      console.error('[LabelPrinting] QR code generation error:', error);
      const errorMsg = t('errorGeneratingQRCode');
      toast({
        title: t('error'),
        description: errorMsg,
        variant: "destructive"
      });
      if (onError) onError(errorMsg);
      setIsPrinting(false);
    }
  };
  
  // Function to print multiple frame labels
  const printMultipleLabels = async (frameIds: string[]) => {
    if (frameIds.length === 0) {
      const errorMsg = t('noFramesSelected');
      toast({
        title: t('error'),
        description: errorMsg,
        variant: "destructive"
      });
      if (onError) onError(errorMsg);
      return;
    }
    
    const selectedFrames = frames.filter(f => frameIds.includes(f.frameId));
    
    if (selectedFrames.length === 0) {
      const errorMsg = t('noFramesFound');
      toast({
        title: t('error'),
        description: errorMsg,
        variant: "destructive"
      });
      if (onError) onError(errorMsg);
      return;
    }
    
    try {
      setIsPrinting(true);
      console.log(`[LabelPrinting] Starting multi-label print for ${selectedFrames.length} frames`);
      
      let allLabelsContent = '';
      
      // Process frames sequentially to ensure all QR codes are generated properly
      for (const frame of selectedFrames) {
        console.log(`[LabelPrinting] Generating label content for frame ${frame.frameId}`);
        const qrCodeDataURL = await generateQRCodeDataURL(frame.frameId);
        allLabelsContent += createFrameLabelContent(frame, qrCodeDataURL);
      }
      
      const htmlDocument = PrintService.prepareLabelDocument(allLabelsContent);
      
      PrintService.printHtml(htmlDocument, 'label', () => {
        console.log(`[LabelPrinting] Print process completed for ${selectedFrames.length} frames`);
        setIsPrinting(false);
        toast({
          title: t('success'),
          description: t('labelsPrintedSuccessfully')
        });
      });
    } catch (error) {
      console.error('[LabelPrinting] QR code generation error:', error);
      const errorMsg = t('errorGeneratingQRCodes');
      toast({
        title: t('error'),
        description: errorMsg,
        variant: "destructive"
      });
      if (onError) onError(errorMsg);
      setIsPrinting(false);
    }
  };
  
  // Helper function to create frame label HTML content with pre-generated QR code
  const createFrameLabelContent = (frame: FrameItem, qrCodeDataURL: string) => {
    // Format price to remove decimal places if they're all zeros
    const formattedPrice = Number.isInteger(frame.price) 
      ? Math.floor(frame.price)
      : frame.price.toFixed(3);
    
    return `
      <div class="label-container">
        <div class="left-section">
          <div class="store-logo">
            <img src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" alt="Store Logo" />
          </div>
          <div class="qr-code">
            <img src="${qrCodeDataURL}" alt="QR Code" class="qr-image" />
          </div>
        </div>
        <div class="right-section">
          <div class="brand-name">${frame.brand} ${frame.model}</div>
          <div class="detail-info">Color: ${frame.color || '-'}</div>
          <div class="detail-info">Size: ${frame.size || '-'}</div>
          <div class="price">${formattedPrice} KWD</div>
        </div>
      </div>
    `;
  };
  
  return { printSingleLabel, printMultipleLabels, isPrinting };
};

/**
 * Frame Label Template Component
 */
export const FrameLabelTemplate: React.FC<FrameLabelTemplateProps> = ({ onPrintError }) => {
  const { frames } = useInventoryStore();
  const { printMultipleLabels, isPrinting } = usePrintLabel(onPrintError);
  const { t } = useLanguageStore();
  const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
  
  const toggleFrameSelection = (frameId: string) => {
    if (selectedFrames.includes(frameId)) {
      setSelectedFrames(prev => prev.filter(id => id !== frameId));
    } else {
      setSelectedFrames(prev => [...prev, frameId]);
    }
  };
  
  const selectAllFrames = () => {
    setSelectedFrames(frames.map(f => f.frameId));
  };
  
  const deselectAllFrames = () => {
    setSelectedFrames([]);
  };
  
  const handlePrintSelected = () => {
    console.log(`[FrameLabelTemplate] Attempting to print ${selectedFrames.length} selected frames`);
    printMultipleLabels(selectedFrames);
  };
  
  // CSS styles for the preview
  const previewStyles: Record<string, React.CSSProperties> = {
    container: {
      width: '200px',
      height: '32px',
      display: 'flex',
      border: '1px solid #ddd',
      overflow: 'hidden',
      background: 'white'
    },
    leftSection: {
      width: '70px',
      height: '100%',
      padding: '2px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRight: '1px solid #eee'
    },
    rightSection: {
      width: '130px',
      height: '100%',
      padding: '2px 4px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between'
    },
    storeLogo: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1px'
    },
    storeLogoImg: {
      height: '10px',
      width: 'auto'
    },
    qrCode: {
      display: 'flex',
      justifyContent: 'center'
    },
    brandName: {
      fontWeight: 'bold',
      fontSize: '8px',
      lineHeight: '1',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxHeight: '16px',
      display: '-webkit-box' as any,
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical' as any
    },
    detailInfo: {
      fontSize: '6px',
      lineHeight: '1',
      overflow: 'hidden',
      whiteSpace: 'nowrap' as const,
      textOverflow: 'ellipsis'
    },
    price: {
      fontWeight: 'bold',
      fontSize: '10px',
      marginTop: '1px'
    }
  };
  
  const PreviewLabel = ({ frame }: { frame: FrameItem }) => {
    // Format price to remove decimal places if they're all zeros
    const formattedPrice = Number.isInteger(frame.price) 
      ? Math.floor(frame.price)
      : frame.price.toFixed(3);
      
    return (
      <div style={previewStyles.container}>
        <div style={previewStyles.leftSection}>
          <div style={previewStyles.storeLogo}>
            <img src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" alt="Store Logo" style={previewStyles.storeLogoImg} />
          </div>
          <div style={previewStyles.qrCode}>
            <QRCodeReact 
              value={frame.frameId} 
              size={36}
              level="H"
              includeMargin={false}
              renderAs="svg"
            />
          </div>
        </div>
        <div style={previewStyles.rightSection}>
          <div style={previewStyles.brandName}>{frame.brand} {frame.model}</div>
          <div style={previewStyles.detailInfo}>Color: {frame.color || '-'}</div>
          <div style={previewStyles.detailInfo}>Size: {frame.size || '-'}</div>
          <div style={previewStyles.price}>{formattedPrice} KWD</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">{t('selectedFrames')}: {selectedFrames.length}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAllFrames} disabled={isPrinting}>
            {t('selectAll')}
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAllFrames} disabled={isPrinting}>
            {t('deselectAll')}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handlePrintSelected} 
            disabled={selectedFrames.length === 0 || isPrinting}
            className="relative"
          >
            {isPrinting ? t('printing') : t('printSelected')}
            {isPrinting && (
              <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {selectedFrames.length === 0 && frames.length > 0 && (
        <div className="p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>{t('selectFramesToPrint')}</span>
        </div>
      )}
      
      {/* Preview of the first selected frame */}
      {selectedFrames.length > 0 && frames.length > 0 && (
        <div className="mb-4 p-3 border rounded-md">
          <h3 className="text-sm font-medium mb-2">{t('labelPreview')}</h3>
          <PreviewLabel frame={frames.find(f => f.frameId === selectedFrames[0]) || frames[0]} />
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {frames.map(frame => (
          <div 
            key={frame.frameId}
            className={`border rounded p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedFrames.includes(frame.frameId) ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => toggleFrameSelection(frame.frameId)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm">{frame.brand} {frame.model}</div>
                <div className="text-xs text-gray-500">
                  {frame.color}, {frame.size || '-'}
                </div>
                <div className="text-xs font-medium">{frame.price.toFixed(3)} KWD</div>
              </div>
              {selectedFrames.includes(frame.frameId) && (
                <Check className="h-4 w-4 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {frames.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          {t('noFramesAvailable')}
        </div>
      )}
    </div>
  );
};
