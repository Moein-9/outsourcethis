
import React, { useState, useEffect } from "react";
import { Clock, RefreshCcw } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
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

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card className="hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'ar' 
                ? 'معالجة استرداد الأموال واستبدال المنتجات للعملاء' 
                : 'Process refunds and product exchanges for customers'}
            </p>
            <Button 
              onClick={() => {
                // Find the closest parent component with id "root" and dispatch a custom event
                const rootElement = document.getElementById('root');
                if (rootElement) {
                  const event = new CustomEvent('navigate', { detail: { section: 'refundManager' } });
                  rootElement.dispatchEvent(event);
                }
                // Alternatively, you can use window.location.hash = '#refundManager';
              }}
              className="w-full flex gap-2 items-center justify-center"
              variant="default"
            >
              <RefreshCcw className="h-4 w-4" />
              {language === 'ar' ? 'إدارة الاسترداد' : 'Manage Refunds'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
