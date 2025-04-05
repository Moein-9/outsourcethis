
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
import { TabsContent } from "@/components/ui/tabs";
import { FrameInventoryContextDecorator } from "@/components/FrameInventoryContextDecorator";
import { Contact } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = React.useState("dashboard");
  const [selectedTab, setSelectedTab] = useState("frames");
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
      {activeSection === "inventory" && (
        <div className="container mx-auto px-4 py-8">
          <InventoryTabs 
            defaultValue={selectedTab} 
            onValueChange={setSelectedTab}
          >
            <TabsContent value="frames">
              <FrameInventoryContextDecorator />
            </TabsContent>
            
            <TabsContent value="lenses">
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Lens Inventory</h2>
                <p className="text-gray-500">Lens inventory management coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <div className="p-8 text-center">
                <Contact className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Contact Lens Inventory</h2>
                <p className="text-gray-500">Contact lens inventory management coming soon</p>
              </div>
            </TabsContent>
            
            <TabsContent value="services">
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Services</h2>
                <p className="text-gray-500">Service management coming soon</p>
              </div>
            </TabsContent>
          </InventoryTabs>
        </div>
      )}
      {activeSection === "remainingPayments" && <RemainingPayments />}
      {activeSection === "patientSearch" && <PatientSearch />}
      {activeSection === "refundManager" && <RefundManager />}
    </Layout>
  );
};

export default Index;
