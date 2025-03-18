
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
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
              <p className="text-lg font-semibold">{currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
