
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  Package, 
  CreditCard, 
  Search, 
  RefreshCcw, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { MoenLogo } from "@/assets/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      icon: BarChart3,
      label: t('reportsPage'),
      action: () => navigate("/reports"),
    },
  ];

  const handleNavigation = (section: string) => {
    onNavigate(section);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <Sidebar>
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
                        onClick={() => item.action ? item.action() : handleNavigation(item.section)}
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
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-sidebar-primary">
                <AvatarImage src="/lovable-uploads/d1f7203d-68c5-44fb-b0a8-41330d9b48fc.png" />
                <AvatarFallback className="bg-teal-500 text-white">MO</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70">Moen Optical</p>
              </div>
              <button className="ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
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
                t('dashboard')
              }</h1>
            </div>
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
