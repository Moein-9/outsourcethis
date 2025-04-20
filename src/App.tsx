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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
  // State to track if initial data is loaded
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Store state
  const {
    cleanupSamplePhotochromicCoatings,
    resetLensPricing,
    isLoadingLensTypes,
    isLoadingLensCoatings,
    isLoadingLensThicknesses,
    isLoadingLensPricingCombinations,
    lensTypes,
    lensCoatings,
    lensThicknesses,
    lensPricingCombinations,
  } = useInventoryStore();

  useEffect(() => {
    // Clean up any sample photochromic coatings
    cleanupSamplePhotochromicCoatings();
  }, []);

  // Check if all lens data is loaded
  useEffect(() => {
    if (
      !isLoadingLensTypes &&
      !isLoadingLensCoatings &&
      !isLoadingLensThicknesses &&
      !isLoadingLensPricingCombinations &&
      lensTypes.length > 0 &&
      lensCoatings.length > 0 &&
      lensThicknesses.length > 0 &&
      lensPricingCombinations.length > 0
    ) {
      setIsDataLoaded(true);
    }
  }, [
    isLoadingLensTypes,
    isLoadingLensCoatings,
    isLoadingLensThicknesses,
    isLoadingLensPricingCombinations,
    lensTypes,
    lensCoatings,
    lensThicknesses,
    lensPricingCombinations,
  ]);

  // Show loading indicator while data is being loaded
  if (!isDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading application data...</p>
      </div>
    );
  }

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
            <Route
              path="/custom-work-order"
              element={<CustomWorkOrderReceipt workOrder={{}} />}
            />
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
