
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import QRCode from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { useInventoryStore, FrameItem } from '@/store/inventoryStore';
import { Check } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { PrintService } from '@/utils/PrintService';

/**
 * Custom hook for frame label printing functionality
 */
export const usePrintLabel = () => {
  const { frames } = useInventoryStore();
  const { t } = useLanguageStore();
  
  // Function to print a single frame label by ID
  const printSingleLabel = (frameId: string) => {
    const frame = frames.find(f => f.frameId === frameId);
    
    if (!frame) {
      toast({
        title: t('error'),
        description: t('frameNotFound'),
        variant: "destructive"
      });
      return;
    }
    
    const labelContent = createFrameLabelContent(frame);
    const htmlDocument = PrintService.prepareLabelDocument(labelContent);
    
    PrintService.printHtml(htmlDocument, 'label', () => {
      toast({
        title: t('success'),
        description: t('labelPrintedSuccessfully')
      });
    });
  };
  
  // Function to print multiple frame labels
  const printMultipleLabels = (frameIds: string[]) => {
    if (frameIds.length === 0) {
      toast({
        title: t('error'),
        description: t('noFramesSelected'),
        variant: "destructive"
      });
      return;
    }
    
    const selectedFrames = frames.filter(f => frameIds.includes(f.frameId));
    
    if (selectedFrames.length === 0) {
      toast({
        title: t('error'),
        description: t('noFramesFound'),
        variant: "destructive"
      });
      return;
    }
    
    let allLabelsContent = '';
    selectedFrames.forEach(frame => {
      allLabelsContent += createFrameLabelContent(frame);
    });
    
    const htmlDocument = PrintService.prepareLabelDocument(allLabelsContent);
    
    PrintService.printHtml(htmlDocument, 'label', () => {
      toast({
        title: t('success'),
        description: t('labelsPrintedSuccessfully')
      });
    });
  };
  
  // Helper function to create frame label HTML content
  const createFrameLabelContent = (frame: FrameItem) => {
    // QR value is the frame ID
    const qrValue = frame.frameId;
    
    return `
      <div class="label-container">
        <div class="left-section">
          <div class="store-logo">
            <img src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" alt="Store Logo" />
          </div>
          <div class="qr-code">
            <canvas id="qr-code-${frame.frameId}" class="qr-canvas"></canvas>
            <script>
              (function() {
                var canvas = document.getElementById("qr-code-${frame.frameId}");
                var qr = new QRCode(canvas, {
                  text: "${qrValue}",
                  width: 32,
                  height: 32,
                  colorDark: "#000000",
                  colorLight: "#ffffff",
                  correctLevel: QRCode.CorrectLevel.H
                });
              })();
            </script>
          </div>
        </div>
        <div class="right-section">
          <div class="brand-name">${frame.brand} ${frame.model}</div>
          <div class="detail-info">Color: ${frame.color || '-'}</div>
          <div class="detail-info">Size: ${frame.size || '-'}</div>
          <div class="price">${frame.price.toFixed(3)} KWD</div>
        </div>
      </div>
    `;
  };
  
  return { printSingleLabel, printMultipleLabels };
};

/**
 * Frame Label Template Component
 */
export const FrameLabelTemplate: React.FC = () => {
  const { frames } = useInventoryStore();
  const { printMultipleLabels } = usePrintLabel();
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
    printMultipleLabels(selectedFrames);
  };
  
  // Create a frame preview for demonstration
  const PreviewLabel = ({ frame }: { frame: FrameItem }) => {
    return (
      <div className="label-container-preview">
        <div className="left-section-preview">
          <div className="store-logo-preview">
            <img src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" alt="Store Logo" />
          </div>
          <div className="qr-code-preview">
            <QRCode 
              value={frame.frameId} 
              size={36} 
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
        <div className="right-section-preview">
          <div className="brand-name-preview">{frame.brand} {frame.model}</div>
          <div className="detail-info-preview">Color: {frame.color || '-'}</div>
          <div className="detail-info-preview">Size: {frame.size || '-'}</div>
          <div className="price-preview">{frame.price.toFixed(3)} KWD</div>
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
          <Button variant="outline" size="sm" onClick={selectAllFrames}>
            {t('selectAll')}
          </Button>
          <Button variant="outline" size="sm" onClick={deselectAllFrames}>
            {t('deselectAll')}
          </Button>
          <Button variant="secondary" size="sm" onClick={handlePrintSelected}>
            {t('printSelected')}
          </Button>
        </div>
      </div>
      
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
