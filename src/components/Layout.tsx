
import React, { useState, useEffect } from "react";
import { Clock, Menu, X, Home, UserPlus, ShoppingCart, Package2, Receipt, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoenLogo } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "./LanguageToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handler for home navigation
  const handleHomeNavigation = () => {
    navigate("/");
    onNavigate("dashboard");
    setIsMobileOpen(false);
  };

  // Handler for other navigation items
  const handleSectionNavigation = (section: string) => {
    onNavigate(section);
    setIsMobileOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: t('dashboard'), icon: Home },
    { id: "createClient", label: t('createClient'), icon: UserPlus },
    { id: "createInvoice", label: t('createInvoice'), icon: ShoppingCart },
    { id: "inventory", label: t('inventory'), icon: Package2 },
    { id: "remainingPayments", label: t('remainingPayments'), icon: Receipt },
    { id: "patientSearch", label: t('patientSearch'), icon: Users }
  ];

  const dirClassName = isRtl ? 'rtl' : 'ltr';

  return (
    <div className={`${dirClassName} min-h-screen bg-background font-cairo`}>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50 px-4 py-2 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <MoenLogo 
              className="h-10 w-auto cursor-pointer" 
              onClick={handleHomeNavigation}
            />
            
            {/* Desktop Navigation */}
            <div className={`hidden md:flex ${isRtl ? 'mr-6 space-x-2 space-x-reverse' : 'ml-6 space-x-2'}`}>
              {navItems.map((item) => (
                <Button 
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "outline"} 
                  onClick={() => handleSectionNavigation(item.id)}
                  className="whitespace-nowrap relative group"
                  size="sm"
                >
                  <item.icon className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <div className="hidden md:flex items-center gap-2 font-medium text-foreground/80">
              <Clock className="h-4 w-4" />
              <span className="force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</span>
            </div>
            
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isRtl ? "right" : "left"} className="w-[250px] sm:max-w-sm">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <MoenLogo className="h-8 w-auto" />
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Button 
                        key={item.id}
                        variant={activeSection === item.id ? "default" : "ghost"} 
                        onClick={() => handleSectionNavigation(item.id)}
                        className="justify-start"
                      >
                        <item.icon className={`h-4 w-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                        {item.label}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-6 flex justify-between items-center">
                    <LanguageToggle />
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto pt-20 pb-6 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
