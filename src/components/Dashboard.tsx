
import React, { useState } from "react";
import { Clock, RefreshCcw, MapPin, Calendar, Users, Search, Filter, ArrowRight } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleCard } from "@/components/ui/collapsible-card";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore();
  const { t, language } = useLanguageStore();
  const [selectedTrip, setSelectedTrip] = useState("roundTrip");

  // Mock flight data
  const flights = [
    {
      id: 1,
      airline: "Emirates",
      logoSrc: "/lovable-uploads/d4545e9a-c0f6-4b13-bc06-36c615779360.png",
      from: "JFK",
      to: "BOM",
      departureTime: "13:00",
      arrivalTime: "14:20",
      flightType: "NON-STOP",
      price: "$1,572",
      date: "FTH 25th"
    },
    {
      id: 2,
      airline: "Qatar Airways",
      logoSrc: "/lovable-uploads/d4545e9a-c0f6-4b13-bc06-36c615779360.png",
      from: "JFK",
      to: "BOM",
      departureTime: "13:00",
      arrivalTime: "14:20",
      flightType: "NON-STOP",
      price: "$2,072",
      date: "TH 22nd"
    },
    {
      id: 3,
      airline: "Lufthansa",
      logoSrc: "/lovable-uploads/d4545e9a-c0f6-4b13-bc06-36c615779360.png",
      from: "JFK",
      to: "BOM",
      departureTime: "13:00",
      arrivalTime: "14:20",
      flightType: "NON-STOP",
      price: "$1,872",
      date: "FTH 25th"
    }
  ];

  return (
    <div className="py-4 space-y-6">
      {/* Hero Section */}
      <div className="rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1/4 h-full bg-primary rounded-r-full opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-1/5 h-2/3 bg-cyan-600/20 rounded-tl-full"></div>
        
        <div className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h2 className="text-3xl font-bold text-primary">
                  {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </h2>
                <LanguageToggle />
              </div>
              <p className="mt-2 text-gray-600 max-w-2xl">
                {language === 'ar' 
                  ? 'مرحبًا بك في لوحة تحكم نظام إدارة المبيعات. استخدم هذه اللوحة للوصول السريع إلى الوظائف الرئيسية.'
                  : 'Welcome to the Sales Management System dashboard. Use this dashboard to quickly access key functions.'}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <MoenLogoGreen className="w-auto h-20 mb-2" />
              <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-md shadow-sm">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-500">{t('currentTime')}</p>
                  <p className="text-lg font-semibold force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section - Styled after the flight booking UI in the image */}
      <Card className="border-0 shadow-md bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gray-50 p-4 rounded-t-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الموقع الأول' : 'From Location'}</label>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">New York (JFK)</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'الموقع الثاني' : 'To Location'}</label>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Mumbai (BOM)</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">29 July 2023</span>
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'المسافرون' : 'Travelers'}</label>
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-200">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">2 Travelers</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Button 
                  variant={selectedTrip === "oneWay" ? "default" : "outline"}
                  onClick={() => setSelectedTrip("oneWay")}
                  className="bg-teal-700 text-white hover:bg-teal-800"
                >
                  {language === 'ar' ? 'ذهاب فقط' : 'One Way'}
                </Button>
                <Button 
                  variant={selectedTrip === "roundTrip" ? "default" : "outline"}
                  onClick={() => setSelectedTrip("roundTrip")}
                  className="bg-teal-700 text-white hover:bg-teal-800"
                >
                  {language === 'ar' ? 'ذهاب وعودة' : 'Round Trip'}
                </Button>
                <Button 
                  variant={selectedTrip === "multiCity" ? "default" : "outline"}
                  onClick={() => setSelectedTrip("multiCity")}
                  className="bg-teal-700 text-white hover:bg-teal-800"
                >
                  {language === 'ar' ? 'متعدد المدن' : 'Multi City'}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button className="bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'بحث' : 'Search'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {language === 'ar' ? 'النتائج (25)' : 'Results (25)'}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-3.5 w-3.5 mr-1" />
                  {language === 'ar' ? 'تصفية' : 'Filter'}
                </Button>
                <Button variant="outline" size="sm">
                  {language === 'ar' ? 'الدرجة' : 'Class'} ▼
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {flights.map((flight) => (
                <div key={flight.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <MoenLogoGreen className="w-full h-full" />
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{flight.from}</div>
                        <div className="text-sm text-gray-500">{flight.departureTime}</div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-400">{flight.flightType}</div>
                        <div className="w-20 h-0.5 bg-gray-300 relative my-1">
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 rotate-45 w-2 h-2 border-t border-r border-gray-300"></div>
                        </div>
                        <div className="text-xs text-primary">{flight.date}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold">{flight.to}</div>
                        <div className="text-sm text-gray-500">{flight.arrivalTime}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{flight.price}</div>
                    </div>
                    
                    <Button className="bg-primary hover:bg-primary/90">
                      {language === 'ar' ? 'احجز الآن' : 'Book Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Access Cards - Same as before but styled differently */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <CollapsibleCard 
          title={language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges'}
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
          headerClassName="bg-teal-700 text-white hover:bg-teal-800"
          titleClassName="text-white"
        >
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar' 
                ? 'معالجة استرداد الأموال واستبدال المنتجات للعملاء' 
                : 'Process refunds and product exchanges for customers'}
            </p>
            <Button 
              onClick={() => {
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  const event = new CustomEvent('navigate', { detail: { section: 'refundManager' } });
                  rootElement.dispatchEvent(event);
                }
              }}
              className="w-full flex gap-2 items-center justify-center bg-primary hover:bg-primary/90"
            >
              <RefreshCcw className="h-4 w-4" />
              {language === 'ar' ? 'إدارة الاسترداد' : 'Manage Refunds'}
            </Button>
          </div>
        </CollapsibleCard>
        
        <CollapsibleCard 
          title={language === 'ar' ? 'بحث العملاء' : 'Patient Search'}
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
          headerClassName="bg-teal-700 text-white hover:bg-teal-800"
          titleClassName="text-white"
        >
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar' 
                ? 'ابحث عن معلومات المرضى وعرض سجلاتهم' 
                : 'Search for patient information and view their records'}
            </p>
            <Button 
              onClick={() => {
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  const event = new CustomEvent('navigate', { detail: { section: 'patientSearch' } });
                  rootElement.dispatchEvent(event);
                }
              }}
              className="w-full flex gap-2 items-center justify-center bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
              {language === 'ar' ? 'بحث المرضى' : 'Search Patients'}
            </Button>
          </div>
        </CollapsibleCard>
        
        <CollapsibleCard 
          title={language === 'ar' ? 'إنشاء فاتورة' : 'Create Invoice'}
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
          headerClassName="bg-teal-700 text-white hover:bg-teal-800"
          titleClassName="text-white"
        >
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar' 
                ? 'إنشاء فواتير جديدة للعملاء وإدارة المدفوعات' 
                : 'Create new invoices for customers and manage payments'}
            </p>
            <Button 
              onClick={() => {
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  const event = new CustomEvent('navigate', { detail: { section: 'createInvoice' } });
                  rootElement.dispatchEvent(event);
                }
              }}
              className="w-full flex gap-2 items-center justify-center bg-primary hover:bg-primary/90"
            >
              <ArrowRight className="h-4 w-4" />
              {language === 'ar' ? 'إنشاء فاتورة' : 'Create Invoice'}
            </Button>
          </div>
        </CollapsibleCard>
      </div>
    </div>
  );
};
