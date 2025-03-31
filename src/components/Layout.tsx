
import React from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useLanguageStore } from "@/store/languageStore";

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
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <div className={isRtl ? 'rtl-language' : 'ltr-language'}>
      <DashboardSidebar
        activeSection={activeSection}
        onNavigate={onNavigate}
      >
        {children}
      </DashboardSidebar>
    </div>
  );
};
