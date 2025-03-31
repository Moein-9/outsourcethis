
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{language === 'ar' ? 'آخر المعاملات' : 'Recent Transactions'}</span>
              <Button variant="ghost" size="sm" className="text-primary">
                <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
                <ArrowRight className={`h-4 w-4 ml-1 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="border p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Patient {index + 1}</p>
                    <p className="text-sm text-muted-foreground">Invoice #{1000 + index}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold force-ltr-numbers">$299.99</p>
                    <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'ar' ? 'التقارير السريعة' : 'Quick Reports'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => navigate("/reports")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تقرير المبيعات اليومية' : 'Daily Sales Report'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => navigate("/reports")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تحليل مقارن' : 'Comparative Analysis'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => navigate("/reports")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تقرير المخزون' : 'Inventory Report'}
            </Button>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gold-500 hover:bg-gold-600"
              onClick={() => navigate("/reports")}
            >
              {language === 'ar' ? 'جميع التقارير' : 'All Reports'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
