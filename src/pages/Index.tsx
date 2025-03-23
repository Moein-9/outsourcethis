
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { CreateClient } from "@/components/CreateClient";
import CreateInvoice from "@/components/CreateInvoice";
import { InventoryTabs } from "@/components/InventoryTabs";
import { RemainingPayments } from "@/components/RemainingPayments";
import { PatientSearch } from "@/components/PatientSearch";
import { useLocation } from "react-router-dom";
import { useLanguageStore } from "@/store/languageStore";
import { AnimatedAppWrapper } from "@/components/ui/AnimatedAppWrapper";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const location = useLocation();
  const { language, setLanguage } = useLanguageStore();
  
  // Check if we have state passed from navigation
  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state]);

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
    <AnimatedAppWrapper>
      <Layout
        activeSection={activeSection}
        onNavigate={setActiveSection}
      >
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "createClient" && <CreateClient />}
        {activeSection === "createInvoice" && <CreateInvoice />}
        {activeSection === "inventory" && <InventoryTabs />}
        {activeSection === "remainingPayments" && 
          <RemainingPayments 
            // @ts-ignore - Handle this correctly in the RemainingPayments component
            selectedInvoiceId={location.state?.selectedInvoice} 
          />
        }
        {activeSection === "patientSearch" && <PatientSearch />}
      </Layout>
    </AnimatedAppWrapper>
  );
};

export default Index;
