
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
      <div className="flex flex-1">
        <DashboardSidebar />
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
