
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
  Store,
  ScrollText,
  Eye
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
import { format } from "date-fns";

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

  const navigateToEyeExam = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // Create an event to navigate to createInvoice
      const navigateEvent = new CustomEvent('navigate', { 
        detail: { section: 'createInvoice' } 
      });
      rootElement.dispatchEvent(navigateEvent);
      
      // Wait a bit for the navigation to complete, then set the invoice type to exam
      setTimeout(() => {
        // Find the "exam" radio button and click it
        const examRadioButton = document.querySelector('input[value="exam"]');
        if (examRadioButton instanceof HTMLElement) {
          examRadioButton.click();
        }
      }, 100);
    }
  };

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
      color: 'bg-blue-500',
      onClick: () => navigateToSection('createInvoice')
    },
    {
      title: language === 'ar' ? 'فحص نظر' : 'Eye Exam',
      description: language === 'ar' ? 'إجراء فحص نظر جديد' : 'Perform a new eye exam',
      icon: Eye,
      color: 'bg-purple-500',
      onClick: navigateToEyeExam
    },
    {
      title: language === 'ar' ? 'البحث عن عميل' : 'Search Patient',
      description: language === 'ar' ? 'البحث عن عميل' : 'Search for a patient',
      icon: Search,
      color: 'bg-green-500',
      onClick: () => navigateToSection('patientSearch')
    },
    {
      title: language === 'ar' ? 'إدارة المخزون' : 'Inventory',
      description: language === 'ar' ? 'إدارة مخزون النظارات والعدسات' : 'Manage glasses and lenses inventory',
      icon: Package,
      color: 'bg-amber-500',
      onClick: () => navigateToSection('inventory')
    },
    {
      title: language === 'ar' ? 'المواعيد' : 'Appointments',
      description: language === 'ar' ? 'عرض وإدارة مواعيد اليوم' : 'View and manage today\'s appointments',
      icon: Calendar,
      color: 'bg-red-500',
      onClick: () => navigateToSection('appointments')
    }
  ];

  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';

  return (
    <div className={`${dirClass} py-4 max-w-6xl mx-auto`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md border mt-1">
            <MoenLogoGreen className="h-12 w-12" />
          </div>
          <div>
            <h1 className={`text-2xl font-semibold ${textAlignClass}`}>
              {language === 'ar' ? 'مرحباً بك في مركز النظارات!' : 'Welcome to Moen Optics!'}
            </h1>
            <p className={`text-sm text-muted-foreground mt-1 ${textAlignClass}`}>
              {format(currentTime, language === 'ar' ? 'EEEE, dd MMMM yyyy' : 'EEEE, MMMM dd, yyyy')} | {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <LanguageToggle />
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-5">
            <div className="flex justify-between items-center mb-1">
              <CardTitle className={`text-lg font-semibold ${textAlignClass}`}>
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </CardTitle>
              <RefreshCcw className="h-4 w-4 text-gray-500" />
            </div>
            <p className={`text-sm text-muted-foreground ${textAlignClass}`}>
              {language === 'ar' ? 'إدارة عملياتك الأكثر استخدامًا' : 'Manage your most common operations'}
            </p>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <div 
                  key={index}
                  onClick={action.onClick}
                  className="relative overflow-hidden border group cursor-pointer rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
                >
                  <div className="flex justify-between mb-2">
                    <div className={`${action.color} p-2 rounded-lg text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="absolute -right-3 -top-3 bg-gray-100 rounded-full p-8 opacity-10 group-hover:scale-110 transition-transform"></div>
                  </div>
                  <h3 className={`font-medium mt-1.5 ${textAlignClass}`}>{action.title}</h3>
                  <p className={`text-sm text-muted-foreground mt-1 ${textAlignClass}`}>
                    {action.description}
                  </p>
                  <div className={`mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex ${language === 'ar' ? 'justify-start' : 'justify-end'} items-center`}>
                    <span className="text-sm font-medium mr-1">{language === 'ar' ? 'بدء' : 'Start'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CollapsibleCard
            title={language === 'ar' ? 'إحصائيات' : 'Statistics'}
            description={language === 'ar' ? 'نظرة عامة على النشاط' : 'Activity overview'}
            className="col-span-2"
            defaultOpen
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className={`text-sm font-medium text-green-800 mb-2 ${textAlignClass}`}>
                  {language === 'ar' ? 'العملاء' : 'Patients'}
                </h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-green-700">{patients.length || 0}</span>
                  <span className="text-sm text-green-600 ml-2">
                    {language === 'ar' ? 'عميل' : 'patients'}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className={`text-sm font-medium text-blue-800 mb-2 ${textAlignClass}`}>
                  {language === 'ar' ? 'المخزون' : 'Inventory'}
                </h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-700">{frames.length || 0}</span>
                  <span className="text-sm text-blue-600 ml-2">
                    {language === 'ar' ? 'إطار' : 'frames'}
                  </span>
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h4 className={`text-sm font-medium text-amber-800 mb-2 ${textAlignClass}`}>
                  {language === 'ar' ? 'المبيعات' : 'Sales'}
                </h4>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-amber-700">-</span>
                  <span className="text-sm text-amber-600 ml-2">
                    {language === 'ar' ? 'د.ك' : 'KWD'}
                  </span>
                </div>
              </div>
            </div>
          </CollapsibleCard>
          
          <CollapsibleCard
            title={language === 'ar' ? 'إشعارات' : 'Notifications'}
            description={language === 'ar' ? 'أحدث التحديثات' : 'Latest updates'}
            defaultOpen
          >
            <div className="p-4">
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-800">
                  <p className={`text-sm ${textAlignClass}`}>
                    {language === 'ar' 
                      ? 'مرحبًا بك في نسخة المعاينة من نظام مون للبصريات' 
                      : 'Welcome to the preview version of Moen Optics system'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-600">
                  <p className={`text-sm ${textAlignClass}`}>
                    {language === 'ar' 
                      ? 'يمكنك إنشاء واختبار العديد من الميزات' 
                      : 'You can create and test various features'}
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </div>
    </div>
  );
};
