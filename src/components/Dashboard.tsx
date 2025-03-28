
import React, { useState, useEffect } from "react";
import { Clock, RefreshCw, ArrowDownLeft } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageToggle } from "@/components/LanguageToggle";

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
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/reports">
              <Button>{t('reportsPage')}</Button>
            </Link>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              onClick={() => window.location.href = "/refunds-exchanges"}
            >
              <ArrowDownLeft className="h-4 w-4" />
              {t('processRefund')}
            </Button>
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
      
      {/* New section for quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">{t('quickActions')}</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-blue-50"
              onClick={() => window.location.href = "/"}
            >
              {t('createInvoice')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-blue-50"
              onClick={() => window.location.href = "/"}
            >
              {t('patientSearch')}
            </Button>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">{t('inventory')}</h3>
          <p className="text-sm text-gray-600 mb-3">{t('frameInventory')}: {frames.length}</p>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white hover:bg-purple-50"
            onClick={() => window.location.href = "/"}
          >
            {t('manageInventory')}
          </Button>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-100">
          <h3 className="text-lg font-semibold text-amber-700 mb-3">{t('exchangeAndRefunds')}</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-amber-50 text-red-600"
              onClick={() => window.location.href = "/refunds-exchanges"}
            >
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              {t('processRefund')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white hover:bg-amber-50 text-blue-600"
              onClick={() => window.location.href = "/refunds-exchanges"}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('processExchange')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
