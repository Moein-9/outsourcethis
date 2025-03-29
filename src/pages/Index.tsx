
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { CreateClient } from "@/components/CreateClient";
import { CreateInvoice } from "@/components/CreateInvoice";
import { InventoryTabs } from "@/components/InventoryTabs";
import { RemainingPayments } from "@/components/RemainingPayments";
import { PatientSearch } from "@/components/PatientSearch";
import { RefundManager } from "@/components/RefundManager";
import { useLocation } from "react-router-dom";
import { useLanguageStore } from "@/store/languageStore";
import { useInvoiceStore } from "@/store/invoiceStore";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const location = useLocation();
  const { language, setLanguage } = useLanguageStore();
  const { invoices } = useInvoiceStore();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  
  // Check if we have state passed from navigation
  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
    
    // If there's an invoiceId in the state, set it
    if (location.state?.invoiceId) {
      setSelectedInvoiceId(location.state.invoiceId);
    }
  }, [location.state]);

  // Add event listener for custom navigation events
  useEffect(() => {
    const handleNavigate = (event: any) => {
      if (event.detail && event.detail.section) {
        setActiveSection(event.detail.section);
      }
      
      // If there's an invoiceId in the event detail, set it
      if (event.detail && event.detail.invoiceId) {
        setSelectedInvoiceId(event.detail.invoiceId);
      }
    };

    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.addEventListener('navigate', handleNavigate);
    }

    return () => {
      if (rootElement) {
        rootElement.removeEventListener('navigate', handleNavigate);
      }
    };
  }, []);
  
  // Set a default invoiceId if we don't have one and we're on the remainingPayments section
  useEffect(() => {
    if (activeSection === "remainingPayments" && !selectedInvoiceId && invoices.length > 0) {
      // Find the first unpaid invoice
      const unpaidInvoice = invoices.find(invoice => !invoice.isPaid);
      if (unpaidInvoice) {
        setSelectedInvoiceId(unpaidInvoice.invoiceId);
      } else {
        // If no unpaid invoice, just use the first one
        setSelectedInvoiceId(invoices[0].invoiceId);
      }
    }
  }, [activeSection, selectedInvoiceId, invoices]);

  // Update document's direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Apply RTL or LTR class to the body for global styling
    if (language === 'ar') {
      document.body.classList.add('rtl-language');
      document.body.classList.remove('ltr-language');
    } else {
      document.body.classList.add('ltr-language');
      document.body.classList.remove('rtl-language');
    }
  }, [language]);

  return (
    <Layout
      activeSection={activeSection}
      onNavigate={setActiveSection}
    >
      {activeSection === "dashboard" && <Dashboard />}
      {activeSection === "createClient" && <CreateClient />}
      {activeSection === "createInvoice" && <CreateInvoice />}
      {activeSection === "inventory" && <InventoryTabs />}
      {activeSection === "remainingPayments" && selectedInvoiceId && <RemainingPayments invoiceId={selectedInvoiceId} />}
      {activeSection === "patientSearch" && <PatientSearch />}
      {activeSection === "refundManager" && <RefundManager />}
    </Layout>
  );
};

export default Index;
