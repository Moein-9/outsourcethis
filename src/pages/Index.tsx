
import React from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { CreateClient } from "@/components/CreateClient";
import CreateInvoice from "@/components/CreateInvoice";
import { Inventory } from "@/components/Inventory";
import { RemainingPayments } from "@/components/RemainingPayments";
import { PatientSearch } from "@/components/PatientSearch";
import { useLocation } from "react-router-dom";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const location = useLocation();
  
  // Check if we have state passed from navigation
  React.useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
  }, [location.state]);

  return (
    <Layout
      activeSection={activeSection}
      onNavigate={setActiveSection}
    >
      {activeSection === "dashboard" && <Dashboard />}
      {activeSection === "createClient" && <CreateClient />}
      {activeSection === "createInvoice" && <CreateInvoice />}
      {activeSection === "inventory" && <Inventory />}
      {activeSection === "remainingPayments" && <RemainingPayments />}
      {activeSection === "patientSearch" && <PatientSearch />}
    </Layout>
  );
};

export default Index;
