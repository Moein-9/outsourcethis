
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { CustomWorkOrderReceipt } from "./components/CustomWorkOrderReceipt";
import { LensDebugger } from "./components/LensDebugger";

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
  // We're removing the automatic call to resetLensPricing
  // This ensures that your pricing data persists between refreshes
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
