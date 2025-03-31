
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/LanguageProvider";
import { StoreLocationProvider } from "@/store/storeLocationStore";

// Import your page components
import HomePage from "./pages/index";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import SalesPage from "./pages/SalesPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import NewPatientPage from "./pages/NewPatientPage";
import NewSalePage from "./pages/NewSalePage";
import SettingsPage from "./pages/SettingsPage";
import PrintLabelPage from "./pages/PrintLabelPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import WorkOrdersPage from "./pages/WorkOrdersPage";
import WorkOrderDetailsPage from "./pages/WorkOrderDetailsPage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InvoiceProvider } from "@/store/invoiceStore";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <LanguageProvider>
          <StoreLocationProvider>
            <AuthProvider>
              <InvoiceProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/inventory" element={
                    <ProtectedRoute>
                      <InventoryPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales" element={
                    <ProtectedRoute>
                      <SalesPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/new" element={
                    <ProtectedRoute>
                      <NewSalePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/sales/:invoiceId" element={
                    <ProtectedRoute>
                      <InvoiceDetailsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/patients" element={
                    <ProtectedRoute>
                      <PatientsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/patients/new" element={
                    <ProtectedRoute>
                      <NewPatientPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/patients/:patientId" element={
                    <ProtectedRoute>
                      <PatientDetailsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/work-orders" element={
                    <ProtectedRoute>
                      <WorkOrdersPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/work-orders/:workOrderId" element={
                    <ProtectedRoute>
                      <WorkOrderDetailsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/print-labels" element={
                    <ProtectedRoute>
                      <PrintLabelPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster />
                <SonnerToaster position="top-right" expand={false} richColors />
              </InvoiceProvider>
            </AuthProvider>
          </StoreLocationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
