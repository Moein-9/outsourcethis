
/**
 * Creates a hidden print frame for printing
 * @param htmlContent The HTML content to be placed in the iframe
 * @returns The created iframe element
 */
export const createPrintFrame = (htmlContent: string) => {
  // First remove any existing frames to avoid issues
  const existingFrames = document.querySelectorAll('iframe.print-frame');
  existingFrames.forEach(frame => {
    document.body.removeChild(frame);
  });
  
  // Create a new iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.visibility = 'hidden';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.left = '0';
  iframe.style.top = '0';
  iframe.className = 'print-frame';
  
  // Add the frame to the body
  document.body.appendChild(iframe);
  
  // Write the content to the iframe
  if (iframe.contentWindow) {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(htmlContent);
    iframe.contentWindow.document.close();
  }
  
  return iframe;
};

/**
 * Prepares the print area for printing
 * @returns Object containing created elements
 */
export const preparePrintArea = () => {
  // Create an overlay to prevent user interaction
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '9998';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.className = 'print-overlay';
  
  // Add loading text
  const loadingText = document.createElement('div');
  loadingText.textContent = 'Preparing to print...';
  loadingText.style.color = 'white';
  loadingText.style.fontSize = '16px';
  loadingText.style.fontWeight = 'bold';
  overlay.appendChild(loadingText);
  
  // Add to the body
  document.body.appendChild(overlay);
  
  // Add a class to the body for print-specific CSS
  document.body.classList.add('printing');
  
  return { overlay, loadingText };
};

/**
 * Cleans up the print area after printing
 * @param iframe The iframe element to remove
 */
export const cleanupPrintArea = (iframe: HTMLIFrameElement) => {
  // Remove the overlay if it exists
  const overlay = document.querySelector('.print-overlay');
  if (overlay) {
    document.body.removeChild(overlay);
  }
  
  // Remove the printing class from the body
  document.body.classList.remove('printing');
  
  // Remove the iframe
  if (document.body.contains(iframe)) {
    document.body.removeChild(iframe);
  }
};

/**
 * Executes the print operation
 * @param iframe The iframe to print
 * @param onSuccess Callback when printing is successful
 * @param onError Callback when printing fails
 */
export const executePrint = (
  iframe: HTMLIFrameElement,
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  try {
    if (!iframe.contentWindow) {
      throw new Error('Cannot access iframe content window');
    }
    
    // Focus the iframe before printing
    iframe.contentWindow.focus();
    
    // Attempt to print the iframe content
    iframe.contentWindow.print();
    
    // Set a timeout to execute the success callback
    // This is necessary because the print() method returns immediately
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 1000);
  } catch (error) {
    console.error('Error executing print:', error);
    if (onError) onError(error);
  }
};
