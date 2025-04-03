
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  Package, 
  CreditCard, 
  Search, 
  RefreshCcw, 
  BarChart3, 
  Settings,
  HelpCircle,
  FileInvoice
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { MoenLogo } from "@/assets/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/LanguageToggle";
import { HelpCenter } from "@/components/HelpCenter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const DashboardSidebar = ({ activeSection, onNavigate, children }: { 
  activeSection: string; 
  onNavigate: (section: string) => void;
  children: React.ReactNode;
}) => {
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = language === 'ar';
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Set active section based on route
  useEffect(() => {
    if (location.pathname === "/supplier-invoices" && activeSection !== "supplierInvoice") {
      onNavigate("supplierInvoice");
    }
  }, [location.pathname, activeSection, onNavigate]);
  
  const menuItems = [
    {
      icon: Home,
      label: t('dashboard'),
      section: "dashboard",
    },
    {
      icon: Users,
      label: t('createClient'),
      section: "createClient",
    },
    {
      icon: FileText,
      label: t('createInvoice'),
      section: "createInvoice",
    },
    {
      icon: Package,
      label: t('inventory'),
      section: "inventory",
    },
    {
      icon: CreditCard,
      label: t('remainingPayments'),
      section: "remainingPayments",
    },
    {
      icon: Search,
      label: t('patientSearch'),
      section: "patientSearch",
    },
    {
      icon: RefreshCcw,
      label: language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges',
      section: "refundManager",
    },
    {
      icon: FileInvoice,
      label: language === 'ar' ? 'فواتير الموردين' : 'Supplier Invoices',
      section: "supplierInvoice",
      action: () => {
        onNavigate("supplierInvoice");
      },
    },
    {
      icon: BarChart3,
      label: t('reportsPage'),
      section: "reports",
      action: () => navigate("/reports"),
    },
  ];

  const handleNavigation = (section: string, customAction?: () => void) => {
    if (customAction) {
      customAction();
    } else {
      onNavigate(section);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen flex w-full ${isRtl ? 'rtl-language' : 'ltr-language'}`} 
           style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <Sidebar side={isRtl ? 'right' : 'left'}>
          <SidebarHeader className="flex items-center justify-center py-4">
            <MoenLogo className="h-10 w-auto" />
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-sidebar-foreground/60">
                {t('menu')}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.section || item.label}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={item.section === activeSection}
                        onClick={() => handleNavigation(item.section, item.action)}
                        className={isRtl ? "flex-row-reverse" : ""}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex flex-col gap-3">
              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-10 h-10 border-2 border-sidebar-primary">
                  <AvatarFallback className="bg-teal-500 text-white">MH</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                  <p className="text-xs text-sidebar-foreground/70">Moen Optical</p>
                </div>
                <div className={`${isRtl ? 'mr-auto' : 'ml-auto'} flex gap-2`}>
                  <button 
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    onClick={() => setHelpOpen(true)}
                    aria-label="Help"
                    title={isRtl ? "مساعدة" : "Help"}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <LanguageToggle />
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <div className="p-3 md:p-5 lg:p-6">
            <div className={`flex items-center ${isRtl ? 'flex-row-reverse' : 'flex-row'} justify-between mb-6`}>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                <SidebarTrigger className="text-primary" />
                <h1 className="text-xl font-bold text-primary">{
                  activeSection === "dashboard" ? t('dashboard') :
                  activeSection === "createClient" ? t('createClient') :
                  activeSection === "createInvoice" ? t('createInvoice') :
                  activeSection === "inventory" ? t('inventory') :
                  activeSection === "remainingPayments" ? t('remainingPayments') :
                  activeSection === "patientSearch" ? t('patientSearch') :
                  activeSection === "refundManager" ? 
                    (language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges') :
                  activeSection === "supplierInvoice" ?
                    (language === 'ar' ? 'فواتير الموردين' : 'Supplier Invoices') :
                  activeSection === "reports" ? 
                    (language === 'ar' ? 'التقارير' : 'Reports') :
                  t('dashboard')
                }</h1>
              </div>
              <div className="hidden md:block">
                <LanguageToggle />
              </div>
            </div>
            <div className={`w-full ${isRtl ? 'rtl-content' : 'ltr-content'}`}>
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Dialog */}
      <HelpCenter open={helpOpen} onOpenChange={setHelpOpen} />
    </SidebarProvider>
  );
};
