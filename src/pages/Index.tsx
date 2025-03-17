
import React from "react";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/components/Dashboard";
import { CreateClient } from "@/components/CreateClient";
import { CreateInvoice } from "@/components/CreateInvoice";
import { Inventory } from "@/components/Inventory";
import { RemainingPayments } from "@/components/RemainingPayments";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");

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
    </Layout>
  );
};

export default Index;
