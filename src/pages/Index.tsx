
import React, { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { CreateClient } from "@/components/CreateClient";
import CreateInvoice from "@/components/CreateInvoice";
import { Inventory } from "@/components/Inventory";
import { InventoryTabs } from "@/components/InventoryTabs";
import { RemainingPayments } from "@/components/RemainingPayments";
import { PatientSearch } from "@/components/PatientSearch";
import { useLocation } from "react-router-dom";
import { useLanguageStore } from "@/store/languageStore";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const location = useLocation();
  const { language } = useLanguageStore();
  
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
    </Layout>
  );
};

export default Index;
