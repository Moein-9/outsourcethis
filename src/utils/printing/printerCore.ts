
import { toast } from "@/hooks/use-toast";

/**
 * Core printing functionality that handles the actual print operation
 */
export const executePrint = (
  element: HTMLElement,
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) => {
  try {
    // Use a single print operation to prevent multiple popups
    window.print();
    
    // Call the success callback if provided
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 500);
    }
  } catch (error) {
    console.error("Error during print operation:", error);
    
    // Call the error callback if provided, otherwise show a toast
    if (onError) {
      onError(error);
    } else {
      toast({
        title: "Error",
        description: "Failed to print. Please try again.",
        variant: "destructive",
      });
    }
  }
};

/**
 * Prepares the document for printing by setting up the print area
 */
export const preparePrintArea = (content: string | HTMLElement, id: string = 'thermal-print') => {
  // Clean up any existing print frames first
  const existingPrintElements = document.querySelectorAll(`#${id}`);
  existingPrintElements.forEach(el => {
    el.remove();
  });
  
  // Create a new div for printing
  const printElement = document.createElement('div');
  printElement.id = id;
  
  // Add the content
  if (typeof content === 'string') {
    printElement.innerHTML = content;
  } else {
    printElement.appendChild(content);
  }
  
  // Set styles for the print area
  printElement.style.position = 'fixed';
  printElement.style.top = '0';
  printElement.style.left = '0';
  printElement.style.zIndex = '9999';
  printElement.style.visibility = 'visible';
  
  // Append to body
  document.body.appendChild(printElement);
  
  return printElement;
};

/**
 * Cleans up after printing by removing the print area
 */
export const cleanupPrintArea = (element: HTMLElement, delay: number = 500) => {
  if (!element) return;
  
  setTimeout(() => {
    if (document.body.contains(element)) {
      element.style.visibility = 'hidden';
      element.style.zIndex = '-1000';
      
      setTimeout(() => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      }, delay);
    }
  }, delay);
};

/**
 * Creates an iframe for printing to avoid page navigation
 */
export const createPrintFrame = (content: string, id: string = 'print-frame') => {
  // Remove any existing frames
  const existingFrames = document.querySelectorAll(`#${id}`);
  existingFrames.forEach(el => el.remove());
  
  // Create a new iframe
  const iframe = document.createElement('iframe');
  iframe.id = id;
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  iframe.style.visibility = 'visible';
  
  // Append to body
  document.body.appendChild(iframe);
  
  // Write content to iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();
  }
  
  return iframe;
};
