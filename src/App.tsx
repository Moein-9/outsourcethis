
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import ReportPage from './pages/ReportPage';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { CreateInvoiceExtended } from './components/CreateInvoiceExtended';

// Wrapper component to handle Layout props
const LayoutWrapper = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const location = useLocation();

  // Update active section based on route
  React.useEffect(() => {
    if (location.pathname === '/') {
      setActiveSection("dashboard");
    } else if (location.pathname === '/reports') {
      setActiveSection("reports");
    } else if (location.pathname === '/create-invoice') {
      setActiveSection("createInvoice");
    }
  }, [location]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <Layout activeSection={activeSection} onNavigate={handleNavigate}>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutWrapper />}>
            <Route index element={<Index />} />
            <Route path="reports" element={<ReportPage />} />
            <Route path="create-invoice" element={<CreateInvoiceExtended />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
