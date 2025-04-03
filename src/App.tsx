
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReportPage from "./pages/ReportPage";
import PrintLabelPage from "./pages/PrintLabelPage";
import { CustomWorkOrderReceipt } from "./components/CustomWorkOrderReceipt";
import { LensDebugger } from "./components/LensDebugger";
import { useInventoryStore } from "./store/inventoryStore";
import { useEffect } from "react";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Make sure the sunglasses coating category is properly initialized
  const { cleanupSamplePhotochromicCoatings, resetLensPricing } = useInventoryStore();
  
  useEffect(() => {
    // Clean up any sample photochromic coatings
    cleanupSamplePhotochromicCoatings();
    
    // Reset lens pricing combinations if needed
    // Note: Removed debug logs that were showing initialization messages
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/print-labels" element={<PrintLabelPage />} />
            <Route path="/custom-work-order" element={<CustomWorkOrderReceipt workOrder={{}} />} />
            <Route path="/lens-debug" element={<LensDebugger />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
