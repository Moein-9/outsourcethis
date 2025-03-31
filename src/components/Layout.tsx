
import React from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

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
  return (
    <DashboardSidebar
      activeSection={activeSection}
      onNavigate={onNavigate}
    >
      {children}
    </DashboardSidebar>
  );
};
