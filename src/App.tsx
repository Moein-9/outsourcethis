
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import ReportPage from './pages/ReportPage';
import NotFound from './pages/NotFound';
import { Toaster } from 'sonner';
import { CreateInvoiceExtended } from './components/CreateInvoiceExtended';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
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
