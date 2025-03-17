
import React, { useState, useEffect } from "react";
import { Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoenLogo } from "@/assets/logo";

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

  return (
    <div className="rtl min-h-screen bg-background font-cairo">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-10 px-4 py-2 flex justify-between items-center">
        <MoenLogo 
          className="h-10 w-auto cursor-pointer" 
          onClick={handleHomeNavigation}
        />
        <div className="flex space-x-2 space-x-reverse">
          <Button 
            variant={activeSection === "dashboard" ? "default" : "outline"} 
            onClick={handleHomeNavigation}
          >
            الرئيسية
          </Button>
          <Button 
            variant={activeSection === "createClient" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("createClient")}
          >
            إنشاء عميل
          </Button>
          <Button 
            variant={activeSection === "createInvoice" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("createInvoice")}
          >
            إنشاء فاتورة
          </Button>
          <Button 
            variant={activeSection === "inventory" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("inventory")}
          >
            إدارة المخزون
          </Button>
          <Button 
            variant={activeSection === "remainingPayments" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("remainingPayments")}
          >
            المتبقي
          </Button>
          <Button 
            variant={activeSection === "patientSearch" ? "default" : "outline"} 
            onClick={() => handleSectionNavigation("patientSearch")}
          >
            بحث عن عميل
          </Button>
        </div>
        <div className="flex items-center gap-2 font-medium text-foreground/80">
          <Clock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString('en-US')}</span>
        </div>
      </header>
      <main className="container mx-auto pt-20 pb-6">
        {children}
      </main>
    </div>
  );
};
