import React from 'react';
import { useThemeStore } from '@/store/themeStore';
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { ModeToggle } from "@/components/mode-toggle"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { MobileNav } from "@/components/mobile-nav"
import { InventoryInitializer } from './InventoryInitializer';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <InventoryInitializer />
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <MobileNav />
          <MainNav className="mx-6" />
          <div className="flex items-center space-x-2">
            <ModeToggle />
          </div>
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <TailwindIndicator />
    </div>
  );
};
