
import React, { useEffect } from "react";
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

// Update the primary colors in the document root
document.documentElement.style.setProperty('--primary', '39.6 73.5% 56.7%'); // Golden color
document.documentElement.style.setProperty('--sidebar-background', '180 50% 30%'); // Teal/green color
document.documentElement.style.setProperty('--sidebar-primary', '39.6 73.5% 56.7%'); // Golden color for sidebar

const Index = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const location = useLocation();
  const { language, setLanguage } = useLanguageStore();
  
  // Check if we have state passed from navigation
  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state]);

  // Add event listener for custom navigation events
  useEffect(() => {
    const handleNavigate = (event: any) => {
      if (event.detail && event.detail.section) {
        setActiveSection(event.detail.section);
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
      {activeSection === "remainingPayments" && <RemainingPayments />}
      {activeSection === "patientSearch" && <PatientSearch />}
      {activeSection === "refundManager" && <RefundManager />}
    </Layout>
  );
};

export default Index;
