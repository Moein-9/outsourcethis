
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  RefreshCcw, 
  ArrowRight, 
  Users, 
  FileText, 
  Package, 
  CreditCard, 
  Search, 
  Calendar,
  BarChart3
} from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CollapsibleCard } from "@/components/ui/collapsible-card";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore();
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigateToSection = (section: string) => {
    // Find the closest parent component with id "root" and dispatch a custom event
    const rootElement = document.getElementById('root');
    if (rootElement) {
      const event = new CustomEvent('navigate', { detail: { section } });
      rootElement.dispatchEvent(event);
    }
  };

  const statCards = [
    {
      title: language === 'ar' ? 'العملاء' : 'Patients',
      value: patients.length,
      icon: Users,
      color: 'bg-teal-50 text-teal-500',
      onClick: () => navigateToSection('patientSearch')
    },
    {
      title: language === 'ar' ? 'الإطارات' : 'Frames',
      value: frames.length,
      icon: Package,
      color: 'bg-teal-50 text-teal-500',
      onClick: () => navigateToSection('inventory')
    },
    {
      title: language === 'ar' ? 'المواعيد اليوم' : 'Today\'s Appointments',
      value: 5, // Example value
      icon: Calendar,
      color: 'bg-teal-50 text-teal-500',
      onClick: () => {}
    },
  ];

  const quickActions = [
    {
      title: language === 'ar' ? 'إنشاء عميل جديد' : 'New Patient',
      description: language === 'ar' ? 'إضافة عميل جديد إلى النظام' : 'Add a new patient to the system',
      icon: Users,
      color: 'bg-teal-500',
      onClick: () => navigateToSection('createClient')
    },
    {
      title: language === 'ar' ? 'إنشاء فاتورة' : 'New Invoice',
      description: language === 'ar' ? 'إنشاء فاتورة جديدة' : 'Create a new invoice',
      icon: FileText,
      color: 'bg-teal-500',
      onClick: () => navigateToSection('createInvoice')
    },
    {
      title: language === 'ar' ? 'المدفوعات المتبقية' : 'Remaining Payments',
      description: language === 'ar' ? 'عرض المدفوعات المتبقية' : 'View remaining payments',
      icon: CreditCard,
      color: 'bg-teal-500',
      onClick: () => navigateToSection('remainingPayments')
    },
    {
      title: language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges',
      description: language === 'ar' ? 'معالجة استرداد الأموال واستبدال المنتجات' : 'Process refunds and exchanges',
      icon: RefreshCcw,
      color: 'bg-teal-500',
      onClick: () => navigateToSection('refundManager')
    },
  ];

  const rtlClass = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={`py-4 space-y-6 ${rtlClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={card.onClick}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-3xl font-bold force-ltr-numbers">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-full`}>
                <card.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CollapsibleCard 
        title={language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'} 
        defaultOpen={true}
        className="mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow duration-300 cursor-pointer border-2 border-transparent hover:border-teal-100"
              onClick={action.onClick}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`${action.color} p-3 rounded-full mb-4 text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleCard>
    </div>
  );
};
