
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, BarChart3, Settings } from "lucide-react"
import { useLanguageStore } from "@/store/languageStore";
import { useNavigate, useLocation } from "react-router-dom";

export function DashboardSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const navigate = useNavigate();
  
  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 max-w-[300px]">
        <Sidebar />
      </SheetContent>
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
    </Sheet>
  )
}

function Sidebar() {
  const navigate = useNavigate();
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  const { pathname } = useLocation();

  const menuItems = [
    {
      title: isRtl ? 'الرئيسية' : 'Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/'
    },
    {
      title: isRtl ? 'التقارير' : 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/reports'
    },
    {
      title: isRtl ? 'إدارة النظام' : 'System',
      icon: <Settings className="w-5 h-5" />,
      path: '/system'
    },
  ];

  return (
    <div className="flex flex-col h-full p-3 w-full bg-secondary">
      <div className="px-6 py-4">
        <h2 className="font-semibold text-sm">
          {t('menu')}
        </h2>
      </div>
      <div className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Button
                variant="ghost"
                className={`w-full justify-start font-normal ${pathname === item.path ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground' : 'hover:bg-secondary/50'}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2 text-sm">
                  {item.title}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
