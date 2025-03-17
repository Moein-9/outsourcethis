
import React, { useState, useEffect } from "react";
import { Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeSection, 
  onNavigate 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNavigate = (section: string) => {
    if (section === "dashboard") {
      navigate("/");
    } else {
      onNavigate(section);
    }
  };

  return (
    <div className={`min-h-screen bg-background font-cairo ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className={`fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-10 px-4 py-2 flex justify-between items-center`}>
        <div className="font-bold text-xl">{t("system_name")}</div>
        <div className={`flex ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
          <Button 
            variant={activeSection === "dashboard" ? "default" : "outline"} 
            onClick={() => handleNavigate("dashboard")}
          >
            {t("dashboard")}
          </Button>
          <Button 
            variant={activeSection === "createClient" ? "default" : "outline"} 
            onClick={() => handleNavigate("createClient")}
          >
            {t("create_client")}
          </Button>
          <Button 
            variant={activeSection === "createInvoice" ? "default" : "outline"} 
            onClick={() => handleNavigate("createInvoice")}
          >
            {t("create_invoice")}
          </Button>
          <Button 
            variant={activeSection === "inventory" ? "default" : "outline"} 
            onClick={() => handleNavigate("inventory")}
          >
            {t("inventory")}
          </Button>
          <Button 
            variant={activeSection === "remainingPayments" ? "default" : "outline"} 
            onClick={() => handleNavigate("remainingPayments")}
          >
            {t("remaining")}
          </Button>
          <Button 
            variant={activeSection === "patientSearch" ? "default" : "outline"} 
            onClick={() => handleNavigate("patientSearch")}
          >
            {t("search_patient")}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <div className="flex items-center gap-2 font-medium text-foreground/80">
            <Clock className="h-4 w-4" />
            <span>{currentTime.toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto pt-20 pb-6">
        {children}
      </main>
    </div>
  );
};
