
import React, { useState, useEffect } from "react";
import { Clock, DollarSign, User, PackageCheck, RefreshCcw, Search } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "@/components/LanguageToggle";
import { RefundExchangeManager } from "@/components/RefundExchangeManager";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore();
  const { t, language } = useLanguageStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-4 space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-primary/15 to-primary/5 rounded-lg p-6">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-3xl font-bold text-primary">{t('welcome')}</h2>
            <LanguageToggle />
          </div>
          <p className="mt-2 text-gray-600">
            {t('systemDescription')}
          </p>
          <div className="mt-4">
            <Link to="/reports">
              <Button>{t('reportsPage')}</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <MoenLogoGreen className="w-auto h-32 mb-4" />
          <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-md shadow-sm">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-gray-500">{t('currentTime')}</p>
              <p className="text-lg font-semibold force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4" />
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {language === 'ar' ? 'العملاء' : 'Clients'}
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {language === 'ar' ? 'المبالغ المستردة' : 'Refunds'}
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {language === 'ar' ? 'البحث' : 'Search'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  {t('clientsOverview')}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'إحصائيات العملاء' : 'Client statistics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{patients.length}</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إجمالي العملاء المسجلين في النظام'
                    : 'Total registered clients in the system'}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("clients")}>
                  {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-green-500" />
                  {t('inventoryOverview')}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'إحصائيات المخزون' : 'Inventory statistics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{frames.length}</div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إجمالي الإطارات المتوفرة في المخزون'
                    : 'Total frames available in inventory'}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("inventory")}>
                  {language === 'ar' ? 'عرض المخزون' : 'View Inventory'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5 text-amber-500" />
                  {t('refundsOverview')}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' ? 'إحصائيات الاسترداد' : 'Refund statistics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-xs text-gray-500">
                    {language === 'ar' ? 'اليوم' : 'Today'}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'إجمالي عمليات الاسترداد المعالجة'
                    : 'Total refunds processed'}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("refunds")}>
                  {language === 'ar' ? 'معالجة استرداد الأموال' : 'Process Refund'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إدارة العملاء' : 'Client Management'}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'عرض وإدارة جميع العملاء المسجلين في النظام'
                  : 'View and manage all registered clients in the system'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {language === 'ar' ? 'استخدم وظيفة البحث' : 'Use Search Function'}
                </h3>
                <p className="text-gray-500 max-w-md mb-6">
                  {language === 'ar' 
                    ? 'يرجى استخدام وظيفة البحث عن العملاء للعثور على سجلات العملاء وإدارتها.'
                    : 'Please use the patient search function to find and manage client records.'}
                </p>
                <Button onClick={() => setActiveTab("search")}>
                  <Search className="h-4 w-4 mr-2" />
                  {language === 'ar' ? 'البحث عن العملاء' : 'Search Clients'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunds" className="mt-0">
          <RefundExchangeManager />
        </TabsContent>
        
        <TabsContent value="search" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'بحث شامل' : 'Comprehensive Search'}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'البحث في جميع بيانات النظام'
                  : 'Search across all system data'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {language === 'ar' ? 'قريباً' : 'Coming Soon'}
                </h3>
                <p className="text-gray-500 max-w-md">
                  {language === 'ar' 
                    ? 'ميزة البحث الشامل ستكون متاحة قريباً.'
                    : 'Comprehensive search feature will be available soon.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
