
import React, { useState, useEffect } from "react";
import { Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoenLogo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "./LanguageToggle";

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
  const { t, language } = useLanguageStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simplified navigation handler that ensures we always go to the home page
  // when clicking the dashboard button
  const handleHomeNavigation = () => {
    navigate("/");
    onNavigate("dashboard");
  };

  // Handler for other navigation items
  const handleSectionNavigation = (section: string) => {
    onNavigate(section);
  };

  const dirClassName = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={`${dirClassName} min-h-screen bg-background font-cairo`}>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-10 px-4 py-2 flex justify-between items-center">
        <MoenLogo 
          className="h-10 w-auto cursor-pointer" 
          onClick={handleHomeNavigation}
        />
        <div className={`flex ${language === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'}`}>
          <Button 
            variant={activeSection === "dashboard" ? "default" : "outline"} 
            onClick={handleHomeNavigation}
            className="whitespace-nowrap"
          >
            {t('dashboard')}
          </Button>
          <Button 
            variant={activeSection === "createClient" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("createClient")}
            className="whitespace-nowrap"
          >
            {t('createClient')}
          </Button>
          <Button 
            variant={activeSection === "createInvoice" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("createInvoice")}
            className="whitespace-nowrap"
          >
            {t('createInvoice')}
          </Button>
          <Button 
            variant={activeSection === "inventory" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("inventory")}
            className="whitespace-nowrap"
          >
            {t('inventory')}
          </Button>
          <Button 
            variant={activeSection === "remainingPayments" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("remainingPayments")}
            className="whitespace-nowrap"
          >
            {t('remainingPayments')}
          </Button>
          <Button 
            variant={activeSection === "patientSearch" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("patientSearch")}
            className="whitespace-nowrap"
          >
            {t('patientSearch')}
          </Button>
          <Button 
            variant={activeSection === "refundManager" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("refundManager")}
            className="whitespace-nowrap"
          >
            {language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges'}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <div className="flex items-center gap-2 font-medium text-foreground/80">
            <Clock className="h-4 w-4" />
            <span className="force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto pt-20 pb-6">
        {children}
      </main>
    </div>
  );
};
