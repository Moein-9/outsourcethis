
import React, { useState } from 'react';
import { toast } from 'sonner';
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
      toast.error(t('frameNotFound'));
      return;
    }
    
    const labelContent = createFrameLabelContent(frame);
    const htmlDocument = PrintService.prepareLabelDocument(labelContent);
    
    PrintService.printHtml(htmlDocument, 'label', () => {
      toast.success(t('labelPrintedSuccessfully'));
    });
  };
  
  // Function to print multiple frame labels
  const printMultipleLabels = (frameIds: string[]) => {
    if (frameIds.length === 0) {
      toast.error(t('noFramesSelected'));
      return;
    }
    
    const selectedFrames = frames.filter(f => frameIds.includes(f.frameId));
    
    if (selectedFrames.length === 0) {
      toast.error(t('noFramesFound'));
      return;
    }
    
    let allLabelsContent = '';
    selectedFrames.forEach(frame => {
      allLabelsContent += createFrameLabelContent(frame);
    });
    
    const htmlDocument = PrintService.prepareLabelDocument(allLabelsContent);
    
    PrintService.printHtml(htmlDocument, 'label', () => {
      toast.success(t('labelsPrintedSuccessfully'));
    });
  };
  
  // Helper function to create frame label HTML content
  const createFrameLabelContent = (frame: FrameItem) => {
    return `
      <div class="label-container">
        <div class="left-section">
          <div class="store-logo">
            <img src="/lovable-uploads/826ece02-80b8-482d-a2be-8292f3460297.png" alt="Store Logo" />
          </div>
          <div class="qr-code">
            ${renderQRCodeToString(frame.frameId)}
          </div>
        </div>
        <div class="right-section">
          <div class="brand-name">${frame.brand} ${frame.model}</div>
          <div class="detail-info">Color: ${frame.color || '-'}</div>
          <div class="detail-info">Size: ${frame.size || '-'}</div>
          <div class="price">${frame.price.toFixed(2)} KWD</div>
        </div>
      </div>
    `;
  };
  
  // Helper function to render QR code as a string
  const renderQRCodeToString = (value: string) => {
    // Since we can't directly render React components to string, we'll create a simple SVG
    return `
      <svg viewBox="0 0 40 40" width="40" height="40">
        <rect width="40" height="40" fill="white" />
        <text x="20" y="20" text-anchor="middle" font-size="5">${value.substring(0, 8)}</text>
      </svg>
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
  
  return (
    <div className="space-y-4">
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
                <div className="font-medium">{frame.brand} {frame.model}</div>
                <div className="text-sm text-gray-500">
                  {frame.color}, {frame.size || '-'}
                </div>
                <div className="text-sm font-medium">{frame.price.toFixed(2)} KWD</div>
              </div>
              {selectedFrames.includes(frame.frameId) && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {frames.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {t('noFramesAvailable')}
        </div>
      )}
    </div>
  );
};
