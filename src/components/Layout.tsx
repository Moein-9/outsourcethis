
import React from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { InventoryInitializer } from './InventoryInitializer';

interface LayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export const Layout = ({ children, activeSection = "dashboard", onNavigate = () => {} }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <InventoryInitializer />
      <DashboardSidebar activeSection={activeSection} onNavigate={onNavigate}>
        {children}
      </DashboardSidebar>
    </div>
  );
};
