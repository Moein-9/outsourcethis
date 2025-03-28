
import React, { useState, useEffect } from "react";
import { Clock, RefreshCcw, Home, User, FileText, Package, Wallet, Search } from 'lucide-react';
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

  const menuItems = [
    { id: "dashboard", label: t('dashboard'), icon: <Home className="h-4 w-4" /> },
    { id: "createClient", label: t('createClient'), icon: <User className="h-4 w-4" /> },
    { id: "createInvoice", label: t('createInvoice'), icon: <FileText className="h-4 w-4" /> },
    { id: "inventory", label: t('inventory'), icon: <Package className="h-4 w-4" /> },
    { id: "remainingPayments", label: t('remainingPayments'), icon: <Wallet className="h-4 w-4" /> },
    { id: "patientSearch", label: t('patientSearch'), icon: <Search className="h-4 w-4" /> },
    { id: "refundExchange", label: t('refundExchange') || "Exchange & Refunds", icon: <RefreshCcw className="h-4 w-4" /> },
  ];

  return (
    <div className={`${dirClassName} min-h-screen bg-gray-50 font-cairo`}>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-10 px-4 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <MoenLogo 
            className="h-10 w-auto cursor-pointer" 
            onClick={handleHomeNavigation}
          />
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="flex items-center gap-2 font-medium text-foreground/80 bg-gray-100 rounded-full px-3 py-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Side Navigation */}
        <nav className={`fixed top-16 ${language === 'ar' ? 'right-0' : 'left-0'} bottom-0 w-56 bg-white border-${language === 'ar' ? 'l' : 'r'} border-gray-200 shadow-sm z-10 overflow-y-auto`}>
          <div className="p-3 space-y-1">
            {menuItems.map((item) => (
              <Button 
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"} 
                onClick={() => item.id === "dashboard" ? handleHomeNavigation() : handleSectionNavigation(item.id)}
                className={`w-full justify-${language === 'ar' ? 'end' : 'start'} ${activeSection === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'}`}
              >
                <span className={`flex items-center w-full ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </Button>
            ))}
          </div>
        </nav>
        
        <main className={`flex-1 ${language === 'ar' ? 'mr-56' : 'ml-56'} mt-16 p-6`}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
